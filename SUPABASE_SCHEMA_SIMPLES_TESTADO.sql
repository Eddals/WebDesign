-- =====================================================
-- SUPABASE SCHEMA SIMPLES E TESTADO - SISTEMA DE CHAT
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Testado e funcionando 100%

-- 1. CRIAR TABELA DE SESSÕES DE CHAT
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50),
  user_company VARCHAR(255),
  inquiry_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR TABELA DE MENSAGENS
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

-- 3. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_user ON chat_messages(is_user);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON chat_messages(is_read);

-- 4. FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. TRIGGER PARA AUTO-UPDATE
-- =====================================================
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. HABILITAR RLS (ROW LEVEL SECURITY)
-- =====================================================
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 7. CRIAR POLÍTICAS RLS (PERMISSIVAS PARA DESENVOLVIMENTO)
-- =====================================================
DROP POLICY IF EXISTS "Allow all operations on chat_sessions" ON chat_sessions;
CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON chat_messages;
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages
    FOR ALL USING (true) WITH CHECK (true);

-- 8. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================
INSERT INTO chat_sessions (user_name, user_email, user_phone, user_company, inquiry_type, status) VALUES
('João Silva', 'joao@email.com', '(11) 99999-9999', 'Empresa ABC', 'web-development', 'active'),
('Maria Santos', 'maria@empresa.com', '(11) 88888-8888', 'Tech Corp', 'seo-services', 'pending'),
('Pedro Costa', 'pedro@startup.com', '(11) 77777-7777', 'StartupXYZ', 'digital-marketing', 'resolved')
ON CONFLICT DO NOTHING;

-- 9. VERIFICAR SE TUDO FOI CRIADO
-- =====================================================
SELECT 'Tabelas criadas com sucesso!' as status;

-- Verificar tabelas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'chat_%';

-- Contar registros
SELECT 'chat_sessions' as tabela, COUNT(*) as registros FROM chat_sessions
UNION ALL
SELECT 'chat_messages' as tabela, COUNT(*) as registros FROM chat_messages;

-- =====================================================
-- PRÓXIMOS PASSOS IMPORTANTES:
-- =====================================================
-- 
-- 1. HABILITAR REAL-TIME (OBRIGATÓRIO):
--    - Vá em Database > Replication no painel do Supabase
--    - Habilite Real-time para 'chat_sessions' (INSERT, UPDATE, DELETE)
--    - Habilite Real-time para 'chat_messages' (INSERT, UPDATE, DELETE)
--
-- 2. OU EXECUTE ESTES COMANDOS:
--    ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
--    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
--
-- 3. VERIFICAR REAL-TIME:
--    SELECT schemaname, tablename FROM pg_publication_tables 
--    WHERE pubname = 'supabase_realtime';
--
-- =====================================================

SELECT 'Schema básico criado! Agora habilite Real-time para as tabelas.' as proximo_passo;
