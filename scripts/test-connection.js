import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('contacts')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    
    // Test insert
    console.log('Testing insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('contacts')
      .insert({
        full_name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
      .select();
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError);
    } else {
      console.log('✅ Insert successful:', insertData);
      
      // Clean up
      if (insertData && insertData[0]) {
        await supabase
          .from('contacts')
          .delete()
          .eq('id', insertData[0].id);
        console.log('✅ Test data cleaned up');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection();