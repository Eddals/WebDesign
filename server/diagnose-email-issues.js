const nodemailer = require('nodemailer');
require('dotenv').config();

async function diagnoseEmailIssues() {
  console.log('🔍 Diagnosing Email Configuration Issues\n');
  console.log('=' .repeat(50));
  
  // 1. Check environment variables
  console.log('1️⃣ Environment Variables Check:');
  console.log('--------------------------------');
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ESTIMATE_RECIPIENT_EMAIL'];
  let allVarsPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: NOT SET`);
      allVarsPresent = false;
    } else if (varName === 'SMTP_PASS') {
      console.log(`✅ ${varName}: ***${value.slice(-4)}`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  });
  
  if (!allVarsPresent) {
    console.log('\n⚠️  Missing required environment variables!');
    return;
  }
  
  console.log('\n2️⃣ SMTP Connection Test:');
  console.log('------------------------');
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    debug: true,
    logger: true
  });
  
  try {
    console.log('🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.log('❌ SMTP connection failed!');
    console.log('Error:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. For Gmail: Use an App Password instead of your regular password');
      console.log('   - Go to: https://myaccount.google.com/apppasswords');
      console.log('   - Generate a new app password for "Mail"');
      console.log('   - Update SMTP_PASS in .env with the 16-character password');
      console.log('2. Ensure 2-Step Verification is enabled on your Google account');
      console.log('3. Check if "Less secure app access" is needed (not recommended)');
    }
    return;
  }
  
  console.log('3️⃣ Email Delivery Test:');
  console.log('----------------------');
  
  // Test email to team@devtone.agency
  const testEmail = {
    from: `"DevTone Test" <${process.env.SMTP_USER}>`,
    to: process.env.ESTIMATE_RECIPIENT_EMAIL,
    subject: `Email System Test - ${new Date().toLocaleString()}`,
    html: `
      <h2>Email System Test</h2>
      <p>This is a test email to verify the email delivery system is working correctly.</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>SMTP Configuration:</strong></p>
      <ul>
        <li>Host: ${process.env.SMTP_HOST}</li>
        <li>Port: ${process.env.SMTP_PORT}</li>
        <li>From: ${process.env.SMTP_USER}</li>
        <li>To: ${process.env.ESTIMATE_RECIPIENT_EMAIL}</li>
      </ul>
      <p>If you receive this email, your configuration is working correctly!</p>
    `,
    text: `Email System Test\n\nThis is a test email sent at ${new Date().toLocaleString()}\n\nIf you receive this, your email configuration is working correctly!`
  };
  
  try {
    console.log(`📧 Sending test email to: ${process.env.ESTIMATE_RECIPIENT_EMAIL}`);
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    console.log('\n4️⃣ Common Issues to Check:');
    console.log('-------------------------');
    console.log('1. Check SPAM/Junk folder - emails might be filtered');
    console.log('2. Gmail may block "less secure apps" - use App Passwords');
    console.log('3. Some email providers have rate limits');
    console.log('4. Firewall might be blocking SMTP ports (587/465)');
    console.log('5. Email might be delayed - wait a few minutes');
    
    console.log('\n5️⃣ Next Steps:');
    console.log('-------------');
    console.log('1. Check your inbox at:', process.env.ESTIMATE_RECIPIENT_EMAIL);
    console.log('2. Check SPAM/Junk folder');
    console.log('3. If not received, check Gmail settings');
    console.log('4. Try the enhanced email test: node test-enhanced-emails.js');
    
  } catch (error) {
    console.log('❌ Failed to send test email!');
    console.log('Error:', error.message);
    console.log('\nFull error:', error);
  }
  
  console.log('\n6️⃣ API Server Status:');
  console.log('-------------------');
  try {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/health',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Estimate API server is running on port 3002');
      } else {
        console.log('⚠️  API server responded with status:', res.statusCode);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Estimate API server is NOT running!');
      console.log('Start it with: cd server && npm run start:estimate');
    });
    
    req.end();
  } catch (error) {
    console.log('❌ Could not check API server status');
  }
}

// Run diagnostics
diagnoseEmailIssues();