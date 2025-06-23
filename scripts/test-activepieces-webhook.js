// Test script for ActivePieces webhook
// Run with: node scripts/test-activepieces-webhook.js

const webhookUrl = 'https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg';

async function testWebhook() {
  console.log('🧪 Testing ActivePieces webhook...');
  
  const testData = {
    nome: 'Test User',
    email: 'test@example.com',
    telefone: '123-456-7890',
    empresa: 'Test Company',
    pais: 'Brazil',
    industria: 'Technology',
    tipo_projeto: 'Website',
    orcamento: '$1000-$5000',
    prazo: '1-2 months',
    mensagem: 'This is a test message from the webhook test script.',
    recursos: 'Feature 1, Feature 2',
    timestamp: new Date().toISOString(),
    fonte: 'webhook-test-script'
  };
  
  try {
    console.log('📤 Sending test data to webhook...');
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
      try {
        const responseData = await response.text();
        console.log('📄 Response data:', responseData || '(empty response)');
      } catch (e) {
        console.log('📄 No response data or not JSON format');
      }
    } else {
      console.error('❌ Webhook test failed!');
      console.error('📄 Response text:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error);
  }
}

testWebhook();