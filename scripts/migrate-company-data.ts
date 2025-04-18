/**
 * Script to migrate data from the old company column to the new company_problem_map table.
 * 
 * This script:
 * 1. Reads problems with the old company data
 * 2. Creates company entries if they don't exist
 * 3. Creates associations in the company_problem_map table
 */

import { db, pool } from "../server/db";
import { companies, companyProblemMap, problems } from "../shared/schema";
import { eq } from "drizzle-orm";

async function migrateCompanyData() {
  console.log("Starting company data migration...");

  try {
    // Get all problems
    const allProblems = await db.select().from(problems);
    console.log(`Found ${allProblems.length} problems to process`);

    // Get existing companies for lookup
    const existingCompanies = await db.select().from(companies);
    console.log(`Found ${existingCompanies.length} existing companies in the database`);

    // Process each problem
    for (const problem of allProblems) {
      // This assumes that the old data is still in the database in a column called "company"
      // We need to check if this property exists in the runtime since TS won't have it
      const oldCompanyData = (problem as any).company;
      
      if (!oldCompanyData) {
        console.log(`No company data for problem ${problem.id} (${problem.title})`);
        continue;
      }

      console.log(`Processing problem ${problem.id} (${problem.title}) with company data: ${oldCompanyData}`);
      
      // Handle different formats - could be string or array
      let companyNames: string[] = [];
      
      if (typeof oldCompanyData === 'string') {
        // Single company as string
        companyNames = [oldCompanyData];
      } else if (Array.isArray(oldCompanyData)) {
        // Array of companies
        companyNames = oldCompanyData;
      } else {
        console.log(`Unknown company data format for problem ${problem.id}: ${typeof oldCompanyData}`);
        continue;
      }

      // Process each company name
      for (const companyName of companyNames) {
        if (!companyName || companyName === 'null' || companyName === 'undefined') {
          continue;
        }
        
        // Check if company exists, create if not
        let company = existingCompanies.find(c => c.name === companyName);
        
        if (!company) {
          console.log(`Creating new company entry for: ${companyName}`);
          try {
            const [newCompany] = await db.insert(companies)
              .values({
                name: companyName,
                createdAt: new Date(),
                updatedAt: new Date()
              })
              .returning();
            
            company = newCompany;
            existingCompanies.push(company); // Add to our cached list
          } catch (error) {
            console.error(`Error creating company: ${error.message}`);
            continue;
          }
        }
        
        // Try to create the association
        try {
          console.log(`Creating company-problem association: problem ${problem.id} - company ${company.id} (${company.name})`);
          await db.insert(companyProblemMap)
            .values({
              problemId: problem.id,
              companyId: company.id,
              relevanceScore: 5 // Default relevance score
            });
        } catch (error) {
          // If the error is due to a unique constraint violation, that's fine
          console.log(`Association may already exist or other error: ${error.message}`);
        }
      }
    }

    console.log("Company data migration completed successfully!");
  } catch (error) {
    console.error("Error during company data migration:", error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the migration
migrateCompanyData().catch(console.error);