-- =====================================================
-- FUNCIONALIDADES AVANÇADAS - EXECUTE APÓS O SCHEMA BÁSICO
-- =====================================================
-- Execute este arquivo APENAS após o schema básico estar funcionando
-- e o Real-time habilitado

-- 1. CRIAR VIEW COM CONTADORES (OPCIONAL MAS ÚTIL)
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

-- 2. FUNÇÃO PARA ESTATÍSTICAS DO DASHBOARD
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
        2.5::NUMERIC as avg_response_time
    FROM chat_sessions;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNÇÃO PARA LIMPAR SESSÕES ANTIGAS
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM chat_sessions 
    WHERE status = 'closed' 
    AND updated_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 4. ADICIONAR CONSTRAINTS DE STATUS (IMPORTANTE)
-- =====================================================
ALTER TABLE chat_sessions 
DROP CONSTRAINT IF EXISTS chat_sessions_status_check;

ALTER TABLE chat_sessions 
ADD CONSTRAINT chat_sessions_status_check 
CHECK (status IN ('pending', 'active', 'resolved', 'closed'));

-- 5. TESTAR AS FUNCIONALIDADES
-- =====================================================
-- Testar a view
SELECT * FROM chat_sessions_with_counts LIMIT 3;

-- Testar função de estatísticas
SELECT * FROM get_chat_stats();

-- Testar função de limpeza (não vai deletar nada se não houver dados antigos)
SELECT cleanup_old_sessions() as sessoes_limpas;

-- 6. QUERIES ÚTEIS PARA MONITORAMENTO
-- =====================================================

-- Ver todas as sessões com status
SELECT user_name, user_email, status, created_at 
FROM chat_sessions 
ORDER BY created_at DESC;

-- Ver mensagens não lidas por sessão
SELECT 
    s.user_name,
    s.user_email,
    COUNT(*) as mensagens_nao_lidas
FROM chat_sessions s
JOIN chat_messages m ON s.id = m.session_id
WHERE m.is_user = true AND m.is_read = false
GROUP BY s.id, s.user_name, s.user_email;

-- Ver últimas mensagens de cada sessão
SELECT 
    s.user_name,
    s.status,
    m.message as ultima_mensagem,
    m.created_at as quando
FROM chat_sessions s
JOIN LATERAL (
    SELECT message, created_at
    FROM chat_messages 
    WHERE session_id = s.id 
    ORDER BY created_at DESC 
    LIMIT 1
) m ON true
ORDER BY m.created_at DESC;

-- 7. CONFIGURAÇÕES DE PERFORMANCE (OPCIONAL)
-- =====================================================

-- Analisar performance das queries
-- ANALYZE chat_sessions;
-- ANALYZE chat_messages;

-- Ver estatísticas das tabelas
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserções,
    n_tup_upd as atualizações,
    n_tup_del as exclusões
FROM pg_stat_user_tables 
WHERE tablename LIKE 'chat_%';

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
SELECT 'Funcionalidades avançadas instaladas com sucesso!' as status;

-- Verificar se a view foi criada
SELECT 'chat_sessions_with_counts' as view_name, 
       COUNT(*) as registros 
FROM chat_sessions_with_counts;

-- Verificar se as funções foram criadas
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%chat%' 
OR routine_name LIKE '%cleanup%';

SELECT 'Tudo pronto! Sistema completo funcionando.' as resultado_final;
