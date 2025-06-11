-- =====================================================
-- CRIAR TABELA QUOTES DO ZERO
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Deletar tabela existente se houver problemas (CUIDADO!)
-- DROP TABLE IF EXISTS quotes;

-- Criar tabela quotes completa
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Campos obrigatórios
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Campos opcionais
    phone TEXT,
    company TEXT,
    country TEXT,
    industry TEXT,
    project_type TEXT,
    budget_range TEXT,
    timeline TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending'
);

-- Desabilitar RLS temporariamente para testes
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_country ON quotes(country);
CREATE INDEX IF NOT EXISTS idx_quotes_industry ON quotes(industry);

-- Inserir dados de teste
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
) VALUES 
(
    'João Silva',
    'joao@exemplo.com',
    '+55-11-99999-9999',
    'Empresa ABC',
    'Brazil',
    'Technology & Software',
    'business',
    'professional',
    '1month',
    '["seo", "analytics"]'::jsonb,
    'Preciso de um site profissional para minha empresa',
    'pending'
),
(
    'Maria Santos',
    'maria@exemplo.com',
    '+55-11-88888-8888',
    'Loja XYZ',
    'Brazil',
    'E-commerce & Retail',
    'ecommerce',
    'premium',
    '2months',
    '["seo", "analytics", "security"]'::jsonb,
    'Loja online completa com pagamentos',
    'pending'
),
(
    'Carlos Oliveira',
    'carlos@exemplo.com',
    '+55-11-77777-7777',
    'Studio Design',
    'Brazil',
    'Art & Design',
    'portfolio',
    'starter',
    'flexible',
    '["seo", "social"]'::jsonb,
    'Portfolio para mostrar meus trabalhos',
    'pending'
) ON CONFLICT (email) DO NOTHING;

-- Verificar se a tabela foi criada corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'quotes' 
ORDER BY ordinal_position;

-- Verificar dados inseridos
SELECT 
    id,
    full_name,
    email,
    country,
    industry,
    project_type,
    created_at
FROM quotes 
ORDER BY created_at DESC;

-- Testar query das notificações
SELECT 
    id,
    full_name,
    country,
    industry,
    created_at
FROM quotes 
WHERE country IS NOT NULL 
AND industry IS NOT NULL
ORDER BY created_at DESC 
LIMIT 20;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ TABELA QUOTES CRIADA COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tabela criada com todas as colunas necessárias';
    RAISE NOTICE '🔓 RLS desabilitado para testes';
    RAISE NOTICE '📊 Dados de exemplo inseridos';
    RAISE NOTICE '🔍 Índices criados para performance';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Teste agora:';
    RAISE NOTICE '   1. Formulário em /estimate';
    RAISE NOTICE '   2. Notificações devem aparecer';
    RAISE NOTICE '   3. Dados salvos na tabela';
END $$;
