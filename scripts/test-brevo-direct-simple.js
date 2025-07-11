// Simple test script using axios
const axios = require('axios');

// Brevo API key
const BREVO_API_KEY = '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';

async function testBrevoEmail() {
  console.log('🧪 Testing Brevo email with verified domain');
  console.log('📧 Using verified domain: team@devtone.agency');

  try {
    // Email data
    const emailData = {
      sender: {
        name: 'DevTone Website',
        email: 'team@devtone.agency'  // Using verified domain
      },
      to: [
        {
          email: 'team@devtone.agency',
          name: 'DevTone Team'
        }
      ],
      subject: 'Test Email - Brevo Direct',
      htmlContent: `
        <html>
          <body>
            <h2>Test Email from Brevo</h2>
            <p>This is a test email to verify that Brevo is correctly configured with the verified domain.</p>
            <p>If you're receiving this email, it means the domain verification is working correctly.</p>
            <p>Sent at: ${new Date().toISOString()}</p>
          </body>
        </html>
      `
    };

    console.log('📤 Sending test email to team@devtone.agency...');

    const response = await axios({
      method: 'post',
      url: 'https://api.brevo.com/v3/smtp/email',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      data: emailData
    });

    console.log('✅ Email sent successfully!');
    console.log('📝 Message ID:', response.data.messageId);
    console.log('📊 Response:', response.data);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Check your inbox at team@devtone.agency');
    console.log('2. Verify that the email was received');
    console.log('3. Check the sender address is team@devtone.agency');
    console.log('4. If not received, check spam folder');

  } catch (error) {
    console.error('❌ Error sending email:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

testBrevoEmail();