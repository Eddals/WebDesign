const nodemailer = require('nodemailer');
require('dotenv').config();

async function testIonosEmail() {
  console.log('Testing IONOS email configuration...\n');
  
  // Create transporter with IONOS settings
  const transporter = nodemailer.createTransporter({
    host: 'smtp.ionos.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'team@devtone.agency',
      pass: 'Alebaba1!'
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  try {
    // Verify connection configuration
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Test email data
    const testEmail = {
      from: '"DevTone Test" <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      subject: 'Test Estimate Email from DevTone',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6B46C1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background-color: #e9d5ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test Estimate Email</h1>
            </div>
            <div class="content">
              <div class="highlight">
                <h2>Email Configuration Test Successful!</h2>
                <p>This is a test email to verify that estimate notifications are being sent to <strong>sweepeasellc@gmail.com</strong></p>
              </div>
              
              <h3>Sample Estimate Details:</h3>
              <p><strong>Client Name:</strong> John Doe</p>
              <p><strong>Email:</strong> john@example.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Service Type:</strong> Technical SEO</p>
              <p><strong>Budget:</strong> $5,000 - $10,000</p>
              <p><strong>Timeline:</strong> 1-3 months</p>
              <p><strong>Description:</strong> Looking for comprehensive SEO services including technical optimization, on-page improvements, and content strategy.</p>
              
              <hr style="margin: 30px 0; border: 1px solid #ddd;">
              
              <p style="color: #666; font-size: 14px;">
                This is what you'll receive when someone submits an estimate form on your website.
                <br><br>
                Sent from DevTone Email System on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Test Estimate Email

Email Configuration Test Successful!
This is a test email to verify that estimate notifications are being sent to sweepeasellc@gmail.com

Sample Estimate Details:
- Client Name: John Doe
- Email: john@example.com
- Phone: +1 (555) 123-4567
- Service Type: Technical SEO
- Budget: $5,000 - $10,000
- Timeline: 1-3 months
- Description: Looking for comprehensive SEO services including technical optimization, on-page improvements, and content strategy.

This is what you'll receive when someone submits an estimate form on your website.

Sent from DevTone Email System on ${new Date().toLocaleString()}
      `
    };

    // Send test email
    console.log('Sending test email to sweepeasellc@gmail.com...');
    const info = await transporter.sendMail(testEmail);
    
    console.log('\n✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\n📧 Check sweepeasellc@gmail.com inbox for the test email.');
    console.log('   Subject: "Test Estimate Email from DevTone"');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔐 Authentication Error - Possible solutions:');
      console.log('1. Check if the password is correct');
      console.log('2. Ensure the email account allows SMTP access');
      console.log('3. Check if 2FA is enabled (may need app-specific password)');
      console.log('4. Verify the account is not locked');
    }
  }
}

// Run the test
testIonosEmail();