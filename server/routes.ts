import express, { type Request, Response, NextFunction } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProblemSchema,
  insertUserProgressSchema,
  insertUserStatsSchema,
  insertUserActivitySchema,
  insertCodeSubmissionSchema,
  insertProblemCategorySchema,
  insertLearningPathSchema,
  insertLearningPathItemSchema,
  insertUserPreferencesSchema,
  insertUserNoteSchema,
  insertCompanySchema,
  insertDiscussionSchema,
  insertDiscussionReplySchema,
  problemCategories,
  learningPaths,
  userPreferences,
  userNotes,
  companies,
  discussions,
  discussionReplies
} from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";
import { createUserContainer, setupUserCodebase } from "./container-api";
import { connectToMongoDB, getProblemsCollection } from "./mongodb";
import crypto from 'crypto';
import { setupWebSockets } from "./socket";
import { 
  recordContainerHeartbeat, 
  getContainerActivityStats,
  isContainerRegistered 
} from './container-activity';
import { adminRouter } from './admin-routes';

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
  
  // Register admin routes
  app.use("/api/admin", adminRouter);
  


  // Health check endpoint
  apiRouter.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString() 
    });
  });
  
  // Container heartbeat endpoint - records user activity to keep container alive
  apiRouter.post("/container-heartbeat", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId || !req.user?.username) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const username = req.user.username;
      
      // Check if the container is not registered (it might have been deleted due to inactivity)
      if (!isContainerRegistered(username)) {
        console.log(`Container for ${username} is not registered, recreating it`);
        
        // Recreate the container
        try {
          await createUserContainer(username);
          console.log(`Container recreated for ${username}`);
          
          // Record heartbeat to register the new container
          recordContainerHeartbeat(username);
          
          // Also check if we have information about the current problem
          const problemId = req.body.problemId || req.query.problemId;
          const lang = req.body.lang || req.query.lang || "c";
          
          if (problemId) {
            console.log(`Setting up codebase for problem ${problemId} with lang ${lang}`);
            
            // Run the setup-codebase API to restore the user's environment
            const setupResult = await setupUserCodebase(username, problemId.toString(), lang);
            
            return res.status(200).json({
              status: "container_recreated",
              message: "Container was recreated due to inactivity",
              containerInfo: setupResult,
              timestamp: new Date().toISOString()
            });
          } else {
            // Container recreated but no problem info available
            return res.status(200).json({
              status: "container_recreated",
              message: "Container was recreated due to inactivity, but no problem information was provided",
              timestamp: new Date().toISOString()
            });
          }
        } catch (setupError) {
          console.error("Error recreating container during heartbeat:", setupError);
          // We'll still continue and register the heartbeat
        }
      } else {
        // Container is registered, just record the heartbeat
        recordContainerHeartbeat(username);
      }
      
      return res.status(200).json({ 
        status: "ok", 
        message: "Heartbeat recorded",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error recording container heartbeat:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Admin endpoint to get container activity stats (for debugging)
  apiRouter.get("/container-stats", async (req: Request, res: Response) => {
    try {
      // In production, this would be protected by admin authentication
      const stats = getContainerActivityStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching container stats:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // Get problems from PostgreSQL database (accessible without authentication)
  apiRouter.get("/problems-proxy", optionalAuth, async (req: Request, res: Response) => {
    try {
      // Use the storage interface to get problems from the database
      const options = {
        category: req.query.category as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100, // Higher limit to get more problems
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
        type: req.query.type as string | undefined,
        company: req.query.company as string | undefined,
        importance: req.query.importance as string | undefined
      };

      const { problems, total } = await storage.getProblems(options);
      
      res.status(200).json({ 
        status: "ok", 
        count: problems.length,
        problems: problems
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch problems from database" });
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
  
  // Get all available categories - this now returns the full category objects from the database
  apiRouter.get("/categories", async (req: Request, res: Response) => {
    try {
      // Get categories from the database
      const categories = await storage.getProblemCategories();
      return res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Problem routes - fetch from database (accessible without authentication)
  apiRouter.get("/problems", optionalAuth, async (req: Request, res: Response) => {
    try {
      const { 
        category, 
        difficulty, 
        search, 
        page = '1', 
        limit = '10',
        sortBy = 'title',
        sortOrder = 'asc',
        type,
        company,
        importance
      } = req.query;
      
      // Use storage interface to get problems from database with pagination and filtering
      const options = {
        category: category && category !== 'all' ? category as string : undefined,
        difficulty: difficulty && difficulty !== 'all' ? difficulty as string : undefined,
        search: search as string | undefined,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        type: type && type !== 'all' ? type as string : undefined,
        company: company && company !== 'all' ? company as string : undefined,
        importance: importance as string | undefined
      };
      
      const { problems, total } = await storage.getProblems(options);
      
      return res.json({ 
        problems, 
        total 
      });
    } catch (error) {
      console.error("Error fetching problems from database:", error);
      return res.status(500).json({ error: "Failed to fetch problems from database" });
    }
  });
  
  apiRouter.get("/problems/:id", optionalAuth, async (req: Request, res: Response) => {
    try {
      const problemId = req.params.id;
      
      // First, try to get the problem from the database
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
      
      // We no longer use the external get_problems API as a fallback
      // All problems should be in the database
      console.log(`Problem with ID ${problemId} not found in database`);
      // Log to help troubleshoot why the problem might be missing
      
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
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          totalAttempted: 0,
          currentStreak: 0,
          longestStreak: 0
          // lastActiveDate handled by DB default value
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
  
  // Update user daily goal
  apiRouter.post("/user-daily-goal", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const { dailyGoal } = req.body;
      
      // Validate the daily goal value
      if (typeof dailyGoal !== 'number' || dailyGoal < 1) {
        return res.status(400).json({ error: "Daily goal must be a number greater than or equal to 1" });
      }
      
      // Get current stats
      let currentStats = await storage.getUserStatsRecord(req.userId);
      
      // If no stats record exists, create one
      if (!currentStats) {
        currentStats = await storage.createUserStats({
          userId: req.userId,
          dailyGoal: dailyGoal,
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          totalAttempted: 0,
          currentStreak: 0,
          longestStreak: 0
          // lastActiveDate handled by DB default value
        });
        return res.status(201).json(currentStats);
      }
      
      // Otherwise update existing record with just the daily goal
      const updatedStats = await storage.updateUserStats(req.userId, {
        dailyGoal: dailyGoal,
        updatedAt: new Date()
      });
      
      return res.json(updatedStats);
    } catch (error) {
      console.error("Error updating user daily goal:", error);
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

  // Get monthly activity with optional username and month parameters
  apiRouter.get("/monthly-activity", getUserId, async (req: Request, res: Response) => {
    try {
      // Get username and month from query parameters
      const { username, month, year } = req.query;
      let targetUserId = req.userId;
      
      // If username is provided, look up the user
      if (username && typeof username === 'string') {
        const user = await storage.getUserByUsername(username);
        if (user) {
          targetUserId = user.id;
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      }
      
      // If no user ID is available, return empty result
      if (!targetUserId) {
        return res.json({ activities: [], mostActiveDate: null });
      }
      
      // Parse month and year or use current date
      const currentDate = new Date();
      const targetMonth = month ? parseInt(month as string) - 1 : currentDate.getMonth();
      const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();
      
      // Create first and last day of the month
      const firstDay = new Date(targetYear, targetMonth, 1);
      const lastDay = new Date(targetYear, targetMonth + 1, 0);
      
      // Get activity for the month
      const activities = await storage.getUserActivity(targetUserId, firstDay, lastDay);
      
      // Find most active date - prioritize today's date (April 18)
      let mostActiveDate = null;
      let maxProblems = 0;
      
      // First check today's date if it has activity
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Find today's activity
      const todayActivity = activities.find(activity => 
        activity.date.toString().split('T')[0] === todayStr
      );
      
      // If today has activity, always use it as most active date
      if (todayActivity && todayActivity.problemsSolved > 0) {
        mostActiveDate = todayActivity.date;
        maxProblems = todayActivity.problemsSolved;
      } 
      // Otherwise find the date with most problems
      else {
        activities.forEach(activity => {
          if (activity.problemsSolved > maxProblems) {
            maxProblems = activity.problemsSolved;
            mostActiveDate = activity.date;
          }
        });
      }
      
      return res.json({
        activities,
        mostActiveDate,
        month: targetMonth + 1,
        year: targetYear
      });
    } catch (error) {
      console.error("Error fetching monthly activity:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  // Get progress summary with counts by difficulty and streak
  apiRouter.get("/progress-summary", getUserId, async (req: Request, res: Response) => {
    try {
      // Get username from query parameter
      const { username } = req.query;
      let targetUserId = req.userId;
      
      // If username is provided, look up the user
      if (username && typeof username === 'string') {
        const user = await storage.getUserByUsername(username);
        if (user) {
          targetUserId = user.id;
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      }
      
      // If no user ID is available, return empty result
      if (!targetUserId) {
        return res.json({
          totalSolved: 0,
          byDifficulty: {
            easy: 0,
            medium: 0,
            hard: 0
          },
          streak: {
            current: 0,
            longest: 0
          }
        });
      }
      
      // Get the user's stats
      const userStats = await storage.getUserStatsRecord(targetUserId);
      
      // Get the user's streak
      const streak = await storage.getUserStreak(targetUserId);
      
      // Prepare and return the response
      return res.json({
        totalSolved: userStats?.totalSolved || 0,
        byDifficulty: {
          easy: userStats?.easySolved || 0,
          medium: userStats?.mediumSolved || 0,
          hard: userStats?.hardSolved || 0
        },
        streak
      });
    } catch (error) {
      console.error("Error fetching progress summary:", error);
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
      
      // The question_id from the client should already be in the right format
      // (e.g. "10101_reverse_linked_list")
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
      
      // Generate a secure token for the container URL before making the API call
      const token = generateSecureToken();
      
      // Create an expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Send initial status update via WebSockets
      if ((app as any).updateContainerStatus) {
        (app as any).updateContainerStatus(
          token, 
          'creating', 
          'Setting up your coding environment...', 
          undefined, 
          req.userId
        );
      }
      
      // Log for debugging
      console.log(`About to call external API for user ${user.username}, with question_id: ${mongoDbQuestionId}, language: ${language}`);
      
      // Call the external API to setup the codebase using the question_id from MongoDB and language
      const result = await setupUserCodebase(user.username, mongoDbQuestionId.toString(), language);
      
      // Send final status update via WebSockets
      if ((app as any).updateContainerStatus) {
        (app as any).updateContainerStatus(
          token, 
          'ready', 
          'Your coding environment is ready!', 
          result.containerUrl, 
          req.userId
        );
      }
      
      // Record the attempt in user progress
      try {
        const problemId = parseInt(questionId);
        if (!isNaN(problemId)) {
          // First check if the problem exists to avoid foreign key constraint errors
          const problemExists = await storage.getProblem(problemId);
          
          if (problemExists) {
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
          } else {
            console.log(`Problem ID ${problemId} does not exist in the database. Skipping user progress update.`);
          }
        }
      } catch (progressError) {
        console.error("Error updating user progress:", progressError);
        // Don't fail the request if this part has an error
      }
      
      // The token was already generated earlier, no need to regenerate
      
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
      const errorToken = generateSecureToken();
      
      // Create an expiration date (24 hours from now)
      const errorExpiresAt = new Date();
      errorExpiresAt.setHours(errorExpiresAt.getHours() + 24);
      
      // Send error status update via WebSockets
      if ((app as any).updateContainerStatus) {
        (app as any).updateContainerStatus(
          errorToken, 
          'error', 
          'Error setting up your coding environment. Please try again.', 
          fallbackContainerUrl, 
          req.userId || 0
        );
      }
      
      // Store the fallback container URL in the session map
      containerSessions.set(errorToken, {
        containerUrl: fallbackContainerUrl,
        userId: req.userId || 0, // Use 0 as a fallback user ID
        createdAt: new Date(),
        expiresAt: errorExpiresAt
      });
      
      // Return a response with the token
      return res.status(200).json({
        status: "error",
        message: "Codebase setup initiated with some issues. You can still begin coding, but some features may be limited.",
        containerToken: errorToken,
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
  
  // Test endpoint for retrieving a specific code submission by ID (doesn't require authentication - for testing only)
  apiRouter.get("/test-code-submissions/:id", async (req: Request, res: Response) => {
    try {
      const submissionId = parseInt(req.params.id);
      if (isNaN(submissionId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid submission ID" 
        });
      }
      
      const submission = await storage.getCodeSubmissionById(submissionId);
      
      if (!submission) {
        return res.status(404).json({ 
          status: "error", 
          message: "Submission not found" 
        });
      }
      
      return res.json({
        status: "success",
        submission
      });
    } catch (error) {
      console.error("Error fetching code submission:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch code submission",
        error: String(error)
      });
    }
  });
  
  // Test endpoint for retrieving code submissions (doesn't require authentication - for testing only)
  apiRouter.get("/test-code-submissions", async (req: Request, res: Response) => {
    try {
      // Use a default user ID for testing (id: 1)
      const testUserId = 1;
      
      const problemId = req.query.problemId ? parseInt(req.query.problemId as string) : undefined;
      
      const submissions = await storage.getCodeSubmissions(testUserId, problemId);
      
      return res.json({
        status: "success",
        submissions
      });
    } catch (error) {
      console.error("Error fetching code submissions:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch code submissions",
        error: String(error)
      });
    }
  });
  
  // Test endpoint for code submissions (doesn't require authentication - for testing only)
  apiRouter.post("/test-code-submissions", async (req: Request, res: Response) => {
    try {
      console.log("Test code submission endpoint called with body:", req.body);
      
      // Use the userId from the request body (no fallback to ensure we detect missing user IDs)
      const testUserId = req.body.userId;
      
      let problemId = req.body.problemId;
      
      // If the problemId is a large number (like 10102), try to find the internal ID
      if (problemId > 1000) {
        // Look up the problem by question_id
        const questionIdPattern = `${problemId}_%`;
        console.log(`Looking up problem with question_id like: ${questionIdPattern}`);
        
        try {
          const problem = await storage.getProblemByQuestionIdPattern(questionIdPattern);
          
          if (problem) {
            console.log(`Found problem with internal ID ${problem.id} for external ID ${problemId}`);
            problemId = problem.id; // Use the internal ID instead
          } else {
            console.log(`No problem found for external ID ${problemId}`);
            return res.status(404).json({
              status: "error",
              message: `Problem with ID ${problemId} not found in database`
            });
          }
        } catch (lookupError) {
          console.error("Error looking up problem:", lookupError);
          // Continue with the original ID, which might fail later
        }
      }
      
      console.log("About to validate submission data for userId:", testUserId, "problemId:", problemId);
      
      // Validate the submission data
      const submissionData = insertCodeSubmissionSchema.parse({
        ...req.body,
        userId: testUserId,
        problemId: problemId
      });
      
      console.log("Validation passed. Creating submission with data:", JSON.stringify(submissionData, null, 2));
      
      // Save the submission to the database
      const submission = await storage.createCodeSubmission(submissionData);
      
      console.log("Submission created successfully:", submission.id);
      
      return res.status(201).json({
        status: "success",
        message: "Code submission recorded successfully",
        submission
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid submission data", 
          errors: error.errors 
        });
      }
      
      console.error("Error recording code submission:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to record code submission",
        error: String(error)
      });
    }
  });
  
  // Code Submission endpoint
  apiRouter.post("/code-submissions", getUserId, async (req: Request, res: Response) => {
    try {
      console.log("Code submission request received, auth userId:", req.userId);
      console.log("Request body:", req.body);
      
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      try {
        // Validate the submission data
        const submissionData = insertCodeSubmissionSchema.parse({
          ...req.body,
          userId: req.userId
        });
        
        console.log("Validated submission data:", submissionData);
        
        // Save the submission to the database
        const submission = await storage.createCodeSubmission(submissionData);
        
        console.log("Submission saved successfully:", submission);
        
        return res.status(201).json({
          status: "success",
          message: "Code submission recorded successfully",
          submission
        });
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return res.status(400).json({
          status: "error",
          message: "Invalid submission data",
          error: validationError
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid submission data", 
          errors: error.errors 
        });
      }
      
      console.error("Error recording code submission:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to record code submission" 
      });
    }
  });
  
  // Get code submissions for a user (optionally filtered by problem)
  apiRouter.get("/code-submissions", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const problemId = req.query.problemId ? parseInt(req.query.problemId as string) : undefined;
      
      const submissions = await storage.getCodeSubmissions(req.userId, problemId);
      
      return res.json({
        status: "success",
        submissions
      });
    } catch (error) {
      console.error("Error fetching code submissions:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch code submissions" 
      });
    }
  });
  
  // Get a specific code submission by ID
  apiRouter.get("/code-submissions/:id", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const submissionId = parseInt(req.params.id);
      if (isNaN(submissionId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid submission ID" 
        });
      }
      
      const submission = await storage.getCodeSubmissionById(submissionId);
      
      if (!submission) {
        return res.status(404).json({ 
          status: "error", 
          message: "Submission not found" 
        });
      }
      
      // Ensure the user can only access their own submissions
      if (submission.userId !== req.userId) {
        return res.status(403).json({ 
          status: "error", 
          message: "You do not have permission to access this submission" 
        });
      }
      
      return res.json({
        status: "success",
        submission
      });
    } catch (error) {
      console.error("Error fetching code submission:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch code submission" 
      });
    }
  });
  
  // Get memory statistics summary for a user or for a specific problem
  apiRouter.get("/memory-stats-summary", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const problemId = req.query.problemId ? parseInt(req.query.problemId as string) : undefined;
      
      const statsSummary = await storage.getMemoryStatsSummary(req.userId, problemId);
      
      return res.json({
        status: "success",
        statsSummary
      });
    } catch (error) {
      console.error("Error fetching memory stats summary:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch memory statistics summary" 
      });
    }
  });
  
  // For testing - get memory statistics summary without authentication
  apiRouter.get("/test-memory-stats-summary", async (req: Request, res: Response) => {
    try {
      // Use a default user ID for testing (id: 1)
      const testUserId = 1;
      
      const problemId = req.query.problemId ? parseInt(req.query.problemId as string) : undefined;
      
      const statsSummary = await storage.getMemoryStatsSummary(testUserId, problemId);
      
      return res.json({
        status: "success",
        statsSummary
      });
    } catch (error) {
      console.error("Error fetching memory stats summary:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch memory statistics summary",
        error: String(error)
      });
    }
  });

  // Learning Paths routes
  apiRouter.get("/learning-paths", async (req: Request, res: Response) => {
    try {
      const learningPaths = await storage.getLearningPaths();
      return res.json({
        status: "success",
        learningPaths
      });
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch learning paths" 
      });
    }
  });
  
  apiRouter.get("/learning-paths/:id", async (req: Request, res: Response) => {
    try {
      const pathId = parseInt(req.params.id);
      if (isNaN(pathId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid learning path ID" 
        });
      }
      
      const learningPath = await storage.getLearningPathById(pathId);
      if (!learningPath) {
        return res.status(404).json({ 
          status: "error", 
          message: "Learning path not found" 
        });
      }
      
      // Get the items in this learning path
      const items = await storage.getLearningPathItems(pathId);
      
      return res.json({
        status: "success",
        learningPath: {
          ...learningPath,
          items
        }
      });
    } catch (error) {
      console.error("Error fetching learning path:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch learning path" 
      });
    }
  });

  // User Preferences routes
  apiRouter.get("/user-preferences", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      let preferences = await storage.getUserPreferences(req.userId);
      
      // If preferences don't exist, create default ones
      if (!preferences) {
        preferences = await storage.createUserPreferences({
          userId: req.userId,
          theme: 'system',
          notificationSettings: {
            email_notifications: true,
            push_notifications: true
          },
          editorPreferences: {
            font_size: 14,
            tab_size: 2,
            theme: 'vs-dark',
            auto_save: true
          }
        });
      }
      
      return res.json({
        status: "success",
        preferences
      });
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch user preferences" 
      });
    }
  });
  
  apiRouter.post("/user-preferences", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      // Check if preferences already exist
      const existingPreferences = await storage.getUserPreferences(req.userId);
      
      let preferences;
      if (existingPreferences) {
        // Update existing preferences
        preferences = await storage.updateUserPreferences(req.userId, req.body);
      } else {
        // Create new preferences
        preferences = await storage.createUserPreferences({
          userId: req.userId,
          ...req.body
        });
      }
      
      return res.json({
        status: "success",
        preferences
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to update user preferences" 
      });
    }
  });

  // User Notes routes
  apiRouter.get("/user-notes", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      // Get optional problemId filter
      const problemId = req.query.problemId 
        ? parseInt(req.query.problemId as string) 
        : undefined;
      
      const notes = await storage.getUserNotes(req.userId, problemId);
      
      return res.json({
        status: "success",
        notes
      });
    } catch (error) {
      console.error("Error fetching user notes:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch user notes" 
      });
    }
  });
  
  apiRouter.post("/user-notes", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      // Create a new note
      const note = await storage.createUserNote({
        userId: req.userId,
        ...req.body
      });
      
      return res.status(201).json({
        status: "success",
        note
      });
    } catch (error) {
      console.error("Error creating user note:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to create user note" 
      });
    }
  });
  
  apiRouter.put("/user-notes/:id", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      const noteId = parseInt(req.params.id);
      if (isNaN(noteId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid note ID" 
        });
      }
      
      // Update the note
      const updatedNote = await storage.updateUserNote(noteId, req.body);
      
      if (!updatedNote) {
        return res.status(404).json({ 
          status: "error", 
          message: "Note not found" 
        });
      }
      
      return res.json({
        status: "success",
        note: updatedNote
      });
    } catch (error) {
      console.error("Error updating user note:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to update user note" 
      });
    }
  });

  // Learning Paths routes
  apiRouter.get("/learning-paths", async (req: Request, res: Response) => {
    try {
      const learningPaths = await storage.getLearningPaths();
      return res.json({
        status: "success",
        learningPaths
      });
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch learning paths" 
      });
    }
  });
  
  apiRouter.get("/learning-paths/:id", async (req: Request, res: Response) => {
    try {
      const pathId = parseInt(req.params.id);
      if (isNaN(pathId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid learning path ID" 
        });
      }
      
      const learningPath = await storage.getLearningPathById(pathId);
      if (!learningPath) {
        return res.status(404).json({ 
          status: "error", 
          message: "Learning path not found" 
        });
      }
      
      // Get the items in this learning path
      const items = await storage.getLearningPathItems(pathId);
      
      return res.json({
        status: "success",
        learningPath: {
          ...learningPath,
          items
        }
      });
    } catch (error) {
      console.error("Error fetching learning path:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch learning path" 
      });
    }
  });

  // Problem Categories routes
  apiRouter.get("/problem-categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getProblemCategories();
      return res.json({
        status: "success",
        categories
      });
    } catch (error) {
      console.error("Error fetching problem categories:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch problem categories" 
      });
    }
  });

  // User Preferences routes
  apiRouter.get("/user-preferences", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      let preferences = await storage.getUserPreferences(req.userId);
      
      // If preferences don't exist, create default ones
      if (!preferences) {
        preferences = await storage.createUserPreferences({
          userId: req.userId,
          theme: 'system',
          notificationSettings: {
            email_notifications: true,
            push_notifications: true
          },
          editorPreferences: {
            font_size: 14,
            tab_size: 2,
            theme: 'vs-dark',
            auto_save: true
          }
        });
      }
      
      return res.json({
        status: "success",
        preferences
      });
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch user preferences" 
      });
    }
  });
  
  apiRouter.post("/user-preferences", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      // Check if preferences already exist
      const existingPreferences = await storage.getUserPreferences(req.userId);
      
      let preferences;
      if (existingPreferences) {
        // Update existing preferences
        preferences = await storage.updateUserPreferences(req.userId, req.body);
      } else {
        // Create new preferences
        preferences = await storage.createUserPreferences({
          userId: req.userId,
          ...req.body
        });
      }
      
      return res.json({
        status: "success",
        preferences
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to update user preferences" 
      });
    }
  });

  // User Notes routes
  apiRouter.get("/user-notes", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      // Get optional problemId filter
      const problemId = req.query.problemId 
        ? parseInt(req.query.problemId as string) 
        : undefined;
      
      const notes = await storage.getUserNotes(req.userId, problemId);
      return res.json({
        status: "success",
        notes
      });
    } catch (error) {
      console.error("Error fetching user notes:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch user notes" 
      });
    }
  });
  
  apiRouter.post("/user-notes", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      // Create a new note
      const note = await storage.createUserNote({
        userId: req.userId,
        ...req.body
      });
      
      return res.status(201).json({
        status: "success",
        note
      });
    } catch (error) {
      console.error("Error creating user note:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to create user note" 
      });
    }
  });
  
  apiRouter.put("/user-notes/:id", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          status: "error", 
          message: "Unauthorized" 
        });
      }
      
      const noteId = parseInt(req.params.id);
      if (isNaN(noteId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid note ID" 
        });
      }
      
      // Update the note
      const updatedNote = await storage.updateUserNote(noteId, req.body);
      
      if (!updatedNote) {
        return res.status(404).json({ 
          status: "error", 
          message: "Note not found" 
        });
      }
      
      return res.json({
        status: "success",
        note: updatedNote
      });
    } catch (error) {
      console.error("Error updating user note:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to update user note" 
      });
    }
  });

  // Company routes
  apiRouter.get("/companies", async (req: Request, res: Response) => {
    try {
      const companies = await storage.getCompanies();
      return res.json({
        status: "success",
        companies
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch companies" 
      });
    }
  });

  apiRouter.get("/companies/:id", async (req: Request, res: Response) => {
    try {
      const companyId = parseInt(req.params.id);
      if (isNaN(companyId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid company ID" 
        });
      }
      
      const company = await storage.getCompanyById(companyId);
      
      if (!company) {
        return res.status(404).json({ 
          status: "error", 
          message: "Company not found" 
        });
      }
      
      return res.json({
        status: "success",
        company
      });
    } catch (error) {
      console.error("Error fetching company:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch company" 
      });
    }
  });

  apiRouter.post("/companies", async (req: Request, res: Response) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      return res.status(201).json({
        status: "success",
        company
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid company data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating company:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to create company" 
      });
    }
  });

  apiRouter.put("/companies/:id", async (req: Request, res: Response) => {
    try {
      const companyId = parseInt(req.params.id);
      if (isNaN(companyId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid company ID" 
        });
      }
      
      const updatedCompany = await storage.updateCompany(companyId, req.body);
      
      if (!updatedCompany) {
        return res.status(404).json({ 
          status: "error", 
          message: "Company not found" 
        });
      }
      
      return res.json({
        status: "success",
        company: updatedCompany
      });
    } catch (error) {
      console.error("Error updating company:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to update company" 
      });
    }
  });

  // Problem-Company mapping routes
  apiRouter.get("/problems/:problemId/companies", async (req: Request, res: Response) => {
    try {
      const problemId = parseInt(req.params.problemId);
      if (isNaN(problemId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid problem ID" 
        });
      }
      
      const companies = await storage.getCompaniesByProblemId(problemId);
      
      return res.json({
        status: "success",
        companies
      });
    } catch (error) {
      console.error("Error fetching problem companies:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to fetch problem companies" 
      });
    }
  });

  apiRouter.post("/problems/:problemId/companies", async (req: Request, res: Response) => {
    try {
      const problemId = parseInt(req.params.problemId);
      if (isNaN(problemId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid problem ID" 
        });
      }
      
      const { companyId, relevanceScore } = req.body;
      
      if (!companyId || isNaN(parseInt(companyId))) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid company ID" 
        });
      }
      
      const mapping = await storage.associateProblemWithCompany(
        problemId, 
        parseInt(companyId), 
        relevanceScore
      );
      
      return res.status(201).json({
        status: "success",
        mapping
      });
    } catch (error) {
      console.error("Error associating problem with company:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to associate problem with company" 
      });
    }
  });

  apiRouter.delete("/problems/:problemId/companies/:companyId", async (req: Request, res: Response) => {
    try {
      const problemId = parseInt(req.params.problemId);
      const companyId = parseInt(req.params.companyId);
      
      if (isNaN(problemId) || isNaN(companyId)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid problem ID or company ID" 
        });
      }
      
      const success = await storage.removeProblemCompanyAssociation(problemId, companyId);
      
      if (!success) {
        return res.status(404).json({ 
          status: "error", 
          message: "Association not found" 
        });
      }
      
      return res.json({
        status: "success",
        message: "Association removed successfully"
      });
    } catch (error) {
      console.error("Error removing problem-company association:", error);
      return res.status(500).json({ 
        status: "error", 
        message: "Failed to remove problem-company association" 
      });
    }
  });

  // Discussion routes
  // Get discussions with optional filters
  apiRouter.get("/discussions", optionalAuth, async (req: Request, res: Response) => {
    try {
      const { 
        problemId, 
        userId, 
        category, 
        page = '1', 
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      // Convert query params
      const options = {
        problemId: problemId ? parseInt(problemId as string) : undefined,
        userId: userId ? parseInt(userId as string) : undefined,
        category: category as string | undefined,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };
      
      const { discussions, total } = await storage.getDiscussions(options);
      
      return res.json({ 
        discussions, 
        total 
      });
    } catch (error) {
      console.error("Error fetching discussions:", error);
      return res.status(500).json({ error: "Failed to fetch discussions" });
    }
  });
  
  // Get discussions for a specific problem
  apiRouter.get("/problems/:problemId/discussions", optionalAuth, async (req: Request, res: Response) => {
    try {
      const problemId = parseInt(req.params.problemId);
      if (isNaN(problemId)) {
        return res.status(400).json({ error: "Invalid problem ID" });
      }
      
      const { 
        page = '1', 
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      const options = {
        problemId,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };
      
      const { discussions, total } = await storage.getDiscussions(options);
      
      return res.json({ 
        discussions, 
        total 
      });
    } catch (error) {
      console.error("Error fetching discussions for problem:", error);
      return res.status(500).json({ error: "Failed to fetch discussions" });
    }
  });
  
  // Get a specific discussion by ID with replies
  apiRouter.get("/discussions/:id", optionalAuth, async (req: Request, res: Response) => {
    try {
      const discussionId = parseInt(req.params.id);
      if (isNaN(discussionId)) {
        return res.status(400).json({ error: "Invalid discussion ID" });
      }
      
      const discussion = await storage.getDiscussion(discussionId);
      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }
      
      return res.json(discussion);
    } catch (error) {
      console.error("Error fetching discussion:", error);
      return res.status(500).json({ error: "Failed to fetch discussion" });
    }
  });
  
  // Create a new discussion
  apiRouter.post("/discussions", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const discussionData = insertDiscussionSchema.parse({
        ...req.body,
        userId: req.userId
      });
      
      const discussion = await storage.createDiscussion(discussionData);
      return res.status(201).json(discussion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating discussion:", error);
      return res.status(500).json({ error: "Failed to create discussion" });
    }
  });
  
  // Update a discussion
  apiRouter.patch("/discussions/:id", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const discussionId = parseInt(req.params.id);
      if (isNaN(discussionId)) {
        return res.status(400).json({ error: "Invalid discussion ID" });
      }
      
      // Check if the discussion exists and belongs to the user
      const existingDiscussion = await storage.getDiscussion(discussionId);
      if (!existingDiscussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }
      
      if (existingDiscussion.userId !== req.userId) {
        return res.status(403).json({ error: "You are not authorized to update this discussion" });
      }
      
      // Update the discussion
      const updatedDiscussion = await storage.updateDiscussion(discussionId, req.body);
      return res.json(updatedDiscussion);
    } catch (error) {
      console.error("Error updating discussion:", error);
      return res.status(500).json({ error: "Failed to update discussion" });
    }
  });
  
  // Delete a discussion
  apiRouter.delete("/discussions/:id", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const discussionId = parseInt(req.params.id);
      if (isNaN(discussionId)) {
        return res.status(400).json({ error: "Invalid discussion ID" });
      }
      
      // Check if the discussion exists and belongs to the user
      const existingDiscussion = await storage.getDiscussion(discussionId);
      if (!existingDiscussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }
      
      if (existingDiscussion.userId !== req.userId) {
        return res.status(403).json({ error: "You are not authorized to delete this discussion" });
      }
      
      // Delete the discussion
      const success = await storage.deleteDiscussion(discussionId);
      if (success) {
        return res.status(204).end();
      } else {
        return res.status(500).json({ error: "Failed to delete discussion" });
      }
    } catch (error) {
      console.error("Error deleting discussion:", error);
      return res.status(500).json({ error: "Failed to delete discussion" });
    }
  });
  
  // Create a reply to a discussion
  apiRouter.post("/discussions/:id/replies", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const discussionId = parseInt(req.params.id);
      if (isNaN(discussionId)) {
        return res.status(400).json({ error: "Invalid discussion ID" });
      }
      
      // Check if the discussion exists
      const existingDiscussion = await storage.getDiscussion(discussionId);
      if (!existingDiscussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }
      
      const replyData = insertDiscussionReplySchema.parse({
        ...req.body,
        userId: req.userId,
        discussionId
      });
      
      const reply = await storage.createDiscussionReply(replyData);
      return res.status(201).json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating reply:", error);
      return res.status(500).json({ error: "Failed to create reply" });
    }
  });
  
  // Vote on a reply
  apiRouter.post("/discussion-replies/:id/vote", getUserId, async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const replyId = parseInt(req.params.id);
      if (isNaN(replyId)) {
        return res.status(400).json({ error: "Invalid reply ID" });
      }
      
      const { vote } = req.body;
      if (vote !== 'like' && vote !== 'dislike') {
        return res.status(400).json({ error: "Invalid vote type. Must be 'like' or 'dislike'" });
      }
      
      const updatedReply = await storage.voteDiscussionReply(replyId, vote);
      if (!updatedReply) {
        return res.status(404).json({ error: "Reply not found" });
      }
      
      return res.json(updatedReply);
    } catch (error) {
      console.error("Error voting on reply:", error);
      return res.status(500).json({ error: "Failed to vote on reply" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSockets
  const { updateContainerStatus } = setupWebSockets(httpServer, app);
  
  // Store the updateContainerStatus function on the app for use in other places
  (app as any).updateContainerStatus = updateContainerStatus;

  return httpServer;
}
