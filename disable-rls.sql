-- =====================================================
-- DISABLE RLS AND ALLOW ANONYMOUS ACCESS
-- Execute this SQL in your Supabase SQL Editor
-- =====================================================

-- Disable Row Level Security on both tables
ALTER TABLE IF EXISTS quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON quotes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON quotes;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON quotes;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON contacts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON contacts;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON contacts;

-- Grant full access to anon role (for form submissions)
GRANT ALL PRIVILEGES ON quotes TO anon;
GRANT ALL PRIVILEGES ON contacts TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant full access to authenticated role
GRANT ALL PRIVILEGES ON quotes TO authenticated;
GRANT ALL PRIVILEGES ON contacts TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Test insert to verify it works
INSERT INTO contacts (full_name, email, message) 
VALUES ('RLS Test', 'rls-test@example.com', 'Testing after disabling RLS')
ON CONFLICT DO NOTHING;

-- Verify the test worked
SELECT 'RLS disabled successfully!' as status, count(*) as total_contacts FROM contacts;