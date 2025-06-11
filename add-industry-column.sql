-- Add industry column to existing quotes table for real client notifications
-- Execute this in your Supabase SQL Editor

-- Add industry column if it doesn't exist
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS industry TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_industry ON quotes(industry);

-- Update the recent_estimates_for_notifications view to include industry
CREATE OR REPLACE VIEW recent_estimates_for_notifications AS
SELECT 
    id,
    full_name,
    country,
    industry,
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
AND country IS NOT NULL
AND industry IS NOT NULL  -- Only show estimates with industry information
ORDER BY created_at DESC
LIMIT 20;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND column_name = 'industry';

-- Show current notification data
SELECT * FROM recent_estimates_for_notifications LIMIT 5;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Industry column added successfully!';
    RAISE NOTICE '🔔 Notifications will now show real client data with business industries';
    RAISE NOTICE '📋 Only estimates with both country and industry will appear in notifications';
    RAISE NOTICE '🧪 Test by submitting an estimate form with industry selection';
END $$;
