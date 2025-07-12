-- Desabilitar RLS temporariamente na tabela contact_form_messages
-- Execute este SQL no Supabase SQL Editor se houver problemas de RLS

-- Desabilitar RLS
ALTER TABLE public.contact_form_messages DISABLE ROW LEVEL SECURITY;

-- Verificar se foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contact_form_messages';

-- Para reabilitar RLS depois (quando estiver funcionando):
-- ALTER TABLE public.contact_form_messages ENABLE ROW LEVEL SECURITY; 