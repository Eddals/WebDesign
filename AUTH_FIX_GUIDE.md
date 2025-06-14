# 🔧 Authentication Fix Guide

The 400 error you're seeing indicates authentication issues. Here's how to fix it:

## 🚨 **Immediate Fix Steps**

### Step 1: Disable Email Confirmation in Supabase
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Settings**
3. Under **Email Auth**, turn **OFF** "Enable email confirmations"
4. Save the settings

### Step 2: Check Your Environment Variables
Make sure your `.env` file has the correct Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Run Database Setup
Execute these SQL files in order in your Supabase SQL Editor:

1. **First**: `fix_auth_issues.sql`
2. **Then**: `create_working_admin.sql`

### Step 4: Create Admin User via Signup Form
1. Go to your signup page (`/signup`)
2. Fill out the form:
   - **Name**: Your Name
   - **Email**: admin@devtone.agency (or your email)
   - **Password**: admin123456 (or your password)
   - **Account Type**: Admin Account
   - **Admin Key**: devtone-admin-2024
3. Submit the form

### Step 5: Approve the Admin User (if needed)
If the user shows as pending, run this SQL:
```sql
UPDATE users 
SET status = 'approved', 
    approved_by = id, 
    approved_at = NOW()
WHERE email = 'admin@devtone.agency';
```

## 🔍 **Debugging Steps**

### Check Auth Users
```sql
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;
```

### Check User Profiles
```sql
SELECT id, name, email, role, status, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Manual Email Confirmation (if needed)
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'your-email@example.com';
```

## 🎯 **Alternative: Create User via API**

If the signup form still doesn't work, create the user via curl:

```bash
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
```

Then run the SQL to approve the user.

## ⚡ **Quick Test**

After setup, test the login:
1. Go to `/login`
2. Email: admin@devtone.agency
3. Password: admin123456
4. Should redirect to admin dashboard

## 🚨 **Common Issues & Solutions**

### Issue: Still getting 400 error
**Solution**: Email confirmation is still enabled
- Double-check Supabase Dashboard settings
- Manually confirm email in SQL

### Issue: User not found
**Solution**: Auth user doesn't exist
- Create via signup form or API
- Check auth.users table

### Issue: Access denied
**Solution**: User not approved
- Check users table status
- Run approval SQL

### Issue: Wrong credentials
**Solution**: Password mismatch
- Reset password in Supabase Dashboard
- Or create new user

## 📋 **Verification Checklist**

- [ ] Email confirmation disabled in Supabase
- [ ] Environment variables correct
- [ ] Database tables created
- [ ] Auth user exists in auth.users
- [ ] User profile exists in users table
- [ ] User status is 'approved'
- [ ] User role is 'admin'

## 🔧 **Emergency Reset**

If nothing works, run this to reset everything:

```sql
-- Delete all users (CAREFUL!)
DELETE FROM users;
DELETE FROM auth.users;

-- Then start over with the signup process
```

Follow these steps in order, and your authentication should work properly!