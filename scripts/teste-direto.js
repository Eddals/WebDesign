console.log('🚀 TESTE DIRETO DO FORMULÁRIO\n');

async function testeFormulario() {
  const dados = {
    full_name: 'João Silva',
    email: 'joao@example.com',
    phone: '+55 11 99999-9999',
    company: 'Empresa ABC',
    subject: 'website-issue',
    message: 'Preciso de ajuda com meu site. Está com problemas de carregamento.',
    preferredContact: 'phone'
  };
  
  console.log('📋 Enviando dados:', dados);
  console.log('\n📡 Para: https://devtone.agency/api/contact-form\n');
  
  try {
    const response = await fetch('https://devtone.agency/api/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados)
    });
    
    const result = await response.json();
    
    console.log('✅ Resposta:', result);
    
    if (result.success) {
      console.log('\n🎉 SUCESSO!');
      console.log('📧 Email enviado para: sweepeasellc@gmail.com');
      console.log('📧 Confirmação enviada para: joao@example.com');
      console.log('\n🔍 VERIFIQUE AGORA:');
      console.log('1. Caixa de entrada de sweepeasellc@gmail.com');
      console.log('2. Pasta SPAM/Lixo');
      console.log('3. Procure por: from:noreply@devtone.agency');
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

testeFormulario();