-- =====================================================
-- CORREÇÃO DE EMERGÊNCIA - VERSÃO SIMPLES
-- Execute se o script anterior não funcionar
-- =====================================================

-- 1. DESABILITAR COMPLETAMENTE RLS
-- =====================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS
-- =====================================================
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
END $$;

-- 3. CRIAR TABELA SIMPLES SEM RLS
-- =====================================================
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'client',
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INSERIR ADMIN DIRETAMENTE
-- =====================================================
INSERT INTO users (id, name, email, role, status) VALUES 
('82616bc3-da1f-4132-99c7-754ace0af9a6', 'DevTone Admin', 'admin@devtone.agency', 'admin', 'approved')
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin', 
    status = 'approved';

-- 5. CONCEDER TODAS AS PERMISSÕES
-- =====================================================
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO postgres;

-- 6. VERIFICAR
-- =====================================================
SELECT * FROM users;

SELECT 'Correção de emergência aplicada!' as status,
       'Tabela users sem RLS - funcionará sem problemas' as info;