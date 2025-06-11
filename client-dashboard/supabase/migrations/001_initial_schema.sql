-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'review', 'completed', 'on_hold');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'client',
    company_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    priority project_priority DEFAULT 'medium',
    start_date DATE,
    due_date DATE,
    budget DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status milestone_status DEFAULT 'pending',
    due_date DATE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table
CREATE TABLE files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    uploader_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status invoice_status DEFAULT 'draft',
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_files_project_id ON files(project_id);
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects policies
CREATE POLICY "Clients can view own projects" ON projects FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all projects" ON projects FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Milestones policies
CREATE POLICY "Users can view milestones of accessible projects" ON milestones FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        )
    )
);
CREATE POLICY "Admins can manage all milestones" ON milestones FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Messages policies
CREATE POLICY "Users can view messages of accessible projects" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        )
    )
);
CREATE POLICY "Users can send messages to accessible projects" ON messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        )
    )
);

-- Files policies
CREATE POLICY "Users can view files of accessible projects" ON files FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        )
    )
);
CREATE POLICY "Users can upload files to accessible projects" ON files FOR INSERT WITH CHECK (
    uploader_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        )
    )
);

-- Invoices policies
CREATE POLICY "Clients can view own invoices" ON invoices FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all invoices" ON invoices FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data (for development/demo purposes)
-- Note: In production, you would create these through the application

-- Sample admin user (you'll need to create this user through Supabase Auth first)
-- INSERT INTO profiles (id, email, full_name, role, company_name) VALUES
-- ('admin-uuid-here', 'admin@devtone.agency', 'Admin User', 'admin', 'DevTone Agency');

-- Sample client user
-- INSERT INTO profiles (id, email, full_name, role, company_name, phone) VALUES
-- ('client-uuid-here', 'client@example.com', 'John Smith', 'client', 'Example Corp', '+1-555-0123');

-- Sample projects
-- INSERT INTO projects (id, client_id, title, description, status, priority, start_date, due_date, budget) VALUES
-- ('project-1-uuid', 'client-uuid-here', 'E-commerce Website', 'Modern e-commerce platform with payment integration', 'in_progress', 'high', '2024-01-15', '2024-03-15', 15000.00),
-- ('project-2-uuid', 'client-uuid-here', 'Mobile App Development', 'iOS and Android mobile application', 'planning', 'medium', '2024-02-01', '2024-05-01', 25000.00);

-- Sample milestones
-- INSERT INTO milestones (project_id, title, description, status, due_date, order_index) VALUES
-- ('project-1-uuid', 'Design Phase', 'Complete UI/UX design and wireframes', 'completed', '2024-02-01', 1),
-- ('project-1-uuid', 'Frontend Development', 'Develop responsive frontend', 'in_progress', '2024-02-15', 2),
-- ('project-1-uuid', 'Backend Development', 'API and database development', 'pending', '2024-03-01', 3),
-- ('project-1-uuid', 'Testing & Deployment', 'Quality assurance and deployment', 'pending', '2024-03-15', 4);

-- Sample messages
-- INSERT INTO messages (project_id, sender_id, content, is_internal) VALUES
-- ('project-1-uuid', 'admin-uuid-here', 'Project has been started. We will begin with the design phase.', false),
-- ('project-1-uuid', 'client-uuid-here', 'Great! Looking forward to seeing the initial designs.', false);

-- Sample invoices
-- INSERT INTO invoices (project_id, client_id, invoice_number, amount, status, due_date) VALUES
-- ('project-1-uuid', 'client-uuid-here', 'INV-2024-001', 5000.00, 'paid', '2024-02-15'),
-- ('project-1-uuid', 'client-uuid-here', 'INV-2024-002', 5000.00, 'sent', '2024-03-15');
