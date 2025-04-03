import express, { type Request, Response, NextFunction } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProblemSchema,
  insertUserProgressSchema,
  insertUserStatsSchema,
  insertUserActivitySchema,
} from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";
import { setupUserCodebase } from "./container-api";
import { connectToMongoDB, getProblemsCollection } from "./mongodb";
import crypto from 'crypto';

// Container session storage for secure access
interface ContainerSession {
  containerUrl: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date; // Session expires after a certain time
}

// Map to store container sessions by token
const containerSessions = new Map<string, ContainerSession>();

// Function to generate a secure random token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Function to clean up expired container sessions (called periodically)
function cleanupExpiredSessions(): void {
  const now = new Date();
  containerSessions.forEach((session, token) => {
    if (session.expiresAt < now) {
      containerSessions.delete(token);
    }
  });
}

// Set up a cleanup interval (every hour)
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

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

// Optional authentication middleware - doesn't reject unauthenticated users
// but adds user ID to request if authenticated
const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    req.userId = req.user?.id;
  }
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

  // External API proxy for problems (accessible without authentication)
  apiRouter.get("/problems-proxy", optionalAuth, async (_req: Request, res: Response) => {
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
  
  // Problem routes - fetch from external API (accessible without authentication)
  apiRouter.get("/problems", optionalAuth, async (req: Request, res: Response) => {
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
  
  apiRouter.get("/problems/:id", optionalAuth, async (req: Request, res: Response) => {
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
  
  // User Stats routes
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
  
  // Get user stats record from the database
  apiRouter.get("/user-stats-record", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      let stats = await storage.getUserStatsRecord(req.userId);
      
      // If stats record doesn't exist, create one
      if (!stats) {
        stats = await storage.createUserStats({
          userId: req.userId,
          lastActiveDate: new Date(),
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          totalAttempted: 0,
          currentStreak: 0,
          longestStreak: 0
        });
      }
      
      return res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats record:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Update user stats
  apiRouter.post("/user-stats", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Get current stats
      let currentStats = await storage.getUserStatsRecord(req.userId);
      
      // If no stats record exists, create one
      if (!currentStats) {
        currentStats = await storage.createUserStats({
          userId: req.userId,
          lastActiveDate: new Date(),
          ...req.body
        });
        return res.status(201).json(currentStats);
      }
      
      // Otherwise update existing record
      const updatedStats = await storage.updateUserStats(req.userId, {
        ...req.body,
        updatedAt: new Date()
      });
      
      return res.json(updatedStats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating user stats:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // User Activity routes
  apiRouter.get("/user-activity", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Parse date range if provided
      const { from, to } = req.query;
      let fromDate: Date | undefined;
      let toDate: Date | undefined;
      
      if (from && typeof from === 'string') {
        fromDate = new Date(from);
      }
      
      if (to && typeof to === 'string') {
        toDate = new Date(to);
      }
      
      const activity = await storage.getUserActivity(req.userId, fromDate, toDate);
      return res.json(activity);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Record user activity
  apiRouter.post("/user-activity", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Set userId and ensure date is properly formatted
      const activityData = {
        ...req.body,
        userId: req.userId,
        date: req.body.date ? new Date(req.body.date) : new Date()
      };
      
      const activity = await storage.recordUserActivity(activityData);
      
      // Also update the user's streak
      let userStats = await storage.getUserStatsRecord(req.userId);
      
      if (userStats) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastActiveDate = userStats.lastActiveDate;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let currentStreak = userStats.currentStreak || 0;
        let longestStreak = userStats.longestStreak || 0;
        
        // If the user was last active yesterday, increment the streak
        // If today, maintain the streak (don't double count)
        // If more than a day ago, reset the streak
        if (lastActiveDate) {
          const lastDate = new Date(lastActiveDate);
          lastDate.setHours(0, 0, 0, 0);
          
          if (lastDate.getTime() === today.getTime()) {
            // Already logged today, keep streak the same
          } else if (lastDate.getTime() === yesterday.getTime()) {
            // Increment streak for consecutive days
            currentStreak += 1;
          } else {
            // Reset streak for break in consecutive days
            currentStreak = 1;
          }
        } else {
          // First activity ever
          currentStreak = 1;
        }
        
        // Update longest streak if needed
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
        
        // Update user stats with new streak information
        await storage.updateUserStats(req.userId, {
          currentStreak,
          longestStreak
        });
      }
      
      return res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error recording user activity:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Get user streak
  apiRouter.get("/user-streak", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const streak = await storage.getUserStreak(req.userId);
      return res.json(streak);
    } catch (error) {
      console.error("Error fetching user streak:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // Setup user codebase for a specific question
  apiRouter.post("/setup-codebase", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      // Get the user to find the username
      const user = await storage.getUser(req.userId);
      if (!user || !user.username) {
        return res.status(404).json({ error: "User not found or username missing" });
      }
      
      const { questionId, language = "c" } = req.body;
      if (!questionId) {
        return res.status(400).json({ error: "Question ID is required" });
      }
      
      // Get the MongoDB problem details to extract the question_id field
      let mongoDbQuestionId = questionId;
      
      // Try to retrieve the question_id from MongoDB if this is a MongoDB ID
      try {
        const mongoClient = await connectToMongoDB();
        const collection = await getProblemsCollection();
        
        // Look up the problem by _id
        const problem = await collection.findOne({ 
          $or: [
            { _id: questionId }, 
            { id: questionId }
          ]
        });
        
        // Use the question_id field from MongoDB if available
        if (problem && problem.question_id) {
          console.log(`Found MongoDB problem with question_id: ${problem.question_id}`);
          mongoDbQuestionId = problem.question_id;
        } else {
          console.log(`Using original questionId: ${questionId} (MongoDB problem not found or missing question_id field)`);
        }
      } catch (err) {
        console.warn("Error looking up MongoDB problem:", err);
        // Continue with the original questionId
      }
      
      // Call the external API to setup the codebase using the question_id from MongoDB and language
      const result = await setupUserCodebase(user.username, mongoDbQuestionId.toString(), language);
      
      // Record the attempt in user progress
      try {
        const problemId = parseInt(questionId);
        if (!isNaN(problemId)) {
          const existingProgress = await storage.getUserProgressForProblem(req.userId, problemId);
          
          if (existingProgress) {
            await storage.updateUserProgress(existingProgress.id, {
              lastAttemptedAt: new Date(),
              attemptCount: (existingProgress.attemptCount || 0) + 1
            });
          } else {
            await storage.createUserProgress({
              userId: req.userId,
              problemId: problemId,
              status: "Attempted",
              lastAttemptedAt: new Date(),
              attemptCount: 1
            });
          }
        }
      } catch (progressError) {
        console.error("Error updating user progress:", progressError);
        // Don't fail the request if this part has an error
      }
      
      // Generate a secure token for the container URL
      const token = generateSecureToken();
      
      // Create an expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Store the container URL in the session map
      containerSessions.set(token, {
        containerUrl: result.containerUrl,
        userId: req.userId,
        createdAt: new Date(),
        expiresAt: expiresAt
      });
      
      // Return only the token to the client, not the actual container URL
      return res.status(200).json({
        status: result.status,
        message: result.message,
        containerToken: token, // Send token instead of direct URL
        trackingId: `${user.username}-${questionId}-${Date.now()}`
      });
    } catch (err: unknown) {
      console.error("Error setting up user codebase:", err);
      
      // Extract error message safely
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Get the username safely since we need to generate a container URL
      let containerUsername = "unknown-user";
      try {
        if (req.userId) {
          const userInfo = await storage.getUser(req.userId);
          if (userInfo && userInfo.username) {
            containerUsername = userInfo.username;
          }
        }
      } catch (userErr) {
        console.error("Could not get username for container URL:", userErr);
      }
      
      // Even if there's an error, return a more graceful response with a token
      // Generate a fallback container URL
      const fallbackContainerUrl = `https://${containerUsername}.ambitiousfield-760fb695.eastus.azurecontainerapps.io`;
      
      // Generate a secure token for the fallback container URL
      const token = generateSecureToken();
      
      // Create an expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Store the fallback container URL in the session map
      containerSessions.set(token, {
        containerUrl: fallbackContainerUrl,
        userId: req.userId || 0, // Use 0 as a fallback user ID
        createdAt: new Date(),
        expiresAt: expiresAt
      });
      
      // Return a response with the token
      return res.status(200).json({
        status: "pending",
        message: "Codebase setup initiated with some issues. You can still begin coding, but some features may be limited.",
        containerToken: token,
        error: errorMessage
      });
    }
  });

  // Container redirect endpoint for secure access
  apiRouter.get("/container-redirect/:token", getUserId, async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      
      // Check if the token exists in the session map
      if (!containerSessions.has(token)) {
        return res.status(404).json({ error: "Container session not found or expired" });
      }
      
      // Get the container session
      const session = containerSessions.get(token)!;
      
      // Check if the session is expired
      if (session.expiresAt < new Date()) {
        containerSessions.delete(token);
        return res.status(401).json({ error: "Container session has expired" });
      }
      
      // Check if the user ID matches the session (to prevent unauthorized access)
      if (session.userId !== req.userId) {
        return res.status(403).json({ error: "Unauthorized access to container" });
      }
      
      // Redirect to the actual container URL
      return res.redirect(session.containerUrl);
    } catch (error) {
      console.error("Error redirecting to container:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
