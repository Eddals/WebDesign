import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function sendTestEmail() {
  // IMPORTANT: Change this to your actual email address
  const YOUR_EMAIL = 'your-email@example.com'; // <-- CHANGE THIS!
  
  console.log('📧 Sending test email to:', YOUR_EMAIL);
  console.log('Please make sure to change the email address in the script!\n');
  
  try {
    const result = await resend.emails.send({
      from: 'DevTone Contact Form <onboarding@resend.dev>',
      to: YOUR_EMAIL,
      subject: '🎉 DevTone Contact Form is Working!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px;">✅ Contact Form is Working!</h1>
      <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Your email integration is set up correctly</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        <strong>Congratulations!</strong> If you're reading this email, your DevTone contact form email system is working perfectly.
      </p>
      
      <div style="background-color: #f0f7ff; padding: 25px; border-radius: 10px; margin: 25px 0;">
        <h2 style="color: #2541b2; margin: 0 0 15px 0; font-size: 20px;">📋 What's Working:</h2>
        <ul style="color: #555; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>✅ Resend API is configured correctly</li>
          <li>✅ Email templates are rendering properly</li>
          <li>✅ Contact form can send notifications</li>
          <li>✅ Both customer and admin emails will be sent</li>
        </ul>
      </div>
      
      <div style="background-color: #fff8dc; padding: 20px; border-radius: 10px; border-left: 4px solid #f4a261; margin: 25px 0;">
        <h3 style="color: #e76f51; margin: 0 0 10px 0; font-size: 18px;">⚠️ Important Notes:</h3>
        <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
          <li>Currently using <code>onboarding@resend.dev</code> as the sender</li>
          <li>For production, verify your own domain in Resend</li>
          <li>Check spam folder if emails don't appear in inbox</li>
          <li>Rate limit: 2 emails per second</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://resend.com/emails" style="display: inline-block; background-color: #4a6cf7; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">View Email Logs in Resend</a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
        Sent on ${new Date().toLocaleString()}<br>
        Email ID: Will be shown in console
      </p>
    </div>
    
  </div>
</body>
</html>
      `,
    });
    
    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log('📬 Email ID:', result.data.id);
    console.log('\n📍 Next steps:');
    console.log('1. Check your inbox (and spam folder)');
    console.log('2. View email status at: https://resend.com/emails');
    console.log('3. If you don\'t receive it, make sure you changed YOUR_EMAIL in the script');
    
  } catch (error) {
    console.error('\n❌ ERROR sending email:', error.message);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
  }
}

// Run the test
sendTestEmail();