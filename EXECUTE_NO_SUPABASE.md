# 🚀 EXECUTE NO SUPABASE SQL EDITOR

## ⚡ Configuração Rápida (5 minutos)

### 1️⃣ PRIMEIRO: Execute o Schema
```sql
-- Copie e cole todo o conteúdo do arquivo:
-- supabase-setup-1-schema.sql
```

### 2️⃣ SEGUNDO: Configure RLS
```sql
-- Copie e cole todo o conteúdo do arquivo:
-- supabase-setup-2-rls.sql
```

### 3️⃣ TERCEIRO: Configure Realtime
```sql
-- Copie e cole todo o conteúdo do arquivo:
-- supabase-setup-3-realtime.sql
```

### 4️⃣ QUARTO: Insira Dados de Exemplo
```sql
-- Copie e cole todo o conteúdo do arquivo:
-- supabase-setup-4-sample-data.sql
```

## 🔧 Configuração Manual do Supabase

### Authentication Settings
1. Vá para **Authentication** > **Settings**
2. **Site URL**: `http://localhost:5173`
3. **Redirect URLs**: `http://localhost:5173/client-portal`
4. Salve as configurações

### Storage Bucket (Já criado via SQL)
- ✅ Bucket `project-files` será criado automaticamente
- ✅ Políticas de segurança aplicadas
- ✅ Limite de 50MB por arquivo

### Realtime (Já configurado via SQL)
- ✅ Logical Replication habilitada
- ✅ Todas as tabelas no supabase_realtime
- ✅ Triggers de notificação criados

## 🎯 Teste o Sistema

### Acesse o Portal
```
http://localhost:5173/client-portal
```

### Crie uma Conta ou Use Dados de Exemplo
- **Email**: `john.doe@techstartup.com`
- **Email**: `sarah.wilson@retailco.com`
- **Senha**: Crie via registro (dados de exemplo não incluem senhas)

### Painéis Disponíveis
- **Cliente**: `/client-portal`
- **Admin**: `/admin-client-dashboard`
- **Suporte**: `/chat-dashboard`

## ✅ Verificação

Após executar todos os scripts, você deve ver:

```
✅ DevTone Client Dashboard - Realtime configurado com sucesso!
📡 Logical Replication habilitada para todas as tabelas
🔄 Triggers de notificação criados
📁 Storage bucket "project-files" configurado
🔐 Políticas de segurança aplicadas

📊 Resumo dos dados:
👥 Usuários: 3
🏢 Clientes: 2
📁 Projetos: 3
🎯 Marcos: 4
✅ Tarefas: 4
💬 Feedbacks: 3
📎 Arquivos: 3
💭 Comentários: 4

🚀 Sistema pronto para uso!
```

## 🔄 Funcionalidades Realtime

### ✅ Implementado
- **Logical Replication** automática
- **WebSocket** connections
- **Real-time** updates sem refresh
- **Polling** inteligente como fallback
- **Notificações** em tempo real

### 📡 Canais Realtime
- `project_changes` - Mudanças em projetos
- `comment_changes` - Novas mensagens
- `feedback_changes` - Atualizações de feedback

## 🛠️ Troubleshooting

### ❌ Erro: "relation does not exist"
**Solução**: Execute os scripts na ordem correta (1 → 2 → 3 → 4)

### ❌ Erro: "permission denied"
**Solução**: Certifique-se de estar logado como proprietário do projeto

### ❌ Realtime não funciona
**Solução**: Verifique se as tabelas estão na publicação:
```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

### ❌ Storage não funciona
**Solução**: Verifique se o bucket foi criado:
```sql
SELECT * FROM storage.buckets WHERE id = 'project-files';
```

## 🎨 Customização

### Cores do Sistema
Edite em `src/types/client-dashboard.ts`:
```typescript
export const STATUS_COLORS = {
  // Customize aqui
}
```

### Configurações de Upload
Edite limites no script 3:
```sql
file_size_limit: 52428800, -- 50MB
```

## 📞 Suporte

- **Email**: hello@devtone.agency
- **Documentação**: `CLIENT_DASHBOARD_SYSTEM.md`
- **Setup**: `SETUP_CLIENT_DASHBOARD.md`

---

**Sistema 100% funcional com Realtime! 🚀**
