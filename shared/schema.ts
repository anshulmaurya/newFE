import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const difficultyEnum = pgEnum('difficulty', ['Easy', 'Medium', 'Hard']);
export const statusEnum = pgEnum('status', ['Solved', 'Attempted', 'Not Started']);
export const categoryEnum = pgEnum('category', [
  'Memory Management', 
  'Multithreading', 
  'Data Structures', 
  'C++ API', 
  'Linux API', 
  'RTOS', 
  'Power Management'
]);

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

// Problems table
export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: categoryEnum("category").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  acceptanceRate: integer("acceptance_rate"),
  completionRate: text("completion_rate"),
  estimatedTime: text("estimated_time"),
  codeSnippet: text("code_snippet"),
  frequency: integer("frequency").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

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

// Define relations
export const userRelations = relations(users, ({ many, one }) => ({
  progress: many(userProgress),
  activity: many(userActivity),
  stats: one(userStats),
}));

export const problemRelations = relations(problems, ({ many }) => ({
  userProgress: many(userProgress),
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

export const insertProblemSchema = createInsertSchema(problems).pick({
  title: true,
  description: true,
  category: true,
  difficulty: true,
  acceptanceRate: true,
  completionRate: true,
  estimatedTime: true,
  codeSnippet: true,
  frequency: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  problemId: true,
  status: true,
  attemptCount: true,
  notes: true,
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
  })
  .extend({
    lastActiveDate: z.date().default(() => new Date())
  });

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
