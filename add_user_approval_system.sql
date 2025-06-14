-- Add approval system to users table
-- Execute this in Supabase SQL Editor

-- Add approval status column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Update existing users to approved status (if any)
UPDATE users SET status = 'approved', approved_at = NOW() WHERE status IS NULL;

-- Create function to approve user
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

-- Create function to reject user
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

-- Create view for pending users (admin dashboard)
CREATE OR REPLACE VIEW pending_users AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.created_at,
    u.status
FROM users u
WHERE u.status = 'pending'
ORDER BY u.created_at DESC;

-- Grant permissions
GRANT SELECT ON pending_users TO authenticated;
GRANT EXECUTE ON FUNCTION approve_user(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_user(UUID, UUID, TEXT) TO authenticated;

-- Update RLS policies to allow pending users to be viewed by admins
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.status = 'approved'
        )
    );

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can update user status" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.status = 'approved'
        )
    );

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

SELECT 'User approval system added successfully!' as status;