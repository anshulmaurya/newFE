import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const difficultyEnum = pgEnum('difficulty', ['Easy', 'Medium', 'Hard']);
export const statusEnum = pgEnum('status', ['Solved', 'Attempted', 'Not Started']);
export const jobTitleEnum = pgEnum('job_title', [
  'Embedded Systems Engineer',
  'Firmware Engineer',
  'IoT Developer',
  'Hardware Engineer',
  'FPGA Engineer',
  'RTOS Developer',
  'Device Driver Engineer',
  'DSP Engineer',
  'System on Chip (SoC) Engineer',
  'Microcontroller Programmer',
  'Embedded Software Engineer',
  'Other'
]);

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

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  jobDescriptions: many(jobDescriptions),
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

// Add GitHub user profile fields to the users table
// JD Based Tables
export const jobDescriptions = pgTable("job_descriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: jobTitleEnum("title").notNull(),
  company: text("company"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jdQuestions = pgTable("jd_questions", {
  id: serial("id").primaryKey(),
  jobDescriptionId: integer("job_description_id").references(() => jobDescriptions.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  category: categoryEnum("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jdNotes = pgTable("jd_notes", {
  id: serial("id").primaryKey(),
  jobDescriptionId: integer("job_description_id").references(() => jobDescriptions.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional relations
export const jobDescriptionRelations = relations(jobDescriptions, ({ many, one }) => ({
  user: one(users, {
    fields: [jobDescriptions.userId],
    references: [users.id],
  }),
  questions: many(jdQuestions),
  notes: many(jdNotes),
}));

export const jdQuestionsRelations = relations(jdQuestions, ({ one }) => ({
  jobDescription: one(jobDescriptions, {
    fields: [jdQuestions.jobDescriptionId],
    references: [jobDescriptions.id],
  }),
}));

export const jdNotesRelations = relations(jdNotes, ({ one }) => ({
  jobDescription: one(jobDescriptions, {
    fields: [jdNotes.jobDescriptionId],
    references: [jobDescriptions.id],
  }),
}));

// User relations are defined above and include both progress and jobDescriptions

// Insert schemas for JD based tables
export const insertJobDescriptionSchema = createInsertSchema(jobDescriptions).pick({
  userId: true,
  title: true,
  company: true,
  description: true,
});

export const insertJdQuestionSchema = createInsertSchema(jdQuestions).pick({
  jobDescriptionId: true,
  title: true,
  description: true,
  difficulty: true,
  category: true,
});

export const insertJdNoteSchema = createInsertSchema(jdNotes).pick({
  jobDescriptionId: true,
  title: true,
  content: true,
});

// Types for JD based tables
export type InsertJobDescription = z.infer<typeof insertJobDescriptionSchema>;
export type JobDescription = typeof jobDescriptions.$inferSelect;

export type InsertJdQuestion = z.infer<typeof insertJdQuestionSchema>;
export type JdQuestion = typeof jdQuestions.$inferSelect;

export type InsertJdNote = z.infer<typeof insertJdNoteSchema>;
export type JdNote = typeof jdNotes.$inferSelect;

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
