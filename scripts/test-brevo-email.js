// Test script for Brevo email functionality
// Run with: node scripts/test-brevo-email.js

const SibApiV3Sdk = require('sib-api-v3-sdk');

async function testBrevoEmail() {
  try {
    console.log('Testing Brevo email sending...');
    
    // 1. Authentication setup
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';

    // 2. Create API instance for transactional emails
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // 3. Prepare the email with template ID and parameters
    const sendSmtpEmail = {
      to: [
        {
          email: 'test@example.com', // Replace with your test email
          name: 'Test User'
        }
      ],
      templateId: 2, // ID of your template in Brevo
      params: {
        FIRSTNAME: 'Test',
        message: 'This is a test message from the Brevo email service.'
      },
      sender: {
        name: 'Devtone Agency',
        email: 'team@devtone.agency'
      }
    };

    // 4. Send the email
    console.log('Sending test email...');
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('Email sent successfully!');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    return { success: true, message: 'Email sent successfully', data: response };
  } catch (error) {
    console.error('Error sending Brevo email:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// Execute the test
testBrevoEmail()
  .then(result => {
    console.log('Test completed:', result.success ? 'SUCCESS' : 'FAILED');
    if (!result.success) {
      console.error('Error:', result.error);
      process.exit(1);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  });