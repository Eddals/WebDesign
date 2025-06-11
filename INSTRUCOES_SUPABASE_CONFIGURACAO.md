# 🚀 Instruções de Configuração do Supabase

## 📋 **PASSO A PASSO COMPLETO**

### **1. Executar o Script SQL Principal**
1. **Acesse** o painel do Supabase
2. **Vá em** `Database` → `SQL Editor`
3. **Cole** todo o conteúdo do arquivo `SUPABASE_SCHEMA_ATUALIZADO_FINAL.sql`
4. **Execute** o script (botão Run)
5. **Verifique** se não há erros

### **2. Habilitar Real-time (OBRIGATÓRIO)**
1. **Vá em** `Database` → `Replication`
2. **Encontre** a tabela `chat_sessions`
3. **Clique** no toggle para habilitar
4. **Marque** todas as opções: `INSERT`, `UPDATE`, `DELETE`
5. **Repita** para a tabela `chat_messages`

**Ou execute via SQL:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
```

### **3. Configurar Políticas RLS (Já incluído no script)**
✅ **Políticas criadas** automaticamente pelo script
✅ **Permissões** configuradas para acesso total
✅ **Segurança** básica implementada

### **4. Verificar Configurações**
Execute estas queries para verificar:

```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'chat_%';

-- Verificar Real-time
SELECT schemaname, tablename FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Testar view
SELECT * FROM chat_sessions_with_counts LIMIT 5;

-- Testar função de stats
SELECT * FROM get_chat_stats();
```

## 🔧 **CONFIGURAÇÕES ESPECÍFICAS**

### **Status da Sessão Atualizado:**
```sql
-- Novos status possíveis:
-- 'pending'  - Aguardando primeira resposta
-- 'active'   - Conversa ativa
-- 'resolved' - Marcada como resolvida
-- 'closed'   - Oculta do dashboard (dados preservados)
```

### **Metadata das Mensagens:**
```sql
-- Exemplos de metadata JSONB:
-- Mensagem normal: {}
-- Mensagem de sistema: {"message_type": "system_resolved", "agent_name": "Support"}
-- Arquivo: {"message_type": "file", "file_name": "doc.pdf", "file_data": "base64..."}
```

### **Índices para Performance:**
✅ **Status** das sessões
✅ **Data de criação** e atualização
✅ **Session ID** nas mensagens
✅ **Status de leitura** das mensagens

## 📊 **MONITORAMENTO**

### **Queries Úteis:**

**Ver sessões ativas:**
```sql
SELECT user_name, user_email, status, created_at 
FROM chat_sessions 
WHERE status IN ('active', 'pending') 
ORDER BY updated_at DESC;
```

**Contar mensagens não lidas:**
```sql
SELECT s.user_name, COUNT(*) as unread_count
FROM chat_sessions s 
JOIN chat_messages m ON s.id = m.session_id 
WHERE m.is_user = true AND m.is_read = false 
GROUP BY s.id, s.user_name;
```

**Estatísticas gerais:**
```sql
SELECT * FROM get_chat_stats();
```

**Limpar sessões antigas:**
```sql
SELECT cleanup_old_sessions(); -- Remove sessões fechadas > 30 dias
```

## 🔒 **SEGURANÇA E PRODUÇÃO**

### **Configurações Recomendadas:**

**1. Environment Variables (.env):**
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

**2. Rate Limiting (Supabase Dashboard):**
- **Vá em** `Settings` → `API`
- **Configure** limites de requisições
- **Monitore** uso da API

**3. Backup Automático:**
- **Vá em** `Settings` → `Database`
- **Configure** backups automáticos
- **Defina** retenção de dados

**4. Monitoramento:**
- **Vá em** `Logs` → `Database`
- **Configure** alertas para erros
- **Monitore** performance

## 🎯 **FUNCIONALIDADES IMPLEMENTADAS**

### **✅ Sistema Completo:**
- **Chat em tempo real** bidirecional
- **Persistência** de sessões (24h)
- **Typing indicators** sincronizados
- **Envio de arquivos** (base64)
- **Status inteligente** das conversas
- **Dashboard profissional**
- **Filtros avançados**
- **Botões de ação** (Resolved/Not Resolved/Close)

### **✅ Real-time Sincronizado:**
- **Mensagens** aparecem instantaneamente
- **Status** atualiza automaticamente
- **Contadores** em tempo real
- **Typing indicators** bidirecionais

### **✅ Dados Preservados:**
- **Histórico completo** mantido
- **Arquivos** armazenados em base64
- **Metadata** rica para auditoria
- **Limpeza** opcional de dados antigos

## 🚨 **IMPORTANTE - CHECKLIST FINAL**

### **Antes de usar em produção:**

- [ ] **Script SQL** executado com sucesso
- [ ] **Real-time** habilitado para ambas as tabelas
- [ ] **Políticas RLS** funcionando
- [ ] **Environment variables** configuradas
- [ ] **Backup** automático ativado
- [ ] **Rate limiting** configurado
- [ ] **Monitoramento** ativo

### **Teste o sistema:**

- [ ] **Cliente** consegue iniciar chat
- [ ] **Mensagens** aparecem em tempo real
- [ ] **Dashboard** mostra conversas
- [ ] **Botões** funcionam corretamente
- [ ] **Arquivos** podem ser enviados
- [ ] **Status** atualiza automaticamente

## 📞 **INFORMAÇÕES DO SISTEMA**

### **Acesso ao Dashboard:**
- **URL:** `/chat-dashboard`
- **Senha:** `devtone2024`
- **Horário:** Segunda-Sexta, 12h-18h

### **Funcionalidades:**
- **Chat Widget:** Circular, responsivo
- **Dashboard:** Tela inteira, profissional
- **Arquivos:** Suporte a imagens, PDFs, docs
- **Status:** Pending → Active → Resolved → Closed

### **Performance:**
- **Real-time:** Supabase Broadcast + Postgres Changes
- **Storage:** Base64 no banco (até 5MB por arquivo)
- **Sincronização:** Automática, sem refresh necessário

## 🎉 **SISTEMA PRONTO PARA PRODUÇÃO!**

Após seguir todas essas instruções, o sistema estará:

- ✅ **Completamente funcional**
- ✅ **Sincronizado em tempo real**
- ✅ **Seguro e monitorado**
- ✅ **Pronto para clientes reais**

**Status:** 🚀 **PRONTO PARA DEPLOY**
