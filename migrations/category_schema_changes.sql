-- Migration script for category schema changes
-- 1. Create problem_category_map table for many-to-many relationship

-- Create problem_category_map table if it doesn't exist
CREATE TABLE IF NOT EXISTS problem_category_map (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES problem_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(problem_id, category_id)
);

-- First, temporarily remove the NOT NULL constraint from the slug column
ALTER TABLE problem_categories ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE problem_categories ALTER COLUMN description DROP NOT NULL;
ALTER TABLE problem_categories ALTER COLUMN icon_path DROP NOT NULL;

-- 2. Migrate the existing category data to the new mapping table
-- For each problem, look up the category ID from problem_categories and create a mapping

-- Get all the category enum values and ensure they exist in problem_categories
INSERT INTO problem_categories (name, slug, description, icon_path, created_at, updated_at)
SELECT e.enumlabel, LOWER(REPLACE(e.enumlabel, ' ', '-')), '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'category'
ON CONFLICT (name) DO NOTHING;

-- First, make sure all categories exist
DO $$
DECLARE
  category_enum category;
  category_name TEXT;
  category_id INTEGER;
  slug_value TEXT;
BEGIN
  -- Get distinct categories from problems table
  FOR category_enum IN (SELECT DISTINCT category FROM problems WHERE category IS NOT NULL) LOOP
    -- Convert enum to text
    category_name := category_enum::text;
    
    -- Check if the category exists in problem_categories
    SELECT id INTO category_id FROM problem_categories WHERE name = category_name;
    
    -- Create a slug value from the category name (lowercase, replace spaces with dashes)
    slug_value := LOWER(REPLACE(category_name, ' ', '-'));
    
    -- If category doesn't exist, create it
    IF category_id IS NULL THEN
      INSERT INTO problem_categories (name, slug, description, icon_path, created_at, updated_at)
      VALUES (category_name, slug_value, '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id INTO category_id;
    END IF;
  END LOOP;
END
$$;

-- Now create the mappings
INSERT INTO problem_category_map (problem_id, category_id)
SELECT p.id, pc.id
FROM problems p
JOIN problem_categories pc ON pc.name = p.category::text
WHERE p.category IS NOT NULL
ON CONFLICT DO NOTHING;

-- 3. Remove unnecessary columns from problem_categories table
-- First, check if columns exist and then drop them
DO $$
BEGIN
  -- Drop slug column if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'problem_categories' AND column_name = 'slug') THEN
    ALTER TABLE problem_categories DROP COLUMN slug;
  END IF;
  
  -- Drop description column if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'problem_categories' AND column_name = 'description') THEN
    ALTER TABLE problem_categories DROP COLUMN description;
  END IF;
  
  -- Drop icon_path column if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'problem_categories' AND column_name = 'icon_path') THEN
    ALTER TABLE problem_categories DROP COLUMN icon_path;
  END IF;
  
  -- Drop display_order column if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'problem_categories' AND column_name = 'display_order') THEN
    ALTER TABLE problem_categories DROP COLUMN display_order;
  END IF;
END
$$;

-- 4. Now we can safely remove the category column from problems table
-- First make sure we check if the column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'problems' AND column_name = 'category') THEN
    ALTER TABLE problems DROP COLUMN category;
  END IF;
END
$$;

-- Done! The schema has been updated to support multiple categories per problem