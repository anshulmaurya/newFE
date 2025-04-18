import { MongoClient } from 'mongodb';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { problems, problemCategories } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Helper function to map any category string to a valid category ID
async function mapToCategoryId(db: any, category: string | undefined): Promise<number> {
  if (!category) {
    // Default to "Arrays" category
    const defaultCategory = await db.select()
      .from(problemCategories)
      .where(eq(problemCategories.name, 'Arrays'))
      .execute();
    
    return defaultCategory[0]?.id || 31; // Default to ID 31 if not found
  }
  
  // Try direct match first
  const exactMatch = await db.select()
    .from(problemCategories)
    .where(eq(problemCategories.name, category))
    .execute();
    
  if (exactMatch.length > 0) {
    return exactMatch[0].id;
  }
  
  // Try case-insensitive match (need to do this manually since Drizzle doesn't have case-insensitive comparison)
  const allCategories = await db.select().from(problemCategories).execute();
  const lowerCategory = category.toLowerCase();
  
  for (const cat of allCategories) {
    if (cat.name.toLowerCase() === lowerCategory) {
      return cat.id;
    }
  }
  
  // Map similar categories based on keywords
  if (lowerCategory.includes('memory') || lowerCategory.includes('allocation')) {
    const memoryCategory = await db.select()
      .from(problemCategories)
      .where(eq(problemCategories.name, 'Memory Management'))
      .execute();
    return memoryCategory[0]?.id || 53;
  } else if (lowerCategory.includes('thread') || lowerCategory.includes('concurrency')) {
    const threadingCategory = await db.select()
      .from(problemCategories)
      .where(eq(problemCategories.name, 'Multithreading'))
      .execute();
    return threadingCategory[0]?.id || 33;
  } else if (lowerCategory.includes('array')) {
    const arrayCategory = await db.select()
      .from(problemCategories)
      .where(eq(problemCategories.name, 'Arrays'))
      .execute();
    return arrayCategory[0]?.id || 31;
  } else if (lowerCategory.includes('data') || lowerCategory.includes('structure')) {
    const dataStructCategory = await db.select()
      .from(problemCategories)
      .where(eq(problemCategories.name, 'Arrays'))
      .execute();
    return dataStructCategory[0]?.id || 31;
  } else if (lowerCategory.includes('rtos') || lowerCategory.includes('real-time')) {
    const rtosCategory = await db.select()
      .from(problemCategories)
      .where(eq(problemCategories.name, 'RTOS'))
      .execute();
    return rtosCategory[0]?.id || 50;
  }
  
  // Default fallback to Arrays
  const defaultCategory = await db.select()
    .from(problemCategories)
    .where(eq(problemCategories.name, 'Arrays'))
    .execute();
  return defaultCategory[0]?.id || 31;
}

// MongoDB Atlas connection string
const MONGODB_CONNECTION_STRING = "mongodb+srv://db_admin:thefutureofdb@dspcluster.xdg0hzp.mongodb.net/?retryWrites=true&w=majority&appName=dspcluster";
const MONGODB_DATABASE = "dsp_dev";
const PROBLEM_COLLECTION = "problems";

// Export the migration function
export async function migrateProblemData() {
  console.log('Starting problem data migration...');
  let migratedCount = 0;
  let errorCount = 0;
  
  // PostgreSQL connection
  const connectionString = process.env.DATABASE_URL || '';
  const client = postgres(connectionString);
  const db = drizzle(client);
  
  // Connect to MongoDB
  const mongoClient = new MongoClient(MONGODB_CONNECTION_STRING);
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB Atlas');
    
    const mongoDb = mongoClient.db(MONGODB_DATABASE);
    const problemsCollection = mongoDb.collection(PROBLEM_COLLECTION);
    
    // Fetch all problems from MongoDB
    const mongoProblems = await problemsCollection.find({}).toArray();
    console.log(`Found ${mongoProblems.length} problems in MongoDB`);
    
    // Process each problem
    for (const mongoProblem of mongoProblems) {
      try {
        // Check if problem already exists in PostgreSQL by questionId (if it exists)
        if (mongoProblem.question_id) {
          const existingProblem = await db.select()
            .from(problems)
            .where(eq(problems.questionId, mongoProblem.question_id))
            .execute();
            
          if (existingProblem.length > 0) {
            console.log(`Problem with questionId ${mongoProblem.question_id} already exists, skipping`);
            continue;
          }
        } else {
          // If no questionId, check by title as a fallback
          const existingProblem = await db.select()
            .from(problems)
            .where(eq(problems.title, mongoProblem.title || ''))
            .execute();
            
          if (existingProblem.length > 0) {
            console.log(`Problem with title "${mongoProblem.title}" already exists, skipping`);
            continue;
          }
        }
        
        // Get category ID for the problem
        const categoryId = await mapToCategoryId(db, mongoProblem.category);
        
        // Map MongoDB problem to PostgreSQL schema
        const pgProblem = {
          title: mongoProblem.title || 'Untitled Problem',
          description: mongoProblem.description || 'No description provided',
          difficulty: (mongoProblem.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Easy',
          type: (mongoProblem.type as 'dsa' | 'embedded' | 'bridge') || 'dsa', // Updated 'system' to 'bridge'
          // Removed tags and companies from direct insertion - will be handled separately if needed
          filePath: mongoProblem.file_path,
          successfulSubmissions: parseInt(mongoProblem.successful_submissions) || 0,
          failedSubmissions: parseInt(mongoProblem.failed_submissions) || 0,
          importance: mongoProblem.importance,
          questionId: mongoProblem.question_id,
          categoryId: categoryId, // Use the category ID instead of enum value
        };
        
        // Insert into PostgreSQL
        await db.insert(problems)
          .values([pgProblem]) // Wrap in array as required by drizzle-orm
          .execute();
          
        console.log(`Migrated problem: ${mongoProblem.title} (${mongoProblem.id})`);
        migratedCount++;
      } catch (error) {
        console.error(`Error migrating problem ${mongoProblem.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Migration completed: ${migratedCount} problems migrated, ${errorCount} errors`);
    return { 
      success: true, 
      migrated: migratedCount, 
      errors: errorCount, 
      total: mongoProblems.length 
    };
  } catch (error) {
    console.error('Error during migration:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      migrated: migratedCount, 
      errors: errorCount + 1 
    };
  } finally {
    if (mongoClient) {
      await mongoClient.close();
      console.log('Disconnected from MongoDB Atlas');
    }
    await client.end();
    console.log('Disconnected from PostgreSQL');
  }
}

// Main execution - for direct script execution
if (process.argv[1]?.endsWith('migrate-problems.ts')) {
  migrateProblemData()
    .then(result => console.log('Migration result:', result))
    .catch(console.error);
}