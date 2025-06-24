const fetch = require('node-fetch');

async function testFullEstimateFlow() {
  console.log('🧪 Testing Full Estimate Form Flow\n');
  console.log('This will submit a test estimate through the API\n');
  
  const testData = {
    name: 'Test Client',
    email: 'team@devtone.agency', // Sending to your email for testing
    phone: '+1 (555) 123-4567',
    company: 'Test Company LLC',
    country: 'United States',
    industry: 'Technology & Software',
    projectType: 'ecommerce',
    budget: 'professional',
    timeline: '1month',
    description: 'This is a test submission to verify the email automation is working correctly.',
    features: ['payment', 'seo', 'analytics', 'security']
  };
  
  try {
    console.log('📤 Submitting estimate to API...');
    console.log('URL: http://localhost:3002/api/estimate');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3002/api/estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('\n📊 Response:');
    console.log('Status:', response.status);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Estimate submitted successfully!');
      console.log('\n📧 Emails sent:');
      console.log(`   Admin notification: ${result.emailsSent?.admin ? '✅' : '❌'}`);
      console.log(`   Client confirmation: ${result.emailsSent?.client ? '✅' : '❌'}`);
      
      console.log('\n📬 Check your inbox:');
      console.log('   - Admin email: team@devtone.agency (with priority indicator and quick actions)');
      console.log('   - Client email: team@devtone.agency (confirmation with next steps)');
      
      console.log('\n💡 What to look for:');
      console.log('   - Subject line with priority indicator');
      console.log('   - Formatted budget ($2,000 - $5,000) and timeline (1 Month)');
      console.log('   - Quick response template button');
      console.log('   - Project-specific content');
    } else {
      console.log('\n❌ Estimate submission failed:', result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure the estimate API is running:');
    console.log('   cd server && npm run start:estimate');
  }
}

// Run the test
console.log('🚀 DevTone Estimate Form - Full Flow Test\n');
testFullEstimateFlow();