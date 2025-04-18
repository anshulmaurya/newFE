import { pool, db } from "../server/db";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { sql } from "drizzle-orm";

async function runMigrations() {
  console.log("Running migrations...");
  
  try {
    // Read all SQL files in the migrations directory
    const migrationsFolder = "./migrations";
    const files = await readdir(migrationsFolder);
    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();
    
    console.log(`Found ${sqlFiles.length} migration files to run:`);
    sqlFiles.forEach(file => console.log(` - ${file}`));
    
    // Execute each SQL file
    for (const file of sqlFiles) {
      console.log(`Running migration: ${file}`);
      
      // Read the migration file
      const migrationSql = await readFile(join(migrationsFolder, file), 'utf8');
      
      // Split the SQL script by statement breakpoints
      const statements = migrationSql.split('--> statement-breakpoint');
      
      // Execute each statement separately
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (statement) {
          try {
            await db.execute(sql.raw(statement));
            console.log(`  - Executed statement ${i + 1} of ${statements.length}`);
          } catch (stmtError) {
            console.error(`  - Error executing statement ${i + 1}:`, stmtError.message);
            // Continue with the next statement rather than failing completely
          }
        }
      }
      
      console.log(`Completed migration: ${file}`);
    }
    
    console.log("All migrations completed!");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations().catch(console.error);