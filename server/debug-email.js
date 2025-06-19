#!/usr/bin/env node

const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📧 Email Delivery Debug Tool\n');
console.log('='.repeat(50));

// Show current configuration
console.log('Current Configuration:');
console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
console.log(`SMTP Port: ${process.env.SMTP_PORT}`);
console.log(`SMTP User: ${process.env.SMTP_USER}`);
console.log(`SMTP Pass: ${'*'.repeat(process.env.SMTP_PASS?.length || 0)}`);
console.log('='.repeat(50));

// Create transporter with debug enabled
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true, // Enable debug output
  logger: true // Enable logger
});

async function sendDebugEmail() {
  try {
    console.log('\n🔍 Verifying SMTP connection...\n');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully\n');
    
    // Try sending to multiple addresses for testing
    const testAddresses = [
      'matheusnagringanyc@gmail.com',
      process.env.SMTP_USER // Also send to yourself
    ];
    
    for (const email of testAddresses) {
      console.log(`\n📤 Attempting to send to: ${email}`);
      console.log('-'.repeat(40));
      
      const mailOptions = {
        from: `"DevTone Test" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Test Email - ${new Date().toLocaleTimeString()}`,
        text: `This is a plain text test email sent at ${new Date().toLocaleString()}.\n\nIf you receive this, your SMTP configuration is working correctly.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Test Email from DevTone</h2>
            <p>This is a test email sent at <strong>${new Date().toLocaleString()}</strong></p>
            <p>If you receive this, your SMTP configuration is working correctly.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Sent from: ${process.env.SMTP_USER}<br>
              SMTP Server: ${process.env.SMTP_HOST}
            </p>
          </div>
        `
      };
      
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully!`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}`);
        
        if (info.accepted && info.accepted.length > 0) {
          console.log(`   Accepted by: ${info.accepted.join(', ')}`);
        }
        if (info.rejected && info.rejected.length > 0) {
          console.log(`   ❌ Rejected by: ${info.rejected.join(', ')}`);
        }
      } catch (error) {
        console.error(`❌ Failed to send to ${email}:`);
        console.error(`   Error: ${error.message}`);
        if (error.responseCode) {
          console.error(`   Response Code: ${error.responseCode}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n📋 Troubleshooting Tips:\n');
    console.log('1. Check Gmail spam/junk folder');
    console.log('2. Check Gmail "All Mail" folder');
    console.log('3. Search Gmail for: from:team@devtone.agency');
    console.log('4. Check if Gmail is blocking IONOS servers');
    console.log('5. Try adding team@devtone.agency to your Gmail contacts');
    console.log('\n🔍 Gmail specific checks:');
    console.log('- Go to Gmail Settings > Filters and Blocked Addresses');
    console.log('- Check if there are any filters blocking the email');
    console.log('- Look in Promotions, Updates, or Forums tabs');
    
  } catch (error) {
    console.error('\n❌ Connection/Authentication Error:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication issue detected:');
      console.log('- Verify your IONOS email password is correct');
      console.log('- Make sure you\'re using the email password, not IONOS account password');
    }
  }
}

// Run the debug
sendDebugEmail();