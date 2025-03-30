import express, { type Request, Response, NextFunction } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProblemSchema,
  insertUserProgressSchema,
} from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

// Add userId to Request type
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Middleware to parse user ID from session
const getUserId = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = req.user?.id;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
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

  // External API proxy for problems
  apiRouter.get("/problems-proxy", async (_req: Request, res: Response) => {
    try {
      const response = await fetch('https://dspcoder-backend-prod.azurewebsites.net/api/get_problems');
      const problems = await response.json();
      res.status(200).json({ 
        status: "ok", 
        count: problems.length,
        problems: problems
      });
    } catch (error) {
      console.error("External API error:", error);
      res.status(500).json({ error: "Failed to fetch problems from external API" });
    }
  });

  // GitHub Authentication routes are now handled by setupAuth
  
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
  
  // Problem routes - fetch from external API
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
      
      // Fetch from external API
      const response = await fetch('https://dspcoder-backend-prod.azurewebsites.net/api/get_problems');
      const allProblems = await response.json();
      
      // Apply filters in-memory (since we can't control the API filtering)
      let filteredProblems = [...allProblems];
      
      // Apply category filter
      if (category && category !== 'all') {
        filteredProblems = filteredProblems.filter(p => 
          p.type?.toLowerCase() === (category as string).toLowerCase() ||
          p.tags?.some((tag: string) => tag.toLowerCase() === (category as string).toLowerCase())
        );
      }
      
      // Apply difficulty filter
      if (difficulty && difficulty !== 'all') {
        filteredProblems = filteredProblems.filter(p => 
          p.difficulty?.toLowerCase() === (difficulty as string).toLowerCase()
        );
      }
      
      // Apply search filter
      if (search && (search as string).trim() !== '') {
        const searchTerm = (search as string).toLowerCase();
        filteredProblems = filteredProblems.filter(p => 
          p.title?.toLowerCase().includes(searchTerm) ||
          p.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply sorting
      if (sortBy) {
        filteredProblems.sort((a, b) => {
          const aValue = a[sortBy as string] || '';
          const bValue = b[sortBy as string] || '';
          const compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return (sortOrder as string) === 'asc' ? compareResult : -compareResult;
        });
      }
      
      // Calculate total for pagination
      const total = filteredProblems.length;
      
      // Apply pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedProblems = filteredProblems.slice(startIndex, endIndex);
      
      return res.json({ 
        problems: paginatedProblems, 
        total 
      });
    } catch (error) {
      console.error("Error fetching problems from external API:", error);
      return res.status(500).json({ error: "Failed to fetch problems from external API" });
    }
  });
  
  apiRouter.get("/problems/:id", async (req: Request, res: Response) => {
    try {
      const problemId = req.params.id;
      
      // Fetch all problems from the external API
      const response = await fetch('https://dspcoder-backend-prod.azurewebsites.net/api/get_problems');
      const problems = await response.json();
      
      // Find the problem with the matching ID
      const problem = problems.find((p: any) => p.id === problemId);
      
      if (problem) {
        return res.json(problem);
      }
      
      // If not found in external API, try the database as fallback
      try {
        const id = parseInt(problemId);
        if (!isNaN(id)) {
          const dbProblem = await storage.getProblem(id);
          if (dbProblem) {
            return res.json(dbProblem);
          }
        }
      } catch (dbError) {
        console.error("Database error fetching problem:", dbError);
      }
      
      return res.status(404).json({ error: "Problem not found" });
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
