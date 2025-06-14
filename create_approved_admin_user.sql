-- Create Approved Admin User
-- Execute this in Supabase SQL Editor

-- First, we need to create the auth user in Supabase Auth
-- This creates a user in the auth.users table
-- Note: Replace the email and password with your desired credentials

-- Step 1: Create the auth user (this simulates the signup process)
-- You'll need to do this through the Supabase Auth API or dashboard first
-- But we can create the profile directly if you have the user ID

-- Step 2: Create the user profile with admin role and approved status
-- Replace 'your-user-id-here' with the actual UUID from Supabase Auth
-- Replace the email and name with your desired values

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
    'admin-uuid-replace-this',  -- Replace with actual UUID from auth.users
    'Admin User',               -- Replace with desired name
    'admin@devtone.agency',     -- Replace with desired email
    'admin',
    'approved',
    'system',                   -- Approved by system
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'approved',
    approved_by = 'system',
    approved_at = NOW();

-- Alternative: If you want to create a complete user with a specific UUID
-- This is useful for testing purposes
-- WARNING: This creates a user without proper auth setup - use for testing only

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
    '00000000-0000-0000-0000-000000000001',  -- Test UUID
    'DevTone Admin',
    'admin@devtone.agency',
    'admin',
    'approved',
    'system',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'approved',
    approved_by = 'system',
    approved_at = NOW();

-- Step 3: Verify the user was created
SELECT 
    id,
    name,
    email,
    role,
    status,
    approved_by,
    approved_at,
    created_at
FROM users 
WHERE role = 'admin' AND status = 'approved';

-- Step 4: Grant admin permissions (if using RLS policies)
-- This ensures the admin can manage other users
-- The policies should already allow this, but this confirms it

-- Optional: Create a function to easily create admin users
CREATE OR REPLACE FUNCTION create_admin_user(
    user_id UUID,
    user_name TEXT,
    user_email TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
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
        user_id,
        user_name,
        user_email,
        'admin',
        'approved',
        'system',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        status = 'approved',
        approved_by = 'system',
        approved_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage example:
-- SELECT create_admin_user('your-uuid-here', 'Admin Name', 'admin@example.com');

SELECT 'Admin user creation script completed!' as status,
       'Remember to replace the UUID with actual auth user ID' as important_note,
       'Use the signup form with admin key for proper auth setup' as recommended_approach;