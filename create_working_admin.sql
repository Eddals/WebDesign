-- Create Working Admin User
-- Execute this step by step in Supabase SQL Editor

-- Step 1: First, disable email confirmation in Supabase Dashboard
-- Go to Authentication > Settings > Email Auth
-- Turn OFF "Enable email confirmations"

-- Step 2: Check if we have any auth users
SELECT 'Current auth users:' as info;
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 3: If no users exist, we need to create one through the API
-- You can use this curl command in terminal (replace with your project details):
/*
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/auth/v1/signup' \
-H "apikey: YOUR_ANON_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@devtone.agency",
  "password": "admin123456",
  "data": {
    "name": "DevTone Admin",
    "role": "admin"
  }
}'
*/

-- Step 4: After creating the auth user, get the UUID and update this query
-- Replace 'REPLACE_WITH_ACTUAL_UUID' with the real UUID from auth.users

-- First, let's see what users we have:
SELECT 'Auth users available:' as step;
SELECT id, email, email_confirmed_at FROM auth.users;

-- Step 5: Create or update the user profile
-- You need to replace the UUID below with an actual UUID from auth.users
DO $$
DECLARE
    auth_user_id UUID;
BEGIN
    -- Get the first auth user (or specify a specific email)
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = 'admin@devtone.agency'  -- Change this to your admin email
    LIMIT 1;
    
    IF auth_user_id IS NOT NULL THEN
        -- Insert or update the user profile
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
            auth_user_id,
            'DevTone Admin',
            'admin@devtone.agency',  -- Change this to your admin email
            'admin',
            'approved',
            auth_user_id,  -- Self-approved
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            status = 'approved',
            approved_by = auth_user_id,
            approved_at = NOW();
            
        RAISE NOTICE 'Admin user created/updated with ID: %', auth_user_id;
    ELSE
        RAISE NOTICE 'No auth user found with email admin@devtone.agency';
        RAISE NOTICE 'Please create the auth user first through signup or API';
    END IF;
END $$;

-- Step 6: Verify the admin user was created
SELECT 'Final verification:' as step;
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.status,
    u.approved_at,
    au.email_confirmed_at
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.role = 'admin';

-- Step 7: If you need to manually confirm an email (if email confirmation is still on)
-- Replace the UUID with your actual user UUID
/*
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@devtone.agency';
*/

SELECT 'Setup complete!' as status,
       'Try logging in with your admin credentials' as next_step;