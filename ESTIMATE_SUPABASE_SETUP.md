# 🚀 Configuração do Sistema Estimate + Supabase + Brevo

## 📋 Resumo do Fluxo
1. **Formulário Estimate** → Salva dados no **Supabase**
2. **Trigger Supabase** → Chama **Edge Function**
3. **Edge Function** → Envia dados para **Brevo**
4. **Brevo** → Envia email de confirmação + notificação admin

## 🔧 Passo 1: Configurar Supabase

### 1.1 Executar SQL no Supabase
Copie e execute o conteúdo do arquivo `estimate-table-supabase.sql` no **SQL Editor** do seu projeto Supabase.

### 1.2 Configurar Edge Function
1. No Supabase Dashboard, vá para **Edge Functions**
2. Crie uma nova função chamada `send-estimate-to-brevo`
3. Cole o código do arquivo `supabase/functions/send-estimate-to-brevo/index.ts`
4. Configure as variáveis de ambiente:
   - `BREVO_API_KEY`: Sua chave API do Brevo
   - `ADMIN_EMAIL`: Email para notificações admin

### 1.3 Configurar RLS Policies
As políticas já estão incluídas no SQL, mas verifique se estão ativas:
- ✅ Inserção pública (formulário)
- ✅ Leitura apenas para autenticados (admin)
- ✅ Atualização apenas para autenticados (admin)

## 🔧 Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://olblavscnardvgpgeqdk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYmxhdnNjbmFyZHZncGdlcWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTA2NTYsImV4cCI6MjA2Nzg2NjY1Nn0.PG3aZtT4y5AQcZ4HNt6cbeibyQW26gvYC674-wVGPds

# Brevo Configuration (for Edge Functions)
BREVO_API_KEY=sua_chave_api_brevo_aqui
ADMIN_EMAIL=admin@devtone.agency
```

## 🔧 Passo 3: Configurar Brevo

### 3.1 Criar Lista no Brevo
1. Acesse o Brevo Dashboard
2. Vá para **Contacts** → **Lists**
3. Crie uma nova lista chamada "Estimate Requests"
4. Anote o **ID da lista** (usado na Edge Function)

### 3.2 Configurar Atributos Customizados
No Brevo, vá para **Contacts** → **Attributes** e crie os seguintes atributos:

| Nome | Tipo | Descrição |
|------|------|-----------|
| `FIRSTNAME` | Text | Nome do cliente |
| `LASTNAME` | Text | Sobrenome do cliente |
| `COMPANY` | Text | Nome da empresa |
| `INDUSTRY` | Text | Setor/indústria |
| `PROJECT_TYPE` | Text | Tipo de projeto |
| `BUDGET` | Text | Faixa de orçamento |
| `TIMELINE` | Text | Prazo desejado |
| `DESCRIPTION` | Text | Descrição do projeto |
| `FEATURES` | Text | Features selecionadas |
| `RETAINER` | Text | Tipo de retainer |
| `SOURCE` | Text | Origem da solicitação |
| `ESTIMATE_DATE` | Date | Data da solicitação |

### 3.3 Configurar Email Templates
1. Crie um template de confirmação para o cliente
2. Crie um template de notificação para o admin
3. Use os atributos customizados nos templates

## 🔧 Passo 4: Testar o Sistema

### 4.1 Teste Local
1. Execute `npm run dev`
2. Acesse `/estimate`
3. Preencha o formulário
4. Verifique no Supabase se os dados foram salvos
5. Verifique no Brevo se o contato foi criado

### 4.2 Verificar Logs
- **Supabase**: Vá para **Logs** → **Edge Functions**
- **Brevo**: Vá para **Logs** → **API Calls**

## 🔧 Passo 5: Configurações Adicionais

### 5.1 Dashboard Admin
Para visualizar os estimates no dashboard:
```sql
-- Query para buscar estimates
SELECT 
  id,
  name,
  email,
  company,
  project_type,
  budget,
  timeline,
  status,
  created_at
FROM estimates 
ORDER BY created_at DESC;
```

### 5.2 Notificações em Tempo Real
O sistema já está configurado para notificações em tempo real via Supabase Realtime.

## 🚨 Troubleshooting

### Problema: Edge Function não executa
**Solução:**
1. Verifique se a extensão `http` está habilitada
2. Verifique as variáveis de ambiente da Edge Function
3. Verifique os logs da Edge Function

### Problema: Dados não chegam ao Brevo
**Solução:**
1. Verifique a chave API do Brevo
2. Verifique se o ID da lista está correto
3. Verifique se os atributos customizados existem

### Problema: Formulário não salva no Supabase
**Solução:**
1. Verifique as credenciais do Supabase
2. Verifique as políticas RLS
3. Verifique se a tabela `estimates` existe

## 📊 Estrutura da Tabela Estimates

```sql
CREATE TABLE estimates (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    industry VARCHAR(255),
    project_type VARCHAR(100) NOT NULL,
    budget VARCHAR(100) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    description TEXT,
    features TEXT[],
    retainer VARCHAR(100) DEFAULT 'none',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending',
    estimated_value DECIMAL(10,2),
    notes TEXT,
    source VARCHAR(100) DEFAULT 'website_form',
    ip_address INET,
    user_agent TEXT
);
```

## 🎯 Próximos Passos

1. ✅ Configurar Supabase
2. ✅ Configurar Edge Function
3. ✅ Configurar Brevo
4. ✅ Testar sistema
5. 🔄 Implementar dashboard admin
6. 🔄 Adicionar analytics
7. 🔄 Implementar follow-up automático

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Verifique os logs do Brevo
3. Teste a Edge Function isoladamente
4. Verifique as configurações de CORS 