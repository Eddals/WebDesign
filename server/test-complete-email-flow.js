const fetch = require('node-fetch');
require('dotenv').config();

async function testCompleteEmailFlow() {
  console.log('🧪 Testing Complete Email Flow for Estimate Form\n');
  console.log('📧 Admin emails will be sent to: sweepeasellc@gmail.com');
  console.log('📨 User confirmation will be sent to the test email provided\n');

  // Test estimate data
  const testEstimate = {
    // Basic contact info
    name: 'John Doe',
    email: 'john.doe@example.com', // This email will receive the confirmation
    phone: '+1 (555) 123-4567',
    company: 'Test Company LLC',
    country: 'United States',
    industry: 'E-commerce',
    
    // Project details
    projectType: 'Technical SEO',
    budget: '$5,000 - $10,000',
    timeline: '1-3 months',
    description: 'We need comprehensive SEO services for our e-commerce website. Looking to improve technical SEO, on-page optimization, and content strategy. Our main goals are to increase organic traffic and improve conversion rates.',
    features: ['Technical SEO Audit', 'On-Page Optimization', 'Content Strategy', 'Link Building'],
    
    // Additional fields from EstimateForm
    service_type: 'Technical SEO',
    project_description: 'We need comprehensive SEO services for our e-commerce website.',
    estimated_budget: '$5,000 - $10,000',
    preferred_timeline: '1-3 months',
    property_type: 'E-commerce Website',
    property_size: 'Medium (50-100 pages)',
    location: 'New York, USA'
  };

  try {
    console.log('📤 Sending estimate request to API...\n');
    
    const apiUrl = process.env.VITE_ESTIMATE_API_URL || 'http://localhost:3002';
    const response = await fetch(`${apiUrl}/api/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEstimate)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Estimate submitted successfully!\n');
      console.log('📧 Email Status:');
      console.log(`   Admin notification to sweepeasellc@gmail.com: ${result.emailsSent?.admin ? '✅ Sent' : '❌ Failed'}`);
      console.log(`   User confirmation to ${testEstimate.email}: ${result.emailsSent?.client ? '✅ Sent' : '❌ Failed'}`);
      
      console.log('\n📬 Please check the following inboxes:');
      console.log('   1. sweepeasellc@gmail.com - For the admin notification with all estimate details');
      console.log(`   2. ${testEstimate.email} - For the user confirmation with estimate summary and next steps`);
      
      console.log('\n📋 The emails should contain:');
      console.log('   Admin Email:');
      console.log('   - Complete contact information');
      console.log('   - Project type, budget, and timeline');
      console.log('   - Full project description');
      console.log('   - Submission timestamp');
      
      console.log('\n   User Email:');
      console.log('   - Thank you message');
      console.log('   - Estimate summary with all submitted details');
      console.log('   - Clear next steps (Review → Proposal → Call → Kickoff)');
      console.log('   - Contact information for immediate assistance');
      console.log('   - Helpful resource links');
      
    } else {
      console.log('❌ Failed to submit estimate');
      console.log('Error:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error testing email flow:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the estimate API is running: npm run start:estimate');
    console.log('2. Check that SMTP credentials are correct in server/.env');
    console.log('3. Verify that port 3002 is not blocked');
  }
}

// Run the test
console.log('='.repeat(60));
testCompleteEmailFlow();