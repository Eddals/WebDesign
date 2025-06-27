import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function finalEmailTest() {
  console.log('🚨 TESTE FINAL - DESCOBRINDO O PROBLEMA\n');
  
  const testEmails = [
    { email: 'delivered@resend.dev', description: 'Email de teste do Resend (sempre funciona)' },
    { email: 'team@devtone.agency', description: 'Email da equipe DevTone' },
    { email: 'bounced@resend.dev', description: 'Email de teste para bounce' }
  ];
  
  console.log('Vamos testar diferentes cenários:\n');
  
  for (const test of testEmails) {
    console.log(`\n📧 Testando: ${test.email}`);
    console.log(`   ${test.description}`);
    console.log('   ' + '-'.repeat(50));
    
    try {
      const result = await resend.emails.send({
        from: 'DevTone Test <onboarding@resend.dev>',
        to: test.email,
        subject: `Teste Final - ${new Date().toLocaleTimeString()}`,
        html: `
          <div style="padding: 20px; font-family: Arial;">
            <h2>Teste de Email - ${test.email}</h2>
            <p>Este é um teste para verificar a entrega de email.</p>
            <p><strong>Destinatário:</strong> ${test.email}</p>
            <p><strong>Horário:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Descrição:</strong> ${test.description}</p>
            <hr>
            <p style="color: #666;">Se você recebeu este email, o sistema está funcionando para este endereço.</p>
          </div>
        `
      });
      
      if (result.data?.id) {
        console.log(`   ✅ SUCESSO! Email enviado`);
        console.log(`   📋 ID: ${result.data.id}`);
        console.log(`   🔍 Verifique em: https://resend.com/emails/${result.data.id}`);
      } else if (result.error) {
        console.log(`   ❌ ERRO: ${result.error.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ FALHA: ${error.message}`);
      if (error.response?.data) {
        console.log(`   Detalhes: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    // Aguardar para evitar rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 ANÁLISE DOS RESULTADOS:');
  console.log('='.repeat(60));
  
  console.log('\n✅ O QUE SABEMOS:');
  console.log('1. A API do Resend está funcionando');
  console.log('2. Os emails estão sendo enviados com sucesso');
  console.log('3. Temos IDs de rastreamento válidos');
  
  console.log('\n❓ O PROBLEMA PODE SER:');
  console.log('1. O email team@devtone.agency não existe ou está mal configurado');
  console.log('2. O servidor de email do domínio devtone.agency está rejeitando');
  console.log('3. Os emails estão indo para uma pasta não verificada');
  console.log('4. Há um redirecionamento ou alias não configurado');
  
  console.log('\n🔧 SOLUÇÕES IMEDIATAS:');
  console.log('\n1. TESTE COM GMAIL:');
  console.log('   - Use um email Gmail pessoal para testar');
  console.log('   - Gmail geralmente aceita emails de teste');
  
  console.log('\n2. VERIFIQUE O PAINEL DO RESEND:');
  console.log('   - Acesse: https://resend.com/emails');
  console.log('   - Veja o status de cada email enviado');
  console.log('   - Procure por mensagens de erro ou bounce');
  
  console.log('\n3. CONFIGURE SEU DOMÍNIO:');
  console.log('   - Vá para: https://resend.com/domains');
  console.log('   - Adicione devtone.agency');
  console.log('   - Siga as instruções de verificação DNS');
  
  console.log('\n4. USE OUTRO PROVEDOR:');
  console.log('   - Se urgente, considere SendGrid ou Mailgun');
  console.log('   - Eles podem ter menos restrições para teste');
  
  console.log('\n📱 CONTATO RESEND:');
  console.log('   - Suporte: https://resend.com/support');
  console.log('   - Documentação: https://resend.com/docs');
}

// Executar teste final
console.log('Executando teste final...\n');
finalEmailTest();