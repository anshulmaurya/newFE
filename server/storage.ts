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
  type MemoryStatsData, // Import the memory stats interface
  problemCategories,
  learningPaths,
  learningPathItems,
  userPreferences,
  userNotes,
  companies,
  discussions,
  discussionReplies,
  type ProblemCategory,
  type InsertProblemCategory,
  type LearningPath,
  type InsertLearningPath,
  type LearningPathItem,
  type InsertLearningPathItem,
  type UserPreferences,
  type InsertUserPreferences,
  type UserNote,
  type InsertUserNote,
  type Company,
  type InsertCompany,
  type Discussion,
  type InsertDiscussion,
  type DiscussionReply,
  type InsertDiscussionReply
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
  }): Promise<{ problems: (Problem & { category?: { id: number, name: string } })[]; total: number }>;
  getProblem(id: number): Promise<(Problem & { 
    category?: { id: number, name: string },
    companies?: { id: number, name: string, logoUrl?: string | null }[]
  }) | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblem(id: number, problem: Partial<Problem>): Promise<Problem | undefined>;
  deleteProblem(id: number): Promise<boolean>;
  
  // User Progress methods
  getUserProgress(userId: number): Promise<(UserProgress & { 
    problem: Problem & { 
      category?: { id: number, name: string } 
    } 
  })[]>;
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
  
  // Company methods
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | undefined>;
  getCompaniesByProblemId(problemId: number): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<Company>): Promise<Company | undefined>;
  
  // Company-Problem association methods (using companyIds array in problems table)
  associateProblemWithCompany(problemId: number, companyId: number, relevanceScore?: number): Promise<{ problemId: number, companyId: number, relevanceScore: number | null }>;
  removeProblemCompanyAssociation(problemId: number, companyId: number): Promise<boolean>;
  
  // Discussion methods
  getDiscussions(options?: {
    problemId?: number;
    userId?: number;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ discussions: (Discussion & { user: { id: number, username: string, avatarUrl?: string | null } })[]; total: number }>;
  getDiscussion(id: number): Promise<(Discussion & { 
    user: { id: number, username: string, avatarUrl?: string | null },
    replies?: (DiscussionReply & { user: { id: number, username: string, avatarUrl?: string | null } })[]
  }) | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  updateDiscussion(id: number, discussion: Partial<Discussion>): Promise<Discussion | undefined>;
  deleteDiscussion(id: number): Promise<boolean>;
  
  // Discussion Reply methods
  getDiscussionReplies(discussionId: number): Promise<(DiscussionReply & { 
    user: { id: number, username: string, avatarUrl?: string | null } 
  })[]>;
  createDiscussionReply(reply: InsertDiscussionReply): Promise<DiscussionReply>;
  updateDiscussionReply(id: number, reply: Partial<DiscussionReply>): Promise<DiscussionReply | undefined>;
  deleteDiscussionReply(id: number): Promise<boolean>;
  voteDiscussionReply(id: number, vote: 'like' | 'dislike'): Promise<DiscussionReply | undefined>;
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
    // The lastActiveDate is handled by the database default value
    const [createdStats] = await db.insert(userStats).values({
      ...stats,
      // Let DB use default value for lastActiveDate
    }).returning();
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
    category?: string | number; // Can accept categoryId (number) or category name (string)
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: string;
    company?: string;
    importance?: string;
  }): Promise<{ problems: (Problem & { category?: { id: number, name: string } })[]; total: number }> {
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
    
    // Get all categories to help with filtering and enrichment
    const allCategories = await db.select().from(problemCategories);
    
    // Get all problems
    const allProblems = await db.select().from(problems);
    
    // Apply filters in memory
    let filteredProblems = [...allProblems];
    
    if (category) {
      // If category is a number, it's the categoryId
      if (typeof category === 'number') {
        filteredProblems = filteredProblems.filter(p => p.categoryId === category);
      } 
      // If category is a string, find the matching category ID
      else if (typeof category === 'string') {
        const matchingCategory = allCategories.find(c => c.name === category);
        if (matchingCategory) {
          filteredProblems = filteredProblems.filter(p => p.categoryId === matchingCategory.id);
        }
      }
    }
    
    if (difficulty) {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
    }
    
    if (type) {
      filteredProblems = filteredProblems.filter(p => p.type === type);
    }
    
    // Safe check for importance filter - only apply if we have problems and they have the field
    if (importance && filteredProblems.length > 0 && 'importance' in filteredProblems[0]) {
      filteredProblems = filteredProblems.filter(p => (p as any).importance === importance);
    }
    
    // For company filter, filter based on companyIds array in the problems table
    if (company && company !== 'all') {
      let companyId: number | undefined;
      
      // First determine if company is a name or ID
      if (typeof company === 'number') {
        companyId = company;
      } else if (typeof company === 'string' && !isNaN(parseInt(company))) {
        // If company is a string number, convert to number
        companyId = parseInt(company);
      } else {
        // Try to find company by name
        const companyRecord = await db
          .select()
          .from(companies)
          .where(eq(companies.name, company))
          .limit(1);
        
        if (companyRecord.length > 0) {
          companyId = companyRecord[0].id;
        }
      }
      
      if (companyId) {
        // Filter problems with this company ID in their companyIds array
        filteredProblems = filteredProblems.filter(p => 
          p.companyIds && Array.isArray(p.companyIds) && p.companyIds.includes(companyId)
        );
      } else {
        // If company not found, return empty list
        filteredProblems = [];
      }
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProblems = filteredProblems.filter(p => {
        // Always check if properties exist before doing operations on them
        const titleMatch = p.title ? p.title.toLowerCase().includes(searchLower) : false;
        const descriptionMatch = p.description ? p.description.toLowerCase().includes(searchLower) : false;
        const questionIdMatch = p.questionId ? p.questionId.toLowerCase().includes(searchLower) : false;
        
        return titleMatch || descriptionMatch || questionIdMatch;
      });
    }
    
    // Count total
    const total = filteredProblems.length;
    
    // Apply sorting
    if (sortBy) {
      filteredProblems.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        // Handle null/undefined values for proper sorting
        if (aValue === null || aValue === undefined) return sortOrder === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortOrder === 'asc' ? 1 : -1;
        
        // Safe comparison for different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        // Default numeric comparison
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    let paginatedProblems = filteredProblems.slice(startIndex, endIndex);
    
    // Enrich problems with category information
    paginatedProblems = paginatedProblems.map(problem => {
      if (problem.categoryId) {
        const category = allCategories.find(cat => cat.id === problem.categoryId);
        if (category) {
          return {
            ...problem,
            category: {
              id: category.id,
              name: category.name
            }
          };
        }
      }
      return problem;
    });
    
    return { problems: paginatedProblems, total };
  }

  async getProblem(id: number): Promise<(Problem & { 
    category?: { id: number, name: string },
    companies?: { id: number, name: string, logoUrl?: string | null }[]
  }) | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    
    if (!problem) {
      return undefined;
    }
    
    // Create enriched problem object with additional data
    const enrichedProblem: Problem & { 
      category?: { id: number, name: string },
      companies?: { id: number, name: string, logoUrl?: string | null }[]
    } = { ...problem };
    
    // Get category information if available
    if (problem.categoryId) {
      const [category] = await db
        .select()
        .from(problemCategories)
        .where(eq(problemCategories.id, problem.categoryId));
      
      if (category) {
        enrichedProblem.category = {
          id: category.id,
          name: category.name
        };
      }
    }
    
    // Get associated companies
    const associatedCompanies = await this.getCompaniesByProblemId(id);
    
    if (associatedCompanies.length > 0) {
      enrichedProblem.companies = associatedCompanies.map(company => ({
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl
      }));
    }
    
    return enrichedProblem;
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
  async getUserProgress(userId: number): Promise<(UserProgress & { problem: Problem & { category?: { id: number, name: string } } })[]> {
    const userProgressItems = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    
    // Get all categories for lookup
    const categories = await db.select().from(problemCategories);
    
    // Get problem details for each progress item
    const result = [];
    for (const progressItem of userProgressItems) {
      const [problem] = await db
        .select()
        .from(problems)
        .where(eq(problems.id, progressItem.problemId));
        
      if (problem) {
        // Find the category for this problem
        let enrichedProblem: Problem & { category?: { id: number, name: string } } = { ...problem };
        
        if (problem.categoryId) {
          const category = categories.find(c => c.id === problem.categoryId);
          if (category) {
            enrichedProblem.category = {
              id: category.id,
              name: category.name
            };
          }
        }
        
        result.push({
          ...progressItem,
          problem: enrichedProblem
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
      .set(progress) // userProgress table doesn't have an updatedAt column
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
    let queryBuilder = db
      .select()
      .from(codeSubmissions);
    
    // Build where clauses
    const whereConditions = [eq(codeSubmissions.userId, userId)];
    
    if (problemId) {
      whereConditions.push(eq(codeSubmissions.problemId, problemId));
    }
    
    // Execute the query
    const results = await queryBuilder
      .where(and(...whereConditions))
      .orderBy(desc(codeSubmissions.submittedAt));
      
    // Map the basic results to include properly typed memoryStats
    return results.map(submission => {
      // Cast the raw memoryStats data to the MemoryStatsData interface
      const typedMemoryStats = submission.memoryStats as unknown as MemoryStatsData;
      
      return {
        ...submission,
        memoryStats: typedMemoryStats
      };
    });
  }
  
  // Get memory usage statistics for a user across all submissions or for a specific problem
  async getMemoryStatsSummary(userId: number, problemId?: number): Promise<{
    count: number;
    averageHeapUsage: number | null;
    averageExecutionTime: number | null;
    memoryLeakCount: number;
    submissionsWithMemoryStats: number;
    cacheHitRate: number | null;
  }> {
    const submissions = await this.getCodeSubmissions(userId, problemId);
    
    // Filter for successful submissions only
    const successfulSubmissions = submissions.filter(sub => sub.status === 'pass');
    
    if (successfulSubmissions.length === 0) {
      return {
        count: 0,
        averageHeapUsage: null,
        averageExecutionTime: null,
        memoryLeakCount: 0,
        submissionsWithMemoryStats: 0,
        cacheHitRate: null
      };
    }
    
    // Count submissions with memory stats
    const submissionsWithMemoryStats = successfulSubmissions.filter(
      sub => sub.memoryStats && typeof sub.memoryStats === 'object'
    );
    
    // Calculate memory leak count
    const memoryLeakCount = submissionsWithMemoryStats.filter(
      sub => sub.memoryStats?.memory_leak === true
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
      
      if (sub.memoryStats?.footprint?.heap_usage) {
        totalHeapUsage += sub.memoryStats.footprint.heap_usage;
        heapUsageCount++;
      }
      
      if (sub.memoryStats?.cache_profile) {
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
    
    // Cast memoryStats to the proper type
    const typedMemoryStats = createdSubmission.memoryStats as unknown as MemoryStatsData;
    
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
            lastAttemptedAt: new Date(),
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
          // Since lastActiveDate is a DATE type in PostgreSQL
          const updateData: Partial<UserStats> = {
            totalSolved: (userStatsRecord.totalSolved || 0) + 1,
            // Use the SQL template literal but cast it to any to bypass TypeScript's type checking
            // since we know this will work correctly with PostgreSQL
            lastActiveDate: sql`CURRENT_DATE` as any
          };
          
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
        date: new Date(), // The InsertUserActivitySchema will handle this properly
        problemsSolved: submission.status === 'pass' ? 1 : 0,
        minutesActive: 30 // Default value
      });
    } catch (error) {
      console.error("Error recording activity after submission:", error);
    }
    
    // Return the submission with properly typed memory stats
    return {
      ...createdSubmission,
      memoryStats: typedMemoryStats
    };
  }
  
  async getCodeSubmissionById(id: number): Promise<CodeSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(codeSubmissions)
      .where(eq(codeSubmissions.id, id));
      
    if (!submission) return undefined;
    
    // Cast memoryStats to the proper type
    const typedMemoryStats = submission.memoryStats as unknown as MemoryStatsData;
    
    return {
      ...submission,
      memoryStats: typedMemoryStats
    };
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
    // Build where conditions for the query
    const whereConditions = [eq(userNotes.userId, userId)];
    
    if (problemId) {
      whereConditions.push(eq(userNotes.problemId, problemId));
    }
    
    // Execute the query with AND conditions
    return await db
      .select()
      .from(userNotes)
      .where(and(...whereConditions))
      .orderBy(desc(userNotes.updatedAt));
  }

  async createUserNote(note: InsertUserNote): Promise<UserNote> {
    const [createdNote] = await db
      .insert(userNotes)
      .values(note)
      .returning();
    return createdNote;
  }

  async updateUserNote(id: number, note: Partial<UserNote>): Promise<UserNote | undefined> {
    // The userNotes table has an updatedAt column which we need to update
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
  
  // Company methods
  async getCompanies(): Promise<Company[]> {
    return await db
      .select()
      .from(companies)
      .orderBy(asc(companies.name));
  }
  
  async getCompanyById(id: number): Promise<Company | undefined> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id));
    return company;
  }
  
  async getCompaniesByProblemId(problemId: number): Promise<Company[]> {
    // First get the problem to access its companyIds array
    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.id, problemId));
    
    if (!problem || !problem.companyIds || problem.companyIds.length === 0) {
      return [];
    }
    
    // Get all company details for the IDs in the array
    const companyList: Company[] = [];
    for (const companyId of problem.companyIds) {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, companyId));
      
      if (company) {
        companyList.push(company);
      }
    }
    
    return companyList;
  }
  
  async createCompany(company: InsertCompany): Promise<Company> {
    const [createdCompany] = await db
      .insert(companies)
      .values(company)
      .returning();
    return createdCompany;
  }
  
  async updateCompany(id: number, company: Partial<Company>): Promise<Company | undefined> {
    const [updatedCompany] = await db
      .update(companies)
      .set({
        ...company,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }
  
  // Company-Problem association methods (using companyIds array)
  async associateProblemWithCompany(problemId: number, companyId: number, relevanceScore: number = 5): Promise<{ problemId: number, companyId: number, relevanceScore: number | null }> {
    // Get the current problem
    const [problem] = await db
      .select()
      .from(problems)
      .where(eq(problems.id, problemId));
    
    if (!problem) {
      throw new Error(`Problem with ID ${problemId} not found`);
    }
    
    // Check if this company is already in the array
    const companyIds = problem.companyIds || [];
    
    if (!companyIds.includes(companyId)) {
      // Add the company ID to the array
      const updatedCompanyIds = [...companyIds, companyId];
      
      // Update the problem with the new company ID array
      await db
        .update(problems)
        .set({
          companyIds: updatedCompanyIds,
          updatedAt: new Date()
        })
        .where(eq(problems.id, problemId));
    }
    
    // Return the association data with relevanceScore included to match the interface
    return { problemId, companyId, relevanceScore };
  }
  
  async removeProblemCompanyAssociation(problemId: number, companyId: number): Promise<boolean> {
    try {
      // Get the current problem
      const [problem] = await db
        .select()
        .from(problems)
        .where(eq(problems.id, problemId));
      
      if (!problem || !problem.companyIds) {
        return false;
      }
      
      // Remove the company ID from the array
      const updatedCompanyIds = problem.companyIds.filter(id => id !== companyId);
      
      // Update the problem with the new company ID array
      await db
        .update(problems)
        .set({
          companyIds: updatedCompanyIds,
          updatedAt: new Date()
        })
        .where(eq(problems.id, problemId));
      
      return true;
    } catch (error) {
      console.error("Error removing problem-company association:", error);
      return false;
    }
  }

  // Discussion methods
  async getDiscussions(options?: {
    problemId?: number;
    userId?: number;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ discussions: (Discussion & { user: { id: number, username: string, avatarUrl?: string | null } })[]; total: number }> {
    try {
      const { 
        problemId, 
        userId, 
        category, 
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options || {};
      
      // Apply filters
      const whereConditions = [];
      
      if (problemId) {
        whereConditions.push(eq(discussions.problemId, problemId));
      }
      
      if (userId) {
        whereConditions.push(eq(discussions.userId, userId));
      }
      
      if (category && category !== 'all') {
        whereConditions.push(eq(discussions.category, category));
      }
      
      // Get total count for pagination
      const countQuery = db.select({ count: sql<number>`count(*)` })
        .from(discussions);
      
      if (whereConditions.length > 0) {
        countQuery.where(and(...whereConditions));
      }
      
      const [countResult] = await countQuery;
      const total = countResult?.count || 0;
      
      // Build the query with proper typing
      let query = db.select({
        discussion: discussions,
        user: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl
        }
      })
      .from(discussions)
      .leftJoin(users, eq(discussions.userId, users.id));
      
      if (whereConditions.length > 0) {
        query = query.where(and(...whereConditions));
      }
      
      // Apply sorting
      if (sortBy === 'createdAt') {
        query = query.orderBy(sortOrder === 'asc' ? asc(discussions.createdAt) : desc(discussions.createdAt));
      } else if (sortBy === 'title') {
        query = query.orderBy(sortOrder === 'asc' ? asc(discussions.title) : desc(discussions.title));
      } else if (sortBy === 'updatedAt') {
        query = query.orderBy(sortOrder === 'asc' ? asc(discussions.updatedAt) : desc(discussions.updatedAt));
      }
      
      // Apply pagination
      query = query.limit(limit).offset((page - 1) * limit);
      
      // Execute the query
      const result = await query;
      
      // Transform the result with proper null checking
      const discussionsList = result.map(row => {
        return {
          ...row.discussion,
          user: row.user || { id: 0, username: 'Unknown User' }
        };
      });
      
      return {
        discussions: discussionsList,
        total
      };
    } catch (error) {
      console.error('Error getting discussions:', error);
      return { discussions: [], total: 0 };
    }
  }
  
  async getDiscussion(id: number): Promise<(Discussion & { 
    user: { id: number, username: string, avatarUrl?: string | null },
    replies?: (DiscussionReply & { user: { id: number, username: string, avatarUrl?: string | null } })[]
  }) | undefined> {
    try {
      // Get the discussion with the user
      const [discussionResult] = await db.select({
        discussion: discussions,
        user: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl
        }
      })
      .from(discussions)
      .leftJoin(users, eq(discussions.userId, users.id))
      .where(eq(discussions.id, id));
      
      if (!discussionResult) {
        return undefined;
      }
      
      // Get replies for this discussion
      const replies = await this.getDiscussionReplies(id);
      
      // Combine and return the data with null checking
      return {
        ...discussionResult.discussion,
        user: discussionResult.user || { id: 0, username: 'Unknown User' },
        replies
      };
    } catch (error) {
      console.error(`Error getting discussion ${id}:`, error);
      return undefined;
    }
  }
  
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const [newDiscussion] = await db.insert(discussions)
      .values(discussion)
      .returning();
    
    return newDiscussion;
  }
  
  async updateDiscussion(id: number, discussion: Partial<Discussion>): Promise<Discussion | undefined> {
    const [updatedDiscussion] = await db.update(discussions)
      .set({
        ...discussion,
        updatedAt: new Date()
      })
      .where(eq(discussions.id, id))
      .returning();
    
    return updatedDiscussion;
  }
  
  async deleteDiscussion(id: number): Promise<boolean> {
    try {
      // First delete all replies to this discussion
      await db.delete(discussionReplies)
        .where(eq(discussionReplies.discussionId, id));
      
      // Then delete the discussion
      const result = await db.delete(discussions)
        .where(eq(discussions.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting discussion:", error);
      return false;
    }
  }
  
  // Discussion Reply methods
  async getDiscussionReplies(discussionId: number): Promise<(DiscussionReply & { 
    user: { id: number, username: string, avatarUrl?: string | null } 
  })[]> {
    try {
      const result = await db.select({
        reply: discussionReplies,
        user: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl
        }
      })
      .from(discussionReplies)
      .leftJoin(users, eq(discussionReplies.userId, users.id))
      .where(eq(discussionReplies.discussionId, discussionId))
      .orderBy(asc(discussionReplies.createdAt));
      
      // Transform the result with proper null handling
      return result.map(row => {
        return {
          ...row.reply,
          user: row.user || { id: 0, username: 'Unknown User' }
        };
      });
    } catch (error) {
      console.error(`Error getting discussion replies for discussion ${discussionId}:`, error);
      return [];
    }
  }
  
  async createDiscussionReply(reply: InsertDiscussionReply): Promise<DiscussionReply> {
    const [newReply] = await db.insert(discussionReplies)
      .values(reply)
      .returning();
    
    return newReply;
  }
  
  async updateDiscussionReply(id: number, reply: Partial<DiscussionReply>): Promise<DiscussionReply | undefined> {
    const [updatedReply] = await db.update(discussionReplies)
      .set({
        ...reply,
        updatedAt: new Date()
      })
      .where(eq(discussionReplies.id, id))
      .returning();
    
    return updatedReply;
  }
  
  async deleteDiscussionReply(id: number): Promise<boolean> {
    try {
      // Remove as parent from all child replies
      await db.update(discussionReplies)
        .set({ parentReplyId: null })
        .where(eq(discussionReplies.parentReplyId, id));
      
      // Then delete the reply
      const result = await db.delete(discussionReplies)
        .where(eq(discussionReplies.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting discussion reply:", error);
      return false;
    }
  }
  
  async voteDiscussionReply(id: number, vote: 'like' | 'dislike'): Promise<DiscussionReply | undefined> {
    try {
      // Get the current reply
      const [reply] = await db.select().from(discussionReplies).where(eq(discussionReplies.id, id));
      
      if (!reply) {
        return undefined;
      }
      
      // Update the votes
      const updateData = vote === 'like' 
        ? { likes: (reply.likes || 0) + 1 }
        : { dislikes: (reply.dislikes || 0) + 1 };
      
      const [updatedReply] = await db.update(discussionReplies)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(discussionReplies.id, id))
        .returning();
      
      return updatedReply;
    } catch (error) {
      console.error(`Error ${vote}ing discussion reply:`, error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();