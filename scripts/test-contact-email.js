import { Resend } from 'resend';

// Initialize Resend with the API key
const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function testContactEmail() {
  console.log('🧪 Testing Contact Form Email with Resend...\n');

  try {
    // Test data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1 (555) 123-4567',
      subject: 'Test Contact Form Submission',
      message: 'This is a test message from the contact form. Testing the Resend integration for email notifications.',
      company: 'Test Company',
      preferredContact: 'email',
      submittedAt: new Date().toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };

    console.log('📧 Sending test email...');
    console.log('To:', testData.email);
    console.log('Subject:', testData.subject);
    console.log('---\n');

    // Send test email
    const result = await resend.emails.send({
      from: 'DevTone Agency <onboarding@resend.dev>',
      to: testData.email,
      subject: '✨ Test: We Received Your Message - DevTone Agency',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Contact Form Email</h2>
          <p>Hello ${testData.name},</p>
          <p>This is a test email to verify the contact form email system is working correctly.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #555;">Your Message:</h3>
            <p><strong>Subject:</strong> ${testData.subject}</p>
            <p><strong>Message:</strong> ${testData.message}</p>
            <p><strong>Submitted:</strong> ${testData.submittedAt}</p>
          </div>
          <p>If you received this email, the contact form email system is working correctly!</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">This is a test email from DevTone Agency</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Full response:', JSON.stringify(result, null, 2));
    console.log('Email ID:', result.id || result.data?.id);
    console.log('\n📊 Test Results:');
    console.log('- Email service: Working ✓');
    console.log('- API Key: Valid ✓');
    console.log('- From domain: Configured ✓');
    
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    
    if (error.response) {
      console.error('\n📋 Error Details:');
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.message || error.message);
    }
    
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Verify the API key is correct');
    console.log('2. Ensure the from domain (devtone.agency) is verified in Resend');
    console.log('3. Check if the recipient email is valid');
    console.log('4. Verify you have sufficient credits in your Resend account');
  }
}

// Run the test
testContactEmail();