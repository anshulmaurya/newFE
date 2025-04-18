import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, date, jsonb, varchar, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const difficultyEnum = pgEnum('difficulty', ['Easy', 'Medium', 'Hard']);
export const statusEnum = pgEnum('status', ['Solved', 'Attempted', 'Not Started']);
export const submissionStatusEnum = pgEnum('submission_status', ['pass', 'fail']);
export const categoryEnum = pgEnum('category', [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Trees',
  'Heaps',
  'Hash Tables',
  'Graphs',
  'Tries',
  'Disjoint Sets',
  'Searching',
  'Sorting',
  'Recursion',
  'Dynamic Programming',
  'Greedy Algorithms',
  'Divide and Conquer',
  'Bit Manipulation',
  'Mathematical Algorithms',
  'RTOS',
  'State Machines',
  'Multithreading',
  'Memory Management'
]);
export const problemTypeEnum = pgEnum('problem_type', ['dsa', 'embedded', 'bridge']); // Updated 'system' to 'bridge'
export const importanceEnum = pgEnum('importance', ['low', 'medium', 'high']); // Added importance enum

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  githubId: text("github_id").unique(),
  displayName: text("display_name"),
  profileUrl: text("profile_url"),
  avatarUrl: text("avatar_url"),
  email: text("email"),
  accessToken: text("access_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Companies enum for better querying
export const companyEnum = pgEnum('company', [
  'Tesla',
  'Rivian',
  'Lucid Motors',
  'General Motors',
  'Ford',
  'Bosch',
  'Qualcomm',
  'Intel',
  'AMD',
  'NVIDIA',
  'Texas Instruments',
  'Broadcom',
  'MediaTek',
  'ARM',
  'Infineon Technologies',
  'Apple',
  'Samsung',
  'Lockheed Martin',
  'Raytheon Technologies',
  'Northrop Grumman',
  'Boeing',
  'General Dynamics',
  'DRDO',
  'Sony',
  'Cisco',
  'HP',
  'Dell',
  'IBM',
  'Google',
  'Amazon',
  'LG',
  'Huawei',
  'Microsoft'
]);

// Problems table - removed single category field
export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  type: problemTypeEnum("type").notNull(),
  company: companyEnum("company"), // Single company, not an array
  filePath: text("file_path"), // file_path in MongoDB
  successfulSubmissions: integer("successful_submissions").default(0),
  failedSubmissions: integer("failed_submissions").default(0),
  importance: importanceEnum("importance"), // Using the new enum: low, medium, high
  questionId: text("question_id").unique(), // Unique identifier like "10101_reverse_linked_list"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Problem-category mapping table - allows multiple categories per problem
export const problemCategoryMap = pgTable("problem_category_map", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id").references(() => problems.id).notNull(),
  categoryId: integer("category_id").references(() => problemCategories.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  unq: primaryKey({ columns: [t.problemId, t.categoryId] })
}));

// User progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  problemId: integer("problem_id").references(() => problems.id).notNull(),
  status: statusEnum("status").default("Not Started"),
  lastAttemptedAt: timestamp("last_attempted_at"),
  completedAt: timestamp("completed_at"),
  attemptCount: integer("attempt_count").default(0),
  notes: text("notes"),
});

// User stats table to track overall progress
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  totalSolved: integer("total_solved").default(0),
  easySolved: integer("easy_solved").default(0),
  mediumSolved: integer("medium_solved").default(0),
  hardSolved: integer("hard_solved").default(0),
  totalAttempted: integer("total_attempted").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  dailyGoal: integer("daily_goal").default(3).notNull(),
  lastActiveDate: date("last_active_date").notNull().default(sql`CURRENT_DATE`),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar activity tracking
export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull().default(sql`CURRENT_DATE`),
  problemsSolved: integer("problems_solved").default(0).notNull(),
  minutesActive: integer("minutes_active").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Problem categories normalized table - simplified structure
export const problemCategories = pgTable("problem_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  theme: varchar("theme", { length: 20 }).default("system"),
  notificationSettings: jsonb("notification_settings"),
  editorPreferences: jsonb("editor_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning paths table
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  difficulty: difficultyEnum("difficulty").notNull(),
  estimatedHours: integer("estimated_hours").default(0),
  categoryId: integer("category_id").references(() => problemCategories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning path items (problems in a learning path)
export const learningPathItems = pgTable("learning_path_items", {
  id: serial("id").primaryKey(),
  learningPathId: integer("learning_path_id").references(() => learningPaths.id).notNull(),
  problemId: integer("problem_id").references(() => problems.id).notNull(),
  displayOrder: integer("display_order").default(0),
  isRequired: boolean("is_required").default(true),
});

// Learning path progress tracking
export const learningPathProgress = pgTable("learning_path_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  learningPathId: integer("learning_path_id").references(() => learningPaths.id).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  completionPercentage: integer("completion_percentage").default(0),
  isActive: boolean("is_active").default(true),
});

// User notes for problems
export const userNotes = pgTable("user_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  problemId: integer("problem_id").references(() => problems.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies table (normalized from companyEnum)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  logoUrl: varchar("logo_url", { length: 255 }),
  description: text("description"),
  interviewFocus: text("interview_focus"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company-problem mapping table
export const companyProblemMap = pgTable("company_problem_map", {
  companyId: integer("company_id").references(() => companies.id).notNull(),
  problemId: integer("problem_id").references(() => problems.id).notNull(),
  relevanceScore: integer("relevance_score").default(5),
}, (t) => ({
  pk: primaryKey({ columns: [t.companyId, t.problemId] })
}));

// Forum discussions
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  problemId: integer("problem_id").references(() => problems.id),
  category: varchar("category", { length: 50 }).default("general"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Discussion replies
export const discussionReplies = pgTable("discussion_replies", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").references(() => discussions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  parentReplyId: integer("parent_reply_id").references(() => discussionReplies.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementType: varchar("achievement_type", { length: 50 }).notNull(), // streak, problem_count, etc.
  level: varchar("level", { length: 20 }).notNull(), // bronze, silver, gold
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Code submissions table to track submission results and memory stats
export const codeSubmissions = pgTable("code_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  problemId: integer("problem_id").references(() => problems.id).notNull(),
  status: submissionStatusEnum("status").notNull(),
  executionTime: integer("execution_time"), // Total execution time in milliseconds
  submittedAt: timestamp("submitted_at").defaultNow(),
  language: text("language").notNull(), // Programming language used (e.g., 'c', 'cpp')
  // Memory statistics stored as JSON
  memoryStats: jsonb("memory_stats"), // Will contain heap_usage, stack_usage, etc.
});

// Define relations
export const userRelations = relations(users, ({ many, one }) => ({
  progress: many(userProgress),
  activity: many(userActivity),
  stats: one(userStats),
  submissions: many(codeSubmissions),
  preferences: one(userPreferences),
  notes: many(userNotes),
  achievements: many(userAchievements),
  learningPathProgress: many(learningPathProgress),
  discussions: many(discussions),
  discussionReplies: many(discussionReplies),
}));

export const problemRelations = relations(problems, ({ many, one }) => ({
  userProgress: many(userProgress),
  submissions: many(codeSubmissions),
  notes: many(userNotes),
  learningPathItems: many(learningPathItems),
  companyMappings: many(companyProblemMap),
  discussions: many(discussions),
  categoryMappings: many(problemCategoryMap),
}));

export const problemCategoriesRelations = relations(problemCategories, ({ many }) => ({
  learningPaths: many(learningPaths),
  problemMappings: many(problemCategoryMap),
}));

export const problemCategoryMapRelations = relations(problemCategoryMap, ({ one }) => ({
  problem: one(problems, {
    fields: [problemCategoryMap.problemId],
    references: [problems.id],
  }),
  category: one(problemCategories, {
    fields: [problemCategoryMap.categoryId],
    references: [problemCategories.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const learningPathsRelations = relations(learningPaths, ({ many, one }) => ({
  items: many(learningPathItems),
  progress: many(learningPathProgress),
  category: one(problemCategories, {
    fields: [learningPaths.categoryId],
    references: [problemCategories.id],
  }),
}));

export const learningPathItemsRelations = relations(learningPathItems, ({ one }) => ({
  learningPath: one(learningPaths, {
    fields: [learningPathItems.learningPathId],
    references: [learningPaths.id],
  }),
  problem: one(problems, {
    fields: [learningPathItems.problemId],
    references: [problems.id],
  }),
}));

export const learningPathProgressRelations = relations(learningPathProgress, ({ one }) => ({
  user: one(users, {
    fields: [learningPathProgress.userId],
    references: [users.id],
  }),
  learningPath: one(learningPaths, {
    fields: [learningPathProgress.learningPathId],
    references: [learningPaths.id],
  }),
}));

export const userNotesRelations = relations(userNotes, ({ one }) => ({
  user: one(users, {
    fields: [userNotes.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [userNotes.problemId],
    references: [problems.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  problemMappings: many(companyProblemMap),
}));

export const companyProblemMapRelations = relations(companyProblemMap, ({ one }) => ({
  company: one(companies, {
    fields: [companyProblemMap.companyId],
    references: [companies.id],
  }),
  problem: one(problems, {
    fields: [companyProblemMap.problemId],
    references: [problems.id],
  }),
}));

export const discussionsRelations = relations(discussions, ({ many, one }) => ({
  replies: many(discussionReplies),
  user: one(users, {
    fields: [discussions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [discussions.problemId],
    references: [problems.id],
  }),
}));

export const discussionRepliesRelations = relations(discussionReplies, ({ one, many }) => ({
  discussion: one(discussions, {
    fields: [discussionReplies.discussionId],
    references: [discussions.id],
  }),
  user: one(users, {
    fields: [discussionReplies.userId],
    references: [users.id],
  }),
  // Fix recursive relation
  parentReply: one(discussionReplies, {
    fields: [discussionReplies.parentReplyId],
    references: [discussionReplies.id],
    relationName: 'parentReply',
  }),
  childReplies: many(discussionReplies),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [userProgress.problemId],
    references: [problems.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(users, {
    fields: [userActivity.userId],
    references: [users.id],
  }),
}));

export const codeSubmissionsRelations = relations(codeSubmissions, ({ one }) => ({
  user: one(users, {
    fields: [codeSubmissions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [codeSubmissions.problemId],
    references: [problems.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  githubId: true,
  displayName: true,
  profileUrl: true,
  avatarUrl: true,
  email: true,
  accessToken: true,
});

// This will be updated after the migration succeeds
export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  problemId: true,
  status: true,
  attemptCount: true,
  notes: true,
  lastAttemptedAt: true,
  completedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problems.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type UserStats = typeof userStats.$inferSelect;
export type UserActivity = typeof userActivity.$inferSelect;

// Insert schemas for new tables
export const insertUserStatsSchema = createInsertSchema(userStats)
  .pick({
    userId: true,
    totalSolved: true,
    easySolved: true,
    mediumSolved: true,
    hardSolved: true,
    totalAttempted: true,
    currentStreak: true,
    longestStreak: true,
    dailyGoal: true,
  });
  // Don't extend with lastActiveDate as the DB column has a default value of CURRENT_DATE

export const insertUserActivitySchema = createInsertSchema(userActivity)
  .pick({
    userId: true,
    problemsSolved: true,
    minutesActive: true,
  })
  .extend({
    date: z.date().default(() => new Date())
  });

export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;

// Insert schema for code submissions
export const insertCodeSubmissionSchema = createInsertSchema(codeSubmissions)
  .pick({
    userId: true,
    problemId: true,
    status: true,
    executionTime: true,
    language: true,
  })
  .extend({
    memoryStats: z.record(z.any()).optional(),
    submittedAt: z.date().default(() => new Date())
  });

// Define memory stats interface for better type checking
export interface MemoryStatsData {
  memory_leak?: boolean;
  footprint?: {
    heap_usage?: number;
    stack_usage?: number;
  };
  cache_profile?: {
    cache_hits?: number;
    cache_misses?: number;
  };
}

export type InsertCodeSubmission = z.infer<typeof insertCodeSubmissionSchema>;
export type CodeSubmission = typeof codeSubmissions.$inferSelect & {
  memoryStats?: MemoryStatsData;
};

// Add GitHub user profile fields to the users table
export const githubUserSchema = createInsertSchema(users).extend({
  githubId: z.string(),
  displayName: z.string().optional(),
  username: z.string(),
  profileUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  email: z.string().optional(),
  accessToken: z.string(),
});

export type GithubUser = z.infer<typeof githubUserSchema>;

// Insert schema for problemCategories
export const insertProblemCategorySchema = createInsertSchema(problemCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProblemCategory = z.infer<typeof insertProblemCategorySchema>;
export type ProblemCategory = typeof problemCategories.$inferSelect;

// Insert schema for userPreferences
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  theme: true,
}).extend({
  notificationSettings: z.record(z.any()).optional(),
  editorPreferences: z.record(z.any()).optional(),
});
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Insert schema for learningPaths
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;

// Insert schema for learningPathItems
export const insertLearningPathItemSchema = createInsertSchema(learningPathItems).omit({
  id: true,
});
export type InsertLearningPathItem = z.infer<typeof insertLearningPathItemSchema>;
export type LearningPathItem = typeof learningPathItems.$inferSelect;

// Insert schema for learningPathProgress
export const insertLearningPathProgressSchema = createInsertSchema(learningPathProgress).pick({
  userId: true,
  learningPathId: true,
  completionPercentage: true,
  isActive: true,
});
export type InsertLearningPathProgress = z.infer<typeof insertLearningPathProgressSchema>;
export type LearningPathProgress = typeof learningPathProgress.$inferSelect;

// Insert schema for userNotes
export const insertUserNoteSchema = createInsertSchema(userNotes).pick({
  userId: true,
  problemId: true,
  content: true,
});
export type InsertUserNote = z.infer<typeof insertUserNoteSchema>;
export type UserNote = typeof userNotes.$inferSelect;

// Insert schema for companies
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

// Insert schema for companyProblemMap
export const insertCompanyProblemMapSchema = createInsertSchema(companyProblemMap);
export type InsertCompanyProblemMap = z.infer<typeof insertCompanyProblemMapSchema>;
export type CompanyProblemMap = typeof companyProblemMap.$inferSelect;

// Insert schema for problemCategoryMap
export const insertProblemCategoryMapSchema = createInsertSchema(problemCategoryMap);
export type InsertProblemCategoryMap = z.infer<typeof insertProblemCategoryMapSchema>;
export type ProblemCategoryMap = typeof problemCategoryMap.$inferSelect;

// Insert schema for discussions
export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Discussion = typeof discussions.$inferSelect;

// Insert schema for discussionReplies
export const insertDiscussionReplySchema = createInsertSchema(discussionReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  dislikes: true,
});
export type InsertDiscussionReply = z.infer<typeof insertDiscussionReplySchema>;
export type DiscussionReply = typeof discussionReplies.$inferSelect;

// Insert schema for userAchievements
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
