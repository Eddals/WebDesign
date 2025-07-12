// Test script for Brevo contact form with template #13
const https = require('https');

// Brevo API key from test-brevo.js
const BREVO_API_KEY = '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';

function testBrevoContactTemplate13() {
  console.log('🧪 Testing Brevo contact form with template #13');
  console.log('📧 Using verified domain: team@devtone.agency');

  // Email data using template
  const emailData = {
    to: [
      {
        email: 'team@devtone.agency',
        name: 'DevTone Team'
      }
    ],
    templateId: 13,
    params: {
      FIRSTNAME: 'Test User',
      EMAIL: 'test@example.com',
      PHONE: '123-456-7890',
      COMPANY: 'Test Company',
      SUBJECT: 'Test Contact Form Template',
      MESSAGE: 'This is a test message to verify the contact form template is working correctly.',
      PREFERRED_CONTACT: 'email',
      SUBMISSION_DATE: new Date().toISOString()
    }
  };

  console.log('📤 Sending test email with template #13 to team@devtone.agency...');
  console.log('📋 Template parameters:', emailData.params);

  const data = JSON.stringify(emailData);

  const options = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(responseData);
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Email sent successfully!');
          console.log('📝 Message ID:', parsedData.messageId);
          console.log('📊 Response:', parsedData);
          
          console.log('\n📋 Next Steps:');
          console.log('1. Check your inbox at team@devtone.agency');
          console.log('2. Verify that the email was received with the correct template');
          console.log('3. Check that all template variables are properly replaced');
        } else {
          console.error('❌ Failed to send email:');
          console.error('Status code:', res.statusCode);
          console.error('Response:', parsedData);
          
          if (parsedData.message === 'API Key is not enabled') {
            console.log('\n💡 Solution:');
            console.log('1. Check if the API key is active in Brevo dashboard');
            console.log('2. Generate a new API key if needed');
            console.log('3. Update the API key in the code');
          }
        }
      } catch (e) {
        console.error('❌ Error parsing response:', e);
        console.log('Raw response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error sending email:', error);
  });

  req.write(data);
  req.end();
}

testBrevoContactTemplate13();