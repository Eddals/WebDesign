# Configuração do Banco de Dados Supabase

## Resumo das Alterações

✅ **Concluído:**
- Arquivo `.env` atualizado com as credenciais corretas do Supabase
- Dependências instaladas (`@supabase/supabase-js`, `pg`, `@types/pg`)
- Tipos TypeScript criados para as tabelas (`quotes` e `contacts`)
- Páginas Contact e Estimate atualizadas para conectar com o banco
- Scripts SQL criados para configuração do banco
- Tratamento de erros melhorado

## Próximos Passos (IMPORTANTE)

### 1. Executar SQL no Painel do Supabase

Acesse seu painel do Supabase em: https://supabase.com/dashboard/project/xurhlxnscjjkryrmmubc

Vá para **SQL Editor** e execute um dos seguintes scripts:

#### Opção 1: Setup Simples (Recomendado)
Execute o arquivo: `simple-setup.sql`

#### Opção 2: Se ainda houver problemas de permissão
Execute o arquivo: `disable-rls.sql`

### 2. Verificar se Funcionou

Após executar o SQL, teste a conexão:
```bash
node scripts/test-connection.js
```

### 3. Testar as Páginas

1. Inicie o servidor: `npm run dev`
2. Acesse: http://localhost:5174/contact
3. Acesse: http://localhost:5174/estimate
4. Teste os formulários

## Estrutura das Tabelas

### Tabela `quotes` (Estimativas)
- Armazena solicitações de orçamento da página Estimate
- Campos: nome, email, telefone, tipo de projeto, orçamento, etc.

### Tabela `contacts` (Contatos)
- Armazena mensagens da página Contact
- Campos: nome, email, telefone, mensagem, motivo do contato, etc.

## Arquivos Criados/Modificados

### Configuração
- `.env` - Credenciais do Supabase
- `src/lib/supabase.ts` - Cliente Supabase configurado
- `src/types/supabase.ts` - Tipos do banco de dados
- `src/types/quotes.ts` - Tipos para orçamentos (atualizado)
- `src/types/contacts.ts` - Tipos para contatos (atualizado)

### Scripts SQL
- `database-setup.sql` - Setup completo com RLS
- `simple-setup.sql` - Setup simples sem RLS
- `disable-rls.sql` - Desabilita RLS para resolver problemas de permissão
- `fix-rls-policies.sql` - Corrige políticas RLS

### Scripts de Teste
- `scripts/test-connection.js` - Testa conexão com Supabase
- `scripts/setup-database.js` - Setup via API
- `scripts/migrate.cjs` - Migração via PostgreSQL

### Páginas Atualizadas
- `src/pages/Contact.tsx` - Conecta com tabela `contacts`
- `src/pages/Estimate.tsx` - Conecta com tabela `quotes`

## Solução de Problemas

### Erro 401 ou RLS Policy
Se ainda houver erros de permissão:
1. Execute `disable-rls.sql` no SQL Editor do Supabase
2. Teste novamente com `node scripts/test-connection.js`

### Tabelas não existem
1. Execute `simple-setup.sql` no SQL Editor do Supabase
2. Verifique se as tabelas foram criadas na aba "Table Editor"

### Problemas de conexão
1. Verifique se as credenciais no `.env` estão corretas
2. Confirme se o projeto Supabase está ativo
3. Teste a conexão com `node scripts/test-connection.js`

## Próximas Funcionalidades (Opcional)

- Dashboard para visualizar contatos e orçamentos
- Sistema de notificações por email
- API para integração com outros sistemas
- Backup automático dos dados

## Suporte

Se houver problemas:
1. Verifique os logs do console do navegador
2. Execute `node scripts/test-connection.js` para diagnosticar
3. Confirme se o SQL foi executado corretamente no Supabase