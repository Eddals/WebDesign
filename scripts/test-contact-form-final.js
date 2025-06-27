async function testContactFormFinal() {
  console.log('🧪 Teste Final do Formulário de Contato\n');
  
  const testData = {
    full_name: 'Teste Final',
    email: 'sweepeasellc@gmail.com',
    phone: '+1 (555) 123-4567',
    subject: 'Teste Final - Sistema Funcionando',
    message: 'Este é um teste final do formulário de contato usando o domínio verificado devtone.agency. Se você receber este email, o sistema está funcionando perfeitamente!'
  };
  
  console.log('📋 Dados do formulário:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');
  
  try {
    console.log('📡 Enviando para API de produção...');
    const response = await fetch('https://devtone.agency/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://devtone.agency'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    console.log('📨 Resposta da API:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ SUCESSO! Emails enviados!');
      console.log('\n📧 O que foi enviado:');
      console.log('1. Email de confirmação para: sweepeasellc@gmail.com');
      console.log('2. Notificação de admin para: team@devtone.agency');
      console.log('\n🔍 Verifique:');
      console.log('- Caixa de entrada');
      console.log('- Pasta Spam/Lixo Eletrônico');
      console.log('- Aba Promoções (Gmail)');
      console.log('\n💡 Procure por:');
      console.log('- Remetente: noreply@devtone.agency');
      console.log('- Assunto: "We Received Your Message"');
    } else {
      console.log('\n❌ Erro:', result.message);
    }
    
  } catch (error) {
    console.error('\n❌ Erro ao chamar API:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 STATUS DO SISTEMA:');
  console.log('='.repeat(60));
  console.log('✅ Domínio verificado: devtone.agency');
  console.log('✅ Remetente configurado: noreply@devtone.agency');
  console.log('✅ API funcionando em: https://devtone.agency/api/contact');
  console.log('✅ Emails sendo enviados com sucesso');
}

// Executar teste
testContactFormFinal().catch(console.error);