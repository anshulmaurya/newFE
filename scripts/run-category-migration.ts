import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { pool } from "../server/db";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log("Starting category schema migration...");
    
    // Read the SQL file
    const filePath = path.join(__dirname, "..", "migrations", "category_schema_changes.sql");
    const sql = fs.readFileSync(filePath, "utf8");
    
    // Execute the SQL
    console.log("Executing SQL migration...");
    await pool.query(sql);
    
    console.log("Database migration completed successfully.");
    console.log("Schema changes:");
    console.log("1. Removed unnecessary columns from problem_categories table");
    console.log("2. Created problem_category_map table for many-to-many relationship");
    console.log("3. Migrated existing category data to the new mapping table");
    console.log("4. Removed the category column from problems table");
    
    console.log("\nNext steps:");
    console.log("1. Update the UI to support multiple categories per problem");
    console.log("2. Update APIs to use the new mapping table");
    
  } catch (error) {
    console.error("Error running migration:", error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

runMigration();