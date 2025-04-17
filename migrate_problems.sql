-- Create the new enum types
CREATE TYPE "public"."problem_type" AS ENUM('dsa', 'embedded', 'system');

-- Add new columns to the problems table
ALTER TABLE "problems" 
  ADD COLUMN IF NOT EXISTS "mongo_id" text,
  ADD COLUMN IF NOT EXISTS "type" "problem_type" DEFAULT 'dsa',
  ADD COLUMN IF NOT EXISTS "tags" text[],
  ADD COLUMN IF NOT EXISTS "companies" text[],
  ADD COLUMN IF NOT EXISTS "file_path" text,
  ADD COLUMN IF NOT EXISTS "likes" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "dislikes" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "successful_submissions" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "failed_submissions" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "importance" text,
  ADD COLUMN IF NOT EXISTS "question_id" text,
  ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now(),
  ADD COLUMN IF NOT EXISTS "metadata" jsonb;

-- Add constraints
ALTER TABLE "problems" 
  ADD CONSTRAINT IF NOT EXISTS "problems_mongo_id_unique" UNIQUE("mongo_id"),
  ADD CONSTRAINT IF NOT EXISTS "problems_question_id_unique" UNIQUE("question_id");