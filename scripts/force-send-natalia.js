import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function forceSendToNatalia() {
  console.log('🚀 Force sending email to nataliaaustin.tv@gmail.com\n');
  
  const emails = [
    {
      from: 'onboarding@resend.dev',
      to: 'nataliaaustin.tv@gmail.com',
      subject: 'URGENT: Check Your SPAM Folder - DevTone Contact Test',
      text: `Hi Natalia,

This is a test email from DevTone contact form system.

IMPORTANT: This email is likely in your SPAM folder!

Please check:
1. SPAM/JUNK folder
2. Promotions tab (if using Gmail)
3. All Mail folder
4. Search for: from:onboarding@resend.dev

Time sent: ${new Date().toLocaleString()}

If you see this email, the contact form is working correctly!

Please mark this email as "Not Spam" to ensure future emails arrive in your inbox.

Best regards,
DevTone Team`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h1 style="color: #ff0000; text-align: center;">⚠️ CHECK YOUR SPAM FOLDER ⚠️</h1>
            
            <h2 style="color: #333;">Hi Natalia,</h2>
            
            <p style="font-size: 18px; color: #666;">
              This is a test email from the DevTone contact form system.
            </p>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; border-left: 5px solid #ffc107; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">📧 This email is probably in your SPAM folder!</h3>
              <p style="color: #856404;">Gmail often sends emails from test domains like "onboarding@resend.dev" to spam.</p>
            </div>
            
            <h3 style="color: #333;">Please check these locations in Gmail:</h3>
            <ol style="font-size: 16px; color: #666;">
              <li><strong>SPAM/JUNK folder</strong> (most likely here)</li>
              <li><strong>Promotions tab</strong></li>
              <li><strong>All Mail</strong> folder</li>
              <li>Search for: <code style="background-color: #f5f5f5; padding: 2px 5px;">from:onboarding@resend.dev</code></li>
            </ol>
            
            <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; border-left: 5px solid #28a745; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">✅ If you see this email:</h3>
              <p style="color: #155724;">The contact form email system is working correctly!</p>
              <p style="color: #155724;">Please mark this email as <strong>"Not Spam"</strong> to ensure future emails arrive in your inbox.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 14px;">
              Time sent: ${new Date().toLocaleString()}<br>
              From: onboarding@resend.dev<br>
              System: DevTone Contact Form
            </p>
          </div>
        </div>
      `
    }
  ];
  
  for (const email of emails) {
    try {
      console.log(`📧 Sending email with subject: "${email.subject}"`);
      const result = await resend.emails.send(email);
      console.log('✅ Sent successfully!');
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('---\n');
    } catch (error) {
      console.error('��� Failed to send:', error.message);
    }
  }
  
  console.log('🔍 IMPORTANT INSTRUCTIONS FOR NATALIA:\n');
  console.log('1. Open Gmail');
  console.log('2. Click on "More" in the left sidebar');
  console.log('3. Click on "Spam"');
  console.log('4. Look for emails from "onboarding@resend.dev"');
  console.log('5. OR search for: from:onboarding@resend.dev');
  console.log('\n📱 On Gmail Mobile App:');
  console.log('1. Tap the menu icon (☰)');
  console.log('2. Scroll down and tap "Spam"');
  console.log('3. Look for DevTone emails');
  console.log('\n✅ When you find the email:');
  console.log('1. Open it');
  console.log('2. Click "Not Spam" or "Report not spam"');
  console.log('3. Future emails should arrive in inbox');
  
  console.log('\n🌐 Also check: https://resend.com/emails');
  console.log('You can see all sent emails in the Resend dashboard');
}

// Run it
forceSendToNatalia().catch(console.error);