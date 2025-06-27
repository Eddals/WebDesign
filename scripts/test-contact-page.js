async function testContactPage() {
  console.log('🧪 Testando o formulário de contato\n');
  
  // Dados de teste
  const testData = {
    full_name: 'Teste Usuário',
    email: 'usuario@teste.com',
    phone: '+1 (555) 123-4567',
    company: 'Empresa Teste',
    subject: 'general-inquiry',
    message: 'Esta é uma mensagem de teste do formulário de contato.',
    preferredContact: 'email'
  };
  
  console.log('📋 Dados do teste:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');
  
  try {
    // Testar API de produção
    console.log('📡 Testando API de produção...');
    const response = await fetch('https://devtone.agency/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://devtone.agency'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('📧 Resposta da API:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ SUCESSO! O sistema de email está funcionando!');
      console.log('\n📬 O que aconteceu:');
      console.log('1. Email de notificação enviado para: sweepeasellc@gmail.com');
      console.log('2. Email de confirmação enviado para: usuario@teste.com');
      console.log('\n🔍 Verifique:');
      console.log('- Caixa de entrada de sweepeasellc@gmail.com');
      console.log('- Pasta SPAM/Lixo Eletrônico');
      console.log('- Procure por: from:noreply@devtone.agency');
    } else {
      console.log('\n❌ Erro:', result.message);
    }
    
  } catch (error) {
    console.error('\n❌ Erro ao testar:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 INFORMAÇÕES IMPORTANTES:');
  console.log('='.repeat(60));
  console.log('\n✅ O formulário de contato:');
  console.log('- NÃO usa mais Supabase');
  console.log('- Envia emails diretamente via Resend');
  console.log('- Admin recebe em: sweepeasellc@gmail.com');
  console.log('- Cliente recebe confirmação no email dele');
  console.log('\n📧 Configuração atual:');
  console.log('- Domínio: noreply@devtone.agency');
  console.log('- API: /api/contact');
  console.log('- Sem dependência de banco de dados');
}

// Executar teste
testContactPage().catch(console.error);