#!/usr/bin/env node

const { sendEstimateEmail, sendClientConfirmationEmail } = require('./email-service');
require('dotenv').config();

console.log('📧 Email Configuration Test\n');
console.log('='.repeat(50));

// Check environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.log('\nPlease configure your .env file with SMTP settings.');
  process.exit(1);
}

console.log('✅ Environment variables configured:');
console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
console.log(`   SMTP_PASS: ${'*'.repeat(process.env.SMTP_PASS.length)}`);
console.log(`   RECIPIENT: ${process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER}`);
console.log();

// Test data
const testFormData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '(555) 123-4567',
  company: 'Test Company Inc.',
  country: 'United States',
  industry: 'Technology & Software',
  projectType: 'E-commerce Store',
  budget: '$5,000 - $15,000',
  timeline: '2-3 Months',
  description: 'This is a test estimate submission to verify email functionality. We need a modern e-commerce platform with payment integration, inventory management, and a responsive design.',
  features: ['seo', 'analytics', 'security', 'maintenance']
};

async function runTest() {
  console.log('🚀 Starting email test...\n');

  // Test 1: Admin notification email
  console.log('📤 Test 1: Sending admin notification email...');
  const adminResult = await sendEstimateEmail(testFormData);
  
  if (adminResult.success) {
    console.log('✅ Admin email sent successfully!');
    console.log(`   Message ID: ${adminResult.messageId}`);
  } else {
    console.error('❌ Failed to send admin email:');
    console.error(`   ${adminResult.error}`);
  }
  
  console.log();

  // Test 2: Client confirmation email (optional)
  if (process.argv.includes('--with-client')) {
    console.log('📤 Test 2: Sending client confirmation email...');
    const clientResult = await sendClientConfirmationEmail(testFormData);
    
    if (clientResult.success) {
      console.log('✅ Client email sent successfully!');
    } else {
      console.error('❌ Failed to send client email:');
      console.error(`   ${clientResult.error}`);
    }
  } else {
    console.log('ℹ️  Skipping client email test. Use --with-client flag to include it.');
  }

  console.log('\n' + '='.repeat(50));
  console.log('📧 Email test completed!');
  
  if (adminResult.success) {
    console.log('\n✅ Your email configuration is working correctly!');
    console.log(`Check ${process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER} for the test email.`);
  } else {
    console.log('\n❌ Email configuration needs attention.');
    console.log('Please check your SMTP settings and try again.');
  }
}

// Run the test
runTest().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});