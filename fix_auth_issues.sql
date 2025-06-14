-- Fix Authentication Issues
-- Execute this in Supabase SQL Editor

-- Step 1: Check if users table exists and has correct structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Step 2: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('admin', 'client')) NOT NULL DEFAULT 'client',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update user status" ON users;

-- Step 5: Create proper RLS policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.status = 'approved'
        )
    );

CREATE POLICY "Admins can update user status" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.status = 'approved'
        )
    );

-- Step 6: Create a test admin user (you'll need to replace the UUID)
-- First, create the auth user through Supabase Auth, then run this:

-- Replace 'REPLACE-WITH-ACTUAL-UUID' with the UUID from auth.users
INSERT INTO users (
    id,
    name,
    email,
    role,
    status,
    approved_by,
    approved_at,
    created_at
) VALUES (
    'REPLACE-WITH-ACTUAL-UUID',  -- Get this from auth.users after signup
    'DevTone Admin',
    'admin@devtone.agency',
    'admin',
    'approved',
    'REPLACE-WITH-ACTUAL-UUID',  -- Self-approved
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'approved',
    approved_by = EXCLUDED.id,
    approved_at = NOW();

-- Step 7: Create functions for user management
CREATE OR REPLACE FUNCTION approve_user(user_id UUID, admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users 
    SET status = 'approved', 
        approved_by = admin_id, 
        approved_at = NOW(),
        rejection_reason = NULL
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_user(user_id UUID, admin_id UUID, reason TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users 
    SET status = 'rejected', 
        approved_by = admin_id, 
        approved_at = NOW(),
        rejection_reason = reason
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create a trigger to automatically create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, name, email, role, status)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
        'pending'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 9: Check current auth users (to get UUIDs)
SELECT id, email, created_at, email_confirmed_at, raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- Step 10: Check current users in our users table
SELECT id, name, email, role, status, created_at
FROM users
ORDER BY created_at DESC;

-- Step 11: Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT ALL ON users TO authenticated;
GRANT EXECUTE ON FUNCTION approve_user(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_user(UUID, UUID, TEXT) TO authenticated;

SELECT 'Authentication setup completed!' as status,
       'Check the auth.users table for user IDs' as next_step,
       'Update the INSERT statement with actual UUID' as important;