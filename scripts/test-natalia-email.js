import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function testNataliaEmail() {
  const targetEmail = 'nataliaaustin.tv@gmail.com';
  console.log(`🧪 Testing email delivery to: ${targetEmail}\n`);
  
  try {
    // Test 1: Simple test email
    console.log('📧 Sending test email 1 (Simple)...');
    const result1 = await resend.emails.send({
      from: 'DevTone Test <onboarding@resend.dev>',
      to: targetEmail,
      subject: 'Test 1: DevTone Contact Form Test - Check Spam Folder',
      text: 'This is a test email from DevTone contact form. If you receive this, the email system is working. Please check your spam folder if not in inbox.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">DevTone Contact Form Test</h2>
          <p style="color: #666; font-size: 16px;">
            Hi Natalia,<br><br>
            This is a test email from the DevTone contact form system.<br><br>
            <strong>If you're reading this, the email system is working!</strong><br><br>
            Time sent: ${new Date().toLocaleString()}<br>
            Email ID: Will be shown in console<br><br>
            Please check your spam folder if this email is not in your inbox.
          </p>
        </div>
      `
    });
    
    console.log('✅ Test 1 sent successfully!');
    console.log('Full response:', JSON.stringify(result1, null, 2));
    console.log('Email ID:', result1.id || result1.data?.id || 'Check Resend dashboard');
    console.log('Check your inbox and spam folder now.\n');
    
    // Wait 2 seconds to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Contact form style email
    console.log('📧 Sending test email 2 (Contact Form Style)...');
    const result2 = await resend.emails.send({
      from: 'DevTone Agency <onboarding@resend.dev>',
      to: targetEmail,
      subject: '✨ We Received Your Message - DevTone Agency',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: #ffffff; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">This is a test of the contact form email system</p>
    </div>
    
    <div style="padding: 30px;">
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Hello Natalia,
      </p>
      
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        This is a test email to verify the contact form email system is working correctly for your Gmail address.
      </p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2541b2; margin: 0 0 10px 0;">Test Details:</h3>
        <p style="color: #666; margin: 5px 0;"><strong>Sent to:</strong> ${targetEmail}</p>
        <p style="color: #666; margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: #666; margin: 5px 0;"><strong>From:</strong> onboarding@resend.dev</p>
        <p style="color: #666; margin: 5px 0;"><strong>Email ID:</strong> ${result1.data?.id || 'Will be shown in console'}</p>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
        <p style="color: #856404; margin: 0; font-weight: bold;">⚠️ Important:</p>
        <p style="color: #856404; margin: 5px 0 0 0;">If this email is in your spam folder, please mark it as "Not Spam" to ensure future emails arrive in your inbox.</p>
      </div>
      
      <p style="color: #666; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
        This is an automated test email from DevTone Agency
      </p>
    </div>
    
  </div>
</body>
</html>
      `
    });
    
    console.log('✅ Test 2 sent successfully!');
    console.log('Email ID:', result2.data?.id);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST COMPLETE - 2 emails sent to:', targetEmail);
    console.log('='.repeat(60));
    console.log('\n🔍 IMPORTANT - Check these locations:');
    console.log('1. PRIMARY inbox');
    console.log('2. SPAM/JUNK folder (most likely)');
    console.log('3. PROMOTIONS tab (Gmail)');
    console.log('4. ALL MAIL folder');
    console.log('\n📱 On Gmail mobile app:');
    console.log('- Tap menu (☰) → Spam');
    console.log('- Or search for: from:onboarding@resend.dev');
    console.log('\n🌐 Check email status at:');
    console.log('https://resend.com/emails');
    console.log('\nEmail IDs for reference:');
    console.log('- Test 1:', result1.data?.id);
    console.log('- Test 2:', result2.data?.id);
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Details:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
console.log('Starting email test for Natalia...\n');
testNataliaEmail();