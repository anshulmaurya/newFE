import { MongoClient } from 'mongodb';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { problems, categoryEnum } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Helper function to map any category string to a valid category enum value
function mapToValidCategory(category: string | undefined): typeof categoryEnum.enumValues[number] {
  if (!category) return 'Data Structures';
  
  const validCategories = categoryEnum.enumValues;
  
  // Try direct match first
  if (validCategories.includes(category as any)) {
    return category as typeof categoryEnum.enumValues[number];
  }
  
  // Try case-insensitive match
  const lowerCategory = category.toLowerCase();
  for (const validCategory of validCategories) {
    if (validCategory.toLowerCase() === lowerCategory) {
      return validCategory;
    }
  }
  
  // Map similar categories
  if (lowerCategory.includes('memory') || lowerCategory.includes('allocation')) {
    return 'Memory Management';
  } else if (lowerCategory.includes('thread') || lowerCategory.includes('concurrency')) {
    return 'Multithreading';
  } else if (lowerCategory.includes('data') || lowerCategory.includes('algorithm') || 
             lowerCategory.includes('array') || lowerCategory.includes('list')) {
    return 'Data Structures';
  } else if (lowerCategory.includes('c++') || lowerCategory.includes('cpp') || 
             lowerCategory.includes('stl')) {
    return 'C++ API';
  } else if (lowerCategory.includes('linux') || lowerCategory.includes('unix') || 
             lowerCategory.includes('posix')) {
    return 'Linux API';
  } else if (lowerCategory.includes('rtos') || lowerCategory.includes('freertos') || 
             lowerCategory.includes('real-time')) {
    return 'RTOS';
  } else if (lowerCategory.includes('power') || lowerCategory.includes('energy') || 
             lowerCategory.includes('battery')) {
    return 'Power Management';
  }
  
  // Default fallback
  return 'Data Structures';
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
        // Check if problem already exists in PostgreSQL by mongo_id
        const existingProblem = await db.select()
          .from(problems)
          .where(eq(problems.mongoId, mongoProblem.id))
          .execute();
          
        if (existingProblem.length > 0) {
          console.log(`Problem with mongo_id ${mongoProblem.id} already exists, skipping`);
          continue;
        }
        
        // Map MongoDB problem to PostgreSQL schema
        const pgProblem = {
          mongoId: mongoProblem.id,
          title: mongoProblem.title || 'Untitled Problem',
          description: mongoProblem.description || 'No description provided',
          difficulty: (mongoProblem.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Easy',
          type: (mongoProblem.type as 'dsa' | 'embedded' | 'system') || 'dsa',
          // Handle arrays properly
          tags: mongoProblem.tags || [],
          companies: mongoProblem.companies || [],
          filePath: mongoProblem.file_path,
          likes: parseInt(mongoProblem.likes) || 0,
          dislikes: parseInt(mongoProblem.dislikes) || 0,
          successfulSubmissions: parseInt(mongoProblem.successful_submissions) || 0,
          failedSubmissions: parseInt(mongoProblem.failed_submissions) || 0,
          acceptanceRate: parseInt(mongoProblem.acceptance_rate) || 0,
          importance: mongoProblem.importance,
          questionId: mongoProblem.question_id,
          category: mapToValidCategory(mongoProblem.category), // Map to a valid category enum value
          codeSnippet: mongoProblem.code_snippet,
          // Additional metadata that doesn't fit into columns
          metadata: {
            originalData: mongoProblem
          }
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