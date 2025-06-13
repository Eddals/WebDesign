-- =====================================================
-- EXECUTE NO SQL EDITOR DO SUPABASE - SETUP COMPLETO
-- DevTone Agency - Sistema Completo de Notificações e Registro
-- =====================================================

-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- Este script configura todo o sistema de notificações administrativas
-- e atualiza as tabelas para suportar os novos campos de registro

-- =====================================================
-- 1. ATUALIZAR TABELAS EXISTENTES
-- =====================================================

-- Adicionar colunas faltantes na tabela client_users
ALTER TABLE client_users 
ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Adicionar colunas faltantes na tabela clients
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- =====================================================
-- 2. CRIAR TABELAS DE NOTIFICAÇÕES
-- =====================================================

-- Tabela de notificações administrativas
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('new_client_registration', 'new_project_request', 'client_message', 'payment_received', 'project_update')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES client_users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    action_required BOOLEAN DEFAULT false,
    action_type VARCHAR(50),
    action_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de ações administrativas
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    notification_id UUID REFERENCES admin_notifications(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES client_users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de comunicações em tempo real
CREATE TABLE IF NOT EXISTS real_time_communications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID REFERENCES client_users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES client_users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('project_update', 'milestone_completed', 'feedback_request', 'general_message', 'file_shared')),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 3. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para admin_notifications
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_priority ON admin_notifications(priority);

-- Índices para comunicações
CREATE INDEX IF NOT EXISTS idx_real_time_communications_from_user ON real_time_communications(from_user_id);
CREATE INDEX IF NOT EXISTS idx_real_time_communications_to_user ON real_time_communications(to_user_id);
CREATE INDEX IF NOT EXISTS idx_real_time_communications_project ON real_time_communications(project_id);
CREATE INDEX IF NOT EXISTS idx_real_time_communications_created_at ON real_time_communications(created_at DESC);

-- =====================================================
-- 4. CRIAR FUNÇÕES PARA NOTIFICAÇÕES AUTOMÁTICAS
-- =====================================================

-- Função para criar notificação de novo cliente
CREATE OR REPLACE FUNCTION notify_new_client_registration()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (
        type,
        title,
        message,
        user_id,
        client_id,
        data,
        priority,
        action_required,
        action_type,
        action_data
    ) VALUES (
        'new_client_registration',
        'Novo Cliente Registrado',
        'Um novo cliente se registrou: ' || NEW.full_name || COALESCE(' (' || NEW.company_name || ')', ''),
        NEW.id,
        (SELECT id FROM clients WHERE user_id = NEW.id LIMIT 1),
        jsonb_build_object(
            'user_email', NEW.email,
            'user_name', NEW.full_name,
            'company_name', NEW.company_name,
            'phone', NEW.phone,
            'industry', NEW.industry,
            'country', NEW.country,
            'registration_time', NOW()
        ),
        'high',
        true,
        'approve_client',
        jsonb_build_object(
            'actions', ARRAY['approve', 'reject', 'request_info', 'schedule_call']
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar atualização de projeto
CREATE OR REPLACE FUNCTION notify_project_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificar cliente sobre atualização
    INSERT INTO real_time_communications (
        from_user_id,
        to_user_id,
        project_id,
        message_type,
        subject,
        message,
        metadata
    ) VALUES (
        (SELECT id FROM client_users WHERE role = 'admin' LIMIT 1),
        (SELECT user_id FROM clients WHERE id = NEW.client_id),
        NEW.id,
        'project_update',
        'Atualização do Projeto: ' || NEW.title,
        'Seu projeto foi atualizado. Status atual: ' || NEW.status || '. Progresso: ' || NEW.progress_percentage || '%',
        jsonb_build_object(
            'old_status', OLD.status,
            'new_status', NEW.status,
            'old_progress', OLD.progress_percentage,
            'new_progress', NEW.progress_percentage,
            'update_time', NOW()
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. CRIAR TRIGGERS PARA NOTIFICAÇÕES AUTOMÁTICAS
-- =====================================================

-- Trigger para novos clientes
DROP TRIGGER IF EXISTS trigger_new_client_registration ON client_users;
CREATE TRIGGER trigger_new_client_registration
    AFTER INSERT ON client_users
    FOR EACH ROW
    WHEN (NEW.role = 'client')
    EXECUTE FUNCTION notify_new_client_registration();

-- Trigger para atualizações de projeto
DROP TRIGGER IF EXISTS trigger_project_update ON projects;
CREATE TRIGGER trigger_project_update
    AFTER UPDATE ON projects
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.progress_percentage IS DISTINCT FROM NEW.progress_percentage)
    EXECUTE FUNCTION notify_project_update();

-- =====================================================
-- 6. CONFIGURAR REALTIME
-- =====================================================

-- Habilitar realtime para notificações
ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE real_time_communications;
ALTER PUBLICATION supabase_realtime ADD TABLE client_users;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- =====================================================
-- 7. CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_communications ENABLE ROW LEVEL SECURITY;

-- Políticas para admin_notifications
CREATE POLICY "Admins can view all notifications" ON admin_notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "System can insert notifications" ON admin_notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update notifications" ON admin_notifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para comunicações
CREATE POLICY "Users can view their communications" ON real_time_communications
    FOR SELECT USING (
        from_user_id = auth.uid() OR 
        to_user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can send communications" ON real_time_communications
    FOR INSERT WITH CHECK (
        from_user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM client_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 8. CRIAR FUNÇÕES AUXILIARES PARA ADMIN
-- =====================================================

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE admin_notifications 
    SET is_read = true, read_at = NOW()
    WHERE id = notification_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para executar ação administrativa
CREATE OR REPLACE FUNCTION execute_admin_action(
    notification_id UUID,
    action_type VARCHAR(50),
    action_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    action_id UUID;
    admin_id UUID;
BEGIN
    -- Verificar se o usuário é admin
    SELECT id INTO admin_id FROM client_users 
    WHERE id = auth.uid() AND role = 'admin';
    
    IF admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can execute actions';
    END IF;
    
    -- Criar registro da ação
    INSERT INTO admin_actions (
        notification_id,
        admin_user_id,
        action_type,
        action_data,
        status
    ) VALUES (
        notification_id,
        admin_id,
        action_type,
        action_data,
        'pending'
    ) RETURNING id INTO action_id;
    
    -- Marcar notificação como lida
    PERFORM mark_notification_read(notification_id);
    
    RETURN action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. VERIFICAÇÃO FINAL
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Setup completo executado com sucesso!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Configurações aplicadas:';
    RAISE NOTICE '  • Tabelas atualizadas com novos campos';
    RAISE NOTICE '  • Sistema de notificações administrativas criado';
    RAISE NOTICE '  • Triggers para notificações automáticas configurados';
    RAISE NOTICE '  • Realtime habilitado para todas as tabelas';
    RAISE NOTICE '  • Políticas RLS configuradas para segurança';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Sistema pronto para uso!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '  1. Teste o registro de novos clientes';
    RAISE NOTICE '  2. Verifique as notificações no painel admin';
    RAISE NOTICE '  3. Configure CORS no Supabase para localhost:5173';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 URLs importantes:';
    RAISE NOTICE '  • Client Portal: /client-portal';
    RAISE NOTICE '  • Admin Dashboard: /admin-client-dashboard';
END $$;
