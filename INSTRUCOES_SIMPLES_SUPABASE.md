# 🚀 Instruções Simples - Supabase Setup

## ⚡ **PASSO A PASSO RÁPIDO**

### **1. Execute o Schema Básico**
1. **Abra** o Supabase Dashboard
2. **Vá em** `Database` → `SQL Editor`
3. **Cole** o arquivo `SUPABASE_SCHEMA_SIMPLES_TESTADO.sql`
4. **Clique** em `Run`
5. **Verifique** se apareceu "Tabelas criadas com sucesso!"

### **2. Habilite Real-time (OBRIGATÓRIO)**
1. **Vá em** `Database` → `Replication`
2. **Encontre** `chat_sessions` → **Clique no toggle**
3. **Marque** `INSERT`, `UPDATE`, `DELETE`
4. **Encontre** `chat_messages` → **Clique no toggle**
5. **Marque** `INSERT`, `UPDATE`, `DELETE`

### **3. Teste se Funcionou**
Execute esta query no SQL Editor:
```sql
SELECT * FROM chat_sessions;
```
Se mostrar dados, está funcionando!

### **4. (Opcional) Funcionalidades Avançadas**
Se quiser estatísticas e views:
1. **Execute** o arquivo `SUPABASE_FUNCIONALIDADES_AVANCADAS.sql`
2. **Teste** com: `SELECT * FROM get_chat_stats();`

## 🔧 **Se Der Erro**

### **Erro: "function does not exist"**
- **Ignore** e continue
- **Execute** apenas o schema básico primeiro
- **Funcionalidades avançadas** são opcionais

### **Erro: "table already exists"**
- **Normal** se executar novamente
- **Continue** normalmente

### **Erro: "permission denied"**
- **Verifique** se está no projeto correto
- **Tente** recarregar a página

## ✅ **Verificação Final**

### **Teste estas queries:**
```sql
-- Ver tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'chat_%';

-- Ver dados de exemplo
SELECT user_name, status FROM chat_sessions;

-- Verificar Real-time
SELECT tablename FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

### **Deve mostrar:**
- ✅ `chat_sessions` e `chat_messages` nas tabelas
- ✅ Dados de exemplo (João, Maria, Pedro)
- ✅ Ambas as tabelas no Real-time

## 🎯 **Configuração do Projeto**

### **Environment Variables (.env):**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```

### **Onde encontrar:**
1. **Supabase Dashboard** → `Settings` → `API`
2. **Copie** a URL do projeto
3. **Copie** a chave `anon/public`

## 🚨 **IMPORTANTE**

### **Real-time é OBRIGATÓRIO:**
- **Sem Real-time** = Chat não funciona em tempo real
- **Com Real-time** = Mensagens aparecem instantaneamente

### **Status das Conversas:**
- `pending` - Nova conversa
- `active` - Conversa ativa
- `resolved` - Marcada como resolvida
- `closed` - Oculta do dashboard

### **Metadata das Mensagens:**
- **Mensagem normal:** `{}`
- **Arquivo:** `{"message_type": "file", "file_name": "doc.pdf"}`
- **Sistema:** `{"message_type": "system_resolved"}`

## 🎉 **Pronto!**

Após seguir esses passos:
- ✅ **Chat** funcionará em tempo real
- ✅ **Dashboard** mostrará conversas
- ✅ **Arquivos** poderão ser enviados
- ✅ **Status** atualizará automaticamente

## 🔍 **Troubleshooting**

### **Chat não atualiza em tempo real:**
- **Verifique** se Real-time está habilitado
- **Recarregue** a página
- **Teste** em aba anônima

### **Dashboard não mostra conversas:**
- **Execute** `SELECT * FROM chat_sessions;`
- **Verifique** se há dados
- **Teste** criar nova conversa

### **Erro 401/403:**
- **Verifique** environment variables
- **Confirme** URL e chave do projeto
- **Teste** chaves no Postman

### **Performance lenta:**
- **Execute** funcionalidades avançadas
- **Índices** melhoram performance
- **Views** otimizam queries

## 📞 **Sistema Final**

### **Funcionalidades:**
- ✅ Chat em tempo real
- ✅ Envio de arquivos
- ✅ Dashboard profissional
- ✅ Botões de ação
- ✅ Filtros inteligentes
- ✅ Persistência de sessão

### **Acesso:**
- **Dashboard:** `/chat-dashboard`
- **Senha:** `devtone2024`
- **Horário:** 12h-18h, Seg-Sex

**Status:** 🚀 **PRONTO PARA USO!**
