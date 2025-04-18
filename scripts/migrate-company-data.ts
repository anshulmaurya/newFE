/**
 * Script to migrate company data from company_problem_map to the new companyIds array in problems table
 */

import { db, pool } from "../server/db";
import { problems, companyProblemMap, companies } from "../shared/schema";
import { eq } from "drizzle-orm";

async function migrateCompanyData() {
  console.log("Starting migration of company data...");
  
  try {
    // Get all problems
    const allProblems = await db.select().from(problems);
    console.log(`Found ${allProblems.length} problems to process`);
    
    // Get all company-problem mappings
    const allMappings = await db.select().from(companyProblemMap);
    console.log(`Found ${allMappings.length} company-problem mappings to migrate`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    // For each problem, find all its company mappings and update the companyIds array
    for (const problem of allProblems) {
      try {
        // Find all mappings for this problem
        const problemMappings = allMappings.filter(mapping => mapping.problemId === problem.id);
        
        if (problemMappings.length > 0) {
          // Extract company IDs from mappings
          const companyIds = problemMappings.map(mapping => mapping.companyId);
          console.log(`Problem ${problem.id}: Migrating ${companyIds.length} companies: ${companyIds.join(', ')}`);
          
          // Update the problem with the company IDs
          await db
            .update(problems)
            .set({
              companyIds: companyIds,
              updatedAt: new Date()
            })
            .where(eq(problems.id, problem.id));
          
          migratedCount++;
        }
      } catch (error) {
        console.error(`Error migrating companies for problem ${problem.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Migration complete!`);
    console.log(`${migratedCount} problems successfully updated`);
    if (errorCount > 0) {
      console.log(`${errorCount} problems had errors during migration`);
    }
    
    // Optional: List of companies for verification
    const allCompanies = await db.select().from(companies);
    console.log("Available companies:");
    allCompanies.forEach(company => {
      console.log(`- ID: ${company.id}, Name: ${company.name}`);
    });
    
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the migration
migrateCompanyData().catch(console.error);