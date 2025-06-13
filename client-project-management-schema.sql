-- Client Project Management System Database Schema
-- DevTone Agency - Professional Client Dashboard
-- Execute este script no SQL Editor do Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable Realtime for all tables (será configurado no final)
-- Logical Replication será habilitada automaticamente

-- Client Users Table (Authentication)
CREATE TABLE IF NOT EXISTS client_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients Table (Business Information)
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES client_users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website_url TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    business_description TEXT,
    logo_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL, -- 'website', 'ecommerce', 'app', 'marketing', etc.
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    budget DECIMAL(10,2),
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    project_url TEXT,
    repository_url TEXT,
    staging_url TEXT,
    live_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Milestones Table
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
    due_date DATE,
    completion_date DATE,
    order_index INTEGER DEFAULT 0,
    deliverables TEXT[], -- Array of deliverable items
    is_billable BOOLEAN DEFAULT false,
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Tasks Table
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to VARCHAR(255), -- Developer/team member name
    estimated_hours INTEGER,
    actual_hours INTEGER,
    due_date DATE,
    completion_date DATE,
    tags TEXT[], -- Array of tags for categorization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client Feedbacks Table
CREATE TABLE IF NOT EXISTS client_feedbacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    feedback_type VARCHAR(20) DEFAULT 'general' CHECK (feedback_type IN ('general', 'approval', 'revision', 'concern')),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'addressed', 'resolved')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    admin_response TEXT,
    admin_responded_by VARCHAR(255),
    admin_responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Files Table
CREATE TABLE IF NOT EXISTS project_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    uploaded_by_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    uploaded_by_admin VARCHAR(255),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_url TEXT NOT NULL,
    file_category VARCHAR(50) DEFAULT 'general', -- 'design', 'content', 'assets', 'documents', 'general'
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- Whether client can see this file
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client Comments/Messages Table
CREATE TABLE IF NOT EXISTS client_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    parent_comment_id UUID REFERENCES client_comments(id) ON DELETE SET NULL, -- For threaded conversations
    message TEXT NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('client', 'admin')),
    sender_name VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    attachments TEXT[], -- Array of file URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone_id ON project_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_project_id ON client_feedbacks(project_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_client_id ON client_feedbacks(client_id);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON client_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_client_id ON client_comments(client_id);

-- Enable Row Level Security (RLS)
ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_users
CREATE POLICY "Users can view own profile" ON client_users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON client_users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for clients
CREATE POLICY "Clients can view own data" ON clients
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Clients can update own data" ON clients
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for projects
CREATE POLICY "Clients can view own projects" ON projects
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for project_milestones
CREATE POLICY "Clients can view milestones of own projects" ON project_milestones
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM projects p
            JOIN clients c ON p.client_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- RLS Policies for project_tasks
CREATE POLICY "Clients can view tasks of own projects" ON project_tasks
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM projects p
            JOIN clients c ON p.client_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- RLS Policies for client_feedbacks
CREATE POLICY "Clients can view own feedbacks" ON client_feedbacks
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Clients can insert own feedbacks" ON client_feedbacks
    FOR INSERT WITH CHECK (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for project_files
CREATE POLICY "Clients can view public files of own projects" ON project_files
    FOR SELECT USING (
        is_public = true AND project_id IN (
            SELECT p.id FROM projects p
            JOIN clients c ON p.client_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Clients can upload files to own projects" ON project_files
    FOR INSERT WITH CHECK (
        uploaded_by_client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for client_comments
CREATE POLICY "Clients can view comments of own projects" ON client_comments
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM projects p
            JOIN clients c ON p.client_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Clients can insert comments to own projects" ON client_comments
    FOR INSERT WITH CHECK (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_client_users_updated_at BEFORE UPDATE ON client_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_feedbacks_updated_at BEFORE UPDATE ON client_feedbacks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_files_updated_at BEFORE UPDATE ON project_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_comments_updated_at BEFORE UPDATE ON client_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SUPABASE REALTIME CONFIGURATION
-- =====================================================

-- Enable Realtime for all tables with Logical Replication
-- This enables real-time subscriptions for the client dashboard

-- Enable Realtime on client_users table
ALTER PUBLICATION supabase_realtime ADD TABLE client_users;

-- Enable Realtime on clients table
ALTER PUBLICATION supabase_realtime ADD TABLE clients;

-- Enable Realtime on projects table
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- Enable Realtime on project_milestones table
ALTER PUBLICATION supabase_realtime ADD TABLE project_milestones;

-- Enable Realtime on project_tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;

-- Enable Realtime on client_feedbacks table
ALTER PUBLICATION supabase_realtime ADD TABLE client_feedbacks;

-- Enable Realtime on project_files table
ALTER PUBLICATION supabase_realtime ADD TABLE project_files;

-- Enable Realtime on client_comments table
ALTER PUBLICATION supabase_realtime ADD TABLE client_comments;

-- =====================================================
-- NOTIFICATION FUNCTIONS FOR REALTIME
-- =====================================================

-- Function to notify on project updates
CREATE OR REPLACE FUNCTION notify_project_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify clients about project changes
  PERFORM pg_notify(
    'project_update',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD),
      'table', TG_TABLE_NAME,
      'timestamp', extract(epoch from now())
    )::text
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to notify on comment updates
CREATE OR REPLACE FUNCTION notify_comment_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify about new messages/comments
  PERFORM pg_notify(
    'comment_update',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD),
      'table', TG_TABLE_NAME,
      'timestamp', extract(epoch from now())
    )::text
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to notify on feedback updates
CREATE OR REPLACE FUNCTION notify_feedback_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify about feedback changes
  PERFORM pg_notify(
    'feedback_update',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD),
      'table', TG_TABLE_NAME,
      'timestamp', extract(epoch from now())
    )::text
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- REALTIME TRIGGERS
-- =====================================================

-- Trigger for projects table
CREATE TRIGGER projects_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION notify_project_update();

-- Trigger for project_milestones table
CREATE TRIGGER milestones_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION notify_project_update();

-- Trigger for project_tasks table
CREATE TRIGGER tasks_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON project_tasks
  FOR EACH ROW EXECUTE FUNCTION notify_project_update();

-- Trigger for client_comments table
CREATE TRIGGER comments_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON client_comments
  FOR EACH ROW EXECUTE FUNCTION notify_comment_update();

-- Trigger for client_feedbacks table
CREATE TRIGGER feedbacks_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON client_feedbacks
  FOR EACH ROW EXECUTE FUNCTION notify_feedback_update();

-- Trigger for project_files table
CREATE TRIGGER files_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON project_files
  FOR EACH ROW EXECUTE FUNCTION notify_project_update();

-- =====================================================
-- STORAGE CONFIGURATION
-- =====================================================

-- Create storage bucket for project files (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Policy for authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- Policy for authenticated users to view files
CREATE POLICY "Authenticated users can view files" ON storage.objects
FOR SELECT USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- Policy for authenticated users to update files
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- Policy for authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'DevTone Client Dashboard Schema created successfully!';
  RAISE NOTICE 'Realtime enabled with Logical Replication for all tables.';
  RAISE NOTICE 'Storage bucket "project-files" configured.';
  RAISE NOTICE 'Next step: Run client-project-sample-data.sql for test data.';
END $$;
