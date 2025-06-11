import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEstimateIntegration() {
  console.log('🧪 Testing Estimate Integration...\n');

  try {
    // Test 1: Insert a test estimate
    console.log('1. Testing estimate insertion...');
    const testEstimate = {
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+1-555-123-4567',
      company: 'Test Company',
      country: 'United States',
      project_type: 'business',
      description: 'Test project description',
      budget_range: 'professional',
      timeline: '1month',
      status: 'pending'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('quotes')
      .insert([testEstimate])
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      return;
    }

    console.log('✅ Estimate inserted successfully:', insertData[0].id);

    // Test 2: Fetch recent estimates for notifications
    console.log('\n2. Testing notification data fetch...');
    const { data: notificationData, error: fetchError } = await supabase
      .from('quotes')
      .select('id, full_name, country, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError);
      return;
    }

    console.log('✅ Recent estimates fetched successfully:');
    notificationData.forEach((estimate, index) => {
      const timeAgo = getTimeAgo(estimate.created_at);
      console.log(`   ${index + 1}. ${estimate.full_name} from ${estimate.country} - ${timeAgo}`);
    });

    // Test 3: Clean up test data
    console.log('\n3. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .eq('id', insertData[0].id);

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError);
      return;
    }

    console.log('✅ Test data cleaned up successfully');

    console.log('\n🎉 All tests passed! Estimate integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return `${Math.floor(diffInDays / 7)} weeks ago`;
}

// Run the test
testEstimateIntegration();
