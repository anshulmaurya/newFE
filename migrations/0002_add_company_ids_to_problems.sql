-- Add companyIds array column to problems table
ALTER TABLE problems ADD COLUMN company_ids INTEGER[] DEFAULT '{}';

-- Remove the company_problem_map table since we're not using it anymore
-- IMPORTANT: Consider migrating existing data before dropping the table!
-- This is commented out to prevent accidental data loss
-- DROP TABLE IF EXISTS company_problem_map;