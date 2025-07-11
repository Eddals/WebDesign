// Test script to verify contact form email functionality
// Use native fetch in Node.js 18+
// For older Node.js versions, you would need to install node-fetch

// Brevo API key
const BREVO_API_KEY = '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';

async function testContactEmail() {
  console.log('🧪 Testing contact form email functionality with Brevo');
  console.log('📧 Using verified domain: team@devtone.agency');

  try {
    // Test data
    const testData = {
      name: 'Test User',
      email: 'team@devtone.agency', // Send to yourself for testing
      phone: '123-456-7890',
      subject: 'Test Contact Form Email',
      message: 'This is a test message to verify the contact form email functionality.',
      company: 'Test Company',
      preferredContact: 'email'
    };

    console.log('📤 Sending test email to team@devtone.agency...');

    // Send notification email to team@devtone.agency
    const notificationData = {
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
      subject: `Test: New Contact Form Submission: ${testData.subject}`,
      htmlContent: `
        <html>
          <body>
            <h2>Test: New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${testData.name}</p>
            <p><strong>Email:</strong> ${testData.email}</p>
            <p><strong>Phone:</strong> ${testData.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${testData.company || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${testData.subject}</p>
            <p><strong>Message:</strong> ${testData.message}</p>
            <p><strong>Preferred Contact Method:</strong> ${testData.preferredContact || 'Email'}</p>
            <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
            <p><em>This is a test email to verify the contact form functionality.</em></p>
          </body>
        </html>
      `
    };

    const notificationResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(notificationData)
    });

    const notificationResult = await notificationResponse.json();
    
    if (notificationResponse.ok) {
      console.log('✅ Notification email sent successfully!');
      console.log('📝 Message ID:', notificationResult.messageId);
    } else {
      console.error('❌ Failed to send notification email:', notificationResult);
    }

    console.log('\n📊 Test Results:');
    console.log('- API Response Status:', notificationResponse.status);
    console.log('- API Response:', notificationResult);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Check your inbox at team@devtone.agency');
    console.log('2. Verify that the email was received');
    console.log('3. Check the sender address is team@devtone.agency');
    console.log('4. If not received, check spam folder');
    console.log('5. Verify domain settings in Brevo dashboard');

  } catch (error) {
    console.error('❌ Error testing contact email:', error);
  }
}

testContactEmail();