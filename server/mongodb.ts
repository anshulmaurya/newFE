import { MongoClient } from 'mongodb';

// MongoDB Atlas connection string
const MONGODB_CONNECTION_STRING = "mongodb+srv://db_admin:thefutureofdb@dspcluster.xdg0hzp.mongodb.net/?retryWrites=true&w=majority&appName=dspcluster";
const MONGODB_DATABASE = "dsp_dev";
const PROBLEM_COLLECTION = "problems";

let client: MongoClient | null = null;

export async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGODB_CONNECTION_STRING);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db(MONGODB_DATABASE);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function getProblemsCollection() {
  if (!client) {
    const db = await connectToMongoDB();
    return db.collection(PROBLEM_COLLECTION);
  }
  return client.db(MONGODB_DATABASE).collection(PROBLEM_COLLECTION);
}

export async function closeMongoDB() {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
    client = null;
  }
}

// Helper functions to work with the problems collection
export async function getAllProblems() {
  const collection = await getProblemsCollection();
  return collection.find({}).toArray();
}

export async function getProblemById(id: string) {
  const collection = await getProblemsCollection();
  return collection.findOne({ id });
}

export async function getProblemsByFilter(filter: Record<string, any>) {
  const collection = await getProblemsCollection();
  return collection.find(filter).toArray();
}