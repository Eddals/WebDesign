import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyDatabaseSetup() {
  console.log('🔍 Verifying Database Setup for Estimate Form...\n');

  try {
    // Test 1: Check if quotes table exists and has required columns
    console.log('1. Checking table structure...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('quotes')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table access failed:', tableError.message);
      console.log('💡 Make sure to run the database-update-country.sql script first!');
      return;
    }

    console.log('✅ Quotes table is accessible');

    // Test 2: Insert a complete test estimate with all fields
    console.log('\n2. Testing complete estimate insertion...');
    
    const testEstimate = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-987-6543',
      company: 'Acme Corporation',
      country: 'Canada',
      project_type: 'ecommerce',
      description: 'Need a complete e-commerce solution with payment integration',
      budget_range: 'premium',
      timeline: '2months',
      features: ['seo', 'analytics', 'security', 'maintenance'],
      status: 'pending'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('quotes')
      .insert([testEstimate])
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      if (insertError.message.includes('column "country" does not exist')) {
        console.log('💡 Run this SQL in Supabase SQL Editor:');
        console.log('   ALTER TABLE quotes ADD COLUMN country TEXT;');
      }
      if (insertError.message.includes('column "features" does not exist')) {
        console.log('💡 Run this SQL in Supabase SQL Editor:');
        console.log('   ALTER TABLE quotes ADD COLUMN features JSONB DEFAULT \'[]\'::jsonb;');
      }
      return;
    }

    const insertedId = insertData[0].id;
    console.log('✅ Complete estimate inserted successfully');
    console.log(`   ID: ${insertedId}`);
    console.log(`   Name: ${insertData[0].full_name}`);
    console.log(`   Country: ${insertData[0].country}`);
    console.log(`   Features: ${JSON.stringify(insertData[0].features)}`);

    // Test 3: Test notification data retrieval
    console.log('\n3. Testing notification data retrieval...');
    
    const { data: notificationData, error: notificationError } = await supabase
      .from('quotes')
      .select('id, full_name, country, created_at, project_type, budget_range')
      .order('created_at', { ascending: false })
      .limit(5);

    if (notificationError) {
      console.error('❌ Notification data fetch failed:', notificationError);
      return;
    }

    console.log('✅ Notification data retrieved successfully:');
    notificationData.forEach((estimate, index) => {
      const timeAgo = getTimeAgo(estimate.created_at);
      console.log(`   ${index + 1}. ${estimate.full_name} from ${estimate.country} - ${timeAgo}`);
      console.log(`      Project: ${estimate.project_type}, Budget: ${estimate.budget_range}`);
    });

    // Test 4: Test features field specifically
    console.log('\n4. Testing features field...');
    
    const { data: featuresData, error: featuresError } = await supabase
      .from('quotes')
      .select('id, full_name, features')
      .eq('id', insertedId)
      .single();

    if (featuresError) {
      console.error('❌ Features field test failed:', featuresError);
      return;
    }

    console.log('✅ Features field working correctly:');
    console.log(`   Features: ${JSON.stringify(featuresData.features)}`);
    console.log(`   Type: ${Array.isArray(featuresData.features) ? 'Array' : typeof featuresData.features}`);

    // Test 5: Test country field for notifications
    console.log('\n5. Testing country field for notifications...');
    
    const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    const { data: countryTest, error: countryError } = await supabase
      .from('quotes')
      .update({ country: randomCountry })
      .eq('id', insertedId)
      .select();

    if (countryError) {
      console.error('❌ Country field test failed:', countryError);
      return;
    }

    console.log('✅ Country field working correctly:');
    console.log(`   Updated country to: ${countryTest[0].country}`);

    // Test 6: Clean up test data
    console.log('\n6. Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .eq('id', insertedId);

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError);
      console.log(`💡 Manually delete record with ID: ${insertedId}`);
      return;
    }

    console.log('✅ Test data cleaned up successfully');

    // Final summary
    console.log('\n🎉 DATABASE SETUP VERIFICATION COMPLETE!');
    console.log('\n✅ All tests passed! Your database is ready for:');
    console.log('   • Estimate form submissions');
    console.log('   • Real-time notifications');
    console.log('   • Country tracking');
    console.log('   • Features storage');
    console.log('\n🚀 You can now test the estimate form at: /estimate');

  } catch (error) {
    console.error('❌ Verification failed with error:', error);
    console.log('\n💡 Troubleshooting steps:');
    console.log('   1. Make sure Supabase project is active');
    console.log('   2. Verify environment variables in .env');
    console.log('   3. Run database-update-country.sql in Supabase SQL Editor');
    console.log('   4. Check table permissions in Supabase dashboard');
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

// Run the verification
verifyDatabaseSetup();
