-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR GET ESTIMATE FORM
-- Execute this in your Supabase SQL Editor
-- =====================================================

-- Drop existing table if you want to start fresh (OPTIONAL - CAREFUL!)
-- DROP TABLE IF EXISTS quotes;

-- Create complete quotes table with ALL form fields
CREATE TABLE IF NOT EXISTS quotes (
    -- Primary key and timestamps
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- PERSONAL INFORMATION SECTION
    full_name TEXT NOT NULL,                    -- Required: Full Name
    email TEXT NOT NULL,                        -- Required: Email Address
    phone TEXT,                                 -- Optional: Phone Number
    company TEXT,                               -- Optional: Company Name
    country TEXT,                               -- Optional: Country (for notifications)
    industry TEXT,                              -- Optional: Business Industry (for notifications)
    
    -- PROJECT TYPE SECTION
    project_type TEXT,                          -- Selected project type:
                                               -- 'landing', 'portfolio', 'business', 'ecommerce', 'webapp'
    
    -- BUDGET & TIMELINE SECTION  
    budget_range TEXT,                          -- Selected budget range:
                                               -- 'starter', 'professional', 'premium', 'enterprise'
    timeline TEXT,                              -- Selected timeline:
                                               -- 'asap', '1month', '2months', 'flexible'
    
    -- ADDITIONAL FEATURES SECTION
    features JSONB DEFAULT '[]'::jsonb,         -- Array of selected features:
                                               -- ['seo', 'analytics', 'social', 'security', 'maintenance', 'training']
    
    -- PROJECT DESCRIPTION SECTION
    description TEXT,                           -- Free text project description
    
    -- SYSTEM FIELDS
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'quoted', 'approved', 'rejected', 'completed')),
    priority INTEGER DEFAULT 1,                -- 1=Low, 2=Medium, 3=High, 4=Urgent
    assigned_to TEXT,                          -- Staff member assigned to this estimate
    notes TEXT,                                -- Internal notes from team
    estimated_cost DECIMAL(10,2),             -- Calculated estimate amount
    quoted_amount DECIMAL(10,2),              -- Final quoted amount
    
    -- METADATA
    source TEXT DEFAULT 'website',            -- Where the estimate came from
    ip_address INET,                          -- User's IP address (optional)
    user_agent TEXT,                          -- Browser info (optional)
    referrer TEXT                             -- How they found the site (optional)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_country ON quotes(country);
CREATE INDEX IF NOT EXISTS idx_quotes_industry ON quotes(industry);
CREATE INDEX IF NOT EXISTS idx_quotes_project_type ON quotes(project_type);
CREATE INDEX IF NOT EXISTS idx_quotes_budget_range ON quotes(budget_range);
CREATE INDEX IF NOT EXISTS idx_quotes_priority ON quotes(priority);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy reporting
CREATE OR REPLACE VIEW estimate_summary AS
SELECT 
    id,
    full_name,
    email,
    company,
    country,
    industry,
    project_type,
    budget_range,
    timeline,
    array_length(features::json::text[]::text[], 1) as features_count,
    status,
    priority,
    estimated_cost,
    quoted_amount,
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
ORDER BY created_at DESC;

-- Create a view specifically for notifications
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
AND industry IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;

-- Insert sample data for testing (OPTIONAL)
INSERT INTO quotes (
    full_name,
    email,
    phone,
    company,
    country,
    industry,
    project_type,
    budget_range,
    timeline,
    features,
    description,
    status
) VALUES 
(
    'John Smith',
    'john.smith@example.com',
    '+1-555-123-4567',
    'Acme Corporation',
    'United States',
    'Technology & Software',
    'business',
    'professional',
    '1month',
    '["seo", "analytics", "security"]'::jsonb,
    'Need a professional business website with modern design and SEO optimization.',
    'pending'
),
(
    'Maria Garcia',
    'maria.garcia@example.com',
    '+1-555-987-6543',
    'Creative Studio',
    'Spain',
    'Art & Design',
    'portfolio',
    'starter',
    '2months',
    '["seo", "social"]'::jsonb,
    'Portfolio website to showcase my design work and attract new clients.',
    'pending'
),
(
    'David Chen',
    'david.chen@example.com',
    '+1-555-456-7890',
    'TechStart Inc',
    'Canada',
    'Technology & Software',
    'webapp',
    'enterprise',
    'flexible',
    '["analytics", "security", "maintenance", "training"]'::jsonb,
    'Custom web application for project management with user authentication and real-time features.',
    'pending'
) ON CONFLICT DO NOTHING;

-- Show table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quotes' 
ORDER BY ordinal_position;

-- Show sample data
SELECT * FROM estimate_summary LIMIT 5;

-- Show notification data
SELECT * FROM recent_estimates_for_notifications LIMIT 5;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ COMPLETE ESTIMATE FORM DATABASE SETUP SUCCESSFUL!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Table Created: quotes';
    RAISE NOTICE '🔍 Views Created: estimate_summary, recent_estimates_for_notifications';
    RAISE NOTICE '⚡ Indexes Created: For performance optimization';
    RAISE NOTICE '🔄 Triggers Created: Auto-update timestamps';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Your estimate form can now save ALL data to the database!';
    RAISE NOTICE '📊 Use estimate_summary view for reporting';
    RAISE NOTICE '🔔 Use recent_estimates_for_notifications view for live notifications';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Test your form at: /estimate';
END $$;
