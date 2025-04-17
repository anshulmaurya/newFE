import { MongoClient } from 'mongodb';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { problems } from '../shared/schema';
import { eq } from 'drizzle-orm';

// MongoDB Atlas connection string
const MONGODB_CONNECTION_STRING = "mongodb+srv://db_admin:thefutureofdb@dspcluster.xdg0hzp.mongodb.net/?retryWrites=true&w=majority&appName=dspcluster";
const MONGODB_DATABASE = "dsp_dev";
const PROBLEM_COLLECTION = "problems";

// PostgreSQL connection
const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
const db = drizzle(client);

async function migrateProblemData() {
  console.log('Starting problem data migration...');
  
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
        const pgProblem = mapMongoDbToPgProblem(mongoProblem);
        
        // Insert into PostgreSQL
        await db.insert(problems)
          .values(pgProblem)
          .execute();
          
        console.log(`Migrated problem: ${mongoProblem.title} (${mongoProblem.id})`);
      } catch (error) {
        console.error(`Error migrating problem ${mongoProblem.id}:`, error);
      }
    }
    
    console.log('Problem data migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoClient.close();
    console.log('Disconnected from MongoDB Atlas');
    await client.end();
    console.log('Disconnected from PostgreSQL');
  }
}

function mapMongoDbToPgProblem(mongoProblem: any) {
  // Handle any necessary data type conversions and create a valid problem object
  const pgProblem: any = {
    mongoId: mongoProblem.id,
    title: mongoProblem.title || 'Untitled Problem',
    description: mongoProblem.description || 'No description provided', // Provide default for required fields
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
    category: 'Data Structures', // Default category if not specified
    codeSnippet: mongoProblem.code_snippet,
    // Additional metadata that doesn't fit into columns
    metadata: {
      originalData: mongoProblem
    }
  };
  
  return pgProblem;
}

// Run the migration
migrateProblemData().catch(console.error);