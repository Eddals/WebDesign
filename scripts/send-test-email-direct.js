import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function sendTestEmailDirect() {
  console.log('📧 Sending test email directly to sweepeasellc@gmail.com\n');
  
  try {
    const result = await resend.emails.send({
      from: 'DevTone Contact Form <noreply@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      subject: '🧪 Direct Test - Contact Form Working',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Contact Form Test</h1>
          <p style="color: #666; font-size: 16px;">
            This is a direct test email to confirm the email system is working.
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Test Details:</h3>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> noreply@devtone.agency</p>
            <p><strong>To:</strong> sweepeasellc@gmail.com</p>
            <p><strong>API Key:</strong> Active</p>
          </div>
          <p style="color: #666;">
            If you receive this email, the Resend integration is working correctly.
            The contact form should also work properly.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 14px; text-align: center;">
            DevTone Contact System - Test Email
          </p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('\n📬 Check your inbox at sweepeasellc@gmail.com');
    console.log('📂 Also check spam folder if not in inbox');
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Details:', error.message);
  }
}

sendTestEmailDirect();