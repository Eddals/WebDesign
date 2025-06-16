-- =====================================================
-- TESTE DE CONEXÃO SUPABASE
-- Execute este SQL no Supabase SQL Editor para verificar a conexão
-- =====================================================

-- 1. VERIFICAR VERSÃO DO POSTGRES
-- =====================================================
SELECT version();

-- 2. VERIFICAR TABELAS EXISTENTES
-- =====================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. VERIFICAR TABELA USERS
-- =====================================================
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
) AS users_table_exists;

-- 4. VERIFICAR ESTRUTURA DA TABELA USERS (SE EXISTIR)
-- =====================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
ORDER BY ordinal_position;

-- 5. VERIFICAR POLÍTICAS RLS NA TABELA USERS
-- =====================================================
SELECT * FROM pg_policies WHERE tablename = 'users';

-- 6. VERIFICAR SE RLS ESTÁ ATIVADO
-- =====================================================
SELECT relname as table_name, relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'users';

-- 7. VERIFICAR USUÁRIOS AUTH EXISTENTES (LIMITADO A 5)
-- =====================================================
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
LIMIT 5;

-- 8. VERIFICAR CONFIGURAÇÕES DE AUTENTICAÇÃO
-- =====================================================
SELECT * FROM auth.config;

-- 9. VERIFICAR CONEXÃO ENTRE AUTH E USERS
-- =====================================================
SELECT 
    a.id as auth_id, 
    a.email as auth_email, 
    u.id as user_id, 
    u.email as user_email,
    u.role,
    u.status
FROM 
    auth.users a
LEFT JOIN 
    users u ON a.id = u.id
LIMIT 5;

-- 10. RESULTADO
-- =====================================================
SELECT 'TESTE DE CONEXÃO CONCLUÍDO' as status;