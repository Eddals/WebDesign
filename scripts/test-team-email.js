import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function testTeamEmail() {
  console.log('🔍 Testando envio direto para team@devtone.agency\n');
  
  try {
    // Teste 1: Email simples
    console.log('📧 Teste 1: Enviando email simples...');
    const result1 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'team@devtone.agency',
      subject: 'TESTE URGENTE - Verificar Caixa de Entrada e SPAM',
      text: 'Este é um teste direto. Se você receber este email, o sistema está funcionando. Verifique SPAM também.',
      html: `
        <div style="padding: 20px; font-family: Arial;">
          <h1 style="color: red;">TESTE URGENTE - VERIFICAR EMAIL</h1>
          <p>Este é um teste direto do sistema de email.</p>
          <p><strong>Horário:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Se você está lendo isso, o sistema funciona!</strong></p>
          <hr>
          <p>Por favor, verifique também a pasta SPAM/LIXO ELETRÔNICO</p>
        </div>
      `
    });
    
    console.log('✅ Resultado do Teste 1:');
    console.log(JSON.stringify(result1, null, 2));
    
    // Aguardar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Teste 2: Email do formulário de contato
    console.log('\n📧 Teste 2: Simulando formulário de contato...');
    const result2 = await resend.emails.send({
      from: 'DevTone Contact <onboarding@resend.dev>',
      to: 'team@devtone.agency',
      subject: '📬 Novo Formulário de Contato - TESTE',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial;">
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <h1>Novo Contato - TESTE</h1>
          </div>
          <div style="padding: 20px; background: #f5f5f5;">
            <h2>Detalhes do Contato:</h2>
            <p><strong>Nome:</strong> Teste Sistema</p>
            <p><strong>Email:</strong> teste@example.com</p>
            <p><strong>Assunto:</strong> Teste de Funcionamento</p>
            <p><strong>Mensagem:</strong> Esta é uma mensagem de teste para verificar se o email está chegando.</p>
            <hr>
            <p style="color: #666;">Enviado em: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Resultado do Teste 2:');
    console.log(JSON.stringify(result2, null, 2));
    
  } catch (error) {
    console.error('❌ ERRO ao enviar email:', error);
    console.error('Detalhes:', error.message);
    if (error.response) {
      console.error('Resposta da API:', error.response.data);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 INSTRUÇÕES IMPORTANTES:');
  console.log('='.repeat(60));
  console.log('\n1. VERIFIQUE IMEDIATAMENTE:');
  console.log('   - Caixa de entrada principal');
  console.log('   - Pasta SPAM/LIXO ELETRÔNICO');
  console.log('   - Aba Promoções (Gmail)');
  console.log('   - Todas as mensagens');
  console.log('\n2. PROCURE POR:');
  console.log('   - Remetente: onboarding@resend.dev');
  console.log('   - Assunto: "TESTE URGENTE"');
  console.log('   - Assunto: "Novo Formulário de Contato"');
  console.log('\n3. SE NÃO ENCONTRAR:');
  console.log('   - Verifique se team@devtone.agency está correto');
  console.log('   - Acesse: https://resend.com/emails');
  console.log('   - Verifique o status dos emails enviados');
  console.log('\n4. POSSÍVEIS PROBLEMAS:');
  console.log('   - Email team@devtone.agency não existe');
  console.log('   - Servidor de email está bloqueando');
  console.log('   - Filtros muito restritivos');
}

// Executar teste
console.log('Iniciando teste de email...\n');
testTeamEmail();