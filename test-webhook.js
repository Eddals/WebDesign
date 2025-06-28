// Script para testar o webhook de contato
// Execute com: node test-webhook.js

import fetch from 'node-fetch';

async function testWebhook() {
  try {
    console.log('🚀 Testando webhook de contato...');
    
    // Dados de teste para o formulário
    const testData = {
      name: 'Usuário de Teste',
      email: 'sweepeasellc@gmail.com', // Use um email real para receber a confirmação
      phone: '123-456-7890',
      company: 'Empresa de Teste',
      subject: 'Teste do Webhook',
      message: 'Esta é uma mensagem de teste para verificar se o webhook está funcionando corretamente.',
      preferredContact: 'Email'
    };
    
    // Enviar para o webhook de produção
    const prodResponse = await fetch('https://devtone.agency/api/webhooks/resend-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const prodResult = await prodResponse.json();
    console.log('📡 Resposta do webhook de produção:', prodResult);
    
    console.log('✅ Teste concluído!');
  } catch (error) {
    console.error('❌ Erro ao testar webhook:', error);
  }
}

testWebhook();