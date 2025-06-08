-- First, enable RLS on the quotes table
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON quotes;
DROP POLICY IF EXISTS "Allow authenticated reads" ON quotes;

-- Create policy for anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON quotes
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create policy for reading quotes (admin only)
CREATE POLICY "Allow authenticated reads" ON quotes
FOR SELECT 
TO authenticated
USING (true);

-- Make sure the table exists and has the correct structure
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    business_name TEXT,
    website_goal TEXT,
    selected_package TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);