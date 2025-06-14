-- =====================================================
-- CRIAR USUÁRIO DE TESTE SIMPLES
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. LIMPAR DADOS EXISTENTES
-- =====================================================
DELETE FROM users WHERE email = 'admin@devtone.agency';
DELETE FROM auth.users WHERE email = 'admin@devtone.agency';

-- 2. CRIAR TABELA USERS SIMPLES (SEM RLS)
-- =====================================================
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'client',
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Desabilitar RLS completamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. INSERIR USUÁRIO AUTH MANUALMENTE
-- =====================================================
-- Método direto para criar usuário auth
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_super_admin
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '82616bc3-da1f-4132-99c7-754ace0af9a6',
    'authenticated',
    'authenticated',
    'admin@devtone.agency',
    '$2a$10$8K1p/a0dhrxSHxN1nByqNOhHiJ8qvHR8QjANy8Q3JlKO6tfaS.Klq', -- senha: admin123
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "DevTone Admin", "role": "admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    NULL,
    NULL,
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    false
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = NOW(),
    updated_at = NOW();

-- 4. INSERIR PERFIL DO USUÁRIO
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

-- 6. VERIFICAR CRIAÇÃO
-- =====================================================
SELECT 'USUÁRIO AUTH CRIADO:' as info;
SELECT id, email, email_confirmed_at, created_at FROM auth.users WHERE email = 'admin@devtone.agency';

SELECT 'PERFIL CRIADO:' as info;
SELECT * FROM users WHERE email = 'admin@devtone.agency';

-- 7. TESTE DE AUTENTICAÇÃO
-- =====================================================
SELECT 'CREDENCIAIS PARA TESTE:' as info,
       'Email: admin@devtone.agency' as email,
       'Senha: admin123' as senha,
       'Status: Pronto para login' as status;