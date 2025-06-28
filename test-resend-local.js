const { Resend } = require('resend');

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function testResend() {
  try {
    console.log('🚀 Testando Resend diretamente...\n');

    const data = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'test@example.com', // Altere para seu email real
      subject: 'Teste de Integração Resend',
      html: `
        <h2>Teste de E-mail Automático</h2>
        <p>Este é um teste do sistema de automação de e-mail com Resend.</p>
        <p>Se você está recebendo este e-mail, o sistema está funcionando corretamente!</p>
        <br>
        <p>Atenciosamente,<br>DevTone Agency</p>
      `,
      text: 'Teste de E-mail Automático\n\nEste é um teste do sistema de automação de e-mail com Resend.\n\nSe você está recebendo este e-mail, o sistema está funcionando corretamente!\n\nAtenciosamente,\nDevTone Agency'
    });

    console.log('✅ E-mail enviado com sucesso!');
    console.log('📧 ID do e-mail:', data.id);
    console.log('\nDetalhes:', data);

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    console.error('\nDetalhes do erro:', error.message);
    if (error.response) {
      console.error('Resposta da API:', error.response);
    }
  }
}

testResend();