-- =====================================================
-- EXECUTE AGORA NO SQL EDITOR DO SUPABASE
-- DevTone Agency - Criação Urgente das Tabelas
-- =====================================================

-- COPIE E COLE ESTE SCRIPT COMPLETO NO SQL EDITOR DO SUPABASE

-- =====================================================
-- 1. CRIAR EXTENSÕES
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CRIAR TABELA DE REGISTRO DE CLIENTES
-- =====================================================

-- Remover se existir
DROP TABLE IF EXISTS client_registrations CASCADE;

-- Criar tabela principal
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
-- 3. CRIAR TABELA DE NOTIFICAÇÕES
-- =====================================================

DROP TABLE IF EXISTS admin_notifications CASCADE;

CREATE TABLE admin_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    client_registration_id UUID REFERENCES client_registrations(id) ON DELETE CASCADE,
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

-- =====================================================
-- 4. CRIAR TABELA DE AÇÕES
-- =====================================================

DROP TABLE IF EXISTS admin_actions CASCADE;

CREATE TABLE admin_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    notification_id UUID REFERENCES admin_notifications(id) ON DELETE CASCADE,
    admin_name VARCHAR(255) DEFAULT 'DevTone Admin',
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 5. DESABILITAR RLS (PARA SIMPLICIDADE)
-- =====================================================

ALTER TABLE client_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CRIAR FUNÇÃO DE NOTIFICAÇÃO
-- =====================================================

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
            'registration_time', NEW.created_at
        ),
        'high',
        true,
        'approve_client'
    );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. CRIAR FUNÇÕES ADMINISTRATIVAS
-- =====================================================

CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE admin_notifications 
    SET is_read = true, read_at = NOW()
    WHERE id = notification_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

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
    -- Obter ID do cliente
    SELECT client_registration_id INTO client_id 
    FROM admin_notifications 
    WHERE id = notification_id;
    
    -- Criar ação
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
    
    -- Executar ação
    IF action_type = 'approve_client' THEN
        UPDATE client_registrations 
        SET status = 'approved', approved_by = 'DevTone Admin', approved_at = NOW()
        WHERE id = client_id;
    ELSIF action_type = 'reject_client' THEN
        UPDATE client_registrations 
        SET status = 'rejected', rejection_reason = COALESCE(action_data->>'reason', 'Não especificado')
        WHERE id = client_id;
    END IF;
    
    -- Marcar como lida
    PERFORM mark_notification_read(notification_id);
    
    RETURN action_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. CRIAR TRIGGER
-- =====================================================

DROP TRIGGER IF EXISTS trigger_new_client_registration ON client_registrations;
CREATE TRIGGER trigger_new_client_registration
    AFTER INSERT ON client_registrations
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_client_registration();

-- =====================================================
-- 9. HABILITAR REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE client_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_actions;

-- =====================================================
-- 10. INSERIR DADOS DE TESTE
-- =====================================================

INSERT INTO client_registrations (
    email,
    password_hash,
    full_name,
    company_name,
    phone,
    industry,
    country,
    business_description
) VALUES (
    'teste@exemplo.com',
    'hash_exemplo',
    'Cliente Teste',
    'Empresa Teste',
    '(11) 99999-9999',
    'Technology',
    'Brasil',
    'Cliente de teste para verificação'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 11. VERIFICAÇÃO
-- =====================================================

DO $$
DECLARE
    registration_count INTEGER;
    notification_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO registration_count FROM client_registrations;
    SELECT COUNT(*) INTO notification_count FROM admin_notifications;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ TABELAS CRIADAS COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Status:';
    RAISE NOTICE '  • client_registrations: % registros', registration_count;
    RAISE NOTICE '  • admin_notifications: % registros', notification_count;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 AGORA TESTE O SISTEMA:';
    RAISE NOTICE '  1. Reinicie: npm run dev';
    RAISE NOTICE '  2. Acesse: /client-portal';
    RAISE NOTICE '  3. Clique em "Testar Conexão"';
    RAISE NOTICE '  4. Registre um novo cliente';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Sistema pronto para uso!';
END $$;
