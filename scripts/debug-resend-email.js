import { Resend } from 'resend';

// Initialize Resend with the API key
const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function debugResendEmail() {
  console.log('🔍 Debugging Resend Email Configuration...\n');

  // Test 1: Simple email with minimal configuration
  console.log('Test 1: Sending simple email with onboarding@resend.dev...');
  try {
    const result1 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev', // Resend's test email
      subject: 'Test Email from DevTone',
      html: '<p>This is a test email to verify Resend is working.</p>',
    });
    console.log('✅ Test 1 Success:', result1);
  } catch (error) {
    console.error('❌ Test 1 Failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }

  console.log('\n---\n');

  // Test 2: Email with custom from name
  console.log('Test 2: Sending email with custom from name...');
  try {
    const result2 = await resend.emails.send({
      from: 'DevTone Agency <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: 'Test Email with Custom From Name',
      html: '<p>Testing custom from name.</p>',
    });
    console.log('✅ Test 2 Success:', result2);
  } catch (error) {
    console.error('❌ Test 2 Failed:', error.message);
  }

  console.log('\n---\n');

  // Test 3: Check API key validity
  console.log('Test 3: Verifying API key...');
  try {
    // Try to send to multiple recipients to test the API
    const result3 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['delivered@resend.dev'],
      subject: 'API Key Verification',
      html: '<p>If you receive this, the API key is valid.</p>',
    });
    console.log('✅ Test 3 Success: API key is valid');
    console.log('Response:', result3);
  } catch (error) {
    console.error('❌ Test 3 Failed: API key might be invalid');
    console.error('Error:', error.message);
  }

  console.log('\n---\n');

  // Test 4: Send to a real email address (change this to your email)
  const yourEmail = 'team@devtone.agency'; // Change this to your actual email
  console.log(`Test 4: Sending to real email address (${yourEmail})...`);
  try {
    const result4 = await resend.emails.send({
      from: 'DevTone Test <onboarding@resend.dev>',
      to: yourEmail,
      subject: 'DevTone Contact Form Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Contact Form Email Test</h2>
          <p>This is a test email from your DevTone contact form integration.</p>
          <p>If you're receiving this email, the Resend integration is working correctly!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Sent using Resend API<br>
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });
    console.log('✅ Test 4 Success: Email sent to', yourEmail);
    console.log('Response:', result4);
  } catch (error) {
    console.error('❌ Test 4 Failed:', error.message);
  }

  console.log('\n---\n');
  console.log('📊 Debug Summary:');
  console.log('- API Key: re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');
  console.log('- From Domain: onboarding@resend.dev (Resend\'s test domain)');
  console.log('- Test Email: delivered@resend.dev (Resend\'s test inbox)');
  console.log('\n💡 Tips:');
  console.log('1. Make sure you have an active Resend account');
  console.log('2. Check your Resend dashboard for email logs: https://resend.com/emails');
  console.log('3. Verify your API key is correct and has not been revoked');
  console.log('4. For production, you\'ll need to verify your own domain');
}

// Run the debug script
debugResendEmail();