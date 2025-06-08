-- =====================================================
-- EMERGENCY FIX - COPY AND PASTE THIS ENTIRE BLOCK
-- INTO SUPABASE SQL EDITOR AND RUN IT
-- =====================================================

-- First, let's make sure we're working in the public schema
SET search_path TO public;

-- Drop everything and start fresh
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- Remove any existing policies
DROP POLICY IF EXISTS "quotes_anon_insert" ON quotes;
DROP POLICY IF EXISTS "contacts_anon_insert" ON contacts;

-- Create quotes table with explicit permissions
CREATE TABLE quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    business_name TEXT,
    company TEXT,
    project_type TEXT,
    website_goal TEXT,
    description TEXT,
    budget_range TEXT,
    timeline TEXT,
    selected_package TEXT,
    payment_model TEXT,
    subscription_plan TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    estimated_budget NUMERIC(10,2),
    pages_needed TEXT,
    domain_hosting_status TEXT
);

-- Create contacts table with explicit permissions
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    contact_reason TEXT,
    project_type TEXT,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    preferred_contact TEXT DEFAULT 'email',
    status TEXT DEFAULT 'new',
    is_urgent BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1,
    subject TEXT
);

-- Completely disable RLS
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Grant explicit permissions to anon role
GRANT ALL PRIVILEGES ON TABLE quotes TO anon;
GRANT ALL PRIVILEGES ON TABLE contacts TO anon;
GRANT ALL PRIVILEGES ON TABLE quotes TO authenticated;
GRANT ALL PRIVILEGES ON TABLE contacts TO authenticated;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Test the setup
INSERT INTO contacts (full_name, email, message) 
VALUES ('Emergency Test', 'emergency@test.com', 'Testing emergency fix');

INSERT INTO quotes (full_name, email, status) 
VALUES ('Emergency Quote Test', 'quote@test.com', 'pending');

-- Verify the setup worked
SELECT 
    'SETUP COMPLETE!' as status,
    (SELECT COUNT(*) FROM contacts) as contacts_count,
    (SELECT COUNT(*) FROM quotes) as quotes_count;

-- Show table structure
\d quotes;
\d contacts;