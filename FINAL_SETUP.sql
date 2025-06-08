-- =====================================================
-- FINAL SETUP - EXECUTE THIS IN SUPABASE SQL EDITOR
-- =====================================================

-- Drop existing tables completely
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;

-- Create quotes table
CREATE TABLE public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    business_name TEXT,
    company TEXT,
    project_type TEXT,
    website_goal TEXT,
    description TEXT,
    budget_range TEXT,
    timeline TEXT,
    selected_package TEXT,
    payment_model TEXT,
    subscription_plan TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    estimated_budget DECIMAL(10,2),
    pages_needed TEXT,
    domain_hosting_status TEXT
);

-- Create contacts table
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    contact_reason TEXT,
    project_type TEXT,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    preferred_contact TEXT DEFAULT 'email',
    status TEXT DEFAULT 'new',
    is_urgent BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    subject TEXT
);

-- Make sure RLS is disabled
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to anon role
GRANT ALL ON public.quotes TO anon;
GRANT ALL ON public.contacts TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant all permissions to authenticated role
GRANT ALL ON public.quotes TO authenticated;
GRANT ALL ON public.contacts TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create indexes
CREATE INDEX idx_quotes_email ON public.quotes(email);
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at);

-- Test insert
INSERT INTO public.contacts (full_name, email, message) 
VALUES ('Setup Test', 'setup@example.com', 'Final setup test message');

-- Verify
SELECT 'SUCCESS: Tables created and accessible!' as result, 
       (SELECT count(*) FROM public.quotes) as quotes_count,
       (SELECT count(*) FROM public.contacts) as contacts_count;