// Test the complete form submission flow

import fetch from 'node-fetch';

const testFormData = {
  name: 'Test User',
  email: 'sweepeasellc@gmail.com',
  phone: '+1 (555) 123-4567',
  company: 'Test Company',
  country: 'United States',
  industry: 'Technology',
  projectType: 'E-commerce Store',
  budget: '$2,000 - $5,000',
  timeline: '1 Month',
  features: 'Payment Processing, SEO Optimization',
  retainer: 'Basic Maintenance ($200/mo)',
  description: 'Testing the complete form submission flow.'
};

async function testFormSubmission() {
  console.log('🧪 Testing Complete Form Submission\n');
  
  // Change this to your production URL when testing live
  const apiUrl = 'http://localhost:3000/api/send-estimate';
  // const apiUrl = 'https://devtone.agency/api/send-estimate';
  
  console.log('📤 Submitting to:', apiUrl);
  console.log('📋 Form data:', JSON.stringify(testFormData, null, 2));
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData)
    });
    
    const result = await response.json();
    
    console.log('\n📥 Response:');
    console.log('   Status:', response.status);
    console.log('   Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Form submission successful!');
      console.log('\n📧 Check your email for:');
      console.log('   1. Admin notification at sweepeasellc@gmail.com');
      console.log('   2. Client confirmation at sweepeasellc@gmail.com');
      console.log('\n📊 Check Resend dashboard for:');
      console.log('   - Email delivery status');
      console.log('   - Webhook events (if configured)');
    } else {
      console.log('\n❌ Form submission failed');
      console.log('   Error:', result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Is your Next.js app running? (npm run dev)');
    console.log('   - Is the API URL correct?');
    console.log('   - Check server logs for detailed errors');
  }
}

testFormSubmission();