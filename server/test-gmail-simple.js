require('dotenv').config();

console.log('🧪 Testing Gmail SMTP Configuration\n');
console.log('📧 Current SMTP Settings:');
console.log(`   Host: ${process.env.SMTP_HOST}`);
console.log(`   Port: ${process.env.SMTP_PORT}`);
console.log(`   User: ${process.env.SMTP_USER}`);
console.log(`   Pass: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-3) : 'NOT SET'}`);

// Test using the existing email service
const { sendEstimateEmail } = require('./email-service');

async function testGmail() {
  const testData = {
    name: 'Gmail SMTP Test',
    email: 'matheussenhorzin@gmail.com',
    phone: '+1 (555) 123-4567',
    company: 'Test Company',
    country: 'USA',
    industry: 'Technology',
    projectType: 'Gmail SMTP Configuration Test',
    budget: 'Test Budget',
    timeline: 'Immediate',
    description: 'This is a test email to verify Gmail SMTP is working correctly with the new configuration.',
    features: ['Gmail SMTP', 'Port 587', 'TLS/STARTTLS']
  };

  console.log('\n📤 Sending test email via Gmail SMTP...\n');
  
  try {
    const result = await sendEstimateEmail(testData);
    
    if (result.success) {
      console.log('✅ SUCCESS! Gmail SMTP is working!');
      console.log('📧 Check sweepeasellc@gmail.com for the test email');
      console.log('\n✨ Your email system is now using Gmail SMTP successfully!');
    } else {
      console.log('❌ Failed to send email');
      console.log('Error:', result.error);
      
      if (result.error.includes('Invalid login')) {
        console.log('\n⚠️  Gmail requires an App Password for SMTP:');
        console.log('1. Go to: https://myaccount.google.com/apppasswords');
        console.log('2. Sign in to your Google account');
        console.log('3. Select "Mail" as the app');
        console.log('4. Select your device');
        console.log('5. Click "Generate"');
        console.log('6. Copy the 16-character password');
        console.log('7. Update SMTP_PASS in server/.env with this app password');
        console.log('\nNote: You need 2-Step Verification enabled to use App Passwords');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGmail();