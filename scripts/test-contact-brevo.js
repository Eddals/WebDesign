// Test script for Brevo Contact endpoint using template ID #5
import fetch from 'node-fetch';

const testContactData = {
  name: 'João Silva',
  email: 'joao.silva@exemplo.com',
  phone: '+55 (11) 99999-9999',
  company: 'Empresa Teste Ltda',
  subject: 'general-inquiry',
  message: 'Olá! Gostaria de saber mais sobre os serviços de desenvolvimento web da DevTone Agency. Podem me enviar informações sobre preços e prazos?',
  preferredContact: 'email'
};

async function testContactBrevo() {
  console.log('🧪 Testing Brevo Contact endpoint with template ID #5...');
  console.log('📧 Test data:', testContactData);

  try {
    const response = await fetch('http://localhost:3001/api/contact-brevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContactData)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', response.headers);

    const result = await response.json();
    console.log('📊 Response body:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Contact test successful!');
      console.log('📧 Message:', result.message);
    } else {
      console.log('❌ Contact test failed!');
      console.log('❌ Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testContactBrevo(); 