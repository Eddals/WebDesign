// Test webhook format to understand what Resend sends

import fetch from 'node-fetch';

// Sample Resend webhook payload
const sampleWebhookPayload = {
  type: 'email.sent',
  created_at: new Date().toISOString(),
  data: {
    created_at: new Date().toISOString(),
    email_id: '229f8fcb-d8ce-4c48-b525-b11e4b6a2ee6',
    from: 'team@devtone.agency',
    to: ['sweepeasellc@gmail.com'],
    subject: 'Test Email'
  }
};

async function testWebhook() {
  console.log('🧪 Testing webhook endpoint\n');
  
  // Test local webhook endpoint
  const webhookUrl = 'http://localhost:3000/api/webhooks/resend-simple';
  
  console.log('📤 Sending test webhook to:', webhookUrl);
  console.log('📦 Payload:', JSON.stringify(sampleWebhookPayload, null, 2));
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Resend webhook headers
        'svix-id': 'msg_test123',
        'svix-timestamp': Date.now().toString(),
        'svix-signature': 'v1=test_signature'
      },
      body: JSON.stringify(sampleWebhookPayload)
    });
    
    const result = await response.json();
    
    console.log('\n📥 Response:');
    console.log('   Status:', response.status);
    console.log('   Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Webhook endpoint is working!');
    } else {
      console.log('\n❌ Webhook endpoint returned an error');
    }
    
  } catch (error) {
    console.error('\n❌ Error testing webhook:', error.message);
    console.log('\n💡 Make sure your Next.js app is running (npm run dev)');
  }
}

// Also show what the actual webhook URL should be
console.log('📍 Production webhook URLs:');
console.log('   Primary: https://devtone.agency/api/webhooks/resend');
console.log('   Simple: https://devtone.agency/api/webhooks/resend-simple');
console.log('\n');

testWebhook();