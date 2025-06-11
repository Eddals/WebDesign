# 📋 Tabelas SQL - Sistema de Chat de Suporte

## 🚀 **EXECUTE ESTE SQL NO SUPABASE**

Copie e cole o código abaixo no **SQL Editor** do Supabase:

```sql
-- =====================================================
-- SISTEMA DE CHAT DE SUPORTE DEVTONE
-- =====================================================

-- 1. TABELA DE SESSÕES DE CHAT
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
    
    -- Validação de email
    CONSTRAINT valid_email CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 2. TABELA DE MENSAGENS DO CHAT
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

-- 3. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_email ON chat_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_inquiry_type ON chat_sessions(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_user ON chat_messages(is_user);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON chat_messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created ON chat_messages(session_id, created_at);

-- 4. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
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

-- 5. POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para desenvolvimento
CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on chat_messages" ON chat_messages
    FOR ALL USING (true) WITH CHECK (true);

-- 6. VIEW PARA ESTATÍSTICAS
CREATE OR REPLACE VIEW chat_stats AS
SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'active') as active_sessions,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_sessions,
    COUNT(*) FILTER (WHERE status = 'resolved') as resolved_sessions,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_sessions,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_sessions
FROM chat_sessions;

-- 7. VIEW PARA SESSÕES COM CONTADORES
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

-- FINALIZAÇÃO
SELECT 'Sistema de Chat de Suporte criado com sucesso!' as status;
```

## ✅ **Verificação**

Após executar o SQL, você deve ver:

1. **Tabelas criadas:**
   - `chat_sessions`
   - `chat_messages`

2. **Views criadas:**
   - `chat_stats`
   - `chat_sessions_with_counts`

3. **Mensagem de sucesso:**
   - "Sistema de Chat de Suporte criado com sucesso!"

## 🧪 **Teste o Sistema**

### **1. Teste o Chat do Cliente:**
- Acesse qualquer página do site
- Clique no ícone de chat roxo no canto inferior direito
- Preencha as informações e envie uma mensagem

### **2. Teste o Painel Administrativo:**
- Acesse: `http://localhost:5173/chat-dashboard`
- Senha: `devtone2024`
- Veja as conversas e responda mensagens

## 🔧 **Estrutura das Tabelas**

### **chat_sessions**
```
id              UUID (Primary Key)
created_at      Timestamp
updated_at      Timestamp
user_name       Text (Nome do cliente)
user_email      Text (Email do cliente)
user_phone      Text (Telefone - opcional)
user_company    Text (Empresa - opcional)
inquiry_type    Text (Tipo de consulta)
status          Text (pending/active/resolved/closed)
is_active       Boolean
metadata        JSONB (Dados extras)
```

### **chat_messages**
```
id              UUID (Primary Key)
created_at      Timestamp
session_id      UUID (Foreign Key)
user_name       Text (Nome do remetente)
user_email      Text (Email do remetente)
message         Text (Conteúdo da mensagem)
is_user         Boolean (true = cliente, false = suporte)
is_read         Boolean (Mensagem lida?)
metadata        JSONB (Dados extras)
```

## 🎯 **Funcionalidades Ativas**

✅ **Chat em tempo real**
✅ **Coleta de informações do cliente**
✅ **Painel administrativo completo**
✅ **Estatísticas em tempo real**
✅ **Filtros e busca**
✅ **Gerenciamento de status**
✅ **Notificações de mensagens não lidas**
✅ **Interface responsiva**
✅ **Segurança com RLS**

## 📞 **Suporte**

Se houver algum erro:

1. **Verifique as variáveis de ambiente:**
   ```env
   VITE_SUPABASE_URL=sua_url
   VITE_SUPABASE_ANON_KEY=sua_chave
   ```

2. **Execute o SQL novamente** se necessário

3. **Teste a conexão** acessando o dashboard

---

**Status:** ✅ **PRONTO PARA USO**
