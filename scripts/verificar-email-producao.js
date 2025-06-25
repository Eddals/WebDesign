#!/usr/bin/env node

console.log('🔍 Verificando configuração de email em produção...\n');

const verificarEmail = async () => {
  // Dados de teste
  const dadosTeste = {
    name: 'Teste Produção',
    email: 'teste@exemplo.com',
    phone: '(11) 99999-9999',
    company: 'Empresa Teste',
    country: 'Brasil',
    industry: 'Tecnologia',
    projectType: 'Website',
    budget: 'R$ 5.000 - R$ 10.000',
    timeline: '1 Mês',
    description: 'Teste de email em produção - verificando se funciona',
    features: ['SEO', 'Contact Form']
  };

  console.log('📧 Testando envio de email para: team@devtone.agency\n');

  try {
    // Testar o endpoint de produção
    const response = await fetch('https://devtone.agency/api/send-estimate-resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosTeste),
    });

    const resultado = await response.json();

    if (response.ok && resultado.success) {
      console.log('✅ SUCESSO! Emails enviados!');
      console.log('\n📬 Verifique estes emails:');
      console.log('   1. team@devtone.agency (notificação admin)');
      console.log('   2. teste@exemplo.com (confirmação cliente)');
      console.log('\n🔗 Veja no Resend: https://resend.com/emails');
    } else {
      console.log('❌ ERRO: Emails não foram enviados');
      console.log('Resposta:', resultado);
      
      console.log('\n⚠️  SOLUÇÃO:');
      console.log('1. Vá em: https://vercel.com/dashboard');
      console.log('2. Clique no projeto "devtone"');
      console.log('3. Settings → Environment Variables');
      console.log('4. Adicione:');
      console.log('   Key: RESEND_API_KEY');
      console.log('   Value: re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');
      console.log('5. Salve e faça REDEPLOY');
    }

  } catch (error) {
    console.log('❌ ERRO de conexão:', error.message);
    console.log('\n💡 Possíveis causas:');
    console.log('1. Site ainda não foi deployado');
    console.log('2. Função do Vercel com erro');
    console.log('3. API key não configurada no Vercel');
  }

  console.log('\n📝 Lembre-se:');
  console.log('- A API key DEVE estar no Vercel (não só no código)');
  console.log('- Após adicionar a API key, faça REDEPLOY');
  console.log('- Emails vêm de: onboarding@resend.dev');
};

verificarEmail();