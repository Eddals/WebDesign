-- =====================================================
-- SUPABASE SCHEMA ATUALIZADO - SISTEMA DE CHAT COMPLETO
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. TABELA DE SESSÕES DE CHAT (ATUALIZADA)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50),
  user_company VARCHAR(255),
  inquiry_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE MENSAGENS (ATUALIZADA COM METADATA)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN DEFAULT true,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_user ON chat_messages(is_user);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON chat_messages(is_read);

-- 4. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. TRIGGER PARA AUTO-UPDATE DO updated_at
-- =====================================================
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. VIEW PARA SESSÕES COM CONTADORES (OTIMIZADA)
-- =====================================================
CREATE OR REPLACE VIEW chat_sessions_with_counts AS
SELECT 
    s.*,
    COALESCE(msg_counts.total_messages, 0) as total_messages,
    COALESCE(msg_counts.unread_messages, 0) as unread_messages,
    COALESCE(last_msg.last_message, '') as last_message,
    COALESCE(last_msg.last_message_time, s.created_at) as last_message_time
FROM chat_sessions s
LEFT JOIN (
    SELECT 
        session_id,
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE is_user = true AND is_read = false) as unread_messages
    FROM chat_messages 
    GROUP BY session_id
) msg_counts ON s.id = msg_counts.session_id
LEFT JOIN (
    SELECT DISTINCT ON (session_id)
        session_id,
        message as last_message,
        created_at as last_message_time
    FROM chat_messages
    ORDER BY session_id, created_at DESC
) last_msg ON s.id = last_msg.session_id;

-- 7. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================
-- Habilitar RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Política para sessões - permitir todas as operações
CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- Política para mensagens - permitir todas as operações
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages
    FOR ALL USING (true) WITH CHECK (true);

-- 8. FUNÇÃO PARA ESTATÍSTICAS DO DASHBOARD
-- =====================================================
CREATE OR REPLACE FUNCTION get_chat_stats()
RETURNS TABLE (
    total_sessions BIGINT,
    active_sessions BIGINT,
    pending_sessions BIGINT,
    resolved_sessions BIGINT,
    closed_sessions BIGINT,
    avg_response_time NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_sessions,
        COUNT(*) FILTER (WHERE status = 'active') as active_sessions,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_sessions,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_sessions,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_sessions,
        2.5::NUMERIC as avg_response_time -- Placeholder para tempo médio
    FROM chat_sessions;
END;
$$ LANGUAGE plpgsql;

-- 9. FUNÇÃO PARA LIMPAR SESSÕES ANTIGAS (OPCIONAL)
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Remove sessões fechadas com mais de 30 dias
    DELETE FROM chat_sessions 
    WHERE status = 'closed' 
    AND updated_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 10. DADOS DE EXEMPLO (OPCIONAL - REMOVER EM PRODUÇÃO)
-- =====================================================
-- Inserir algumas sessões de exemplo
INSERT INTO chat_sessions (user_name, user_email, user_phone, user_company, inquiry_type, status) VALUES
('João Silva', 'joao@email.com', '(11) 99999-9999', 'Empresa ABC', 'web-development', 'active'),
('Maria Santos', 'maria@empresa.com', '(11) 88888-8888', 'Tech Corp', 'seo-services', 'pending'),
('Pedro Costa', 'pedro@startup.com', '(11) 77777-7777', 'StartupXYZ', 'digital-marketing', 'resolved')
ON CONFLICT DO NOTHING;

-- Inserir algumas mensagens de exemplo
INSERT INTO chat_messages (session_id, user_name, user_email, message, is_user, is_read, metadata) 
SELECT 
    s.id,
    s.user_name,
    s.user_email,
    'Olá, preciso de ajuda com meu projeto.',
    true,
    true,
    '{}'::jsonb
FROM chat_sessions s
WHERE s.user_name = 'João Silva'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO chat_messages (session_id, user_name, user_email, message, is_user, is_read, metadata)
SELECT 
    s.id,
    'DevTone Support',
    'support@devtone.agency',
    'Olá! Como posso ajudá-lo hoje?',
    false,
    true,
    '{"agent_name": "DevTone Support", "message_type": "response"}'::jsonb
FROM chat_sessions s
WHERE s.user_name = 'João Silva'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 11. VERIFICAÇÕES FINAIS
-- =====================================================
-- Verificar se as tabelas foram criadas
SELECT 'chat_sessions' as table_name, COUNT(*) as records FROM chat_sessions
UNION ALL
SELECT 'chat_messages' as table_name, COUNT(*) as records FROM chat_messages;

-- Verificar se a view funciona
SELECT * FROM chat_sessions_with_counts LIMIT 5;

-- 12. CONFIGURAÇÕES ADICIONAIS RECOMENDADAS
-- =====================================================
-- Configurar timezone (se necessário)
-- SET timezone = 'America/Sao_Paulo';

-- Configurar parâmetros de performance (se necessário)
-- ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- 13. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================
COMMENT ON TABLE chat_sessions IS 'Tabela principal de sessões de chat com clientes';
COMMENT ON TABLE chat_messages IS 'Tabela de mensagens individuais de cada sessão';
COMMENT ON COLUMN chat_sessions.status IS 'Status: pending, active, resolved, closed';
COMMENT ON COLUMN chat_messages.metadata IS 'Dados adicionais em JSON (tipo de mensagem, arquivos, etc.)';
COMMENT ON VIEW chat_sessions_with_counts IS 'View otimizada com contadores de mensagens';

-- =====================================================
-- CONFIGURAÇÕES REAL-TIME (IMPORTANTE!)
-- =====================================================
-- No painel do Supabase, vá em Database > Replication
-- e habilite Real-time para as seguintes tabelas:
--
-- ✅ chat_sessions (INSERT, UPDATE, DELETE)
-- ✅ chat_messages (INSERT, UPDATE, DELETE)
--
-- Ou execute via SQL:
-- ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- =====================================================
-- CONFIGURAÇÕES DE STORAGE (PARA ARQUIVOS)
-- =====================================================
-- Se quiser usar Supabase Storage para arquivos (opcional):
--
-- 1. Vá em Storage no painel do Supabase
-- 2. Crie um bucket chamado 'chat-attachments'
-- 3. Configure as políticas de acesso
--
-- Ou use o sistema base64 atual que já está funcionando

-- =====================================================
-- CONFIGURAÇÕES DE AUTENTICAÇÃO
-- =====================================================
-- O sistema atual usa autenticação simples por senha
-- Para produção, considere implementar:
--
-- 1. Autenticação JWT para o dashboard
-- 2. Rate limiting para o chat
-- 3. Validação de email para clientes

-- =====================================================
-- MONITORAMENTO E MANUTENÇÃO
-- =====================================================
-- Queries úteis para monitoramento:

-- Ver sessões ativas
-- SELECT * FROM chat_sessions WHERE status IN ('active', 'pending') ORDER BY updated_at DESC;

-- Ver mensagens não lidas
-- SELECT s.user_name, COUNT(*) as unread
-- FROM chat_sessions s
-- JOIN chat_messages m ON s.id = m.session_id
-- WHERE m.is_user = true AND m.is_read = false
-- GROUP BY s.id, s.user_name;

-- Limpar sessões antigas (executar periodicamente)
-- SELECT cleanup_old_sessions();

-- Estatísticas do sistema
-- SELECT * FROM get_chat_stats();

-- =====================================================
-- BACKUP E SEGURANÇA
-- =====================================================
-- Recomendações para produção:
--
-- 1. Configure backups automáticos no Supabase
-- 2. Monitore o uso de storage
-- 3. Configure alertas para volume de mensagens
-- 4. Implemente rate limiting
-- 5. Configure logs de auditoria

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================
SELECT 'Schema do chat atualizado com sucesso!' as status,
       NOW() as timestamp,
       'Todas as tabelas, índices, funções e políticas foram criadas.' as details,
       'Não esqueça de habilitar Real-time para as tabelas!' as importante;
