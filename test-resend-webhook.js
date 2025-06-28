// Script de teste para o webhook Resend
// Execute com: node test-resend-webhook.js

const testWebhook = async () => {
  console.log('🚀 Testando webhook Resend...\n');

  const testData = {
    name: 'Teste Usuario',
    email: 'teste@example.com', // Altere para seu e-mail real para receber o teste
    phone: '(11) 99999-9999',
    company: 'Empresa Teste',
    subject: 'Teste de Integração',
    message: 'Esta é uma mensagem de teste para verificar se o sistema de e-mail automático está funcionando corretamente.'
  };

  console.log('📋 Dados de teste:', testData);
  console.log('\n📡 Enviando para: https://devtone.agency/api/webhooks/resend-simple\n');

  try {
    const response = await fetch('https://devtone.agency/api/webhooks/resend-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Sucesso!');
      console.log('📧 IDs dos e-mails:');
      console.log('   - Confirmação:', result.confirmationId);
      console.log('   - Notificação:', result.notificationId);
      console.log('\n✉️  Verifique sua caixa de entrada!');
    } else {
      console.error('❌ Erro:', response.status, response.statusText);
      console.error('Detalhes:', result);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
};

// Executar teste
testWebhook();