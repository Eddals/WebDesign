-- =====================================================
-- SOLUÇÃO SIMPLES - REGISTRO DE CLIENTES
-- DevTone Agency - Tabela Independente para Registro
-- =====================================================

-- EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- Esta solução cria uma tabela simples para registro de clientes

-- =====================================================
-- 1. CRIAR TABELA SIMPLES PARA REGISTRO DE CLIENTES
-- =====================================================

-- Remover tabela se existir
DROP TABLE IF EXISTS client_registrations CASCADE;

-- Criar tabela simples para registros de clientes
CREATE TABLE client_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    industry VARCHAR(100),
    website_url TEXT,
    country VARCHAR(100),
    business_description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CRIAR TABELA DE NOTIFICAÇÕES ADMINISTRATIVAS
-- =====================================================

-- Remover tabela se existir
DROP TABLE IF EXISTS admin_notifications CASCADE;

-- Criar tabela de notificações
CREATE TABLE admin_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    client_registration_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
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

-- =====================================================
-- 3. CRIAR TABELA DE AÇÕES ADMINISTRATIVAS
-- =====================================================

-- Remover tabela se existir
DROP TABLE IF EXISTS admin_actions CASCADE;

-- Criar tabela de ações
CREATE TABLE admin_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    notification_id UUID REFERENCES admin_notifications(id) ON DELETE CASCADE,
    admin_name VARCHAR(255) DEFAULT 'DevTone Admin',
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 4. CRIAR TABELA DE COMUNICAÇÕES
-- =====================================================

-- Remover tabela se existir
DROP TABLE IF EXISTS client_communications CASCADE;

-- Criar tabela de comunicações
CREATE TABLE client_communications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_registration_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
    from_admin BOOLEAN DEFAULT false,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 5. DESABILITAR RLS PARA SIMPLICIDADE
-- =====================================================

-- Desabilitar RLS em todas as tabelas
ALTER TABLE client_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_client_registrations_email ON client_registrations(email);
CREATE INDEX idx_client_registrations_status ON client_registrations(status);
CREATE INDEX idx_client_registrations_created_at ON client_registrations(created_at DESC);

CREATE INDEX idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

CREATE INDEX idx_client_communications_client_id ON client_communications(client_registration_id);
CREATE INDEX idx_client_communications_created_at ON client_communications(created_at DESC);

-- =====================================================
-- 7. CRIAR FUNÇÕES PARA NOTIFICAÇÕES
-- =====================================================

-- Função para criar notificação de novo cliente
CREATE OR REPLACE FUNCTION notify_new_client_registration()
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
        action_type,
        action_data
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
            'website_url', NEW.website_url,
            'business_description', NEW.business_description,
            'registration_time', NEW.created_at
        ),
        'high',
        true,
        'approve_client',
        jsonb_build_object(
            'actions', ARRAY['approve', 'reject', 'request_info', 'schedule_call']
        )
    );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Se der erro, apenas continue sem falhar
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
$$ LANGUAGE plpgsql;

-- Função para executar ação administrativa
CREATE OR REPLACE FUNCTION execute_admin_action(
    notification_id UUID,
    action_type VARCHAR(50),
    action_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    action_id UUID;
    client_id UUID;
BEGIN
    -- Obter ID do cliente da notificação
    SELECT client_registration_id INTO client_id 
    FROM admin_notifications 
    WHERE id = notification_id;
    
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
        'completed'
    ) RETURNING id INTO action_id;
    
    -- Executar ação específica
    IF action_type = 'approve_client' THEN
        UPDATE client_registrations 
        SET status = 'approved', approved_by = 'DevTone Admin', approved_at = NOW()
        WHERE id = client_id;
        
        -- Enviar mensagem de boas-vindas
        INSERT INTO client_communications (
            client_registration_id,
            from_admin,
            subject,
            message,
            is_urgent
        ) VALUES (
            client_id,
            true,
            'Bem-vindo à DevTone Agency!',
            'Sua conta foi aprovada com sucesso! Nossa equipe entrará em contato em breve para discutir seus projetos.',
            true
        );
        
    ELSIF action_type = 'reject_client' THEN
        UPDATE client_registrations 
        SET status = 'rejected', rejection_reason = COALESCE(action_data->>'reason', 'Não especificado')
        WHERE id = client_id;
        
        -- Enviar mensagem de rejeição
        INSERT INTO client_communications (
            client_registration_id,
            from_admin,
            subject,
            message
        ) VALUES (
            client_id,
            true,
            'Atualização sobre sua solicitação',
            'Obrigado pelo seu interesse na DevTone Agency. Infelizmente, não podemos prosseguir com sua solicitação neste momento.'
        );
    END IF;
    
    -- Marcar notificação como lida
    PERFORM mark_notification_read(notification_id);
    
    RETURN action_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. CRIAR TRIGGERS
-- =====================================================

-- Trigger para novos clientes
DROP TRIGGER IF EXISTS trigger_new_client_registration ON client_registrations;
CREATE TRIGGER trigger_new_client_registration
    AFTER INSERT ON client_registrations
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_client_registration();

-- =====================================================
-- 9. HABILITAR REALTIME
-- =====================================================

-- Adicionar tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE client_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE client_communications;

-- =====================================================
-- 10. INSERIR DADOS DE TESTE
-- =====================================================

-- Inserir cliente de teste
INSERT INTO client_registrations (
    email,
    password_hash,
    full_name,
    company_name,
    phone,
    industry,
    country,
    website_url,
    business_description
) VALUES (
    'cliente.teste@exemplo.com',
    '$2a$10$example.hash.for.testing.purposes.only',
    'Cliente Teste',
    'Empresa Teste Ltda',
    '(11) 99999-9999',
    'Technology',
    'Brasil',
    'https://empresateste.com',
    'Empresa de teste para demonstração do sistema'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 11. VERIFICAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
    registration_count INTEGER;
    notification_count INTEGER;
    communication_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO registration_count FROM client_registrations;
    SELECT COUNT(*) INTO notification_count FROM admin_notifications;
    SELECT COUNT(*) INTO communication_count FROM client_communications;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ SISTEMA SIMPLES DE REGISTRO CRIADO!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Status das tabelas:';
    RAISE NOTICE '  • client_registrations: % registros', registration_count;
    RAISE NOTICE '  • admin_notifications: % registros', notification_count;
    RAISE NOTICE '  • client_communications: % registros', communication_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Configurações aplicadas:';
    RAISE NOTICE '  • Tabelas independentes criadas (sem auth)';
    RAISE NOTICE '  • RLS desabilitado para simplicidade';
    RAISE NOTICE '  • Triggers de notificação configurados';
    RAISE NOTICE '  • Realtime habilitado';
    RAISE NOTICE '  • Dados de teste inseridos';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tabelas criadas:';
    RAISE NOTICE '  • client_registrations - Registro de clientes';
    RAISE NOTICE '  • admin_notifications - Notificações para admin';
    RAISE NOTICE '  • admin_actions - Ações administrativas';
    RAISE NOTICE '  • client_communications - Mensagens';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 PRÓXIMOS PASSOS:';
    RAISE NOTICE '  1. Atualize o código frontend para usar client_registrations';
    RAISE NOTICE '  2. Teste o registro sem autenticação Supabase';
    RAISE NOTICE '  3. Verifique notificações em tempo real';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Esta solução evita problemas com Supabase Auth';
    RAISE NOTICE '   e permite controle total sobre o registro de clientes.';
END $$;
