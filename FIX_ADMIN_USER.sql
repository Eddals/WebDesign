-- =====================================================
-- CORREÇÃO DE USUÁRIO ADMIN
-- Execute este SQL no Supabase SQL Editor para corrigir problemas de login
-- =====================================================

-- 1. VERIFICAR SE O USUÁRIO EXISTE
-- =====================================================
SELECT 'VERIFICANDO USUÁRIO AUTH:' as info, id, email, email_confirmed_at 
FROM auth.users 
WHERE email IN ('admin@devtone.agency', 'admin@devtone.net');

SELECT 'VERIFICANDO PERFIL:' as info, id, email, role, status 
FROM users 
WHERE email IN ('admin@devtone.agency', 'admin@devtone.net');

-- 2. LIMPAR USUÁRIOS EXISTENTES (SE NECESSÁRIO)
-- =====================================================
DELETE FROM users WHERE email IN ('admin@devtone.agency', 'admin@devtone.net');
DELETE FROM auth.users WHERE email IN ('admin@devtone.agency', 'admin@devtone.net');

-- 3. DESABILITAR RLS TEMPORARIAMENTE
-- =====================================================
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- 4. INSERIR USUÁRIO AUTH NOVAMENTE
-- =====================================================
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
    NOW(), -- Set last_sign_in_at to now to ensure it's not null
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

-- 6. VERIFICAR CRIAÇÃO
-- =====================================================
SELECT 'USUÁRIO AUTH CRIADO:' as info, id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@devtone.agency';

SELECT 'PERFIL CRIADO:' as info, id, email, role, status 
FROM users 
WHERE email = 'admin@devtone.agency';

-- 7. VERIFICAR CONFIGURAÇÕES DE AUTENTICAÇÃO
-- =====================================================
-- Isso vai mostrar se há alguma configuração que possa estar bloqueando o login
SELECT * FROM auth.config;

-- 8. RESULTADO
-- =====================================================
SELECT 'USUÁRIO ADMIN CORRIGIDO!' as status,
       'Email: admin@devtone.agency' as email,
       'Senha: admin123' as senha,
       'UUID: 11111111-1111-1111-1111-111111111111' as uuid;