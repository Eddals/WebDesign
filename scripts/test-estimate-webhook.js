// Test script for the Estimate form webhook
// Run with: node scripts/test-estimate-webhook.js

const webhookUrl = 'https://devtone.app.n8n.cloud/webhook-test/https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/cq2QrNJ';

async function testWebhook() {
  console.log('🧪 Testing Estimate form webhook...');
  
  const testData = {
    nome: 'Test User',
    email: 'test@example.com',
    telefone: '123-456-7890',
    tipo_servico: 'Technical SEO',
    descricao_projeto: 'This is a test project description',
    orcamento: '$1000-$5000',
    prazo: '1-3 months',
    tipo_propriedade: 'Commercial',
    tamanho_propriedade: '1000 sqft',
    localizacao: 'New York',
    data_envio: new Date().toISOString(),
    origem: 'test-script'
  };
  
  try {
    console.log('📤 Sending test data to webhook...');
    console.log(JSON.stringify(testData, null, 2));
    
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