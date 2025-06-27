import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function runEmailDiagnostics() {
  console.log('🔍 Running Email Diagnostics for DevTone Contact Form\n');
  console.log('=' .repeat(60));
  
  // Configuration
  const testEmails = [
    'delivered@resend.dev',  // Resend's test inbox (always works)
    'team@devtone.agency',   // Your admin email
    // Add your personal email here for testing
    // 'your-email@example.com'
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  // Test 1: API Key Validation
  console.log('\n📌 Test 1: API Key Validation');
  console.log('-'.repeat(40));
  try {
    const testResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev',
      subject: 'API Key Test',
      text: 'Testing API key validity',
    });
    console.log('✅ API Key is valid');
    console.log(`   Email ID: ${testResult.data?.id}`);
    successCount++;
  } catch (error) {
    console.log('❌ API Key is invalid or expired');
    console.log(`   Error: ${error.message}`);
    failCount++;
    return; // Stop here if API key is invalid
  }
  
  // Test 2: Send to multiple test addresses
  console.log('\n📌 Test 2: Email Delivery Test');
  console.log('-'.repeat(40));
  
  for (const email of testEmails) {
    console.log(`\n   Testing: ${email}`);
    try {
      const result = await resend.emails.send({
        from: 'DevTone Contact Form <onboarding@resend.dev>',
        to: email,
        subject: '🧪 DevTone Contact Form - Diagnostic Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Contact Form Diagnostic Test</h2>
            <p>This is a diagnostic email to verify delivery to: <strong>${email}</strong></p>
            <hr>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>From:</strong> onboarding@resend.dev</p>
            <p><strong>API Status:</strong> Working</p>
            <hr>
            <p style="color: #666; font-size: 14px;">
              If you received this email, the contact form email system is working correctly for this address.
            </p>
          </div>
        `,
      });
      
      console.log(`   ✅ Sent successfully`);
      console.log(`      Email ID: ${result.data?.id}`);
      successCount++;
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 600));
      
    } catch (error) {
      console.log(`   ❌ Failed to send`);
      console.log(`      Error: ${error.message}`);
      failCount++;
    }
  }
  
  // Test 3: Check rate limiting
  console.log('\n📌 Test 3: Rate Limit Check');
  console.log('-'.repeat(40));
  try {
    // Send 3 emails quickly to test rate limit
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'delivered@resend.dev',
        subject: `Rate Limit Test ${i + 1}`,
        text: 'Testing rate limits',
      }));
    }
    
    const results = await Promise.allSettled(promises);
    const rateLimited = results.filter(r => r.status === 'rejected' && r.reason.message.includes('rate_limit')).length;
    
    if (rateLimited > 0) {
      console.log(`⚠️  Rate limit detected: ${rateLimited} emails were rate limited`);
      console.log('   Current limit: 2 emails per second');
    } else {
      console.log('✅ No rate limiting issues detected');
    }
  } catch (error) {
    console.log('❌ Rate limit test failed:', error.message);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful tests: ${successCount}`);
  console.log(`❌ Failed tests: ${failCount}`);
  console.log('\n📋 Checklist:');
  console.log('[ ] Check spam/junk folders for test emails');
  console.log('[ ] Verify email addresses are correct');
  console.log('[ ] Check Resend dashboard: https://resend.com/emails');
  console.log('[ ] Wait 2-5 minutes for delivery');
  console.log('\n💡 Recommendations:');
  console.log('1. If emails to "delivered@resend.dev" work but others don\'t:');
  console.log('   - The recipient email server might be blocking');
  console.log('   - Try different email providers (Gmail, Outlook, etc)');
  console.log('2. For production use:');
  console.log('   - Verify your own domain in Resend');
  console.log('   - Use your domain instead of onboarding@resend.dev');
  console.log('3. To improve deliverability:');
  console.log('   - Set up SPF, DKIM, and DMARC records');
  console.log('   - Use a verified domain');
  console.log('\n🔗 Useful Links:');
  console.log('- Resend Dashboard: https://resend.com/emails');
  console.log('- API Logs: https://resend.com/api-keys');
  console.log('- Domain Setup: https://resend.com/domains');
}

// Run diagnostics
console.log('Starting email diagnostics...\n');
runEmailDiagnostics().catch(console.error);