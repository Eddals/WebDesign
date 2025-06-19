#!/usr/bin/env node

const nodemailer = require('nodemailer');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 Alternate Email Test\n');

rl.question('Enter an alternate email address to test (not Gmail): ', async (email) => {
  if (!email || !email.includes('@')) {
    console.log('❌ Invalid email address');
    rl.close();
    return;
  }

  console.log(`\n📤 Sending test email to: ${email}\n`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ionos.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"DevTone Test" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'DevTone Email Test - Checking Delivery',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B46C1;">DevTone Email Test</h2>
          <p>This test confirms that your email system is working correctly.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent from: ${process.env.SMTP_USER}</li>
              <li>Sent to: ${email}</li>
              <li>Time: ${new Date().toLocaleString()}</li>
              <li>SMTP Server: ${process.env.SMTP_HOST}</li>
            </ul>
          </div>
          <p>If you received this email, your SMTP configuration is working perfectly!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
          <p style="color: #666; font-size: 12px;">
            Note: Gmail may be blocking or filtering emails from new domains. 
            Consider adding SPF records to improve deliverability.
          </p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Check ${email} for the test message`);
    
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }

  rl.close();
});