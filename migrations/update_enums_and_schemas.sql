-- Create or update the problem_type enum with 'bridge' instead of 'system'
DO $$
BEGIN
    -- Check if enum needs to be updated
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'problem_type') THEN
        -- Drop constraints using the enum before updating it
        ALTER TABLE problems ALTER COLUMN type DROP DEFAULT;
        ALTER TABLE problems ALTER COLUMN type TYPE TEXT;
        
        -- Drop and recreate the enum
        DROP TYPE problem_type;
    END IF;
    
    -- Create the updated enum
    CREATE TYPE problem_type AS ENUM ('dsa', 'embedded', 'bridge');
    
    -- Update the column to use the new enum
    ALTER TABLE problems ALTER COLUMN type TYPE problem_type USING 
        CASE 
            WHEN type::text = 'system' THEN 'bridge'::problem_type
            ELSE type::text::problem_type
        END;
    
    -- Set the default back
    ALTER TABLE problems ALTER COLUMN type SET DEFAULT 'dsa'::problem_type;
END$$;

-- Create importance enum for low, medium, high
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'importance') THEN
        CREATE TYPE importance AS ENUM ('low', 'medium', 'high');
    END IF;
END$$;

-- Update the importance column to use the enum
DO $$
BEGIN
    -- First convert the existing text to the enum (if any data exists)
    ALTER TABLE problems ALTER COLUMN importance TYPE importance 
    USING CASE 
        WHEN importance = 'High' THEN 'high'::importance
        WHEN importance = 'Medium' THEN 'medium'::importance
        WHEN importance = 'Low' THEN 'low'::importance
        ELSE 'medium'::importance  -- Default value
    END;
END$$;

-- Update category enum to the new list
DO $$
BEGIN
    -- First drop the constraints using the enum
    ALTER TABLE problems ALTER COLUMN category DROP DEFAULT;
    ALTER TABLE problems ALTER COLUMN category TYPE TEXT;
    
    -- Drop and recreate category enum
    DROP TYPE IF EXISTS category;
    
    CREATE TYPE category AS ENUM (
        'Arrays',
        'Strings',
        'Linked Lists',
        'Stacks',
        'Queues',
        'Trees',
        'Heaps',
        'Hash Tables',
        'Graphs',
        'Tries',
        'Disjoint Sets',
        'Searching',
        'Sorting',
        'Recursion',
        'Dynamic Programming',
        'Greedy Algorithms',
        'Divide and Conquer',
        'Bit Manipulation',
        'Mathematical Algorithms',
        'RTOS',
        'State Machines',
        'Multithreading',
        'Memory Management'
    );
    
    -- Update the column to use the new enum values
    ALTER TABLE problems ALTER COLUMN category TYPE category 
    USING CASE 
        WHEN category = 'Data Structures' THEN 'Arrays'::category
        WHEN category = 'Memory Management' THEN 'Memory Management'::category
        WHEN category = 'Multithreading' THEN 'Multithreading'::category
        WHEN category = 'C++ API' THEN 'Arrays'::category
        WHEN category = 'Linux API' THEN 'Arrays'::category
        WHEN category = 'RTOS' THEN 'RTOS'::category
        WHEN category = 'Power Management' THEN 'Memory Management'::category
        ELSE 'Arrays'::category
    END;
    
    -- Set default back
    ALTER TABLE problems ALTER COLUMN category SET DEFAULT 'Arrays'::category;
END$$;

-- Update company enum with the new list
DO $$
BEGIN
    -- First drop the constraints using the enum
    ALTER TABLE problems ALTER COLUMN company TYPE TEXT;
    
    -- Drop and recreate company enum
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
        'Huawei'
    );
    
    -- Update the column to use the new enum
    ALTER TABLE problems ALTER COLUMN company TYPE company USING NULL;
END$$;

-- Create index on importance for efficient querying
CREATE INDEX IF NOT EXISTS problems_importance_idx ON problems (importance);