// Test the complete estimate flow
// This simulates what happens when someone submits the form

import fetch from 'node-fetch';

const testData = {
  name: 'Test User',
  email: 'sweepeasellc@gmail.com', // Your email for testing
  phone: '+1 (555) 123-4567',
  company: 'Test Company',
  country: 'United States',
  industry: 'Technology',
  projectType: 'E-commerce Store',
  budget: '$2,000 - $5,000',
  timeline: '1 Month',
  features: 'Payment Processing, SEO Optimization, Analytics Dashboard',
  retainer: 'Basic Maintenance ($200/mo)',
  description: 'This is a test submission to verify the email system is working correctly.'
};

async function testEstimateFlow() {
  console.log('🧪 Testing Complete Estimate Flow\n');
  console.log('📋 Test Data:', testData);
  console.log('\n🚀 Sending estimate request...\n');

  try {
    // Test local endpoint (change to your production URL when deployed)
    const response = await fetch('http://localhost:3000/api/send-estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! Estimate submitted successfully\n');
      console.log('📧 What to check:\n');
      console.log('1. Admin Email:');
      console.log('   - Check sweepeasellc@gmail.com inbox');
      console.log('   - Subject: "🚀 New Estimate Request from Test User - E-commerce Store"');
      console.log('   - Contains all form details in a formatted table\n');
      
      console.log('2. Client Confirmation Email:');
      console.log('   - Also sent to sweepeasellc@gmail.com (since it\'s the test email)');
      console.log('   - Subject: "Thank you for your estimate request, Test User!"');
      console.log('   - Contains request summary and next steps\n');
      
      console.log('3. Webhook Events (if configured):');
      console.log('   - Check Vercel logs for webhook events');
      console.log('   - Should see "email.sent" events for both emails\n');
      
      console.log('📊 Next Steps:');
      console.log('   - Verify both emails arrived');
      console.log('   - Check spam folder if not in inbox');
      console.log('   - Monitor webhook logs in Vercel dashboard');
    } else {
      console.error('❌ ERROR:', result.error || 'Failed to send estimate');
      console.error('\n🔧 Troubleshooting:');
      console.error('   - Check if server is running (npm run dev)');
      console.error('   - Verify RESEND_API_KEY in .env.local');
      console.error('   - Check console for detailed error messages');
    }
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.error('\n🔧 Make sure:');
    console.error('   - Your Next.js app is running (npm run dev)');
    console.error('   - You\'re testing on the correct URL');
    console.error('   - API route exists at /api/send-estimate');
  }
}

// Run the test
testEstimateFlow();