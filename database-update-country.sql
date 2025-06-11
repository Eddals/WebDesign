-- =====================================================
-- ADD COUNTRY COLUMN TO QUOTES TABLE
-- Execute this in your Supabase SQL Editor
-- =====================================================

-- Step 1: Add country column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'country'
    ) THEN
        ALTER TABLE quotes ADD COLUMN country TEXT;
        RAISE NOTICE 'Country column added successfully';
    ELSE
        RAISE NOTICE 'Country column already exists';
    END IF;
END $$;

-- Step 2: Add features column for storing selected features as JSON
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'features'
    ) THEN
        ALTER TABLE quotes ADD COLUMN features JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Features column added successfully';
    ELSE
        RAISE NOTICE 'Features column already exists';
    END IF;
END $$;

-- Step 3: Update existing records with default values
UPDATE quotes 
SET country = 'United States' 
WHERE country IS NULL;

UPDATE quotes 
SET features = '[]'::jsonb 
WHERE features IS NULL;

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_country ON quotes(country);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Step 5: Create a view for notifications (optional but recommended)
CREATE OR REPLACE VIEW recent_estimates AS
SELECT 
    id,
    full_name,
    country,
    project_type,
    budget_range,
    created_at,
    CASE 
        WHEN created_at > NOW() - INTERVAL '1 hour' THEN 
            EXTRACT(EPOCH FROM (NOW() - created_at))::int / 60 || ' minutes ago'
        WHEN created_at > NOW() - INTERVAL '1 day' THEN 
            EXTRACT(EPOCH FROM (NOW() - created_at))::int / 3600 || ' hours ago'
        WHEN created_at > NOW() - INTERVAL '7 days' THEN 
            EXTRACT(EPOCH FROM (NOW() - created_at))::int / 86400 || ' days ago'
        ELSE 
            EXTRACT(EPOCH FROM (NOW() - created_at))::int / 604800 || ' weeks ago'
    END as time_ago
FROM quotes 
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 20;

-- Step 6: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND column_name IN ('country', 'features')
ORDER BY column_name;

-- Step 7: Show current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'quotes' 
ORDER BY ordinal_position;

-- Step 8: Insert a test record to verify everything works
INSERT INTO quotes (
    full_name,
    email,
    phone,
    company,
    country,
    project_type,
    description,
    budget_range,
    timeline,
    features,
    status
) VALUES (
    'Test User',
    'test@example.com',
    '+1-555-123-4567',
    'Test Company',
    'United States',
    'business',
    'Test project for database verification',
    'professional',
    '1month',
    '["seo", "analytics"]'::jsonb,
    'pending'
) ON CONFLICT DO NOTHING;

-- Step 9: Test the recent_estimates view
SELECT * FROM recent_estimates LIMIT 5;

-- Step 10: Clean up test data (optional)
-- DELETE FROM quotes WHERE email = 'test@example.com';

RAISE NOTICE 'Database update completed successfully!';
RAISE NOTICE 'Country column is ready for the estimate form.';
RAISE NOTICE 'You can now test the form at /estimate';
