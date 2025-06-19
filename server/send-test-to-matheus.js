#!/usr/bin/env node

const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📧 Sending test email to batatamalsururuca17@gmail.com\n');

// Check if SMTP is configured
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ SMTP credentials not found in .env file');
  console.log('\nPlease run: npm run setup:email');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test email data
const testData = {
  from: `"DevTone Test" <${process.env.SMTP_USER}>`,
  to: 'batatamalsururuca17@gmail.com',
  subject: 'Test Email from DevTone - SMTP Working! 🎉',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B46C1 0%, #4C1D95 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success { background-color: #10B981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .info-box { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #e5e5e5; }
        .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 DevTone Email Test</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>✅ SMTP Configuration Successful!</h2>
          </div>
          
          <p>Hi Matheus,</p>
          
          <p>Great news! Your SMTP email configuration is working perfectly. This test email confirms that your DevTone estimate form can now send email notifications.</p>
          
          <div class="info-box">
            <h3>📋 Configuration Details:</h3>
            <ul>
              <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'smtp.ionos.com'}</li>
              <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT || 587}</li>
              <li><strong>From Email:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>Sent at:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          
          <div class="info-box">
            <h3>🎯 What's Next?</h3>
            <p>When someone submits your estimate form:</p>
            <ol>
              <li>You'll receive a detailed notification at: <strong>${process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER}</strong></li>
              <li>The client will receive a professional confirmation email</li>
              <li>All form data will be beautifully formatted and easy to read</li>
            </ol>
          </div>
          
          <p>Your email system is now ready to handle estimate form submissions!</p>
          
          <div class="footer">
            <p>This is a test email from your DevTone SMTP configuration.</p>
            <p>© ${new Date().getFullYear()} DevTone. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
DevTone Email Test - SMTP Working! 🎉

Hi Matheus,

Great news! Your SMTP email configuration is working perfectly. This test email confirms that your DevTone estimate form can now send email notifications.

Configuration Details:
- SMTP Host: ${process.env.SMTP_HOST || 'smtp.ionos.com'}
- SMTP Port: ${process.env.SMTP_PORT || 587}
- From Email: ${process.env.SMTP_USER}
- Sent at: ${new Date().toLocaleString()}

What's Next?
When someone submits your estimate form:
1. You'll receive a detailed notification at: ${process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER}
2. The client will receive a professional confirmation email
3. All form data will be beautifully formatted and easy to read

Your email system is now ready to handle estimate form submissions!

This is a test email from your DevTone SMTP configuration.
© ${new Date().getFullYear()} DevTone. All rights reserved.
  `
};

// Send the email
async function sendTestEmail() {
  try {
    console.log('🔌 Connecting to SMTP server...');
    await transporter.verify();
    console.log('✅ SMTP connection verified\n');
    
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail(testData);
    
    console.log('\n✅ SUCCESS! Test email sent to batatamalsururuca17@gmail.com');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log('\n🎉 Your email configuration is working perfectly!');
    console.log('Check your Gmail inbox (and spam folder just in case).');
    
  } catch (error) {
    console.error('\n❌ Failed to send test email:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('   - Your email address is correct');
      console.log('   - Your password is correct');
      console.log('   - For IONOS, use your email password');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection failed. Please check:');
      console.log('   - Your internet connection');
      console.log('   - Firewall settings (port 587 should be open)');
      console.log('   - SMTP host is correct');
    }
    
    process.exit(1);
  }
}

// Run the test
sendTestEmail();