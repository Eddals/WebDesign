// Diagnostic script to check Resend configuration and test emails

import { Resend } from 'resend';

const resend = new Resend('re_68sbnJcD_9agW1SfXoz3drqNNEdmEN2gd');

async function diagnoseResend() {
  console.log('🔍 Diagnosing Resend Configuration\n');

  // 1. Test basic email sending
  console.log('1️⃣ Testing basic email send...');
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sweepeasellc@gmail.com',
      subject: '🔍 Resend Diagnostic Test',
      html: '<p>This is a diagnostic test email from your Resend setup.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('   Email ID:', result.id);
    console.log('   Response:', result);
  } catch (error) {
    console.error('❌ Email send failed:', error);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }

  // 2. Check API key validity
  console.log('\n2️⃣ Checking API key...');
  try {
    // Try to list emails (this will fail with invalid key)
    const emails = await resend.emails.list();
    console.log('✅ API key is valid');
    console.log('   Recent emails:', emails.data?.length || 0);
  } catch (error) {
    console.error('❌ API key issue:', error.message);
  }

  // 3. Test webhook endpoint
  console.log('\n3️⃣ Testing webhook endpoint...');
  console.log('   Webhook URL should be: https://devtone.agency/api/webhooks/resend');
  console.log('   Alternative URL: https://devtone.agency/api/webhooks/resend-simple');
  
  // 4. Common issues
  console.log('\n4️⃣ Common Issues to Check:');
  console.log('   - Domain verification: Make sure devtone.com or devtone.agency is verified');
  console.log('   - From address: Use verified domain or onboarding@resend.dev for testing');
  console.log('   - Webhook secret: Make sure it matches what\'s in Resend dashboard');
  console.log('   - API routes: Ensure /api/send-estimate exists and is deployed');

  // 5. UUID Error explanation
  console.log('\n5️⃣ About the UUID Error:');
  console.log('   The "id must be a valid UUID" error usually means:');
  console.log('   - The webhook is expecting a different format');
  console.log('   - There might be a mismatch in the webhook URL');
  console.log('   - Try using the simpler webhook: /api/webhooks/resend-simple');

  console.log('\n✅ Diagnosis complete!');
}

diagnoseResend();