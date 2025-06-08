import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('quotes')
      .select('count')
      .limit(1);

    if (testError && testError.code === '42P01') {
      console.log('Tables do not exist, they will be created automatically when first used.');
    } else if (testError) {
      console.error('Connection test failed:', testError);
      return;
    } else {
      console.log('Connection successful! Tables already exist.');
    }

    // Test inserting a sample quote to verify the structure
    console.log('Testing quotes table...');
    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        full_name: 'Test User',
        email: 'test@example.com',
        project_type: 'website',
        status: 'pending'
      })
      .select();

    if (quoteError) {
      console.error('Error with quotes table:', quoteError);
    } else {
      console.log('Quotes table working correctly!');
      
      // Clean up test data
      if (quoteData && quoteData[0]) {
        await supabase
          .from('quotes')
          .delete()
          .eq('id', quoteData[0].id);
        console.log('Test data cleaned up.');
      }
    }

    // Test inserting a sample contact to verify the structure
    console.log('Testing contacts table...');
    const { data: contactData, error: contactError } = await supabase
      .from('contacts')
      .insert({
        full_name: 'Test Contact',
        email: 'contact@example.com',
        message: 'Test message',
        status: 'new',
        is_urgent: false,
        priority: 1
      })
      .select();

    if (contactError) {
      console.error('Error with contacts table:', contactError);
    } else {
      console.log('Contacts table working correctly!');
      
      // Clean up test data
      if (contactData && contactData[0]) {
        await supabase
          .from('contacts')
          .delete()
          .eq('id', contactData[0].id);
        console.log('Test data cleaned up.');
      }
    }

    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();