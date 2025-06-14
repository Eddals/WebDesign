-- =====================================================
-- DEBUG E CRIAÇÃO DE USUÁRIO - CORREÇÃO 400 ERROR
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. VERIFICAR USUÁRIOS AUTH EXISTENTES
-- =====================================================
SELECT 'USUÁRIOS AUTH EXISTENTES:' as info;
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    phone_confirmed_at,
    raw_user_meta_data,
    is_super_admin,
    role
FROM auth.users 
ORDER BY created_at DESC;

-- 2. VERIFICAR CONFIGURAÇÕES DE AUTH
-- =====================================================
SELECT 'CONFIGURAÇÕES AUTH:' as info;
-- Verificar se email confirmation está habilitado
-- (Isso deve ser feito no dashboard, mas vamos ver o que temos)

-- 3. CRIAR USUÁRIO ADMIN DIRETAMENTE NO AUTH
-- =====================================================
-- IMPORTANTE: Isso só funciona se você tiver acesso de superadmin
-- Normalmente isso é feito via API, mas vamos tentar

-- Primeiro, vamos limpar qualquer usuário problemático
DELETE FROM auth.users WHERE email = 'admin@devtone.agency';

-- 4. INSERIR USUÁRIO AUTH MANUALMENTE (MÉTODO ALTERNATIVO)
-- =====================================================
-- Este é um método não convencional, mas pode funcionar para debug

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '82616bc3-da1f-4132-99c7-754ace0af9a6',
    'authenticated',
    'authenticated',
    'admin@devtone.agency',
    '$2a$10$8K1p/a0dhrxSHxN1nByqNOhHiJ8qvHR8QjANy8Q3JlKO6tfaS.Klq', -- password: admin123
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "DevTone Admin", "role": "admin"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = NOW(),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = NOW();

-- 5. CRIAR PERFIL DO USUÁRIO
-- =====================================================
-- Garantir que a tabela users existe
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'client',
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir perfil do admin
INSERT INTO users (id, name, email, role, status) VALUES 
('82616bc3-da1f-4132-99c7-754ace0af9a6', 'DevTone Admin', 'admin@devtone.agency', 'admin', 'approved')
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin', 
    status = 'approved',
    name = 'DevTone Admin',
    email = 'admin@devtone.agency';

-- 6. VERIFICAR SE O USUÁRIO FOI CRIADO
-- =====================================================
SELECT 'VERIFICAÇÃO FINAL - AUTH USERS:' as info;
SELECT id, email, email_confirmed_at, raw_user_meta_data FROM auth.users WHERE email = 'admin@devtone.agency';

SELECT 'VERIFICAÇÃO FINAL - USER PROFILES:' as info;
SELECT * FROM users WHERE email = 'admin@devtone.agency';

-- 7. MÉTODO ALTERNATIVO - USAR FUNÇÃO SUPABASE
-- =====================================================
-- Se o método acima não funcionar, use este:

SELECT 'Tentando criar usuário via função...' as info;

-- Esta função simula o signup
DO $$
DECLARE
    user_id UUID := '82616bc3-da1f-4132-99c7-754ace0af9a6';
    user_email TEXT := 'admin@devtone.agency';
    user_password TEXT := 'admin123';
BEGIN
    -- Tentar inserir diretamente
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        aud,
        role
    ) VALUES (
        user_id,
        user_email,
        crypt(user_password, gen_salt('bf')),
        NOW(),
        '{"name": "DevTone Admin", "role": "admin"}',
        NOW(),
        NOW(),
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = NOW(),
        updated_at = NOW();
        
    RAISE NOTICE 'Usuário criado/atualizado: %', user_email;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao criar usuário: %', SQLERRM;
END $$;

-- 8. DESABILITAR CONFIRMAÇÃO DE EMAIL (VIA SQL)
-- =====================================================
-- Confirmar email do usuário
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@devtone.agency';

-- 9. RESULTADO FINAL
-- =====================================================
SELECT 'SETUP COMPLETO!' as status,
       'Credenciais: admin@devtone.agency / admin123' as credenciais,
       'Tente fazer login agora' as acao;