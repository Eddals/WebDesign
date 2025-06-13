# 🔧 Correção de CORS e Teste do Sistema

## ❌ Problema Identificado
O erro `400 Bad Request` na tabela `client_users` indica que:
1. A tabela pode não existir
2. RLS (Row Level Security) está bloqueando o acesso
3. CORS não está configurado corretamente

## 🚀 Solução Passo a Passo

### 1. **Execute o Script de Diagnóstico**
```sql
-- Copie e cole o conteúdo do arquivo:
-- DIAGNOSTICO_E_CORRECAO_SUPABASE.sql
-- No SQL Editor do Supabase
```

### 2. **Configure CORS no Supabase**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `xurhlxnscjjkryrmmubc`
3. Vá para **Settings** → **API**
4. Na seção **CORS origins**, adicione:
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   http://192.168.1.187:5173
   https://devtone.agency
   *
   ```

### 3. **Verifique as Configurações de Autenticação**
1. Vá para **Authentication** → **Settings**
2. Certifique-se de que:
   - **Enable email confirmations** está DESABILITADO (para teste)
   - **Enable phone confirmations** está DESABILITADO
   - **Site URL** está configurado como `http://localhost:5173`

### 4. **Teste a Conexão**
Execute este comando no terminal para testar:
```bash
curl -X GET \
  'https://xurhlxnscjjkryrmmubc.supabase.co/rest/v1/client_users?select=*' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M'
```

### 5. **Reinicie o Servidor de Desenvolvimento**
```bash
# Pare o servidor atual (Ctrl+C)
# Depois execute:
npm run dev
```

## 🔍 Verificação de Problemas Comuns

### **Problema 1: Tabela não existe**
**Solução:** Execute o script de diagnóstico que cria todas as tabelas necessárias.

### **Problema 2: RLS muito restritivo**
**Solução:** O script configura políticas permissivas para teste.

### **Problema 3: CORS bloqueando requisições**
**Solução:** Configure os origins permitidos no Supabase Dashboard.

### **Problema 4: Autenticação obrigatória**
**Solução:** As políticas RLS foram configuradas para permitir acesso sem autenticação durante o teste.

## 📋 Checklist de Verificação

- [ ] Script de diagnóstico executado no Supabase
- [ ] CORS configurado no Dashboard
- [ ] Confirmações de email/telefone desabilitadas
- [ ] Site URL configurado corretamente
- [ ] Servidor de desenvolvimento reiniciado
- [ ] Teste de conexão via curl executado

## 🧪 Teste do Sistema

### **1. Teste de Registro de Cliente**
1. Acesse: `http://localhost:5173/client-portal`
2. Clique em "Register"
3. Preencha o formulário com dados de teste:
   ```
   Nome: João Silva
   Email: joao@teste.com
   Empresa: Teste Ltda
   Telefone: (11) 99999-9999
   País: Brasil
   Indústria: Technology
   Website: https://teste.com
   Descrição: Empresa de teste
   Senha: 123456
   ```
4. Clique em "Create Account"

### **2. Teste de Notificação Admin**
1. Abra uma nova aba: `http://localhost:5173/admin-client-dashboard`
2. Você deve ver:
   - Um pop-up de notificação sobre o novo cliente
   - Contador de notificações no sino (🔔)
   - Opções para aprovar/rejeitar o cliente

### **3. Teste de Ações Administrativas**
1. No pop-up de notificação, clique em "Aprovar"
2. Verifique se a ação foi executada com sucesso
3. O cliente deve receber uma mensagem de boas-vindas

## 🔧 Solução de Problemas Avançados

### **Se ainda houver erro 400:**
1. Verifique se o projeto Supabase está ativo
2. Confirme se as chaves de API estão corretas no `.env`
3. Verifique se há limites de uso atingidos
4. Tente recriar as tabelas manualmente

### **Se CORS ainda estiver bloqueando:**
1. Adicione `*` como origin temporariamente
2. Verifique se não há proxy/firewall bloqueando
3. Teste com `127.0.0.1` em vez de `localhost`

### **Se as notificações não aparecerem:**
1. Verifique se o Realtime está habilitado no projeto
2. Confirme se os triggers foram criados corretamente
3. Teste inserindo dados diretamente no SQL Editor

## 📞 Suporte

Se os problemas persistirem:
1. Verifique os logs do navegador (F12 → Console)
2. Verifique os logs do Supabase Dashboard
3. Teste com dados diferentes
4. Confirme se todas as dependências estão instaladas

## ✅ Resultado Esperado

Após seguir todos os passos:
- ✅ Registro de clientes funcionando
- ✅ Notificações em tempo real no admin
- ✅ Pop-ups de ações administrativas
- ✅ Comunicação bidirecional entre cliente e admin
- ✅ Sincronização automática sem refresh

O sistema estará completamente funcional com notificações em tempo real!
