-- =====================================================
-- SUPABASE DATABASE SETUP
-- Execute this SQL in your Supabase SQL Editor
-- =====================================================

-- Create quotes table for estimate requests
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Contact Information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Business Information
    business_name TEXT,
    company TEXT,
    
    -- Project Details
    project_type TEXT,
    website_goal TEXT,
    description TEXT,
    budget_range TEXT,
    timeline TEXT,
    
    -- Package Selection
    selected_package TEXT,
    payment_model TEXT,
    subscription_plan TEXT,
    
    -- Status and Tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    notes TEXT,
    estimated_budget DECIMAL(10,2),
    
    -- Additional fields for compatibility
    pages_needed TEXT,
    domain_hosting_status TEXT
);

-- Create contacts table for contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Contact Information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    
    -- Contact Details
    contact_reason TEXT,
    project_type TEXT,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    preferred_contact TEXT DEFAULT 'email',
    
    -- Status and Metadata
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    is_urgent BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    
    -- Additional fields
    subject TEXT
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts on quotes" ON quotes;
DROP POLICY IF EXISTS "Allow authenticated reads on quotes" ON quotes;
DROP POLICY IF EXISTS "Allow anonymous inserts on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated reads on contacts" ON contacts;

-- Create policies for quotes table
CREATE POLICY "Allow anonymous inserts on quotes" ON quotes
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated reads on quotes" ON quotes
FOR SELECT 
TO authenticated
USING (true);

-- Create policies for contacts table
CREATE POLICY "Allow anonymous inserts on contacts" ON contacts
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated reads on contacts" ON contacts
FOR SELECT 
TO authenticated
USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- You can remove this section if you don't want sample data

-- Sample quote
INSERT INTO quotes (full_name, email, project_type, status) 
VALUES ('Sample User', 'sample@example.com', 'website', 'pending')
ON CONFLICT DO NOTHING;

-- Sample contact
INSERT INTO contacts (full_name, email, message, status, is_urgent, priority) 
VALUES ('Sample Contact', 'contact@example.com', 'This is a test message', 'new', false, 1)
ON CONFLICT DO NOTHING;