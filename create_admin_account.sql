-- Create Admin Account
-- First, you'll need to sign up through the Supabase Auth UI or API
-- Then run this SQL to update the user role to admin

-- Example: Update a user to admin role (replace with actual user ID)
-- UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Or insert directly if you have the user ID from Supabase Auth
-- INSERT INTO users (id, name, email, role) 
-- VALUES ('your-supabase-auth-user-id', 'Admin Name', 'admin@example.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- For testing purposes, you can create a test admin account:
-- Note: You'll need to create the auth user first through Supabase Auth, then run this
INSERT INTO users (id, name, email, role, created_at) 
VALUES (
  'admin-test-id-123', 
  'Admin User', 
  'admin@devtone.com', 
  'admin',
  now()
) ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  name = EXCLUDED.name,
  email = EXCLUDED.email;