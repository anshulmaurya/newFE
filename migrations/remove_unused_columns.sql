-- Drop the unused columns from the problems table
ALTER TABLE problems 
DROP COLUMN IF EXISTS mongo_id, 
DROP COLUMN IF EXISTS code_snippet,
DROP COLUMN IF EXISTS likes,
DROP COLUMN IF EXISTS dislikes,
DROP COLUMN IF EXISTS acceptance_rate,
DROP COLUMN IF EXISTS metadata;

-- Recreate any indices that might have been dropped with the columns
CREATE INDEX IF NOT EXISTS problems_question_id_idx ON problems (question_id);
CREATE INDEX IF NOT EXISTS problems_difficulty_idx ON problems (difficulty);
CREATE INDEX IF NOT EXISTS problems_category_idx ON problems (category);
CREATE INDEX IF NOT EXISTS problems_type_idx ON problems (type);