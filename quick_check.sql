-- =====================================================
-- VERIFICAÇÃO RÁPIDA - STATUS ATUAL
-- Execute para ver o que temos no banco
-- =====================================================

-- 1. VERIFICAR USUÁRIOS AUTH
-- =====================================================
SELECT 'USUÁRIOS AUTH:' as tipo, COUNT(*) as total FROM auth.users;
SELECT 
    'AUTH USER' as tipo,
    id,
    email,
    created_at,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMADO'
        ELSE 'NÃO CONFIRMADO'
    END as status_email
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. VERIFICAR TABELA USERS
-- =====================================================
SELECT 'PERFIS USERS:' as tipo, COUNT(*) as total FROM users;
SELECT 
    'USER PROFILE' as tipo,
    id,
    name,
    email,
    role,
    status,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. VERIFICAR SE EXISTE O USUÁRIO ESPECÍFICO
-- =====================================================
SELECT 'USUÁRIO ADMIN ESPECÍFICO:' as info;
SELECT 
    au.id,
    au.email as auth_email,
    au.email_confirmed_at,
    u.name,
    u.email as profile_email,
    u.role,
    u.status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE au.email = 'admin@devtone.agency'
   OR au.id = '82616bc3-da1f-4132-99c7-754ace0af9a6';

-- 4. CRIAR USUÁRIO SE NÃO EXISTIR
-- =====================================================
-- Se não encontrou nada acima, vamos criar

-- Primeiro, garantir que a tabela users existe
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'client',
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tentar inserir um usuário de teste
INSERT INTO users (
    id, 
    name, 
    email, 
    role, 
    status
) VALUES (
    '82616bc3-da1f-4132-99c7-754ace0af9a6',
    'DevTone Admin',
    'admin@devtone.agency',
    'admin',
    'approved'
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'approved',
    name = 'DevTone Admin';

-- 5. RESULTADO FINAL
-- =====================================================
SELECT 'VERIFICAÇÃO FINAL:' as status;
SELECT 
    'TOTAL AUTH USERS' as tipo,
    COUNT(*) as quantidade
FROM auth.users;

SELECT 
    'TOTAL USER PROFILES' as tipo,
    COUNT(*) as quantidade
FROM users;

SELECT 
    'ADMIN ENCONTRADO' as tipo,
    CASE 
        WHEN COUNT(*) > 0 THEN 'SIM'
        ELSE 'NÃO'
    END as resultado
FROM users 
WHERE email = 'admin@devtone.agency' AND role = 'admin';

-- 6. INSTRUÇÕES
-- =====================================================
SELECT 
    'PRÓXIMOS PASSOS:' as info,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email = 'admin@devtone.agency') = 0 
        THEN 'EXECUTE: create_user_api.js no console do navegador'
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email = 'admin@devtone.agency' AND email_confirmed_at IS NULL) > 0
        THEN 'EXECUTE: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = ''admin@devtone.agency'';'
        ELSE 'TENTE FAZER LOGIN: admin@devtone.agency / admin123'
    END as acao;