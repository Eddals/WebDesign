// Test email sending with verified domain

import { Resend } from 'resend';

const resend = new Resend('re_68sbnJcD_9agW1SfXoz3drqNNEdmEN2gd');

async function testVerifiedEmail() {
  console.log('🧪 Testing email with verified domain devtone.agency\n');

  try {
    // Test 1: Simple email
    console.log('1️⃣ Sending test email...');
    const result = await resend.emails.send({
      from: 'DevTone <team@devtone.agency>',
      to: ['sweepeasellc@gmail.com'],
      subject: 'Test - Domain Verified',
      html: '<h1>Success!</h1><p>Your domain devtone.agency is working correctly with Resend.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('   Response:', JSON.stringify(result, null, 2));
    
    if (result.data && result.data.id) {
      console.log('   Email ID:', result.data.id);
    }
    
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('   Message:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // Test 2: Check what "from" addresses work
  console.log('\n2️⃣ Testing different from addresses...');
  const fromAddresses = [
    'noreply@devtone.agency',
    'hello@devtone.agency',
    'contact@devtone.agency',
    'team@devtone.agency'
  ];

  for (const fromEmail of fromAddresses) {
    try {
      console.log(`   Testing ${fromEmail}...`);
      const result = await resend.emails.send({
        from: `DevTone <${fromEmail}>`,
        to: ['sweepeasellc@gmail.com'],
        subject: `Test from ${fromEmail}`,
        html: `<p>Testing from address: ${fromEmail}</p>`
      });
      console.log(`   ✅ ${fromEmail} works!`);
      break; // Stop after first success
    } catch (error) {
      console.log(`   ❌ ${fromEmail} failed: ${error.message}`);
    }
  }
}

testVerifiedEmail();