-- Create company enum type safely
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

-- Add company column and drop companies array and tags array
ALTER TABLE problems 
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS companies;

-- Add company column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'problems' AND column_name = 'company') THEN
        ALTER TABLE problems ADD COLUMN company company;
    END IF;
END$$;

-- Create index on company for efficient querying
CREATE INDEX IF NOT EXISTS problems_company_idx ON problems (company);

-- Clear all existing problem data as requested
DELETE FROM user_progress;
DELETE FROM problems;