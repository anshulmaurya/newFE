DO $$ BEGIN
    CREATE TYPE "public"."company" AS ENUM('Tesla', 'Rivian', 'Lucid Motors', 'General Motors', 'Ford', 'Bosch', 'Qualcomm', 'Intel', 'AMD', 'NVIDIA', 'Texas Instruments', 'Broadcom', 'MediaTek', 'ARM', 'Infineon Technologies', 'Apple', 'Samsung', 'Lockheed Martin', 'Raytheon Technologies', 'Northrop Grumman', 'Boeing', 'General Dynamics', 'DRDO', 'Sony', 'Cisco', 'HP', 'Dell', 'IBM', 'Google', 'Amazon', 'LG', 'Huawei', 'Microsoft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE "public"."importance" AS ENUM('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE "public"."submission_status" AS ENUM('pass', 'fail');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE "code_submissions" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "problem_id" integer NOT NULL,
        "status" "submission_status" NOT NULL,
        "execution_time" integer,
        "submitted_at" timestamp DEFAULT now(),
        "language" text NOT NULL,
        "memory_stats" jsonb
);
--> statement-breakpoint
CREATE TABLE "companies" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL,
        "logo_url" varchar(255),
        "description" text,
        "interview_focus" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "company_problem_map" (
        "company_id" integer NOT NULL,
        "problem_id" integer NOT NULL,
        "relevance_score" integer DEFAULT 5,
        CONSTRAINT "company_problem_map_company_id_problem_id_pk" PRIMARY KEY("company_id","problem_id")
);
--> statement-breakpoint
CREATE TABLE "discussion_replies" (
        "id" serial PRIMARY KEY NOT NULL,
        "discussion_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "content" text NOT NULL,
        "likes" integer DEFAULT 0,
        "dislikes" integer DEFAULT 0,
        "parent_reply_id" integer,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "discussions" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" varchar(200) NOT NULL,
        "content" text NOT NULL,
        "user_id" integer NOT NULL,
        "problem_id" integer,
        "category" varchar(50) DEFAULT 'general',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_path_items" (
        "id" serial PRIMARY KEY NOT NULL,
        "learning_path_id" integer NOT NULL,
        "problem_id" integer NOT NULL,
        "display_order" integer DEFAULT 0,
        "is_required" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "learning_path_progress" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "learning_path_id" integer NOT NULL,
        "started_at" timestamp DEFAULT now(),
        "completed_at" timestamp,
        "completion_percentage" integer DEFAULT 0,
        "is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "learning_paths" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" varchar(100) NOT NULL,
        "description" text,
        "difficulty" "difficulty" NOT NULL,
        "estimated_hours" integer DEFAULT 0,
        "category_id" integer,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "problem_categories" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(50) NOT NULL,
        "slug" varchar(50) NOT NULL,
        "description" text,
        "icon_path" varchar(255),
        "display_order" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "problem_categories_name_unique" UNIQUE("name"),
        CONSTRAINT "problem_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "achievement_type" varchar(50) NOT NULL,
        "level" varchar(20) NOT NULL,
        "earned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_notes" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "problem_id" integer NOT NULL,
        "content" text NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "theme" varchar(20) DEFAULT 'system',
        "notification_settings" jsonb,
        "editor_preferences" jsonb,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "problems" DROP CONSTRAINT "problems_mongo_id_unique";--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "companies" SET DATA TYPE company[];--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "importance" SET DATA TYPE importance;--> statement-breakpoint
ALTER TABLE "problems" ALTER COLUMN "category" SET DEFAULT 'Arrays';--> statement-breakpoint
ALTER TABLE "code_submissions" ADD CONSTRAINT "code_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_submissions" ADD CONSTRAINT "code_submissions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_problem_map" ADD CONSTRAINT "company_problem_map_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_problem_map" ADD CONSTRAINT "company_problem_map_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_parent_reply_id_discussion_replies_id_fk" FOREIGN KEY ("parent_reply_id") REFERENCES "public"."discussion_replies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_path_items" ADD CONSTRAINT "learning_path_items_learning_path_id_learning_paths_id_fk" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_path_items" ADD CONSTRAINT "learning_path_items_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_path_progress" ADD CONSTRAINT "learning_path_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_path_progress" ADD CONSTRAINT "learning_path_progress_learning_path_id_learning_paths_id_fk" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_category_id_problem_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."problem_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "mongo_id";--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "likes";--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "dislikes";--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "acceptance_rate";--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "code_snippet";--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "public"."problems" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
    DROP TYPE IF EXISTS "public"."category";
EXCEPTION
    WHEN dependent_objects_still_exist THEN
    -- Handle the case when objects depend on this type
    -- First, convert the column to text temporarily
    RAISE NOTICE 'Converting category column to text temporarily';
END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE "public"."category" AS ENUM('Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Heaps', 'Hash Tables', 'Graphs', 'Tries', 'Disjoint Sets', 'Searching', 'Sorting', 'Recursion', 'Dynamic Programming', 'Greedy Algorithms', 'Divide and Conquer', 'Bit Manipulation', 'Mathematical Algorithms', 'RTOS', 'State Machines', 'Multithreading', 'Memory Management');
EXCEPTION
    WHEN duplicate_object THEN
    -- If type already exists, we may need to add new values
    RAISE NOTICE 'Category type already exists, may need manual update for new values';
END $$;--> statement-breakpoint

-- First convert to text if it's not already
ALTER TABLE "public"."problems" 
    ALTER COLUMN "category" TYPE text;

-- Then convert back to the enum type
ALTER TABLE "public"."problems" 
    ALTER COLUMN "category" TYPE "public"."category" 
    USING "category"::"public"."category";

-- Set the default value
ALTER TABLE "public"."problems" 
    ALTER COLUMN "category" SET DEFAULT 'Arrays';

-- Handle problem_type similarly
DO $$ BEGIN
    DROP TYPE IF EXISTS "public"."problem_type";
EXCEPTION
    WHEN dependent_objects_still_exist THEN
    RAISE NOTICE 'Converting type column to text temporarily';
END $$;--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE "public"."problem_type" AS ENUM('dsa', 'embedded', 'bridge');
EXCEPTION
    WHEN duplicate_object THEN
    RAISE NOTICE 'Problem type already exists, may need manual update for new values';
END $$;--> statement-breakpoint

-- First convert to text
ALTER TABLE "public"."problems" 
    ALTER COLUMN "type" TYPE text;

-- Then convert back to the enum type
ALTER TABLE "public"."problems" 
    ALTER COLUMN "type" TYPE "public"."problem_type" 
    USING "type"::"public"."problem_type";