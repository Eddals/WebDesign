const nodemailer = require('nodemailer').default || require('nodemailer');
require('dotenv').config();

async function testGmailSMTP() {
  console.log('🧪 Testing Gmail SMTP Configuration\n');
  console.log('📧 SMTP Settings:');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Secure: ${process.env.SMTP_SECURE}\n`);

  // Create transporter with Gmail settings
  const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  try {
    // Verify connection
    console.log('🔌 Verifying Gmail SMTP connection...');
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified successfully!\n');

    // Send test email
    console.log('📤 Sending test email...');
    
    const testEmail = {
      from: `"DevTone Test" <${process.env.SMTP_USER}>`,
      to: 'matheussenhorzin@gmail.com',
      subject: 'Gmail SMTP Test - DevTone Email System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6B46C1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { margin-bottom: 20px; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .success { background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <img src="https://i.imgur.com/qZ9tgbe.png" alt="DevTone Logo" style="max-width: 150px; height: auto;">
              </div>
              <h1>Gmail SMTP Test Successful!</h1>
            </div>
            <div class="content">
              <div class="success">
                <h2>✅ Gmail SMTP is working correctly!</h2>
                <p>Your email configuration is set up properly and ready to send emails.</p>
              </div>
              
              <h3>Configuration Details:</h3>
              <ul>
                <li><strong>SMTP Host:</strong> smtp.gmail.com</li>
                <li><strong>Port:</strong> 587 (TLS/STARTTLS)</li>
                <li><strong>Authentication:</strong> Yes</li>
                <li><strong>From:</strong> ${process.env.SMTP_USER}</li>
              </ul>
              
              <h3>What This Means:</h3>
              <p>✅ Your estimate form emails will be sent successfully<br>
              ✅ Your contact form emails will be sent successfully<br>
              ✅ All notifications will reach their recipients</p>
              
              <hr style="margin: 30px 0; border: 1px solid #ddd;">
              
              <p style="color: #666; font-size: 14px;">
                Test performed on: ${new Date().toLocaleString()}<br>
                Sent via Gmail SMTP
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Gmail SMTP Test Successful!

✅ Gmail SMTP is working correctly!
Your email configuration is set up properly and ready to send emails.

Configuration Details:
- SMTP Host: smtp.gmail.com
- Port: 587 (TLS/STARTTLS)
- Authentication: Yes
- From: ${process.env.SMTP_USER}

What This Means:
✅ Your estimate form emails will be sent successfully
✅ Your contact form emails will be sent successfully
✅ All notifications will reach their recipients

Test performed on: ${new Date().toLocaleString()}
      `
    };

    const info = await transporter.sendMail(testEmail);
    
    console.log('\n✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('\n📬 Check matheussenhorzin@gmail.com for the test email');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n⚠️  Gmail Authentication Error - Possible solutions:');
      console.log('1. Enable "Less secure app access" in Gmail settings');
      console.log('   OR');
      console.log('2. Use an App Password instead of your regular password:');
      console.log('   - Go to: https://myaccount.google.com/apppasswords');
      console.log('   - Generate an app password for "Mail"');
      console.log('   - Use that password in SMTP_PASS instead of your regular password');
      console.log('\n3. Make sure 2-Step Verification is enabled for App Passwords');
    }
  }
}

// Run the test
testGmailSMTP();