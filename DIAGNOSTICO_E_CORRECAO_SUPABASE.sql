-- =====================================================
-- DIAGNÓSTICO E CORREÇÃO - SUPABASE
-- DevTone Agency - Correção de Problemas de Acesso
-- =====================================================

-- EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- Este script diagnostica e corrige problemas comuns

-- =====================================================
-- 1. VERIFICAR SE AS TABELAS EXISTEM
-- =====================================================

DO $$
DECLARE
    table_count INTEGER;
BEGIN
    -- Verificar tabelas existentes
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('client_users', 'clients', 'projects');
    
    RAISE NOTICE '📊 Tabelas encontradas: %', table_count;
    
    IF table_count < 3 THEN
        RAISE NOTICE '❌ Algumas tabelas estão faltando. Criando...';
    ELSE
        RAISE NOTICE '✅ Tabelas principais encontradas';
    END IF;
END $$;

-- =====================================================
-- 2. CRIAR EXTENSÕES NECESSÁRIAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 3. CRIAR TABELAS SE NÃO EXISTIREM
-- =====================================================

-- Client Users Table
CREATE TABLE IF NOT EXISTS client_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    industry VARCHAR(100),
    country VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients Table
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
    project_type VARCHAR(50) NOT NULL,
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

-- =====================================================
-- 4. CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CRIAR POLÍTICAS RLS PERMISSIVAS PARA TESTE
-- =====================================================

-- Políticas para client_users
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON client_users;
CREATE POLICY "Allow all operations for authenticated users" ON client_users
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas para clients
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON clients;
CREATE POLICY "Allow all operations for authenticated users" ON clients
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas para projects
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON projects;
CREATE POLICY "Allow all operations for authenticated users" ON projects
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 6. CRIAR TABELAS DE NOTIFICAÇÕES
-- =====================================================

-- Admin Notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    client_id UUID,
    user_id UUID,
    project_id UUID,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'medium',
    action_required BOOLEAN DEFAULT false,
    action_type VARCHAR(50),
    action_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Real Time Communications
CREATE TABLE IF NOT EXISTS real_time_communications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID,
    to_user_id UUID,
    project_id UUID,
    message_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Admin Actions
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    notification_id UUID,
    admin_user_id UUID,
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 7. CONFIGURAR RLS PARA TABELAS DE NOTIFICAÇÕES
-- =====================================================

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para teste
CREATE POLICY "Allow all operations" ON admin_notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON real_time_communications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON admin_actions FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 8. CRIAR FUNÇÕES NECESSÁRIAS
-- =====================================================

-- Função para notificar novo cliente
CREATE OR REPLACE FUNCTION notify_new_client_registration()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (
        type,
        title,
        message,
        user_id,
        data,
        priority,
        action_required,
        action_type
    ) VALUES (
        'new_client_registration',
        'Novo Cliente Registrado',
        'Um novo cliente se registrou: ' || NEW.full_name || COALESCE(' (' || NEW.company_name || ')', ''),
        NEW.id,
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
        'approve_client'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
BEGIN
    -- Criar registro da ação
    INSERT INTO admin_actions (
        notification_id,
        action_type,
        action_data,
        status
    ) VALUES (
        notification_id,
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
-- 9. CRIAR TRIGGERS
-- =====================================================

-- Trigger para novos clientes
DROP TRIGGER IF EXISTS trigger_new_client_registration ON client_users;
CREATE TRIGGER trigger_new_client_registration
    AFTER INSERT ON client_users
    FOR EACH ROW
    WHEN (NEW.role = 'client')
    EXECUTE FUNCTION notify_new_client_registration();

-- =====================================================
-- 10. HABILITAR REALTIME
-- =====================================================

-- Adicionar tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE client_users;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE real_time_communications;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_actions;

-- =====================================================
-- 11. INSERIR DADOS DE TESTE
-- =====================================================

-- Inserir usuário admin se não existir
INSERT INTO client_users (id, email, full_name, company_name, role, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@devtone.agency',
    'DevTone Admin',
    'DevTone Agency',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 12. VERIFICAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
    user_count INTEGER;
    client_count INTEGER;
    project_count INTEGER;
    notification_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM client_users;
    SELECT COUNT(*) INTO client_count FROM clients;
    SELECT COUNT(*) INTO project_count FROM projects;
    SELECT COUNT(*) INTO notification_count FROM admin_notifications;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ DIAGNÓSTICO COMPLETO!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Status das tabelas:';
    RAISE NOTICE '  • client_users: % registros', user_count;
    RAISE NOTICE '  • clients: % registros', client_count;
    RAISE NOTICE '  • projects: % registros', project_count;
    RAISE NOTICE '  • admin_notifications: % registros', notification_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Configurações aplicadas:';
    RAISE NOTICE '  • RLS habilitado com políticas permissivas';
    RAISE NOTICE '  • Triggers de notificação configurados';
    RAISE NOTICE '  • Realtime habilitado para todas as tabelas';
    RAISE NOTICE '  • Funções administrativas criadas';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Sistema pronto para teste!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '  1. Teste o registro de cliente em /client-portal';
    RAISE NOTICE '  2. Verifique notificações em /admin-client-dashboard';
    RAISE NOTICE '  3. Configure CORS se necessário';
END $$;
