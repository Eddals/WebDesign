-- =====================================================
-- CRIAR TABELA CONTACTS PARA FORMULÁRIO DE CONTATO
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Criar tabela contacts completa
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    -- Informações pessoais (obrigatórias)
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Informações opcionais
    phone TEXT,
    company TEXT,
    
    -- Detalhes do contato
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    preferred_contact TEXT DEFAULT 'email',
    
    -- Campos do sistema
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    is_urgent BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    
    -- Campos adicionais para categorização
    contact_reason TEXT,
    project_type TEXT,
    budget TEXT,
    timeline TEXT
);

-- Desabilitar RLS temporariamente para testes
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_subject ON contacts(subject);

-- Inserir dados de exemplo para testes
INSERT INTO contacts (
    full_name,
    email,
    phone,
    company,
    subject,
    message,
    preferred_contact,
    status
) VALUES 
(
    'Ana Silva',
    'ana@exemplo.com',
    '+55-11-99999-9999',
    'Empresa ABC',
    'general-inquiry',
    'Gostaria de saber mais sobre os serviços de desenvolvimento web.',
    'email',
    'new'
),
(
    'Carlos Santos',
    'carlos@exemplo.com',
    '+55-11-88888-8888',
    'Startup XYZ',
    'technical-support',
    'Estou tendo problemas com meu site atual e preciso de suporte técnico.',
    'phone',
    'new'
),
(
    'Maria Oliveira',
    'maria@exemplo.com',
    '+55-11-77777-7777',
    'Loja Online',
    'billing-question',
    'Tenho dúvidas sobre os preços dos serviços oferecidos.',
    'email',
    'read'
) ON CONFLICT (email) DO NOTHING;

-- Verificar se a tabela foi criada corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;

-- Verificar dados inseridos
SELECT 
    id,
    full_name,
    email,
    company,
    subject,
    message,
    status,
    created_at
FROM contacts 
ORDER BY created_at DESC;

-- Testar query básica
SELECT 
    id,
    full_name,
    email,
    subject,
    status,
    created_at
FROM contacts 
WHERE status = 'new'
ORDER BY created_at DESC 
LIMIT 10;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ TABELA CONTACTS CRIADA COM SUCESSO!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tabela criada com todas as colunas necessárias';
    RAISE NOTICE '🔓 RLS desabilitado para testes';
    RAISE NOTICE '📊 Dados de exemplo inseridos';
    RAISE NOTICE '🔍 Índices criados para performance';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Teste agora:';
    RAISE NOTICE '   1. Formulário de contato em /contact';
    RAISE NOTICE '   2. Dados salvos na tabela contacts';
    RAISE NOTICE '   3. Sistema de gerenciamento funcionando';
END $$;
