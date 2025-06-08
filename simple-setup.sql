-- =====================================================
-- SIMPLE DATABASE SETUP - NO RLS
-- Execute this SQL in your Supabase SQL Editor
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- Create quotes table
CREATE TABLE quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
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
    estimated_budget DECIMAL(10,2),
    pages_needed TEXT,
    domain_hosting_status TEXT
);

-- Create contacts table
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
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
    is_urgent BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    subject TEXT
);

-- Disable RLS for now to allow anonymous inserts
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT ALL ON quotes TO anon, authenticated;
GRANT ALL ON contacts TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Create indexes
CREATE INDEX idx_quotes_email ON quotes(email);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Test insert
INSERT INTO contacts (full_name, email, message) 
VALUES ('Test Setup', 'setup@test.com', 'Setup test message');

-- Verify the insert worked
SELECT 'Setup completed successfully!' as status, count(*) as test_records FROM contacts WHERE email = 'setup@test.com';