CREATE TYPE "public"."category" AS ENUM('Memory Management', 'Multithreading', 'Data Structures', 'C++ API', 'Linux API', 'RTOS', 'Power Management');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('Easy', 'Medium', 'Hard');--> statement-breakpoint
CREATE TYPE "public"."problem_type" AS ENUM('dsa', 'embedded', 'system');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Solved', 'Attempted', 'Not Started');--> statement-breakpoint
CREATE TABLE "problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"mongo_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"type" "problem_type" NOT NULL,
	"tags" text[],
	"companies" text[],
	"file_path" text,
	"likes" integer DEFAULT 0,
	"dislikes" integer DEFAULT 0,
	"successful_submissions" integer DEFAULT 0,
	"failed_submissions" integer DEFAULT 0,
	"acceptance_rate" integer DEFAULT 0,
	"importance" text,
	"question_id" text,
	"category" "category" DEFAULT 'Data Structures',
	"code_snippet" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"metadata" jsonb,
	CONSTRAINT "problems_mongo_id_unique" UNIQUE("mongo_id"),
	CONSTRAINT "problems_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"problems_solved" integer DEFAULT 0 NOT NULL,
	"minutes_active" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"status" "status" DEFAULT 'Not Started',
	"last_attempted_at" timestamp,
	"completed_at" timestamp,
	"attempt_count" integer DEFAULT 0,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_solved" integer DEFAULT 0,
	"easy_solved" integer DEFAULT 0,
	"medium_solved" integer DEFAULT 0,
	"hard_solved" integer DEFAULT 0,
	"total_attempted" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"daily_goal" integer DEFAULT 3 NOT NULL,
	"last_active_date" date DEFAULT CURRENT_DATE NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text,
	"github_id" text,
	"display_name" text,
	"profile_url" text,
	"avatar_url" text,
	"email" text,
	"access_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;