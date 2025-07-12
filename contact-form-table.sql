-- Nova tabela específica para o formulário Contact.tsx
-- Execute este SQL no Supabase SQL Editor

-- Habilitar extensão http se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS http;

-- Criar tabela contact_form_messages
CREATE TABLE IF NOT EXISTS public.contact_form_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Campos do formulário Contact.tsx
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    preferred_contact VARCHAR(50) DEFAULT 'email',
    
    -- Status e prioridade
    status VARCHAR(50) DEFAULT 'new',
    is_urgent BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Rastreamento
    source VARCHAR(100) DEFAULT 'contact_page_form',
    ip_address INET,
    user_agent TEXT,
    
    -- Informações adicionais
    notes TEXT,
    assigned_to UUID,
    tags TEXT[]
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contact_form_email ON public.contact_form_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_form_created_at ON public.contact_form_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_form_status ON public.contact_form_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_form_priority ON public.contact_form_messages(priority);
CREATE INDEX IF NOT EXISTS idx_contact_form_is_urgent ON public.contact_form_messages(is_urgent);
CREATE INDEX IF NOT EXISTS idx_contact_form_company ON public.contact_form_messages(company);
CREATE INDEX IF NOT EXISTS idx_contact_form_subject ON public.contact_form_messages(subject);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.contact_form_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de qualquer usuário (formulário público)
CREATE POLICY "Allow public insert on contact_form_messages" ON public.contact_form_messages
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados (admin)
CREATE POLICY "Allow authenticated read on contact_form_messages" ON public.contact_form_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados (admin)
CREATE POLICY "Allow authenticated update on contact_form_messages" ON public.contact_form_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir exclusão apenas para usuários autenticados (admin)
CREATE POLICY "Allow authenticated delete on contact_form_messages" ON public.contact_form_messages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Função para atualizar o timestamp updated_at automaticamente
CREATE OR REPLACE FUNCTION update_contact_form_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_contact_form_updated_at 
    BEFORE UPDATE ON public.contact_form_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_contact_form_updated_at();

-- Função para enviar dados para o Brevo quando um novo contato for criado
CREATE OR REPLACE FUNCTION public.trigger_brevo_contact_form()
RETURNS TRIGGER AS $$
BEGIN
  -- Chama a função Edge Function ao adicionar um novo contato
  PERFORM
    http_post(
      'https://olblavscnardvgpgeqdk.supabase.co/functions/v1/send-contact-to-brevo',
      json_build_object(
        'record', row_to_json(NEW)
      )::text,
      'application/json'
    );
  RETURN NEW;
END;
$$ language plpgsql;

-- Trigger para enviar contato para o Brevo
DROP TRIGGER IF EXISTS contact_form_brevo_trigger ON public.contact_form_messages;

CREATE TRIGGER contact_form_brevo_trigger
AFTER INSERT ON public.contact_form_messages
FOR EACH ROW
EXECUTE FUNCTION trigger_brevo_contact_form();

-- Função para definir prioridade automática baseada em palavras-chave
CREATE OR REPLACE FUNCTION set_contact_form_priority()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se é urgente baseado em palavras-chave
    IF (
        LOWER(NEW.subject) LIKE '%urgent%' OR 
        LOWER(NEW.subject) LIKE '%asap%' OR 
        LOWER(NEW.subject) LIKE '%emergency%' OR
        LOWER(NEW.message) LIKE '%urgent%' OR 
        LOWER(NEW.message) LIKE '%asap%' OR 
        LOWER(NEW.message) LIKE '%emergency%'
    ) THEN
        NEW.is_urgent := true;
        NEW.priority := 5;
    ELSIF (
        LOWER(NEW.subject) LIKE '%important%' OR 
        LOWER(NEW.subject) LIKE '%priority%' OR
        LOWER(NEW.message) LIKE '%important%' OR 
        LOWER(NEW.message) LIKE '%priority%'
    ) THEN
        NEW.priority := 4;
    ELSIF (
        LOWER(NEW.subject) LIKE '%quote%' OR 
        LOWER(NEW.subject) LIKE '%estimate%' OR
        LOWER(NEW.message) LIKE '%quote%' OR 
        LOWER(NEW.message) LIKE '%estimate%'
    ) THEN
        NEW.priority := 3;
    ELSE
        NEW.priority := 1;
    END IF;
    
    RETURN NEW;
END;
$$ language plpgsql;

-- Trigger para definir prioridade automaticamente
CREATE TRIGGER set_contact_form_priority_trigger
    BEFORE INSERT ON public.contact_form_messages
    FOR EACH ROW
    EXECUTE FUNCTION set_contact_form_priority();

-- Comentários para documentação
COMMENT ON TABLE public.contact_form_messages IS 'Tabela específica para mensagens do formulário Contact.tsx';
COMMENT ON COLUMN public.contact_form_messages.name IS 'Nome do contato';
COMMENT ON COLUMN public.contact_form_messages.email IS 'Email do contato';
COMMENT ON COLUMN public.contact_form_messages.phone IS 'Telefone do contato (opcional)';
COMMENT ON COLUMN public.contact_form_messages.company IS 'Empresa do contato (opcional)';
COMMENT ON COLUMN public.contact_form_messages.subject IS 'Assunto da mensagem';
COMMENT ON COLUMN public.contact_form_messages.message IS 'Conteúdo da mensagem';
COMMENT ON COLUMN public.contact_form_messages.preferred_contact IS 'Forma preferida de contato (email, phone)';
COMMENT ON COLUMN public.contact_form_messages.status IS 'Status da mensagem (new, read, replied, archived)';
COMMENT ON COLUMN public.contact_form_messages.is_urgent IS 'Se a mensagem é urgente';
COMMENT ON COLUMN public.contact_form_messages.priority IS 'Prioridade da mensagem (1-5)';
COMMENT ON COLUMN public.contact_form_messages.source IS 'Origem da mensagem';
COMMENT ON COLUMN public.contact_form_messages.assigned_to IS 'ID do usuário responsável pela mensagem';
COMMENT ON COLUMN public.contact_form_messages.tags IS 'Tags para categorização'; 