import express, { type Request, Response, NextFunction } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProblemSchema,
  insertUserProgressSchema,
} from "@shared/schema";
import { z } from "zod";
import { connectToMongoDB, getProblemsCollection, getAllProblems, getProblemById } from "./mongodb";

// Add userId to Request type
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Middleware to parse user ID from session/token
// For now this is a stub that returns a dummy user ID for testing
const getUserId = (req: Request, _res: Response, next: NextFunction) => {
  // In a real app, this would come from authentication
  // For now we'll use a dummy user ID for demonstration
  req.userId = 1;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Health check endpoint
  apiRouter.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString() 
    });
  });

  // GitHub Authentication routes
  apiRouter.get("/auth/github", async (_req: Request, res: Response) => {
    // In a real implementation, we would initialize GitHub OAuth flow here
    // For now, we'll redirect to GitHub's OAuth page directly for demonstration
    const clientId = process.env.GITHUB_CLIENT_ID || "your_github_client_id";
    const redirectUri = encodeURIComponent(`${process.env.APP_URL || 'http://localhost:5000'}/api/auth/github/callback`);
    const scope = encodeURIComponent("user:email");
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.redirect(githubAuthUrl);
  });

  // GitHub OAuth callback
  apiRouter.get("/auth/github/callback", async (req: Request, res: Response) => {
    // In a real implementation, we would:
    // 1. Exchange the code for an access token
    // 2. Fetch user data from GitHub API
    // 3. Create or update user in our database
    // 4. Create a session or JWT for the user
    // 5. Redirect to the frontend with the token
    
    // For now, we'll just simulate a successful login
    console.log("GitHub OAuth callback received with code:", req.query.code);
    
    // Redirect back to the main app
    res.redirect("/");
  });
  
  // User routes
  apiRouter.get("/user", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userData } = user;
      return res.json(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Problem routes
  apiRouter.get("/problems", async (req: Request, res: Response) => {
    try {
      const { 
        category, 
        difficulty, 
        search, 
        page = '1', 
        limit = '10',
        sortBy = 'title',
        sortOrder = 'asc'
      } = req.query;
      
      // Get MongoDB collection
      const collection = await getProblemsCollection();
      
      // Build filter for MongoDB query
      const filter: Record<string, any> = {};
      
      if (category && category !== 'all') {
        filter.type = category as string;
      }
      
      if (difficulty && difficulty !== 'all') {
        filter.difficulty = difficulty as string;
      }
      
      if (search && (search as string).trim() !== '') {
        filter.title = { $regex: search as string, $options: 'i' };
      }
      
      // Get total count for pagination
      const total = await collection.countDocuments(filter);
      
      // Parse pagination parameters
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;
      
      // Create sort object for MongoDB
      const sort: Record<string, 1 | -1> = {};
      sort[sortBy as string] = (sortOrder as string) === 'asc' ? 1 : -1;
      
      // Execute query with pagination and sorting
      const problems = await collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .toArray();
      
      return res.json({ 
        problems, 
        total 
      });
    } catch (error) {
      console.error("Error fetching problems from MongoDB:", error);
      
      // Fallback to SQL storage if MongoDB fails
      try {
        const { 
          category, 
          difficulty, 
          search, 
          page, 
          limit,
          sortBy,
          sortOrder
        } = req.query;
        
        const problemsData = await storage.getProblems({
          category: category as string,
          difficulty: difficulty as string,
          search: search as string,
          page: page ? parseInt(page as string) : undefined,
          limit: limit ? parseInt(limit as string) : undefined,
          sortBy: sortBy as string,
          sortOrder: (sortOrder as 'asc' | 'desc') || 'asc'
        });
        
        return res.json(problemsData);
      } catch (fallbackError) {
        console.error("Fallback to SQL storage also failed:", fallbackError);
        return res.status(500).json({ error: "Server error" });
      }
    }
  });
  
  apiRouter.get("/problems/:id", async (req: Request, res: Response) => {
    try {
      const problemId = req.params.id;
      
      // Try to get problem from MongoDB first
      try {
        const problem = await getProblemById(problemId);
        
        if (problem) {
          return res.json(problem);
        }
      } catch (mongoError) {
        console.error("MongoDB error fetching problem:", mongoError);
        // Continue to fallback if MongoDB fails
      }
      
      // Fallback to SQL storage
      const id = parseInt(problemId);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid problem ID" });
      }
      
      const problem = await storage.getProblem(id);
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      
      return res.json(problem);
    } catch (error) {
      console.error("Error fetching problem:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  apiRouter.post("/problems", async (req: Request, res: Response) => {
    try {
      const problemData = insertProblemSchema.parse(req.body);
      const problem = await storage.createProblem(problemData);
      return res.status(201).json(problem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating problem:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // User Progress routes
  apiRouter.get("/user-progress", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const progress = await storage.getUserProgress(req.userId);
      return res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  apiRouter.get("/user-progress/:problemId", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const problemId = parseInt(req.params.problemId);
      if (isNaN(problemId)) {
        return res.status(400).json({ error: "Invalid problem ID" });
      }
      
      const progress = await storage.getUserProgressForProblem(req.userId, problemId);
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      
      return res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  apiRouter.post("/user-progress", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId: req.userId
      });
      
      // Check if progress already exists for this problem
      const existingProgress = await storage.getUserProgressForProblem(
        req.userId,
        progressData.problemId
      );
      
      if (existingProgress) {
        // Update existing progress
        const updatedProgress = await storage.updateUserProgress(
          existingProgress.id,
          {
            ...req.body,
            attemptCount: (existingProgress.attemptCount || 0) + 1,
            lastAttemptedAt: new Date()
          }
        );
        return res.json(updatedProgress);
      }
      
      // Create new progress
      const progress = await storage.createUserProgress({
        ...progressData,
        attemptCount: 1
      });
      
      return res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating/updating user progress:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // User Stats route
  apiRouter.get("/user-stats", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const stats = await storage.getUserStats(req.userId);
      return res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
