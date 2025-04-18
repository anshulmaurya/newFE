/**
 * Script to seed companies and create problem-company associations
 */

import { db, pool } from "../server/db";
import { companies, companyProblemMap, problems } from "../shared/schema";
import { and, eq } from "drizzle-orm";

async function seedCompaniesAndMappings() {
  console.log("Starting company seeding and mappings...");

  try {
    // Sample companies
    const sampleCompanies = [
      { name: "Google", logoUrl: "https://www.google.com/favicon.ico" },
      { name: "Amazon", logoUrl: "https://www.amazon.com/favicon.ico" },
      { name: "Microsoft", logoUrl: "https://www.microsoft.com/favicon.ico" },
      { name: "Meta", logoUrl: "https://www.meta.com/favicon.ico" },
      { name: "Apple", logoUrl: "https://www.apple.com/favicon.ico" },
      { name: "Netflix", logoUrl: "https://www.netflix.com/favicon.ico" },
      { name: "Tesla", logoUrl: "https://www.tesla.com/favicon.ico" },
      { name: "Uber", logoUrl: "https://www.uber.com/favicon.ico" },
      { name: "Airbnb", logoUrl: "https://www.airbnb.com/favicon.ico" },
      { name: "Twitter", logoUrl: "https://www.twitter.com/favicon.ico" }
    ];

    // First check if we already have companies
    const existingCompanies = await db.select().from(companies);
    
    if (existingCompanies.length > 0) {
      console.log(`Found ${existingCompanies.length} existing companies, skipping company creation.`);
    } else {
      // Insert companies
      console.log("Creating companies...");
      for (const company of sampleCompanies) {
        await db.insert(companies).values({
          name: company.name,
          logoUrl: company.logoUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log(`Created ${sampleCompanies.length} companies.`);
    }

    // Get all companies (including the ones we just created)
    const allCompanies = await db.select().from(companies);
    console.log(`Working with ${allCompanies.length} companies in the database.`);

    // Get all problems
    const allProblems = await db.select().from(problems);
    console.log(`Found ${allProblems.length} problems to map companies to.`);

    // Problem-company mappings definition
    const mappings = [
      { problemId: 45, companyNames: ["Google", "Amazon", "Microsoft", "Meta"] }, // Two Sum
      { problemId: 46, companyNames: ["Google", "Amazon", "Microsoft", "Meta", "Apple"] }, // Reverse Linked List
      { problemId: 47, companyNames: ["Google", "Microsoft", "Meta"] }, // Binary Tree Level Order Traversal
      { problemId: 48, companyNames: ["Tesla", "Apple"] }, // RTOS Task Scheduling
      { problemId: 49, companyNames: ["Google", "Microsoft", "Apple"] }  // Memory Pool Allocator
    ];

    // Create problem-company mappings
    console.log("Creating problem-company mappings...");
    
    for (const mapping of mappings) {
      // Check if problem exists
      const problem = allProblems.find(p => p.id === mapping.problemId);
      
      if (!problem) {
        console.log(`Problem with ID ${mapping.problemId} not found. Skipping.`);
        continue;
      }
      
      console.log(`Processing mappings for problem ${problem.id}: ${problem.title}`);
      
      // Process each company for this problem
      for (const companyName of mapping.companyNames) {
        const company = allCompanies.find(c => c.name === companyName);
        
        if (!company) {
          console.log(`Company ${companyName} not found. Skipping.`);
          continue;
        }
        
        try {
          // Create the mapping, catching any unique constraint violations
          await db.insert(companyProblemMap).values({
            problemId: problem.id,
            companyId: company.id,
            relevanceScore: 5 // Default relevance score
          });
          
          console.log(`Created mapping: Problem ${problem.id} - Company ${company.name} (ID: ${company.id})`);
        } catch (error: any) {
          // If it's a unique constraint violation, that's fine
          if (error.message.includes("duplicate key")) {
            console.log(`Mapping for problem ${problem.id} and company ${company.name} already exists.`);
          } else {
            console.error(`Error creating mapping: ${error.message}`);
          }
        }
      }
    }

    console.log("Completed company seeding and mappings!");
  } catch (error: any) {
    console.error("Error during company seeding:", error.message);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the seeding
seedCompaniesAndMappings().catch(console.error);