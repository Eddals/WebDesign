-- =====================================================
-- DASHBOARD COMPLETO - SCHEMA SUPABASE
-- DevTone Agency - Sistema Completo com Realtime
-- =====================================================

-- EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- Este script cria todas as tabelas para o dashboard completo

-- =====================================================
-- 1. EXTENSÕES NECESSÁRIAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. TABELA DE PROJETOS
-- =====================================================

DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_registration_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL CHECK (project_type IN ('website', 'ecommerce', 'mobile_app', 'web_app', 'branding', 'seo', 'maintenance')),
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    budget DECIMAL(10,2),
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    project_url TEXT,
    repository_url TEXT,
    staging_url TEXT,
    live_url TEXT,
    assigned_to VARCHAR(255),
    technologies JSONB DEFAULT '[]',
    milestones JSONB DEFAULT '[]',
    files JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA DE MENSAGENS
-- =====================================================

DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general' CHECK (message_type IN ('general', 'project_update', 'support', 'billing', 'feedback')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
    thread_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 4. TABELA DE RELATÓRIOS
-- =====================================================

DROP TABLE IF EXISTS reports CASCADE;

CREATE TABLE reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('financial', 'project_status', 'client_activity', 'performance', 'custom')),
    description TEXT,
    data JSONB NOT NULL DEFAULT '{}',
    filters JSONB DEFAULT '{}',
    generated_by VARCHAR(255) DEFAULT 'System',
    date_range_start DATE,
    date_range_end DATE,
    status VARCHAR(20) DEFAULT 'generated' CHECK (status IN ('generating', 'generated', 'failed')),
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABELA DE ATIVIDADES (LOGS)
-- =====================================================

DROP TABLE IF EXISTS activity_logs CASCADE;

CREATE TABLE activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABELA DE CONFIGURAÇÕES DO DASHBOARD
-- =====================================================

DROP TABLE IF EXISTS dashboard_settings CASCADE;

CREATE TABLE dashboard_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}',
    theme VARCHAR(20) DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- 7. DESABILITAR RLS PARA SIMPLICIDADE
-- =====================================================

ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_settings DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para projects
CREATE INDEX idx_projects_client_id ON projects(client_registration_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_priority ON projects(priority);

-- Índices para messages
CREATE INDEX idx_messages_from_user ON messages(from_user_id);
CREATE INDEX idx_messages_to_user ON messages(to_user_id);
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);

-- Índices para reports
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Índices para activity_logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- =====================================================
-- 9. FUNÇÕES PARA TRIGGERS E NOTIFICAÇÕES
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar log de atividade
CREATE OR REPLACE FUNCTION create_activity_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data
    ) VALUES (
        COALESCE(NEW.client_registration_id, OLD.client_registration_id),
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'CREATE'
            WHEN TG_OP = 'UPDATE' THEN 'UPDATE'
            WHEN TG_OP = 'DELETE' THEN 'DELETE'
        END,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Função para notificar nova mensagem
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (
        type,
        title,
        message,
        client_registration_id,
        data,
        priority,
        action_required,
        action_type
    ) VALUES (
        'client_message',
        'Nova Mensagem Recebida',
        'Nova mensagem de ' || (SELECT full_name FROM client_registrations WHERE id = NEW.from_user_id),
        NEW.from_user_id,
        jsonb_build_object(
            'message_id', NEW.id,
            'subject', NEW.subject,
            'message_type', NEW.message_type,
            'priority', NEW.priority,
            'project_id', NEW.project_id
        ),
        CASE NEW.priority
            WHEN 'urgent' THEN 'urgent'
            WHEN 'high' THEN 'high'
            ELSE 'medium'
        END,
        true,
        'reply_message'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar atualização de projeto
CREATE OR REPLACE FUNCTION notify_project_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status OR OLD.progress_percentage IS DISTINCT FROM NEW.progress_percentage THEN
        INSERT INTO admin_notifications (
            type,
            title,
            message,
            client_registration_id,
            data,
            priority,
            action_required,
            action_type
        ) VALUES (
            'project_update',
            'Projeto Atualizado',
            'Projeto "' || NEW.title || '" foi atualizado',
            NEW.client_registration_id,
            jsonb_build_object(
                'project_id', NEW.id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'old_progress', OLD.progress_percentage,
                'new_progress', NEW.progress_percentage
            ),
            'medium',
            false,
            'view_project'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. CRIAR TRIGGERS
-- =====================================================

-- Triggers para updated_at
CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_dashboard_settings_updated_at
    BEFORE UPDATE ON dashboard_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para activity logs
CREATE TRIGGER trigger_projects_activity_log
    AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION create_activity_log();

CREATE TRIGGER trigger_messages_activity_log
    AFTER INSERT OR UPDATE OR DELETE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION create_activity_log();

-- Triggers para notificações
CREATE TRIGGER trigger_new_message_notification
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_message();

CREATE TRIGGER trigger_project_update_notification
    AFTER UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION notify_project_update();

-- =====================================================
-- 11. HABILITAR REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE dashboard_settings;

-- =====================================================
-- 12. INSERIR DADOS DE EXEMPLO
-- =====================================================

-- Inserir projetos de exemplo
INSERT INTO projects (
    client_registration_id,
    title,
    description,
    project_type,
    status,
    priority,
    budget,
    estimated_hours,
    start_date,
    estimated_completion_date,
    progress_percentage,
    assigned_to,
    technologies
) VALUES 
(
    (SELECT id FROM client_registrations LIMIT 1),
    'Website Corporativo',
    'Desenvolvimento de website institucional moderno e responsivo',
    'website',
    'in_progress',
    'high',
    15000.00,
    120,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    65,
    'DevTone Team',
    '["React", "TypeScript", "Tailwind CSS", "Supabase"]'
),
(
    (SELECT id FROM client_registrations LIMIT 1),
    'E-commerce Platform',
    'Plataforma de e-commerce completa com pagamentos integrados',
    'ecommerce',
    'planning',
    'medium',
    25000.00,
    200,
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '60 days',
    10,
    'DevTone Team',
    '["Next.js", "Stripe", "PostgreSQL", "AWS"]'
);

-- Inserir mensagens de exemplo
INSERT INTO messages (
    from_user_id,
    to_user_id,
    subject,
    message,
    message_type,
    priority
) VALUES 
(
    (SELECT id FROM client_registrations LIMIT 1),
    (SELECT id FROM client_registrations WHERE email = 'admin@devtone.agency' LIMIT 1),
    'Dúvida sobre o projeto',
    'Olá! Gostaria de saber como está o andamento do meu projeto. Quando posso esperar a primeira versão?',
    'project_update',
    'medium'
);

-- Inserir relatório de exemplo
INSERT INTO reports (
    title,
    report_type,
    description,
    data,
    date_range_start,
    date_range_end
) VALUES (
    'Relatório Mensal - Janeiro 2025',
    'financial',
    'Relatório financeiro do mês de janeiro',
    '{"total_revenue": 45000, "projects_completed": 3, "new_clients": 5, "active_projects": 8}',
    '2025-01-01',
    '2025-01-31'
);

-- =====================================================
-- 13. VERIFICAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
    project_count INTEGER;
    message_count INTEGER;
    report_count INTEGER;
    activity_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO project_count FROM projects;
    SELECT COUNT(*) INTO message_count FROM messages;
    SELECT COUNT(*) INTO report_count FROM reports;
    SELECT COUNT(*) INTO activity_count FROM activity_logs;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ DASHBOARD COMPLETO CRIADO COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Status das tabelas:';
    RAISE NOTICE '  • projects: % registros', project_count;
    RAISE NOTICE '  • messages: % registros', message_count;
    RAISE NOTICE '  • reports: % registros', report_count;
    RAISE NOTICE '  • activity_logs: % registros', activity_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Funcionalidades habilitadas:';
    RAISE NOTICE '  • Projetos com status e progresso';
    RAISE NOTICE '  • Sistema de mensagens completo';
    RAISE NOTICE '  • Relatórios automáticos';
    RAISE NOTICE '  • Logs de atividade';
    RAISE NOTICE '  • Notificações em tempo real';
    RAISE NOTICE '  • WebSockets habilitados';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 DASHBOARD PRONTO PARA USO COMPLETO!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '  1. Atualize o frontend com as novas APIs';
    RAISE NOTICE '  2. Teste todas as funcionalidades';
    RAISE NOTICE '  3. Configure permissões de admin';
END $$;
