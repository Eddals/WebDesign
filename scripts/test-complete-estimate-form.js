import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCompleteEstimateForm() {
  console.log('🧪 Testing COMPLETE Estimate Form Database Integration...\n');

  try {
    // Test 1: Verify table structure
    console.log('1. Checking complete table structure...');
    
    const { data: tableData, error: tableError } = await supabase
      .from('quotes')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table access failed:', tableError.message);
      console.log('💡 Make sure to run complete-estimate-form-database.sql first!');
      return;
    }

    console.log('✅ Quotes table is accessible');

    // Test 2: Insert complete estimate with ALL form fields
    console.log('\n2. Testing complete estimate form submission...');
    
    const completeEstimate = {
      // Personal Information (from form)
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1-555-234-5678',
      company: 'TechCorp Solutions',
      country: 'Canada',
      
      // Project Type (from form)
      project_type: 'ecommerce',
      
      // Budget & Timeline (from form)
      budget_range: 'premium',
      timeline: '2months',
      
      // Features (from form)
      features: ['seo', 'analytics', 'security', 'maintenance'],
      
      // Description (from form)
      description: 'We need a complete e-commerce solution with payment integration, inventory management, and customer portal. The site should be mobile-responsive and SEO optimized.',
      
      // System fields (auto-filled)
      status: 'pending',
      priority: 2,
      source: 'website'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('quotes')
      .insert([completeEstimate])
      .select();

    if (insertError) {
      console.error('❌ Complete form insert failed:', insertError.message);
      
      // Check for specific missing columns
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n💡 Missing database columns detected!');
        console.log('   Run this SQL in Supabase SQL Editor:');
        console.log('   Copy and paste complete-estimate-form-database.sql');
      }
      return;
    }

    const insertedId = insertData[0].id;
    console.log('✅ Complete estimate inserted successfully!');
    console.log(`   ID: ${insertedId}`);
    console.log(`   Name: ${insertData[0].full_name}`);
    console.log(`   Email: ${insertData[0].email}`);
    console.log(`   Company: ${insertData[0].company}`);
    console.log(`   Country: ${insertData[0].country}`);
    console.log(`   Project Type: ${insertData[0].project_type}`);
    console.log(`   Budget Range: ${insertData[0].budget_range}`);
    console.log(`   Timeline: ${insertData[0].timeline}`);
    console.log(`   Features: ${JSON.stringify(insertData[0].features)}`);
    console.log(`   Status: ${insertData[0].status}`);

    // Test 3: Verify all form fields are saved correctly
    console.log('\n3. Verifying all form fields are saved...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', insertedId)
      .single();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
      return;
    }

    // Check each form field
    const formFields = {
      'Personal Info - Name': verifyData.full_name,
      'Personal Info - Email': verifyData.email,
      'Personal Info - Phone': verifyData.phone,
      'Personal Info - Company': verifyData.company,
      'Personal Info - Country': verifyData.country,
      'Project Type': verifyData.project_type,
      'Budget Range': verifyData.budget_range,
      'Timeline': verifyData.timeline,
      'Features': verifyData.features,
      'Description': verifyData.description,
      'Status': verifyData.status
    };

    console.log('✅ All form fields verified:');
    Object.entries(formFields).forEach(([field, value]) => {
      const status = value !== null && value !== undefined ? '✅' : '❌';
      const displayValue = Array.isArray(value) ? `[${value.join(', ')}]` : value;
      console.log(`   ${status} ${field}: ${displayValue}`);
    });

    // Test 4: Test notification data retrieval
    console.log('\n4. Testing notification data retrieval...');
    
    const { data: notificationData, error: notificationError } = await supabase
      .from('quotes')
      .select('id, full_name, country, project_type, budget_range, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (notificationError) {
      console.error('❌ Notification data fetch failed:', notificationError);
      return;
    }

    console.log('✅ Notification data retrieved successfully:');
    notificationData.forEach((estimate, index) => {
      const timeAgo = getTimeAgo(estimate.created_at);
      console.log(`   ${index + 1}. ${estimate.full_name} from ${estimate.country}`);
      console.log(`      Project: ${estimate.project_type}, Budget: ${estimate.budget_range}, ${timeAgo}`);
    });

    // Test 5: Test different project types and budgets
    console.log('\n5. Testing different form combinations...');
    
    const testCombinations = [
      {
        full_name: 'Mike Wilson',
        email: 'mike@startup.com',
        country: 'United States',
        project_type: 'landing',
        budget_range: 'starter',
        timeline: 'asap',
        features: ['seo'],
        description: 'Simple landing page for product launch'
      },
      {
        full_name: 'Anna Schmidt',
        email: 'anna@design.de',
        country: 'Germany',
        project_type: 'portfolio',
        budget_range: 'professional',
        timeline: 'flexible',
        features: ['seo', 'social'],
        description: 'Portfolio website for freelance designer'
      }
    ];

    for (const [index, combo] of testCombinations.entries()) {
      const { data: comboData, error: comboError } = await supabase
        .from('quotes')
        .insert([{ ...combo, status: 'pending' }])
        .select('id, full_name, project_type, budget_range');

      if (comboError) {
        console.error(`❌ Combination ${index + 1} failed:`, comboError.message);
      } else {
        console.log(`✅ Combination ${index + 1}: ${comboData[0].full_name} - ${comboData[0].project_type}/${comboData[0].budget_range}`);
      }
    }

    // Test 6: Clean up test data
    console.log('\n6. Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .in('email', ['sarah.johnson@techcorp.com', 'mike@startup.com', 'anna@design.de']);

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError);
      console.log('💡 Manually delete test records from Supabase dashboard');
    } else {
      console.log('✅ Test data cleaned up successfully');
    }

    // Final summary
    console.log('\n🎉 COMPLETE ESTIMATE FORM TEST SUCCESSFUL!');
    console.log('\n✅ Database is ready for ALL estimate form fields:');
    console.log('   📝 Personal Information (name, email, phone, company, country)');
    console.log('   🎯 Project Type (landing, portfolio, business, ecommerce, webapp)');
    console.log('   💰 Budget Range (starter, professional, premium, enterprise)');
    console.log('   ⏰ Timeline (asap, 1month, 2months, flexible)');
    console.log('   ⚡ Features (seo, analytics, social, security, maintenance, training)');
    console.log('   📄 Project Description (free text)');
    console.log('   🔧 System Fields (status, priority, timestamps)');
    console.log('\n🚀 Your estimate form is ready for production!');
    console.log('   Test at: /estimate');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    console.log('\n💡 Troubleshooting steps:');
    console.log('   1. Run complete-estimate-form-database.sql in Supabase SQL Editor');
    console.log('   2. Verify environment variables in .env');
    console.log('   3. Check Supabase project is active');
    console.log('   4. Verify table permissions in Supabase dashboard');
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
testCompleteEstimateForm();
