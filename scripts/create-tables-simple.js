import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('Creating tables...');

  // SQL to create quotes table
  const createQuotesSQL = `
    CREATE TABLE IF NOT EXISTS quotes (
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
  `;

  // SQL to create contacts table
  const createContactsSQL = `
    CREATE TABLE IF NOT EXISTS contacts (
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
  `;

  try {
    // Try to execute SQL using RPC
    const { data: quotesResult, error: quotesError } = await supabase.rpc('exec_sql', {
      sql: createQuotesSQL
    });

    if (quotesError) {
      console.log('RPC not available, tables might need to be created manually in Supabase dashboard');
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log('\n--- QUOTES TABLE ---');
      console.log(createQuotesSQL);
      console.log('\n--- CONTACTS TABLE ---');
      console.log(createContactsSQL);
    } else {
      console.log('Quotes table created successfully');
    }

    const { data: contactsResult, error: contactsError } = await supabase.rpc('exec_sql', {
      sql: createContactsSQL
    });

    if (!contactsError) {
      console.log('Contacts table created successfully');
    }

  } catch (error) {
    console.log('Manual table creation required. Please run this SQL in your Supabase dashboard:');
    console.log('\n=== COPY AND PASTE THIS SQL INTO SUPABASE SQL EDITOR ===\n');
    console.log(createQuotesSQL);
    console.log(createContactsSQL);
    console.log('\n=== END OF SQL ===\n');
  }
}

createTables();