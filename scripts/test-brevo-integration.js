const fetch = require('node-fetch');

const BREVO_CONFIG = {
  API_KEY: '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',
  API_URL: 'https://api.brevo.com/v3/smtp/email',
  TEAM_EMAIL: 'team@devtone.agency'
};

async function testBrevoIntegration() {
  console.log('🧪 Testing Brevo Email Integration...\n');

  const testData = {
    sender: {
      name: 'DevTone Agency - Test',
      email: 'team@devtone.agency'
    },
    to: [
      {
        email: BREVO_CONFIG.TEAM_EMAIL,
        name: 'DevTone Team'
      }
    ],
    templateId: 2, // Using template ID #2 for team notification
    params: {
      NAME: 'Test User',
      EMAIL: 'test@example.com',
      PHONE: '(555) 123-4567',
      COMPANY: 'Test Company',
      INDUSTRY: 'Technology',
      PROJECT_TYPE: 'Landing Page',
      BUDGET: '$500 - $1,500',
      TIMELINE: '1 Month',
      RETAINER: 'No monthly retainer',
      FEATURES: 'Contact Form, SEO, Newsletter',
      DESCRIPTION: 'This is a test submission to verify the Brevo integration is working correctly.',
      SUBMISSION_DATE: new Date().toLocaleString(),
      SOURCE: 'Test Script - Team Notification'
    }
  };

  // Also test client confirmation with template #2
  const clientTestData = {
    sender: {
      name: 'DevTone Agency',
      email: 'team@devtone.agency'
    },
    to: [
      {
        email: 'test@example.com',
        name: 'Test User'
      }
    ],
    templateId: 2, // Using template ID #2 for client confirmation
    params: {
      NAME: 'Test User',
      EMAIL: 'test@example.com',
      PHONE: '(555) 123-4567',
      COMPANY: 'Test Company',
      INDUSTRY: 'Technology',
      PROJECT_TYPE: 'Landing Page',
      BUDGET: '$500 - $1,500',
      TIMELINE: '1 Month',
      RETAINER: 'No monthly retainer',
      FEATURES: 'Contact Form, SEO, Newsletter',
      DESCRIPTION: 'This is a test submission to verify the Brevo integration is working correctly.',
      SUBMISSION_DATE: new Date().toLocaleString(),
      SOURCE: 'Test Script - Client Confirmation'
    }
  };

  try {
    console.log('📧 Sending test email...');
    
    const response = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Team notification email sent successfully!');
      console.log('📊 Response:', JSON.stringify(result, null, 2));
      
      // Now send client confirmation email
      console.log('\n📧 Sending client confirmation email...');
      
      const clientResponse = await fetch(BREVO_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_CONFIG.API_KEY
        },
        body: JSON.stringify(clientTestData)
      });

      if (clientResponse.ok) {
        const clientResult = await clientResponse.json();
        console.log('✅ Client confirmation email sent successfully!');
        console.log('📊 Client Response:', JSON.stringify(clientResult, null, 2));
        console.log('\n🎯 Check your emails at:');
        console.log('   - team@devtone.agency (team notification)');
        console.log('   - test@example.com (client confirmation)');
      } else {
        const clientErrorText = await clientResponse.text();
        console.log('❌ Failed to send client confirmation email');
        console.log('📊 Status:', clientResponse.status);
        console.log('📊 Error:', clientErrorText);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to send test email');
      console.log('📊 Status:', response.status);
      console.log('📊 Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error during test:', error.message);
  }
}

// Run the test
testBrevoIntegration(); 