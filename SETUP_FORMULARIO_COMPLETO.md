# 🗄️ Setup Completo do Formulário Get Estimate

## Resumo

Este setup cria **TODAS** as colunas necessárias no banco de dados para armazenar **TODOS** os campos do formulário Get Estimate, não apenas para notificações.

## ✅ O que será criado

### Estrutura Completa da Tabela `quotes`

#### **Informações Pessoais**
- `full_name` (TEXT, obrigatório) - Nome completo
- `email` (TEXT, obrigatório) - Email
- `phone` (TEXT, opcional) - Telefone
- `company` (TEXT, opcional) - Empresa
- `country` (TEXT, opcional) - País

#### **Detalhes do Projeto**
- `project_type` (TEXT) - Tipo do projeto
  - Valores: 'landing', 'portfolio', 'business', 'ecommerce', 'webapp'
- `budget_range` (TEXT) - Faixa de orçamento
  - Valores: 'starter', 'professional', 'premium', 'enterprise'
- `timeline` (TEXT) - Prazo
  - Valores: 'asap', '1month', '2months', 'flexible'
- `features` (JSONB) - Recursos selecionados
  - Array: ['seo', 'analytics', 'social', 'security', 'maintenance', 'training']
- `description` (TEXT) - Descrição do projeto

#### **Campos do Sistema**
- `status` (TEXT) - Status do orçamento
- `priority` (INTEGER) - Prioridade
- `assigned_to` (TEXT) - Responsável
- `notes` (TEXT) - Notas internas
- `estimated_cost` (DECIMAL) - Custo estimado
- `quoted_amount` (DECIMAL) - Valor cotado

## 🚀 Setup em 3 Passos

### Passo 1: Executar SQL no Supabase

1. Acesse seu **Supabase SQL Editor**
2. Copie e cole o conteúdo do arquivo `complete-estimate-form-database.sql`
3. Execute o script

### Passo 2: Testar a Integração

```bash
node scripts/test-complete-estimate-form.js
```

### Passo 3: Testar o Formulário

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:5173/estimate`
3. Preencha todos os campos
4. Envie o formulário
5. Verifique no Supabase se todos os dados foram salvos

## 📋 Campos do Formulário → Colunas do Banco

| Seção do Formulário | Campo | Coluna no Banco | Tipo |
|-------------------|-------|-----------------|------|
| **Informações Pessoais** | Nome Completo | `full_name` | TEXT |
| | Email | `email` | TEXT |
| | Telefone | `phone` | TEXT |
| | Empresa | `company` | TEXT |
| | País | `country` | TEXT |
| **Tipo de Projeto** | Seleção | `project_type` | TEXT |
| **Orçamento** | Faixa | `budget_range` | TEXT |
| **Prazo** | Timeline | `timeline` | TEXT |
| **Recursos** | Checkboxes | `features` | JSONB |
| **Descrição** | Texto livre | `description` | TEXT |

## 🎯 Exemplo de Dados Salvos

Quando alguém preenche o formulário:

```json
{
  "full_name": "João Silva",
  "email": "joao@empresa.com",
  "phone": "+55-11-99999-9999",
  "company": "Empresa XYZ",
  "country": "Brazil",
  "project_type": "ecommerce",
  "budget_range": "premium",
  "timeline": "2months",
  "features": ["seo", "analytics", "security"],
  "description": "Preciso de uma loja online completa...",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 🔍 Verificação

Após o setup, verifique se:

- [ ] Tabela `quotes` foi criada com todas as colunas
- [ ] Formulário envia dados sem erro
- [ ] Todos os campos aparecem no Supabase
- [ ] Notificações mostram dados reais
- [ ] Script de teste passa em todos os checks

## 📊 Views Criadas

### `estimate_summary`
- Visão geral de todos os orçamentos
- Inclui contagem de recursos
- Mostra tempo decorrido

### `recent_estimates_for_notifications`
- Dados específicos para notificações
- Apenas orçamentos pendentes
- Limitado aos 20 mais recentes

## 🛠️ Recursos Adicionais

### Índices para Performance
- `idx_quotes_created_at` - Ordenação por data
- `idx_quotes_status` - Filtro por status
- `idx_quotes_country` - Filtro por país
- `idx_quotes_project_type` - Filtro por tipo

### Triggers Automáticos
- `update_updated_at` - Atualiza timestamp automaticamente

### Campos de Sistema
- `priority` - Para organizar por importância
- `assigned_to` - Para atribuir responsável
- `notes` - Para anotações internas
- `estimated_cost` / `quoted_amount` - Para valores

## 🎉 Resultado Final

Após o setup completo:

✅ **Formulário completo** salva todos os dados
✅ **Notificações reais** baseadas em submissões
✅ **Estrutura profissional** para gerenciar orçamentos
✅ **Performance otimizada** com índices
✅ **Views prontas** para relatórios
✅ **Campos de sistema** para workflow interno

## 🔧 Troubleshooting

### Erro "column does not exist"
```sql
-- Execute no Supabase SQL Editor
-- Copie todo o conteúdo de complete-estimate-form-database.sql
```

### Formulário não salva
1. Verifique console do browser
2. Confirme credenciais no `.env`
3. Execute script de teste
4. Verifique permissões no Supabase

### Notificações não aparecem
1. Envie um orçamento de teste
2. Aguarde 5-15 segundos
3. Verifique se dados estão no banco
4. Confirme que `country` não está vazio

Seu formulário Get Estimate agora está **100% integrado** com o banco de dados! 🚀
