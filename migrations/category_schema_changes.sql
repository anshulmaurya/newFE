-- Category Schema Changes

-- 1. Simplify problem_categories table
ALTER TABLE problem_categories 
DROP COLUMN IF EXISTS slug,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS icon_path,
DROP COLUMN IF EXISTS display_order;

-- 2. Create problem_category_map table for many-to-many relationship
CREATE TABLE IF NOT EXISTS problem_category_map (
  problem_id INTEGER NOT NULL REFERENCES problems(id),
  category_id INTEGER NOT NULL REFERENCES problem_categories(id),
  PRIMARY KEY (problem_id, category_id)
);

-- 3. For existing problems, migrate category data to the new mapping table
-- First, make sure all categories exist in the problem_categories table
INSERT INTO problem_categories (name)
SELECT DISTINCT category FROM problems
WHERE category IS NOT NULL 
ON CONFLICT (name) DO NOTHING;

-- Then, create the mappings using the existing category values
INSERT INTO problem_category_map (problem_id, category_id)
SELECT p.id, pc.id
FROM problems p
JOIN problem_categories pc ON pc.name = p.category
WHERE p.category IS NOT NULL
ON CONFLICT (problem_id, category_id) DO NOTHING;

-- 4. Remove the category column from problems table
ALTER TABLE problems DROP COLUMN IF EXISTS category;