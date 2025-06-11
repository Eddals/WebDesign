-- =====================================================
-- DEVTONE CHAT SUPPORT SYSTEM - DATABASE SETUP
-- =====================================================
-- Este script cria todas as tabelas necessárias para o sistema de chat de suporte
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. TABELA DE SESSÕES DE CHAT
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Informações do usuário
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    user_company TEXT,
    inquiry_type TEXT DEFAULT 'general',
    
    -- Status da sessão
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'resolved', 'closed')),
    is_active BOOLEAN DEFAULT true,
    
    -- Metadados adicionais
    metadata JSONB DEFAULT '{}',
    
    -- Índices para busca
    CONSTRAINT valid_email CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- 2. TABELA DE MENSAGENS DO CHAT
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Relacionamento com sessão
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    
    -- Informações da mensagem
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Tipo de mensagem
    is_user BOOLEAN NOT NULL DEFAULT true,
    is_read BOOLEAN DEFAULT false,
    
    -- Metadados adicionais
    metadata JSONB DEFAULT '{}',
    
    -- Validações
    CONSTRAINT message_not_empty CHECK (length(trim(message)) > 0),
    CONSTRAINT valid_email CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- 3. TABELA DE AGENTES DE SUPORTE (OPCIONAL)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Informações do agente
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'supervisor', 'admin')),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE,
    
    -- Configurações
    max_concurrent_chats INTEGER DEFAULT 5,
    auto_assign BOOLEAN DEFAULT true,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- 4. TABELA DE ATRIBUIÇÕES DE CHAT (OPCIONAL)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Relacionamentos
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES chat_agents(id) ON DELETE SET NULL,
    
    -- Status da atribuição
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'transferred', 'completed')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Notas
    notes TEXT,
    
    UNIQUE(session_id, agent_id, status)
);

-- =====================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para chat_sessions
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_email ON chat_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_inquiry_type ON chat_sessions(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(is_active) WHERE is_active = true;

-- Índices para chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_user ON chat_messages(is_user);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON chat_messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created ON chat_messages(session_id, created_at);

-- Índices para chat_agents
CREATE INDEX IF NOT EXISTS idx_chat_agents_email ON chat_agents(email);
CREATE INDEX IF NOT EXISTS idx_chat_agents_active ON chat_agents(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_chat_agents_online ON chat_agents(is_online) WHERE is_online = true;

-- Índices para chat_assignments
CREATE INDEX IF NOT EXISTS idx_chat_assignments_session_id ON chat_assignments(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_assignments_agent_id ON chat_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_assignments_status ON chat_assignments(status);

-- =====================================================
-- 6. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para atualizar updated_at em chat_sessions
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_sessions_updated_at();

-- Trigger para atualizar updated_at em chat_agents
CREATE OR REPLACE FUNCTION update_chat_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_agents_updated_at
    BEFORE UPDATE ON chat_agents
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_agents_updated_at();

-- Trigger para atualizar session quando nova mensagem é adicionada
CREATE OR REPLACE FUNCTION update_session_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions 
    SET updated_at = timezone('utc', now())
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_on_new_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_session_on_new_message();

-- =====================================================
-- 7. POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_assignments ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de sessões (usuários anônimos)
CREATE POLICY "Allow anonymous session creation" ON chat_sessions
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de sessões próprias
CREATE POLICY "Allow session read by email" ON chat_sessions
    FOR SELECT USING (true); -- Temporariamente permissivo para desenvolvimento

-- Política para permitir inserção de mensagens
CREATE POLICY "Allow message creation" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de mensagens
CREATE POLICY "Allow message read" ON chat_messages
    FOR SELECT USING (true); -- Temporariamente permissivo para desenvolvimento

-- Política para permitir atualização de mensagens (marcar como lida)
CREATE POLICY "Allow message update" ON chat_messages
    FOR UPDATE USING (true); -- Temporariamente permissivo para desenvolvimento

-- =====================================================
-- 8. DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir agente padrão do sistema
INSERT INTO chat_agents (name, email, role, is_active, is_online) 
VALUES ('DevTone Support', 'support@devtone.agency', 'admin', true, true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 9. VIEWS ÚTEIS PARA RELATÓRIOS
-- =====================================================

-- View para estatísticas de chat
CREATE OR REPLACE VIEW chat_stats AS
SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'active') as active_sessions,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_sessions,
    COUNT(*) FILTER (WHERE status = 'resolved') as resolved_sessions,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_sessions,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_sessions
FROM chat_sessions;

-- View para sessões com contagem de mensagens
CREATE OR REPLACE VIEW chat_sessions_with_counts AS
SELECT 
    cs.*,
    COALESCE(msg_counts.total_messages, 0) as total_messages,
    COALESCE(msg_counts.unread_messages, 0) as unread_messages,
    last_msg.last_message,
    last_msg.last_message_time
FROM chat_sessions cs
LEFT JOIN (
    SELECT 
        session_id,
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE is_user = true AND is_read = false) as unread_messages
    FROM chat_messages 
    GROUP BY session_id
) msg_counts ON cs.id = msg_counts.session_id
LEFT JOIN (
    SELECT DISTINCT ON (session_id)
        session_id,
        message as last_message,
        created_at as last_message_time
    FROM chat_messages
    ORDER BY session_id, created_at DESC
) last_msg ON cs.id = last_msg.session_id;

-- =====================================================
-- FINALIZAÇÃO
-- =====================================================

-- Comentário final
COMMENT ON TABLE chat_sessions IS 'Tabela principal para armazenar sessões de chat de suporte';
COMMENT ON TABLE chat_messages IS 'Tabela para armazenar todas as mensagens do chat';
COMMENT ON TABLE chat_agents IS 'Tabela para gerenciar agentes de suporte';
COMMENT ON TABLE chat_assignments IS 'Tabela para atribuir chats a agentes específicos';

-- Verificação final
SELECT 'Chat Support Database Setup Complete!' as status;
