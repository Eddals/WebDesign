-- EXECUTE NO SQL EDITOR DO SUPABASE - PARTE 2: RLS E POLÍTICAS
-- DevTone Agency - Row Level Security

-- Enable RLS
ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_comments ENABLE ROW LEVEL SECURITY;

-- Client Users Policies
CREATE POLICY "Users can view own profile" ON client_users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON client_users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Clients Policies
CREATE POLICY "Clients can view own data" ON clients
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Clients can update own data" ON clients
    FOR UPDATE USING (user_id = auth.uid());

-- Projects Policies
CREATE POLICY "Clients can view own projects" ON projects
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

-- Milestones Policies
CREATE POLICY "Clients can view milestones of own projects" ON project_milestones
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM projects p
            JOIN clients c ON p.client_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- Tasks Policies
CREATE POLICY "Clients can view tasks of own projects" ON project_tasks
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM projects p
            JOIN clients c ON p.client_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- Feedbacks Policies
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

-- Files Policies
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

-- Comments Policies
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

-- Admin Policies (para usuários admin)
CREATE POLICY "Admins can view all data" ON client_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all clients" ON clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all projects" ON projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all milestones" ON project_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all tasks" ON project_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all feedbacks" ON client_feedbacks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all files" ON project_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all comments" ON client_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
