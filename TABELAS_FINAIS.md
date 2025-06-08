# Estruturas das Tabelas - Banco de Dados

## Tabela: `quotes` (Orçamentos/Estimativas)

Esta tabela armazena todas as solicitações de orçamento da página **Estimate**.

```sql
CREATE TABLE public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Informações de Contato
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    business_name TEXT,
    company TEXT,
    
    -- Detalhes do Projeto
    project_type TEXT,              -- Tipo de projeto (website, app, etc.)
    website_goal TEXT,              -- Objetivo do website
    description TEXT,               -- Descrição detalhada do projeto
    budget_range TEXT,              -- Faixa de orçamento selecionada
    timeline TEXT,                  -- Prazo desejado
    pages_needed TEXT,              -- Número de páginas necessárias
    domain_hosting_status TEXT,     -- Status de domínio/hospedagem
    
    -- Pacotes e Pagamento
    selected_package TEXT,          -- Pacote selecionado
    payment_model TEXT,             -- Modelo de pagamento (one-time/subscription)
    subscription_plan TEXT,         -- Plano de assinatura (se aplicável)
    
    -- Controle Interno
    status TEXT DEFAULT 'pending',  -- Status do orçamento
    notes TEXT,                     -- Notas internas
    estimated_budget NUMERIC(10,2)  -- Orçamento estimado calculado
);
```

### Campos Principais:
- **Contato**: `full_name`, `email`, `phone`, `business_name`, `company`
- **Projeto**: `project_type`, `website_goal`, `description`, `budget_range`, `timeline`
- **Pacotes**: `selected_package`, `payment_model`, `subscription_plan`
- **Controle**: `status`, `notes`, `estimated_budget`

---

## Tabela: `contacts` (Contatos/Mensagens)

Esta tabela armazena todas as mensagens da página **Contact**.

```sql
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Informações de Contato
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    
    -- Detalhes do Contato
    contact_reason TEXT,            -- Motivo do contato
    project_type TEXT,              -- Tipo de projeto (se aplicável)
    budget TEXT,                    -- Orçamento disponível
    timeline TEXT,                  -- Prazo desejado
    message TEXT NOT NULL,          -- Mensagem principal
    subject TEXT,                   -- Assunto da mensagem
    
    -- Preferências
    preferred_contact TEXT DEFAULT 'email', -- Forma preferida de contato
    
    -- Controle Interno
    status TEXT DEFAULT 'new',      -- Status da mensagem (new, read, replied, closed)
    is_urgent BOOLEAN DEFAULT FALSE, -- Marcador de urgência
    priority INTEGER DEFAULT 1      -- Prioridade (1-5)
);
```

### Campos Principais:
- **Contato**: `full_name`, `email`, `phone`, `company`
- **Mensagem**: `contact_reason`, `message`, `subject`, `preferred_contact`
- **Projeto**: `project_type`, `budget`, `timeline`
- **Controle**: `status`, `is_urgent`, `priority`

---

## Permissões Configuradas

Ambas as tabelas estão configuradas com:
- ✅ **RLS Desabilitado** - Permite inserções anônimas
- ✅ **Permissões para `anon`** - Usuários não autenticados podem inserir
- ✅ **Permissões para `authenticated`** - Usuários autenticados têm acesso completo

---

## Como Usar

### 1. Execute o SQL
Copie e cole o conteúdo do arquivo `EXECUTE_THIS_NOW.sql` no SQL Editor do Supabase.

### 2. Verifique as Tabelas
Após executar, você verá as tabelas criadas na aba "Table Editor" do Supabase.

### 3. Teste os Formulários
- **Contact**: http://localhost:5173/contact
- **Estimate**: http://localhost:5173/estimate

### 4. Visualize os Dados
Acesse as tabelas no painel do Supabase para ver os dados enviados pelos formulários.

---

## Índices Criados

Para melhor performance:
- `idx_quotes_email` - Busca por email em orçamentos
- `idx_quotes_created_at` - Ordenação por data
- `idx_contacts_email` - Busca por email em contatos
- `idx_contacts_created_at` - Ordenação por data

---

## Backup dos Dados

Se você estava usando localStorage como fallback, os dados ficam salvos em:
- `localStorage.getItem('fallback_contacts')`
- `localStorage.getItem('fallback_quotes')`

Você pode exportar esses dados e importar para o Supabase depois que as tabelas estiverem funcionando.