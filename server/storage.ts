import { 
  type User, 
  type InsertUser, 
  users, 
  problems, 
  userProgress,
  userStats,
  userActivity,
  codeSubmissions,
  type Problem, 
  type InsertProblem,
  type UserProgress,
  type InsertUserProgress,
  type UserStats,
  type InsertUserStats,
  type UserActivity,
  type InsertUserActivity,
  type CodeSubmission,
  type InsertCodeSubmission
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, like, ilike, or } from "drizzle-orm";
import { pool } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Interface for storage operations
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Problem methods
  getProblems(options?: {
    category?: string;
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: string;
    company?: string;
    importance?: string;
  }): Promise<{ problems: Problem[]; total: number }>;
  getProblem(id: number): Promise<Problem | undefined>;
  // Removed getProblemByMongoId as MongoDB migration is being handled manually

  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblem(id: number, problem: Partial<Problem>): Promise<Problem | undefined>;
  deleteProblem(id: number): Promise<boolean>;
  
  // User Progress methods
  getUserProgress(userId: number): Promise<(UserProgress & { problem: Problem })[]>;
  getUserProgressForProblem(userId: number, problemId: number): Promise<UserProgress | undefined>;
  createUserProgress(userProgress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, userProgress: Partial<UserProgress>): Promise<UserProgress | undefined>;
  
  // User Stats methods
  getUserStats(userId: number): Promise<{
    totalProblems: number;
    solvedProblems: number;
    attemptedProblems: number;
    easyProblems: { solved: number; total: number };
    mediumProblems: { solved: number; total: number };
    hardProblems: { solved: number; total: number };
  }>;
  
  // User Stats DB methods
  getUserStatsRecord(userId: number): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: number, stats: Partial<UserStats>): Promise<UserStats | undefined>;
  
  // User Activity methods
  getUserActivity(userId: number, fromDate?: Date, toDate?: Date): Promise<UserActivity[]>;
  recordUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  updateUserActivity(id: number, activity: Partial<UserActivity>): Promise<UserActivity | undefined>;
  getUserStreak(userId: number): Promise<{ current: number, longest: number }>;
  
  // Code Submissions methods
  getCodeSubmissions(userId: number, problemId?: number): Promise<CodeSubmission[]>;
  createCodeSubmission(submission: InsertCodeSubmission): Promise<CodeSubmission>;
  getCodeSubmissionById(id: number): Promise<CodeSubmission | undefined>;
}

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Session store property
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  // User Stats DB methods
  async getUserStatsRecord(userId: number): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }
  
  async createUserStats(stats: InsertUserStats): Promise<UserStats> {
    const [createdStats] = await db.insert(userStats).values(stats).returning();
    return createdStats;
  }
  
  async updateUserStats(userId: number, stats: Partial<UserStats>): Promise<UserStats | undefined> {
    const [updatedStats] = await db
      .update(userStats)
      .set({
        ...stats,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))
      .returning();
    return updatedStats;
  }
  
  // User Activity methods
  async getUserActivity(userId: number, fromDate?: Date, toDate?: Date): Promise<UserActivity[]> {
    let query = db.select().from(userActivity).where(eq(userActivity.userId, userId));
    
    if (fromDate) {
      query = query.where(sql`${userActivity.date} >= ${fromDate}`);
    }
    
    if (toDate) {
      query = query.where(sql`${userActivity.date} <= ${toDate}`);
    }
    
    return await query.orderBy(desc(userActivity.date));
  }
  
  async recordUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    // Check if we already have an entry for this date
    const [existingActivity] = await db
      .select()
      .from(userActivity)
      .where(
        and(
          eq(userActivity.userId, activity.userId),
          eq(userActivity.date, activity.date)
        )
      );
      
    if (existingActivity) {
      // Update the existing activity
      const [updatedActivity] = await db
        .update(userActivity)
        .set({
          problemsSolved: existingActivity.problemsSolved + (activity.problemsSolved || 0),
          minutesActive: existingActivity.minutesActive + (activity.minutesActive || 0),
          updatedAt: new Date(),
        })
        .where(eq(userActivity.id, existingActivity.id))
        .returning();
      return updatedActivity;
    } else {
      // Create a new activity
      const [newActivity] = await db
        .insert(userActivity)
        .values(activity)
        .returning();
      return newActivity;
    }
  }
  
  async updateUserActivity(id: number, activity: Partial<UserActivity>): Promise<UserActivity | undefined> {
    const [updatedActivity] = await db
      .update(userActivity)
      .set({
        ...activity,
        updatedAt: new Date(),
      })
      .where(eq(userActivity.id, id))
      .returning();
    return updatedActivity;
  }
  
  async getUserStreak(userId: number): Promise<{ current: number, longest: number }> {
    // Get the user's stats record first
    const userStatsRecord = await this.getUserStatsRecord(userId);
    
    if (userStatsRecord) {
      return {
        current: userStatsRecord.currentStreak,
        longest: userStatsRecord.longestStreak,
      };
    }
    
    return { current: 0, longest: 0 };
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.githubId, githubId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Problem methods
  async getProblems(options?: {
    category?: string;
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: string;
    company?: string;
    importance?: string;
  }): Promise<{ problems: Problem[]; total: number }> {
    const { 
      category, 
      difficulty, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'id',
      sortOrder = 'asc',
      type,
      company,
      importance
    } = options || {};
    
    let query = db.select().from(problems);
    
    // Apply filters
    const filters = [];
    if (category) {
      filters.push(eq(problems.category, category as any));
    }
    if (difficulty) {
      filters.push(eq(problems.difficulty, difficulty as any));
    }
    if (type) {
      filters.push(eq(problems.type, type as any));
    }
    if (importance) {
      filters.push(eq(problems.importance, importance));
    }
    if (search) {
      filters.push(
        or(
          ilike(problems.title, `%${search}%`),
          ilike(problems.description, `%${search}%`),
          ilike(problems.questionId, `%${search}%`)
        )
      );
    }
    
    // Filter by company (now a single enum value)
    if (company) {
      filters.push(eq(problems.company, company as any));
    }
    
    if (filters.length > 0) {
      query = query.where(and(...filters));
    }
    
    // Count total before pagination
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems)
      .where(filters.length > 0 ? and(...filters) : undefined);
    
    const total = countResult?.count || 0;
    
    // Apply sorting
    if (sortBy && sortBy in problems) {
      const sortColumn = problems[sortBy as keyof typeof problems];
      if (sortColumn) {
        query = query.orderBy(
          sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn)
        );
      }
    }
    
    // Apply pagination
    query = query.limit(limit).offset((page - 1) * limit);
    
    let problemsList = await query;
    
    // The problems are already using question_id format from the database
    // Just ensure the other required fields are present
    problemsList = problemsList.map(problem => ({
      ...problem,
      // Add acceptance_rate if it doesn't exist
      acceptance_rate: problem.acceptance_rate || 90,
      // Ensure companies is always an array
      companies: problem.companies || []
    }));
    
    return { problems: problemsList, total };
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }
  
  // Removed getProblemByMongoId implementation
  


  async createProblem(problem: InsertProblem): Promise<Problem> {
    const [createdProblem] = await db.insert(problems).values(problem).returning();
    return createdProblem;
  }
  
  async updateProblem(id: number, problem: Partial<Problem>): Promise<Problem | undefined> {
    const [updatedProblem] = await db
      .update(problems)
      .set({
        ...problem,
        updatedAt: new Date()
      })
      .where(eq(problems.id, id))
      .returning();
    return updatedProblem;
  }
  
  async deleteProblem(id: number): Promise<boolean> {
    const result = await db
      .delete(problems)
      .where(eq(problems.id, id))
      .returning({ id: problems.id });
    return result.length > 0;
  }
  
  // User Progress methods
  async getUserProgress(userId: number): Promise<(UserProgress & { problem: Problem })[]> {
    const result = await db
      .select()
      .from(userProgress)
      .innerJoin(problems, eq(userProgress.problemId, problems.id))
      .where(eq(userProgress.userId, userId));
      
    return result as (UserProgress & { problem: Problem })[];
  }

  async getUserProgressForProblem(userId: number, problemId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.problemId, problemId)
        )
      );
    return progress;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [createdProgress] = await db
      .insert(userProgress)
      .values(progress)
      .returning();
    return createdProgress;
  }

  async updateUserProgress(id: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [updatedProgress] = await db
      .update(userProgress)
      .set(progress)
      .where(eq(userProgress.id, id))
      .returning();
    return updatedProgress;
  }
  
  // Stats methods
  async getUserStats(userId: number): Promise<{
    totalProblems: number;
    solvedProblems: number;
    attemptedProblems: number;
    easyProblems: { solved: number; total: number };
    mediumProblems: { solved: number; total: number };
    hardProblems: { solved: number; total: number };
  }> {
    // Get total problems
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems);
    const totalProblems = totalResult?.count || 0;
    
    // Get solved problems
    const [solvedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.status, 'Solved')
        )
      );
    const solvedProblems = solvedResult?.count || 0;
    
    // Get attempted but not solved problems
    const [attemptedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.status, 'Attempted')
        )
      );
    const attemptedProblems = attemptedResult?.count || 0;
    
    // Get difficulty breakdown
    const difficultyStats = {
      easyProblems: { solved: 0, total: 0 },
      mediumProblems: { solved: 0, total: 0 },
      hardProblems: { solved: 0, total: 0 }
    };
    
    // Get total by difficulty
    const totalByDifficulty = await db
      .select({
        difficulty: problems.difficulty,
        count: sql<number>`count(*)`
      })
      .from(problems)
      .groupBy(problems.difficulty);
    
    for (const { difficulty, count } of totalByDifficulty) {
      if (difficulty === 'Easy') difficultyStats.easyProblems.total = count;
      if (difficulty === 'Medium') difficultyStats.mediumProblems.total = count;
      if (difficulty === 'Hard') difficultyStats.hardProblems.total = count;
    }
    
    // Get solved by difficulty
    const solvedByDifficulty = await db
      .select({
        difficulty: problems.difficulty,
        count: sql<number>`count(*)`
      })
      .from(userProgress)
      .innerJoin(problems, eq(userProgress.problemId, problems.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.status, 'Solved')
        )
      )
      .groupBy(problems.difficulty);
    
    for (const { difficulty, count } of solvedByDifficulty) {
      if (difficulty === 'Easy') difficultyStats.easyProblems.solved = count;
      if (difficulty === 'Medium') difficultyStats.mediumProblems.solved = count;
      if (difficulty === 'Hard') difficultyStats.hardProblems.solved = count;
    }
    
    return {
      totalProblems,
      solvedProblems,
      attemptedProblems,
      ...difficultyStats
    };
  }
  
  // Code Submissions methods
  async getCodeSubmissions(userId: number, problemId?: number): Promise<CodeSubmission[]> {
    let query = db.select().from(codeSubmissions).where(eq(codeSubmissions.userId, userId));
    
    if (problemId) {
      query = query.where(eq(codeSubmissions.problemId, problemId));
    }
    
    return await query.orderBy(desc(codeSubmissions.submittedAt));
  }
  
  async createCodeSubmission(submission: InsertCodeSubmission): Promise<CodeSubmission> {
    const [createdSubmission] = await db
      .insert(codeSubmissions)
      .values(submission)
      .returning();
      
    // Update problem success/failure counts if this is a submission with a status
    if (submission.status) {
      const problem = await this.getProblem(submission.problemId);
      if (problem) {
        if (submission.status === 'pass') {
          await this.updateProblem(problem.id, {
            successfulSubmissions: (problem.successfulSubmissions || 0) + 1
          });
          
          // Also update user progress to mark as solved if not already
          const userProgress = await this.getUserProgressForProblem(submission.userId, submission.problemId);
          if (userProgress) {
            if (userProgress.status !== 'Solved') {
              await this.updateUserProgress(userProgress.id, {
                status: 'Solved',
                completedAt: new Date(),
                attemptCount: (userProgress.attemptCount || 0) + 1,
                lastAttemptedAt: new Date()
              });
            } else {
              // Just update the attempt count
              await this.updateUserProgress(userProgress.id, {
                attemptCount: (userProgress.attemptCount || 0) + 1,
                lastAttemptedAt: new Date()
              });
            }
          } else {
            // Create new user progress
            await this.createUserProgress({
              userId: submission.userId,
              problemId: submission.problemId,
              status: 'Solved',
              attemptCount: 1,
              lastAttemptedAt: new Date(),
              completedAt: new Date()
            });
          }
          
          // Record activity
          await this.recordUserActivity({
            userId: submission.userId,
            date: new Date().toISOString().split('T')[0], // Use today's date in YYYY-MM-DD format
            problemsSolved: 1,
            minutesActive: 10 // Assume 10 minutes per problem solved
          });
          
          // Update user stats
          const userStatsRecord = await this.getUserStatsRecord(submission.userId);
          if (userStatsRecord) {
            // Calculate streak
            const today = new Date();
            const lastActiveDate = userStatsRecord.lastActiveDate;
            
            let currentStreak = userStatsRecord.currentStreak;
            let longestStreak = userStatsRecord.longestStreak;
            
            // Check if the last active date is yesterday
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            const isYesterday = 
              lastActiveDate.getFullYear() === yesterday.getFullYear() &&
              lastActiveDate.getMonth() === yesterday.getMonth() &&
              lastActiveDate.getDate() === yesterday.getDate();
              
            // Check if the last active date is today
            const isToday = 
              lastActiveDate.getFullYear() === today.getFullYear() &&
              lastActiveDate.getMonth() === today.getMonth() &&
              lastActiveDate.getDate() === today.getDate();
            
            if (isYesterday) {
              // Increment streak
              currentStreak += 1;
              if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
              }
            } else if (!isToday) {
              // Reset streak if not today or yesterday
              currentStreak = 1;
            }
            
            // Calculate solved counts
            const difficulty = problem.difficulty;
            const updateData: Partial<UserStats> = {
              totalSolved: (userStatsRecord.totalSolved || 0) + 1,
              currentStreak,
              longestStreak,
              lastActiveDate: today
            };
            
            if (difficulty === 'Easy') {
              updateData.easySolved = (userStatsRecord.easySolved || 0) + 1;
            } else if (difficulty === 'Medium') {
              updateData.mediumSolved = (userStatsRecord.mediumSolved || 0) + 1;
            } else if (difficulty === 'Hard') {
              updateData.hardSolved = (userStatsRecord.hardSolved || 0) + 1;
            }
            
            await this.updateUserStats(submission.userId, updateData);
          } else {
            // Create new user stats
            const updateData: InsertUserStats = {
              userId: submission.userId,
              totalSolved: 1,
              currentStreak: 1,
              longestStreak: 1,
              lastActiveDate: new Date(),
              dailyGoal: 3 // Default daily goal
            };
            
            const difficulty = problem.difficulty;
            if (difficulty === 'Easy') {
              updateData.easySolved = 1;
            } else if (difficulty === 'Medium') {
              updateData.mediumSolved = 1;
            } else if (difficulty === 'Hard') {
              updateData.hardSolved = 1;
            }
            
            await this.createUserStats(updateData);
          }
        } else if (submission.status === 'fail') {
          await this.updateProblem(problem.id, {
            failedSubmissions: (problem.failedSubmissions || 0) + 1
          });
          
          // Update user progress as attempted if not already solved
          const userProgress = await this.getUserProgressForProblem(submission.userId, submission.problemId);
          if (userProgress) {
            if (userProgress.status !== 'Solved') {
              await this.updateUserProgress(userProgress.id, {
                status: 'Attempted',
                attemptCount: (userProgress.attemptCount || 0) + 1,
                lastAttemptedAt: new Date()
              });
            } else {
              // Just update the attempt count
              await this.updateUserProgress(userProgress.id, {
                attemptCount: (userProgress.attemptCount || 0) + 1,
                lastAttemptedAt: new Date()
              });
            }
          } else {
            // Create new user progress
            await this.createUserProgress({
              userId: submission.userId,
              problemId: submission.problemId,
              status: 'Attempted',
              attemptCount: 1,
              lastAttemptedAt: new Date()
            });
          }
          
          // Update user stats - just increment attempted count and update last active date
          const userStatsRecord = await this.getUserStatsRecord(submission.userId);
          if (userStatsRecord) {
            await this.updateUserStats(submission.userId, {
              totalAttempted: (userStatsRecord.totalAttempted || 0) + 1,
              lastActiveDate: new Date()
            });
          } else {
            // Create new user stats with one attempt
            await this.createUserStats({
              userId: submission.userId,
              totalAttempted: 1,
              dailyGoal: 3, // Default daily goal
              lastActiveDate: new Date()
            });
          }
        }
      }
    }
    
    return createdSubmission;
  }
  
  async getCodeSubmissionById(id: number): Promise<CodeSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(codeSubmissions)
      .where(eq(codeSubmissions.id, id));
    return submission;
  }
}

// Export instance of storage
export const storage = new DatabaseStorage();
