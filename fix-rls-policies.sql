-- =====================================================
-- FIX RLS POLICIES FOR ANONYMOUS INSERTS
-- Execute this SQL in your Supabase SQL Editor
-- =====================================================

-- First, let's disable RLS temporarily to ensure tables exist and are accessible
ALTER TABLE IF EXISTS quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts on quotes" ON quotes;
DROP POLICY IF EXISTS "Allow authenticated reads on quotes" ON quotes;
DROP POLICY IF EXISTS "Allow anonymous inserts on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated reads on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON quotes;
DROP POLICY IF EXISTS "Allow authenticated reads" ON quotes;

-- Re-enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create more permissive policies for quotes table
CREATE POLICY "Enable insert for anonymous users" ON quotes
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users" ON quotes
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON quotes
FOR SELECT 
TO authenticated
USING (true);

-- Create more permissive policies for contacts table
CREATE POLICY "Enable insert for anonymous users" ON contacts
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users" ON contacts
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON contacts
FOR SELECT 
TO authenticated
USING (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON quotes TO anon;
GRANT INSERT ON contacts TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions to authenticated role
GRANT ALL ON quotes TO authenticated;
GRANT ALL ON contacts TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Test the setup by trying to insert a test record
-- This should work if policies are correct
INSERT INTO contacts (full_name, email, message) 
VALUES ('Test User', 'test@test.com', 'Test message from RLS fix')
ON CONFLICT DO NOTHING;