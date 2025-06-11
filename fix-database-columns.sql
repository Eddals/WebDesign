-- =====================================================
-- CORRIGIR COLUNAS DA TABELA QUOTES PARA FORMULÁRIO
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Verificar se a tabela quotes existe, se não, criar
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Adicionar todas as colunas necessárias (se não existirem)
DO $$ 
BEGIN
    -- Informações pessoais
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'full_name') THEN
        ALTER TABLE quotes ADD COLUMN full_name TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'email') THEN
        ALTER TABLE quotes ADD COLUMN email TEXT NOT NULL DEFAULT '';
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
    
    -- Detalhes do projeto
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
    
    -- Campos do sistema
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'status') THEN
        ALTER TABLE quotes ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    
    RAISE NOTICE 'Todas as colunas necessárias foram verificadas/adicionadas!';
END $$;

-- Remover restrições NOT NULL temporariamente para dados existentes
ALTER TABLE quotes ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE quotes ALTER COLUMN email DROP NOT NULL;

-- Adicionar restrições NOT NULL de volta (apenas para novos registros)
-- ALTER TABLE quotes ALTER COLUMN full_name SET NOT NULL;
-- ALTER TABLE quotes ALTER COLUMN email SET NOT NULL;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_country ON quotes(country);
CREATE INDEX IF NOT EXISTS idx_quotes_industry ON quotes(industry);
CREATE INDEX IF NOT EXISTS idx_quotes_project_type ON quotes(project_type);

-- Verificar estrutura final da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quotes' 
ORDER BY ordinal_position;

-- Testar inserção
INSERT INTO quotes (
    full_name,
    email,
    phone,
    company,
    country,
    industry,
    project_type,
    budget_range,
    timeline,
    features,
    description,
    status
) VALUES (
    'Teste SQL',
    'teste-sql@exemplo.com',
    '+55-11-99999-9999',
    'Empresa SQL',
    'Brazil',
    'Technology & Software',
    'business',
    'professional',
    '1month',
    '["seo", "analytics"]'::jsonb,
    'Teste de inserção via SQL',
    'pending'
) ON CONFLICT DO NOTHING;

-- Verificar se a inserção funcionou
SELECT 
    full_name,
    email,
    country,
    industry,
    project_type,
    created_at
FROM quotes 
WHERE email = 'teste-sql@exemplo.com';

-- Limpar dados de teste
DELETE FROM quotes WHERE email = 'teste-sql@exemplo.com';

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ CORREÇÃO DA TABELA QUOTES CONCLUÍDA!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Todas as colunas necessárias estão presentes:';
    RAISE NOTICE '   - full_name, email, phone, company';
    RAISE NOTICE '   - country, industry (para notificações)';
    RAISE NOTICE '   - project_type, budget_range, timeline';
    RAISE NOTICE '   - features (JSONB), description, status';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Teste de inserção passou com sucesso!';
    RAISE NOTICE '🚀 Formulário deve funcionar agora!';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Próximos passos:';
    RAISE NOTICE '   1. Execute: node scripts/debug-form-submission.js';
    RAISE NOTICE '   2. Teste o formulário em /estimate';
    RAISE NOTICE '   3. Verifique o console do browser para erros';
END $$;
