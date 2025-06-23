const { sendEstimateEmail, sendClientConfirmationEmail } = require('./email-service');
require('dotenv').config();

// Test data that matches what the EstimateForm sends
const testFormData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  company: 'Test Company',
  country: 'USA',
  industry: 'Technology',
  projectType: 'Technical SEO',
  budget: '$5,000 - $10,000',
  timeline: '1-3 months',
  description: 'This is a test estimate request to verify email functionality.',
  features: ['Keyword Research', 'On-Page Optimization', 'Technical Audit']
};

async function testEmails() {
  console.log('Testing estimate email service...\n');
  console.log('SMTP Configuration:');
  console.log(`- Host: ${process.env.SMTP_HOST}`);
  console.log(`- Port: ${process.env.SMTP_PORT}`);
  console.log(`- User: ${process.env.SMTP_USER}`);
  console.log(`- Recipient: ${process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER}\n`);

  try {
    // Test admin notification email
    console.log('1. Sending admin notification email...');
    const adminResult = await sendEstimateEmail(testFormData);
    
    if (adminResult.success) {
      console.log('✅ Admin email sent successfully!');
      console.log(`   Message ID: ${adminResult.messageId}\n`);
    } else {
      console.log('❌ Failed to send admin email');
      console.log(`   Error: ${adminResult.error}\n`);
    }

    // Test client confirmation email
    console.log('2. Sending client confirmation email...');
    const clientResult = await sendClientConfirmationEmail(testFormData);
    
    if (clientResult.success) {
      console.log('✅ Client confirmation email sent successfully!\n');
    } else {
      console.log('❌ Failed to send client confirmation email');
      console.log(`   Error: ${clientResult.error}\n`);
    }

    console.log('Email test completed!');
    console.log('\nNote: Check your inbox for the test emails.');
    
  } catch (error) {
    console.error('Error during email test:', error);
  }
}

// Run the test
testEmails();