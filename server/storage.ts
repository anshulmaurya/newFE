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
  type InsertCodeSubmission,
  problemCategories,
  learningPaths,
  learningPathItems,
  userPreferences,
  userNotes,
  type ProblemCategory,
  type InsertProblemCategory,
  type LearningPath,
  type InsertLearningPath,
  type LearningPathItem,
  type InsertLearningPathItem,
  type UserPreferences,
  type InsertUserPreferences,
  type UserNote,
  type InsertUserNote
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
  
  // Problem Categories methods
  getProblemCategories(): Promise<ProblemCategory[]>;
  getProblemCategoryById(id: number): Promise<ProblemCategory | undefined>;
  createProblemCategory(category: InsertProblemCategory): Promise<ProblemCategory>;
  updateProblemCategory(id: number, category: Partial<ProblemCategory>): Promise<ProblemCategory | undefined>;
  
  // Learning Paths methods
  getLearningPaths(): Promise<LearningPath[]>;
  getLearningPathById(id: number): Promise<LearningPath | undefined>;
  createLearningPath(learningPath: InsertLearningPath): Promise<LearningPath>;
  updateLearningPath(id: number, learningPath: Partial<LearningPath>): Promise<LearningPath | undefined>;
  getLearningPathItems(pathId: number): Promise<any[]>;
  createLearningPathItem(item: InsertLearningPathItem): Promise<LearningPathItem>;
  
  // User Preferences methods
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences | undefined>;
  
  // User Notes methods
  getUserNotes(userId: number, problemId?: number): Promise<UserNote[]>;
  createUserNote(note: InsertUserNote): Promise<UserNote>;
  updateUserNote(id: number, note: Partial<UserNote>): Promise<UserNote | undefined>;
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
    let query = db.select().from(userActivity);
    const whereConditions = [eq(userActivity.userId, userId)];
    
    if (fromDate) {
      const fromDateStr = fromDate.toISOString();
      whereConditions.push(sql`${userActivity.date} >= ${fromDateStr}`);
    }
    
    if (toDate) {
      const toDateStr = toDate.toISOString();
      whereConditions.push(sql`${userActivity.date} <= ${toDateStr}`);
    }
    
    return await query
      .where(and(...whereConditions))
      .orderBy(desc(userActivity.date));
  }
  
  async recordUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    // Convert Date object to ISO string if needed
    const activityToInsert = {
      ...activity,
      date: typeof activity.date === 'string' ? activity.date : activity.date.toISOString()
    };
    
    // Check if we already have an entry for this date
    const [existingActivity] = await db
      .select()
      .from(userActivity)
      .where(
        and(
          eq(userActivity.userId, activity.userId),
          eq(userActivity.date, activityToInsert.date)
        )
      );
      
    if (existingActivity) {
      // Update the existing activity
      const [updatedActivity] = await db
        .update(userActivity)
        .set({
          problemsSolved: (existingActivity.problemsSolved || 0) + (activity.problemsSolved || 0),
          minutesActive: (existingActivity.minutesActive || 0) + (activity.minutesActive || 0),
          updatedAt: new Date(),
        })
        .where(eq(userActivity.id, existingActivity.id))
        .returning();
      return updatedActivity;
    } else {
      // Create a new activity
      const [newActivity] = await db
        .insert(userActivity)
        .values([activityToInsert])
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
        current: userStatsRecord.currentStreak || 0,
        longest: userStatsRecord.longestStreak || 0,
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
    
    // Get all problems, then apply filtering in memory
    // This is a workaround for the potential schema mismatch issues
    const allProblems = await db.select().from(problems);
    
    // Apply filters in memory
    let filteredProblems = [...allProblems];
    
    if (category) {
      filteredProblems = filteredProblems.filter(p => p.category === category);
    }
    
    if (difficulty) {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
    }
    
    if (type) {
      filteredProblems = filteredProblems.filter(p => p.type === type);
    }
    
    if (importance && 'importance' in filteredProblems[0]) {
      filteredProblems = filteredProblems.filter(p => (p as any).importance === importance);
    }
    
    if (company && 'company' in filteredProblems[0]) {
      filteredProblems = filteredProblems.filter(p => {
        if (Array.isArray((p as any).company)) {
          return (p as any).company.includes(company);
        }
        return (p as any).company === company;
      });
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProblems = filteredProblems.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower) || 
        (p.questionId && p.questionId.toLowerCase().includes(searchLower))
      );
    }
    
    // Count total
    const total = filteredProblems.length;
    
    // Apply sorting
    if (sortBy) {
      filteredProblems.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);
    
    return { problems: paginatedProblems, total };
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }
  
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
    const [deletedProblem] = await db
      .delete(problems)
      .where(eq(problems.id, id))
      .returning();
    return !!deletedProblem;
  }
  
  // User Progress methods
  async getUserProgress(userId: number): Promise<(UserProgress & { problem: Problem })[]> {
    const userProgressItems = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    
    // Get problem details for each progress item
    const result = [];
    for (const progressItem of userProgressItems) {
      const [problem] = await db
        .select()
        .from(problems)
        .where(eq(problems.id, progressItem.problemId));
        
      if (problem) {
        result.push({
          ...progressItem,
          problem
        });
      }
    }
    
    return result;
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
    const [createdProgress] = await db.insert(userProgress).values(progress).returning();
    return createdProgress;
  }
  
  async updateUserProgress(id: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [updatedProgress] = await db
      .update(userProgress)
      .set({
        ...progress,
        updatedAt: new Date()
      })
      .where(eq(userProgress.id, id))
      .returning();
    return updatedProgress;
  }
  
  // User Stats methods (calculated)
  async getUserStats(userId: number): Promise<{
    totalProblems: number;
    solvedProblems: number;
    attemptedProblems: number;
    easyProblems: { solved: number; total: number };
    mediumProblems: { solved: number; total: number };
    hardProblems: { solved: number; total: number };
  }> {
    // Get all problems
    const allProblems = await db.select().from(problems);
    
    // Get user progress
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    
    // Calculate stats
    const totalProblems = allProblems.length;
    const solvedProblems = progress.filter(p => p.status === 'Solved').length;
    const attemptedProblems = progress.length;
    
    // Calculate by difficulty
    const easyProblems = {
      total: allProblems.filter(p => p.difficulty === 'Easy').length,
      solved: progress.filter(p => 
        p.status === 'Solved' && 
        allProblems.find(ap => ap.id === p.problemId)?.difficulty === 'Easy'
      ).length
    };
    
    const mediumProblems = {
      total: allProblems.filter(p => p.difficulty === 'Medium').length,
      solved: progress.filter(p => 
        p.status === 'Solved' && 
        allProblems.find(ap => ap.id === p.problemId)?.difficulty === 'Medium'
      ).length
    };
    
    const hardProblems = {
      total: allProblems.filter(p => p.difficulty === 'Hard').length,
      solved: progress.filter(p => 
        p.status === 'Solved' && 
        allProblems.find(ap => ap.id === p.problemId)?.difficulty === 'Hard'
      ).length
    };
    
    return {
      totalProblems,
      solvedProblems,
      attemptedProblems,
      easyProblems,
      mediumProblems,
      hardProblems
    };
  }
  
  // Code Submissions methods
  async getCodeSubmissions(userId: number, problemId?: number): Promise<CodeSubmission[]> {
    let query = db
      .select()
      .from(codeSubmissions)
      .where(eq(codeSubmissions.userId, userId));
    
    if (problemId) {
      query = query.where(eq(codeSubmissions.problemId, problemId));
    }
    
    return await query.orderBy(desc(codeSubmissions.submittedAt));
  }
  
  // Get memory usage statistics for a user across all submissions or for a specific problem
  async getMemoryStatsSummary(userId: number, problemId?: number): Promise<any> {
    const submissions = await this.getCodeSubmissions(userId, problemId);
    
    // Filter for successful submissions only
    const successfulSubmissions = submissions.filter(sub => sub.status === 'pass');
    
    if (successfulSubmissions.length === 0) {
      return {
        count: 0,
        averageMemoryUsage: null,
        averageExecutionTime: null,
        memoryLeakCount: 0,
        submissionsWithMemoryStats: 0
      };
    }
    
    // Count submissions with memory stats
    const submissionsWithMemoryStats = successfulSubmissions.filter(
      sub => sub.memoryStats && typeof sub.memoryStats === 'object'
    );
    
    // Calculate memory leak count
    const memoryLeakCount = submissionsWithMemoryStats.filter(
      sub => sub.memoryStats && sub.memoryStats.memory_leak === true
    ).length;
    
    // Calculate average heap usage
    let totalHeapUsage = 0;
    let heapUsageCount = 0;
    
    // Calculate average execution time
    let totalExecutionTime = 0;
    
    // Cache efficiency metrics
    let totalCacheHits = 0;
    let totalCacheMisses = 0;
    let cacheMetricsCount = 0;
    
    submissionsWithMemoryStats.forEach(sub => {
      if (sub.executionTime) {
        totalExecutionTime += sub.executionTime;
      }
      
      if (sub.memoryStats && sub.memoryStats.footprint && sub.memoryStats.footprint.heap_usage) {
        totalHeapUsage += sub.memoryStats.footprint.heap_usage;
        heapUsageCount++;
      }
      
      if (sub.memoryStats && sub.memoryStats.cache_profile) {
        if (sub.memoryStats.cache_profile.cache_hits !== undefined) {
          totalCacheHits += sub.memoryStats.cache_profile.cache_hits;
        }
        if (sub.memoryStats.cache_profile.cache_misses !== undefined) {
          totalCacheMisses += sub.memoryStats.cache_profile.cache_misses;
        }
        if (sub.memoryStats.cache_profile.cache_hits !== undefined || 
            sub.memoryStats.cache_profile.cache_misses !== undefined) {
          cacheMetricsCount++;
        }
      }
    });
    
    const averageHeapUsage = heapUsageCount > 0 ? totalHeapUsage / heapUsageCount : null;
    const averageExecutionTime = successfulSubmissions.length > 0 ? 
      totalExecutionTime / successfulSubmissions.length : null;
    const cacheHitRate = (cacheMetricsCount > 0 && (totalCacheHits + totalCacheMisses) > 0) ? 
      totalCacheHits / (totalCacheHits + totalCacheMisses) : null;
      
    return {
      count: successfulSubmissions.length,
      averageHeapUsage,
      averageExecutionTime,
      memoryLeakCount,
      submissionsWithMemoryStats: submissionsWithMemoryStats.length,
      cacheHitRate: cacheHitRate !== null ? Math.round(cacheHitRate * 100) / 100 : null // Round to 2 decimal places
    };
  }
  
  async createCodeSubmission(submission: InsertCodeSubmission): Promise<CodeSubmission> {
    const [createdSubmission] = await db
      .insert(codeSubmissions)
      .values(submission)
      .returning();
    
    // If this is a successful submission, update user stats and user progress
    if (submission.status === 'pass') {
      try {
        // Update user progress
        const existingProgress = await this.getUserProgressForProblem(
          submission.userId,
          submission.problemId
        );
        
        if (existingProgress) {
          await this.updateUserProgress(existingProgress.id, {
            status: 'Solved',
            completedAt: new Date()
          });
        } else {
          await this.createUserProgress({
            userId: submission.userId,
            problemId: submission.problemId,
            status: 'Solved',
            attemptCount: 1,
            lastAttemptedAt: new Date(),
            completedAt: new Date()
          });
        }
        
        // Update user stats
        const userStatsRecord = await this.getUserStatsRecord(submission.userId);
        
        // Get problem difficulty
        const problem = await this.getProblem(submission.problemId);
        
        if (problem && userStatsRecord) {
          const updateData = {
            totalSolved: (userStatsRecord.totalSolved || 0) + 1,
            lastActiveDate: new Date()
          } as Partial<UserStats>;
          
          // Update difficulty-specific counters
          if (problem.difficulty === 'Easy') {
            updateData.easySolved = (userStatsRecord.easySolved || 0) + 1;
          } else if (problem.difficulty === 'Medium') {
            updateData.mediumSolved = (userStatsRecord.mediumSolved || 0) + 1;
          } else if (problem.difficulty === 'Hard') {
            updateData.hardSolved = (userStatsRecord.hardSolved || 0) + 1;
          }
          
          await this.updateUserStats(submission.userId, updateData);
        }
        
      } catch (error) {
        console.error("Error updating stats/progress after submission:", error);
      }
    }
    
    // Record activity
    try {
      await this.recordUserActivity({
        userId: submission.userId,
        date: new Date().toISOString(),
        problemsSolved: submission.status === 'pass' ? 1 : 0,
        minutesActive: 30 // Default value
      });
    } catch (error) {
      console.error("Error recording activity after submission:", error);
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

  // Problem Categories methods
  async getProblemCategories(): Promise<ProblemCategory[]> {
    return await db.select().from(problemCategories).orderBy(asc(problemCategories.displayOrder));
  }

  async getProblemCategoryById(id: number): Promise<ProblemCategory | undefined> {
    const [category] = await db
      .select()
      .from(problemCategories)
      .where(eq(problemCategories.id, id));
    return category;
  }

  async createProblemCategory(category: InsertProblemCategory): Promise<ProblemCategory> {
    const [createdCategory] = await db
      .insert(problemCategories)
      .values(category)
      .returning();
    return createdCategory;
  }

  async updateProblemCategory(id: number, category: Partial<ProblemCategory>): Promise<ProblemCategory | undefined> {
    const [updatedCategory] = await db
      .update(problemCategories)
      .set({
        ...category,
        updatedAt: new Date()
      })
      .where(eq(problemCategories.id, id))
      .returning();
    return updatedCategory;
  }

  // Learning Paths methods
  async getLearningPaths(): Promise<LearningPath[]> {
    return await db.select().from(learningPaths);
  }

  async getLearningPathById(id: number): Promise<LearningPath | undefined> {
    const [learningPath] = await db
      .select()
      .from(learningPaths)
      .where(eq(learningPaths.id, id));
    return learningPath;
  }

  async createLearningPath(learningPath: InsertLearningPath): Promise<LearningPath> {
    const [createdLearningPath] = await db
      .insert(learningPaths)
      .values(learningPath)
      .returning();
    return createdLearningPath;
  }

  async updateLearningPath(id: number, learningPath: Partial<LearningPath>): Promise<LearningPath | undefined> {
    const [updatedLearningPath] = await db
      .update(learningPaths)
      .set({
        ...learningPath,
        updatedAt: new Date()
      })
      .where(eq(learningPaths.id, id))
      .returning();
    return updatedLearningPath;
  }

  async getLearningPathItems(pathId: number): Promise<any[]> {
    const items = await db
      .select()
      .from(learningPathItems)
      .where(eq(learningPathItems.learningPathId, pathId))
      .orderBy(asc(learningPathItems.displayOrder));
      
    // Fetch problem details for each item
    const result = [];
    for (const item of items) {
      const [problem] = await db
        .select()
        .from(problems)
        .where(eq(problems.id, item.problemId));
        
      result.push({
        ...item,
        problem
      });
    }
    
    return result;
  }

  async createLearningPathItem(item: InsertLearningPathItem): Promise<LearningPathItem> {
    const [createdItem] = await db
      .insert(learningPathItems)
      .values(item)
      .returning();
    return createdItem;
  }

  // User Preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [createdPreferences] = await db
      .insert(userPreferences)
      .values(preferences)
      .returning();
    return createdPreferences;
  }

  async updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences | undefined> {
    const [updatedPreferences] = await db
      .update(userPreferences)
      .set({
        ...preferences,
        updatedAt: new Date()
      })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return updatedPreferences;
  }

  // User Notes methods
  async getUserNotes(userId: number, problemId?: number): Promise<UserNote[]> {
    let query = db
      .select()
      .from(userNotes)
      .where(eq(userNotes.userId, userId));
      
    if (problemId) {
      query = query.where(eq(userNotes.problemId, problemId));
    }
    
    return await query.orderBy(desc(userNotes.updatedAt));
  }

  async createUserNote(note: InsertUserNote): Promise<UserNote> {
    const [createdNote] = await db
      .insert(userNotes)
      .values(note)
      .returning();
    return createdNote;
  }

  async updateUserNote(id: number, note: Partial<UserNote>): Promise<UserNote | undefined> {
    const [updatedNote] = await db
      .update(userNotes)
      .set({
        ...note,
        updatedAt: new Date()
      })
      .where(eq(userNotes.id, id))
      .returning();
    return updatedNote;
  }
}

export const storage = new DatabaseStorage();