-- Update company enum to add Microsoft
DO $$
BEGIN
    -- First drop the constraint using the enum
    ALTER TABLE problems ALTER COLUMN company DROP DEFAULT;
    ALTER TABLE problems ALTER COLUMN company TYPE TEXT;
    
    -- Drop and recreate company enum with Microsoft
    DROP TYPE IF EXISTS company;
    
    CREATE TYPE company AS ENUM (
        'Tesla',
        'Rivian',
        'Lucid Motors',
        'General Motors',
        'Ford',
        'Bosch',
        'Qualcomm',
        'Intel',
        'AMD',
        'NVIDIA',
        'Texas Instruments',
        'Broadcom',
        'MediaTek',
        'ARM',
        'Infineon Technologies',
        'Apple',
        'Samsung',
        'Lockheed Martin',
        'Raytheon Technologies',
        'Northrop Grumman',
        'Boeing',
        'General Dynamics',
        'DRDO',
        'Sony',
        'Cisco',
        'HP',
        'Dell',
        'IBM',
        'Google',
        'Amazon',
        'LG',
        'Huawei',
        'Microsoft'
    );
END$$;

-- Convert company column to companies array
DO $$
BEGIN
    -- First, add a new companies array column
    ALTER TABLE problems ADD COLUMN companies company[] DEFAULT '{}';
    
    -- Transfer data from company to companies array (if there's any data)
    UPDATE problems SET companies = ARRAY[company]::company[] WHERE company IS NOT NULL;
    
    -- Drop the old company column
    ALTER TABLE problems DROP COLUMN company;

    -- Create index on the companies array for efficient querying
    CREATE INDEX problems_companies_idx ON problems USING GIN (companies);
END$$;