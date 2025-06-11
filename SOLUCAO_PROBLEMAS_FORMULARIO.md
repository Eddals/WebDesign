# 🔧 Solução de Problemas - Formulário Get Estimate

## Problema: Formulário não salva no banco de dados

### 🚀 Soluções em ordem de prioridade:

## 1. **PRIMEIRO: Execute o SQL de correção**

Copie e cole este código no **Supabase SQL Editor**:

```sql
-- CORREÇÃO COMPLETA DA TABELA QUOTES
-- Execute este código no Supabase SQL Editor

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Adicionar todas as colunas necessárias
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'full_name') THEN
        ALTER TABLE quotes ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'email') THEN
        ALTER TABLE quotes ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'phone') THEN
        ALTER TABLE quotes ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'company') THEN
        ALTER TABLE quotes ADD COLUMN company TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'country') THEN
        ALTER TABLE quotes ADD COLUMN country TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'industry') THEN
        ALTER TABLE quotes ADD COLUMN industry TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'project_type') THEN
        ALTER TABLE quotes ADD COLUMN project_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'budget_range') THEN
        ALTER TABLE quotes ADD COLUMN budget_range TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'timeline') THEN
        ALTER TABLE quotes ADD COLUMN timeline TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'features') THEN
        ALTER TABLE quotes ADD COLUMN features JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'description') THEN
        ALTER TABLE quotes ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'status') THEN
        ALTER TABLE quotes ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_country ON quotes(country);
CREATE INDEX IF NOT EXISTS idx_quotes_industry ON quotes(industry);

-- Teste de inserção
INSERT INTO quotes (
    full_name, email, country, industry, project_type, status
) VALUES (
    'Teste SQL', 'teste@exemplo.com', 'Brazil', 'Technology & Software', 'business', 'pending'
) ON CONFLICT DO NOTHING;

-- Verificar se funcionou
SELECT * FROM quotes WHERE email = 'teste@exemplo.com';

-- Limpar teste
DELETE FROM quotes WHERE email = 'teste@exemplo.com';
```

## 2. **Teste a conexão**

Execute no terminal:

```bash
node scripts/debug-form-submission.js
```

## 3. **Verifique o console do browser**

1. Abra o formulário: `http://localhost:5173/estimate`
2. Abra o **DevTools** (F12)
3. Vá na aba **Console**
4. Preencha e envie o formulário
5. Veja as mensagens de debug

### Mensagens esperadas:
```
🚀 Iniciando submissão do formulário...
📋 Dados do formulário: {...}
💾 Dados preparados para Supabase: {...}
🔗 Tentando conectar com Supabase...
📡 Resposta do Supabase:
✅ Estimate salvo com sucesso: [...]
```

## 4. **Problemas comuns e soluções:**

### ❌ "column does not exist"
**Solução**: Execute o SQL de correção acima

### ❌ "permission denied"
**Solução**: Desabilite RLS temporariamente:
```sql
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
```

### ❌ "Supabase not configured"
**Solução**: Verifique o arquivo `.env`:
```env
VITE_SUPABASE_URL=https://xurhlxnscjjkryrmmubc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ❌ "Failed to fetch"
**Solução**: 
1. Verifique se o projeto Supabase está ativo
2. Teste a conexão direta:
```bash
node scripts/test-supabase-connection.js
```

## 5. **Verificação final**

Após executar as correções:

1. **Reinicie o servidor**: `npm run dev`
2. **Limpe o cache**: Ctrl+Shift+R
3. **Teste o formulário**: Preencha todos os campos
4. **Verifique no Supabase**: Vá no dashboard e veja a tabela `quotes`

## 6. **Teste manual no Supabase**

No **Supabase Table Editor**:

1. Vá em **Table Editor** > **quotes**
2. Clique em **Insert** > **Insert row**
3. Preencha os campos manualmente
4. Se funcionar, o problema é no frontend

## 7. **Logs detalhados**

O formulário agora tem logs detalhados. Procure por:

- ✅ **Sucesso**: "Estimate salvo com sucesso"
- ❌ **Erro**: "Erro do Supabase" ou "Erro geral na submissão"

## 8. **Contato para suporte**

Se nada funcionar, envie:

1. **Console logs** do browser
2. **Resultado** do script de debug
3. **Screenshot** da tabela no Supabase
4. **Mensagens de erro** completas

## ✅ **Checklist de verificação:**

- [ ] SQL de correção executado no Supabase
- [ ] Tabela `quotes` existe com todas as colunas
- [ ] Arquivo `.env` tem as credenciais corretas
- [ ] Projeto Supabase está ativo
- [ ] RLS está desabilitado (temporariamente)
- [ ] Console do browser não mostra erros
- [ ] Script de debug passa todos os testes
- [ ] Formulário mostra logs de debug
- [ ] Dados aparecem na tabela do Supabase

**Quando tudo estiver ✅, o formulário funcionará perfeitamente!** 🚀
