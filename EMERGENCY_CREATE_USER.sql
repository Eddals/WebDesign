-- =====================================================
-- CRIAÇÃO DE USUÁRIO DE EMERGÊNCIA
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. LIMPAR TUDO PRIMEIRO
-- =====================================================
DELETE FROM users WHERE email = 'admin@devtone.agency';
DELETE FROM auth.users WHERE email = 'admin@devtone.agency';

-- 2. DESABILITAR TODAS AS POLÍTICAS RLS
-- =====================================================
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- 3. RECRIAR TABELA USERS SIMPLES
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

-- 4. INSERIR USUÁRIO AUTH DIRETAMENTE
-- =====================================================
-- UUID fixo para facilitar
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
    '11111111-1111-1111-1111-111111111111',
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
);

-- 5. INSERIR PERFIL DO USUÁRIO
-- =====================================================
INSERT INTO users (id, name, email, role, status) VALUES 
('11111111-1111-1111-1111-111111111111', 'DevTone Admin', 'admin@devtone.agency', 'admin', 'approved');

-- 6. CONCEDER TODAS AS PERMISSÕES
-- =====================================================
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO postgres;
GRANT ALL ON users TO service_role;

-- 7. VERIFICAR CRIAÇÃO
-- =====================================================
SELECT 'USUÁRIO AUTH:' as tipo, id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@devtone.agency';
SELECT 'PERFIL USER:' as tipo, * FROM users WHERE email = 'admin@devtone.agency';

-- 8. RESULTADO
-- =====================================================
SELECT 'USUÁRIO CRIADO COM SUCESSO!' as status,
       'Email: admin@devtone.agency' as email,
       'Senha: admin123' as senha,
       'UUID: 11111111-1111-1111-1111-111111111111' as uuid;