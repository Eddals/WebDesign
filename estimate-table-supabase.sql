-- Criação da tabela estimates para o formulário de orçamento
-- Execute este SQL no Supabase SQL Editor

-- Habilitar extensão http se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS http;

-- Criar tabela estimates
CREATE TABLE IF NOT EXISTS public.estimates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Informações pessoais
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    industry VARCHAR(255),
    
    -- Detalhes do projeto
    project_type VARCHAR(100) NOT NULL,
    budget VARCHAR(100) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    description TEXT,
    features TEXT[], -- Array de features selecionadas
    retainer VARCHAR(100) DEFAULT 'none',
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status do orçamento
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Informações adicionais
    estimated_value DECIMAL(10,2),
    notes TEXT,
    
    -- Rastreamento
    source VARCHAR(100) DEFAULT 'website_form',
    ip_address INET,
    user_agent TEXT
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_estimates_email ON public.estimates(email);
CREATE INDEX IF NOT EXISTS idx_estimates_created_at ON public.estimates(created_at);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON public.estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimates_project_type ON public.estimates(project_type);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de qualquer usuário (formulário público)
CREATE POLICY "Allow public insert on estimates" ON public.estimates
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados (admin)
CREATE POLICY "Allow authenticated read on estimates" ON public.estimates
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados (admin)
CREATE POLICY "Allow authenticated update on estimates" ON public.estimates
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Função para atualizar o timestamp updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_estimates_updated_at 
    BEFORE UPDATE ON public.estimates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Função para enviar dados para o Brevo quando um novo estimate for criado
CREATE OR REPLACE FUNCTION public.trigger_brevo_estimate()
RETURNS TRIGGER AS $$
BEGIN
  -- Chama a função Edge Function ao adicionar um novo estimate
  PERFORM
    http_post(
      'https://olblavscnardvgpgeqdk.supabase.co/functions/v1/send-estimate-to-brevo',
      json_build_object(
        'record', row_to_json(NEW)
      )::text,
      'application/json'
    );
  RETURN NEW;
END;
$$ language plpgsql;

-- Trigger para enviar estimate para o Brevo
DROP TRIGGER IF EXISTS estimate_brevo_trigger ON public.estimates;

CREATE TRIGGER estimate_brevo_trigger
AFTER INSERT ON public.estimates
FOR EACH ROW
EXECUTE FUNCTION trigger_brevo_estimate();

-- Comentários para documentação
COMMENT ON TABLE public.estimates IS 'Tabela para armazenar solicitações de orçamento do formulário';
COMMENT ON COLUMN public.estimates.name IS 'Nome completo do cliente';
COMMENT ON COLUMN public.estimates.email IS 'Email do cliente';
COMMENT ON COLUMN public.estimates.company IS 'Nome da empresa (opcional)';
COMMENT ON COLUMN public.estimates.industry IS 'Setor/indústria da empresa';
COMMENT ON COLUMN public.estimates.project_type IS 'Tipo de projeto (landing, portfolio, business, ecommerce, webapp)';
COMMENT ON COLUMN public.estimates.budget IS 'Faixa de orçamento selecionada';
COMMENT ON COLUMN public.estimates.timeline IS 'Prazo desejado para o projeto';
COMMENT ON COLUMN public.estimates.description IS 'Descrição detalhada do projeto';
COMMENT ON COLUMN public.estimates.features IS 'Array com as features selecionadas';
COMMENT ON COLUMN public.estimates.retainer IS 'Tipo de retainer mensal (none, basic, standard, premium)';
COMMENT ON COLUMN public.estimates.status IS 'Status do orçamento (pending, reviewed, sent, closed)';
COMMENT ON COLUMN public.estimates.estimated_value IS 'Valor estimado calculado';
COMMENT ON COLUMN public.estimates.source IS 'Origem da solicitação'; 