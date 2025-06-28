import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function testResendWithRealEmail() {
  try {
    console.log('🚀 Testando sistema de e-mail automático Resend...\n');
    
    // IMPORTANTE: Substitua este e-mail pelo e-mail real do cliente
    const clientEmail = 'cliente@gmail.com'; // <-- COLOQUE O EMAIL REAL AQUI
    
    console.log(`📧 Enviando e-mail de confirmação para: ${clientEmail}\n`);

    const data = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: clientEmail,
      subject: 'Confirmação de Contato - DevTone Agency',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Obrigado pelo seu contato!</h1>
            </div>
            <div class="content">
              <h2>Olá!</h2>
              <p>Este é um e-mail automático para confirmar que recebemos sua mensagem.</p>
              <p><strong>Este é um teste do sistema de automação de e-mail.</strong></p>
              <p>Nossa equipe entrará em contato em breve para dar continuidade ao seu atendimento.</p>
              <p>Enquanto isso, você pode:</p>
              <ul>
                <li>Visitar nosso site: <a href="https://devtone.agency">devtone.agency</a></li>
                <li>Nos seguir nas redes sociais</li>
                <li>Conhecer nossos serviços</li>
              </ul>
              <a href="https://devtone.agency" class="button">Visitar nosso site</a>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #666;">
                DevTone Agency<br>
                📧 team@devtone.agency<br>
                📱 +1 (718) 419-3863<br>
                <br>
                Este é um e-mail automático, por favor não responda.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Obrigado pelo seu contato!

Este é um e-mail automático para confirmar que recebemos sua mensagem.

Este é um teste do sistema de automação de e-mail.

Nossa equipe entrará em contato em breve para dar continuidade ao seu atendimento.

Atenciosamente,
DevTone Agency

📧 team@devtone.agency
📱 +1 (718) 419-3863

Este é um e-mail automático, por favor não responda.`
    });

    console.log('✅ E-mail enviado com sucesso!');
    console.log('📧 ID do e-mail:', data.data?.id || 'N/A');
    console.log('\n✨ O cliente receberá o e-mail de confirmação em alguns segundos.');
    console.log('\n📌 Detalhes:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    console.error('\nDetalhes do erro:', error.message);
  }
}

// Executar o teste
console.log('====================================');
console.log('TESTE DO SISTEMA DE E-MAIL AUTOMÁTICO');
console.log('====================================\n');
console.log('⚠️  IMPORTANTE: Edite este arquivo e substitua "cliente@gmail.com" pelo e-mail real do cliente antes de executar!\n');

testResendWithRealEmail();