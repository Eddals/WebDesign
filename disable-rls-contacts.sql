-- Desabilitar RLS temporariamente na tabela contacts
-- Execute este SQL no Supabase SQL Editor se houver problemas de RLS

-- Desabilitar RLS
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;

-- Verificar se foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contacts';

-- Para reabilitar RLS depois (quando estiver funcionando):
-- ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY; 