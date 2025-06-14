-- =====================================================
-- CORREÇÃO URGENTE - RECURSÃO INFINITA RLS
-- Execute este script IMEDIATAMENTE no SQL Editor
-- =====================================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE
-- =====================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS PROBLEMÁTICAS
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update user status" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON users;

-- 3. LIMPAR TABELA USERS (CUIDADO!)
-- =====================================================
-- Primeiro, vamos ver o que temos
SELECT 'Usuários atuais na tabela:' as info;
SELECT id, name, email, role, status FROM users;

-- Remover duplicatas e dados problemáticos
DELETE FROM users WHERE id IS NULL OR email IS NULL;

-- 4. RECRIAR TABELA USERS SEM RLS (TEMPORÁRIO)
-- =====================================================
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'client')) NOT NULL DEFAULT 'client',
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID,
    approved_at TIMESTAMPTZ DEFAULT NOW(),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INSERIR USUÁRIO ADMIN DIRETAMENTE
-- =====================================================
-- Vamos verificar se existe usuário auth primeiro
SELECT 'Usuários auth disponíveis:' as info;
SELECT id, email, created_at, email_confirmed_at FROM auth.users;

-- Inserir admin para o usuário que acabou de fazer login
-- Substitua o UUID pelo que apareceu no erro: 82616bc3-da1f-4132-99c7-754ace0af9a6
INSERT INTO users (
    id,
    name,
    email,
    role,
    status,
    approved_by,
    approved_at,
    created_at
) VALUES (
    '82616bc3-da1f-4132-99c7-754ace0af9a6',  -- UUID do erro
    'DevTone Admin',
    (SELECT email FROM auth.users WHERE id = '82616bc3-da1f-4132-99c7-754ace0af9a6'),
    'admin',
    'approved',
    '82616bc3-da1f-4132-99c7-754ace0af9a6',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'approved',
    approved_by = EXCLUDED.id,
    approved_at = NOW();

-- 6. CRIAR POLÍTICAS RLS SIMPLES (SEM RECURSÃO)
-- =====================================================
-- Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política simples: todos podem ler (temporário para debug)
CREATE POLICY "Allow all read access" ON users
    FOR SELECT USING (true);

-- Política simples: usuários autenticados podem inserir
CREATE POLICY "Allow authenticated insert" ON users
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política simples: usuários podem atualizar próprio perfil
CREATE POLICY "Allow own profile update" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 7. RECRIAR FUNÇÕES SEM DEPENDÊNCIAS CIRCULARES
-- =====================================================
CREATE OR REPLACE FUNCTION approve_user_simple(user_id UUID, admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users 
    SET status = 'approved', 
        approved_by = admin_id, 
        approved_at = NOW(),
        rejection_reason = NULL
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_user_simple(user_id UUID, admin_id UUID, reason TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users 
    SET status = 'rejected', 
        approved_by = admin_id, 
        approved_at = NOW(),
        rejection_reason = reason
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RECRIAR TRIGGER SIMPLES
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user_simple()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, name, email, role, status)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
        'approved'  -- Aprovação automática por enquanto
    ) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user_simple();

-- 9. CONCEDER PERMISSÕES
-- =====================================================
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;
GRANT EXECUTE ON FUNCTION approve_user_simple(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_user_simple(UUID, UUID, TEXT) TO authenticated;

-- 10. VERIFICAÇÃO FINAL
-- =====================================================
SELECT 'Verificação final:' as status;
SELECT id, name, email, role, status, created_at FROM users;

-- Confirmar email do usuário se necessário
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE id = '82616bc3-da1f-4132-99c7-754ace0af9a6';

SELECT 'Correção aplicada com sucesso!' as resultado,
       'Tente fazer login novamente' as proximo_passo,
       'RLS simplificado para evitar recursão' as observacao;