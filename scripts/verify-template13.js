// Simple script to verify template #13 is working
const https = require('https');

// Brevo API key from send-brevo-email-direct.js
const BREVO_API_KEY = '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';

// Test data
const testData = {
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
    SUBJECT: 'Test Template #13',
    MESSAGE: 'This is a test message to verify template #13 is working correctly.',
    PREFERRED_CONTACT: 'email',
    SUBMISSION_DATE: new Date().toISOString()
  }
};

console.log('🧪 Testing Brevo template #13');
console.log('📧 Using API key from send-brevo-email-direct.js');
console.log('📧 Template parameters:', testData.params);

// Convert data to JSON string
const data = JSON.stringify(testData);

// Set up the request options
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

// Make the request
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
        console.log('2. Verify that the email was received with template #13');
        console.log('3. Check that all template variables are properly replaced');
      } else {
        console.error('❌ Failed to send email:');
        console.error('Status code:', res.statusCode);
        console.error('Response:', parsedData);
      }
    } catch (e) {
      console.error('❌ Error parsing response:', e);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error sending request:', error);
});

// Send the request
req.write(data);
req.end();