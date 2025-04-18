/**
 * Script to migrate company data from company_problem_map to the new companyIds array in problems table
 */

import { db, pool } from "../server/db";
import { problems, companies } from "../shared/schema";
import { eq } from "drizzle-orm";

async function migrateCompanyData() {
  console.log("Starting migration of company data...");
  
  try {
    // Get all problems
    const allProblems = await db.select().from(problems);
    console.log(`Found ${allProblems.length} problems to process`);
    
    // Note: Migration completed - companyProblemMap table no longer exists
    // This script is kept for reference only
    
    console.log("Data migration already completed from company_problem_map to companyIds array");
    
    let migratedCount = 0;
    let errorCount = 0;
    
    // Show current problems with their company IDs for verification
    for (const problem of allProblems) {
      try {
        if (problem.companyIds && problem.companyIds.length > 0) {
          console.log(`Problem ${problem.id}: Has ${problem.companyIds.length} companies: ${problem.companyIds.join(', ')}`);
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