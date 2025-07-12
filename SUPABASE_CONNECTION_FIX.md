# 🔧 Solução Rápida: Erro de Conexão Supabase

## 🚨 Problema Detectado
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
Supabase Error: TypeError: Failed to fetch
```

## 🔍 Diagnóstico Rápido

### 1. Execute o script de diagnóstico:
```bash
node debug-supabase-connection.js
```

### 2. Verifique no navegador:
- Abra o DevTools (F12)
- Vá para a aba Network
- Tente enviar o formulário
- Verifique se há erros de rede

## 🛠️ Soluções por Ordem de Prioridade

### Solução 1: Desabilitar RLS Temporariamente
Execute no Supabase SQL Editor:
```sql
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
```

### Solução 2: Verificar Configuração do Projeto
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Settings** → **API**
4. Verifique se as credenciais estão corretas

### Solução 3: Verificar Tabela
Execute no Supabase SQL Editor:
```sql
-- Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'contacts'
);

-- Se não existir, execute o SQL completo
-- Copie e cole o conteúdo de contacts-table-supabase.sql
```

### Solução 4: Verificar CORS
No Supabase Dashboard:
1. Vá para **Settings** → **API**
2. Em **CORS Origins**, adicione:
   - `http://localhost:5173` (desenvolvimento)
   - `http://localhost:3000` (desenvolvimento)
   - Seu domínio de produção

### Solução 5: Verificar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://olblavscnardvgpgeqdk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYmxhdnNjbmFyZHZncGdlcWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTA2NTYsImV4cCI6MjA2Nzg2NjY1Nn0.PG3aZtT4y5AQcZ4HNt6cbeibyQW26gvYC674-wVGPds
```

## 🔄 Sistema de Fallback Implementado

O formulário agora tem **sistema de fallback**:
- Tenta Supabase primeiro
- Se falhar, tenta Brevo diretamente
- Se ambos falharem, mostra erro específico

## 📋 Checklist de Verificação

- [ ] Tabela `contacts` existe no Supabase
- [ ] RLS está desabilitado ou configurado corretamente
- [ ] CORS está configurado
- [ ] Variáveis de ambiente estão definidas
- [ ] Projeto Supabase está ativo
- [ ] Chaves de API estão corretas

## 🚀 Teste Rápido

1. **Teste via script:**
   ```bash
   node test-contact-system.js
   ```

2. **Teste via frontend:**
   - Execute `npm run dev`
   - Acesse `/contact`
   - Preencha o formulário
   - Verifique o console do navegador

## 📞 Se Nada Funcionar

1. **Verifique a conectividade:**
   ```bash
   ping olblavscnardvgpgeqdk.supabase.co
   ```

2. **Teste via curl:**
   ```bash
   curl -I https://olblavscnardvgpgeqdk.supabase.co
   ```

3. **Verifique firewall/antivírus**

4. **Tente em modo incógnito**

---

**✅ O sistema de fallback garante que pelo menos o Brevo funcionará mesmo se o Supabase falhar!** 