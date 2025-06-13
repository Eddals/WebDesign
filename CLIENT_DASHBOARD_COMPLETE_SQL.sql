-- 🚀 CLIENT DASHBOARD COMPLETE SQL SCHEMA
-- DevTone Agency - Real-time Client Dashboard with WebSockets
-- Execute this SQL in Supabase SQL Editor

-- ============================================================================
-- 1. PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES client_registrations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) DEFAULT 'website' CHECK (project_type IN ('website', 'ecommerce', 'app', 'marketing', 'seo', 'branding', 'other')),
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    budget DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    estimated_completion DATE,
    actual_completion DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. PROJECT MILESTONES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
    order_index INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. PROJECT TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to VARCHAR(255),
    due_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. CLIENT FEEDBACKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES client_registrations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    feedback_type VARCHAR(50) DEFAULT 'general' CHECK (feedback_type IN ('general', 'bug_report', 'feature_request', 'design_feedback', 'content_feedback')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'addressed', 'closed')),
    admin_response TEXT,
    admin_responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. PROJECT FILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    uploaded_by_client UUID REFERENCES client_registrations(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_url TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'design', 'content', 'documentation', 'assets', 'deliverable')),
    is_public BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. CLIENT COMMENTS/MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS client_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES client_comments(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('client', 'admin')),
    sender_name VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. MEETING SCHEDULES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS meeting_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES client_registrations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(50) DEFAULT 'consultation' CHECK (meeting_type IN ('consultation', 'review', 'planning', 'presentation', 'training', 'support')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
    client_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. REAL-TIME ACTIVITY LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT NOT NULL,
    entity_type VARCHAR(50), -- 'project', 'milestone', 'task', 'file', 'feedback', 'meeting'
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_client_id ON client_feedbacks(client_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON client_feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON client_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_client_id ON client_comments(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON meeting_schedules(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meeting_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_activity_client_id ON activity_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_logs(created_at);

-- ============================================================================
-- 10. UPDATED_AT TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedbacks_updated_at BEFORE UPDATE ON client_feedbacks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON project_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON client_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meeting_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 11. ACTIVITY LOG TRIGGERS (Real-time tracking)
-- ============================================================================
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (client_id, project_id, activity_type, activity_description, entity_type, entity_id, metadata)
        VALUES (
            COALESCE(NEW.client_id, (SELECT client_id FROM projects WHERE id = NEW.project_id)),
            NEW.project_id,
            TG_OP || '_' || TG_TABLE_NAME,
            'New ' || TG_TABLE_NAME || ' created',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO activity_logs (client_id, project_id, activity_type, activity_description, entity_type, entity_id, metadata)
        VALUES (
            COALESCE(NEW.client_id, (SELECT client_id FROM projects WHERE id = NEW.project_id)),
            NEW.project_id,
            TG_OP || '_' || TG_TABLE_NAME,
            TG_TABLE_NAME || ' updated',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Apply activity triggers
CREATE TRIGGER log_projects_activity AFTER INSERT OR UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_milestones_activity AFTER INSERT OR UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_tasks_activity AFTER INSERT OR UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_feedbacks_activity AFTER INSERT OR UPDATE ON client_feedbacks FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_files_activity AFTER INSERT OR UPDATE ON project_files FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_comments_activity AFTER INSERT OR UPDATE ON client_comments FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_meetings_activity AFTER INSERT OR UPDATE ON meeting_schedules FOR EACH ROW EXECUTE FUNCTION log_activity();

-- ============================================================================
-- 12. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 13. RLS POLICIES (Clients can only see their own data)
-- ============================================================================
-- Projects policies
CREATE POLICY "Clients can view their own projects" ON projects FOR SELECT USING (client_id = auth.uid()::uuid);
CREATE POLICY "Admins can view all projects" ON projects FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Milestones policies
CREATE POLICY "Clients can view milestones of their projects" ON project_milestones FOR SELECT 
USING (project_id IN (SELECT id FROM projects WHERE client_id = auth.uid()::uuid));

-- Tasks policies
CREATE POLICY "Clients can view tasks of their projects" ON project_tasks FOR SELECT 
USING (project_id IN (SELECT id FROM projects WHERE client_id = auth.uid()::uuid));

-- Feedbacks policies
CREATE POLICY "Clients can manage their own feedbacks" ON client_feedbacks FOR ALL USING (client_id = auth.uid()::uuid);

-- Files policies
CREATE POLICY "Clients can manage files of their projects" ON project_files FOR ALL 
USING (project_id IN (SELECT id FROM projects WHERE client_id = auth.uid()::uuid));

-- Comments policies
CREATE POLICY "Clients can manage comments of their projects" ON client_comments FOR ALL 
USING (client_id = auth.uid()::uuid OR project_id IN (SELECT id FROM projects WHERE client_id = auth.uid()::uuid));

-- Meetings policies
CREATE POLICY "Clients can manage their own meetings" ON meeting_schedules FOR ALL USING (client_id = auth.uid()::uuid);

-- Activity logs policies
CREATE POLICY "Clients can view their own activity" ON activity_logs FOR SELECT USING (client_id = auth.uid()::uuid);

-- ============================================================================
-- 14. SAMPLE DATA FOR TESTING
-- ============================================================================
-- Insert sample project (replace with actual client_id)
INSERT INTO projects (client_id, title, description, project_type, status, progress_percentage, budget, start_date, end_date) 
VALUES (
    (SELECT id FROM client_registrations LIMIT 1),
    'E-commerce Website Development',
    'Complete e-commerce solution with payment integration and inventory management',
    'ecommerce',
    'in_progress',
    65,
    15000.00,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '60 days'
);

-- Insert sample milestones
INSERT INTO project_milestones (project_id, title, description, due_date, status, order_index, completion_percentage)
SELECT 
    p.id,
    milestone_data.title,
    milestone_data.description,
    milestone_data.due_date,
    milestone_data.status,
    milestone_data.order_index,
    milestone_data.completion_percentage
FROM projects p,
(VALUES 
    ('Project Planning & Design', 'Initial planning and design phase', CURRENT_DATE - INTERVAL '20 days', 'completed', 1, 100),
    ('Frontend Development', 'User interface and user experience development', CURRENT_DATE + INTERVAL '10 days', 'in_progress', 2, 70),
    ('Backend Development', 'Server-side logic and database integration', CURRENT_DATE + INTERVAL '30 days', 'pending', 3, 30),
    ('Testing & Deployment', 'Quality assurance and production deployment', CURRENT_DATE + INTERVAL '50 days', 'pending', 4, 0)
) AS milestone_data(title, description, due_date, status, order_index, completion_percentage)
WHERE p.title = 'E-commerce Website Development';

-- ============================================================================
-- 15. ENABLE REALTIME FOR ALL TABLES
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE project_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE client_feedbacks;
ALTER PUBLICATION supabase_realtime ADD TABLE project_files;
ALTER PUBLICATION supabase_realtime ADD TABLE client_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;

-- ============================================================================
-- 🎉 SCHEMA COMPLETE! 
-- ============================================================================
-- All tables created with:
-- ✅ Real-time WebSocket support
-- ✅ Activity logging
-- ✅ Row Level Security
-- ✅ Performance indexes
-- ✅ Auto-updated timestamps
-- ✅ Sample data for testing
-- 
-- Ready for Client Dashboard with Quick Actions:
-- 📝 Send Feedback
-- 📁 Upload Files  
-- 📅 Schedule Meeting
-- 💬 Real-time Comments
-- 📊 Live Progress Tracking
-- ============================================================================
