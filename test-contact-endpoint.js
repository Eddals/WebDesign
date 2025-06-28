// Script para testar o endpoint de contato diretamente
// Execute com: node test-contact-endpoint.js

async function testContactEndpoint() {
  try {
    console.log('🚀 Testando endpoint de contato...');
    
    // Dados de teste
    const testData = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '(11) 99999-9999',
      company: 'Empresa Teste',
      subject: 'Teste de Formulário de Contato',
      message: 'Esta é uma mensagem de teste para verificar se o formulário de contato está funcionando corretamente.',
      preferredContact: 'Email'
    };
    
    console.log('📋 Dados de teste:', testData);
    
    // Fazer requisição para o endpoint
    const response = await fetch('http://localhost:3001/api/simple-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📄 Resultado:', result);
    
    if (response.ok) {
      console.log('✅ Teste bem-sucedido!');
      console.log('📧 Email para admin ID:', result.details?.adminEmailId);
      console.log('📧 Email para cliente ID:', result.details?.clientEmailId);
    } else {
      console.log('❌ Teste falhou:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testContactEndpoint();