-- =====================================================
-- EXECUTE THIS SQL IN SUPABASE SQL EDITOR NOW
-- This will fix all database issues immediately
-- =====================================================

-- Step 1: Drop everything and start fresh
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;

-- Step 2: Create quotes table
CREATE TABLE public.quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
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
    estimated_budget NUMERIC(10,2),
    pages_needed TEXT,
    domain_hosting_status TEXT
);

-- Step 3: Create contacts table
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
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
    is_urgent BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1,
    subject TEXT
);

-- Step 4: Disable RLS completely
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;

-- Step 5: Grant ALL permissions to anon role
GRANT ALL ON public.quotes TO anon;
GRANT ALL ON public.contacts TO anon;
GRANT ALL ON public.quotes TO authenticated;
GRANT ALL ON public.contacts TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 6: Test the setup
INSERT INTO public.contacts (full_name, email, message) 
VALUES ('Test User', 'test@example.com', 'Test message - setup working!');

INSERT INTO public.quotes (full_name, email, project_type) 
VALUES ('Test Quote', 'quote@example.com', 'website');

-- Step 7: Verify everything works
SELECT 'SUCCESS! Tables created and working!' as result,
       (SELECT count(*) FROM public.quotes) as quotes_count,
       (SELECT count(*) FROM public.contacts) as contacts_count;