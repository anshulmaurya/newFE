-- Create company enum safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'company') THEN
        CREATE TYPE company AS ENUM (
          'Amazon', 'Apple', 'Facebook', 'Google', 'Microsoft', 
          'Netflix', 'Tesla', 'Uber', 'Twitter', 'LinkedIn',
          'Adobe', 'Airbnb', 'Bloomberg', 'Dropbox', 'Nvidia',
          'Salesforce', 'Snapchat', 'Spotify', 'Oracle', 'Intel'
        );
    END IF;
END$$;

-- Drop tags and companies columns, add company column
ALTER TABLE problems 
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS companies,
ADD COLUMN IF NOT EXISTS company company;

-- Create index on company for efficient querying
CREATE INDEX IF NOT EXISTS problems_company_idx ON problems (company);

-- Add unique constraint to user_stats user_id column
ALTER TABLE user_stats 
DROP CONSTRAINT IF EXISTS user_stats_user_id_unique,
ADD CONSTRAINT user_stats_user_id_unique UNIQUE (user_id);