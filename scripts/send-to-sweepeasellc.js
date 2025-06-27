import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function sendToSweepeasellc() {
  const targetEmail = 'sweepeasellc@gmail.com';
  console.log(`📧 Enviando email para: ${targetEmail}\n`);
  
  try {
    // Email 1: Notificação simples
    console.log('Enviando email de teste...');
    const result1 = await resend.emails.send({
      from: 'DevTone Contact <onboarding@resend.dev>',
      to: targetEmail,
      subject: 'Teste do Sistema de Contato DevTone - Verifique Spam',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #dee2e6;">
            <h1 style="color: #333; margin-bottom: 20px;">✅ Teste de Email - DevTone</h1>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Este é um email de teste do sistema de contato DevTone.
            </p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Importante:</strong> Se este email estiver na pasta SPAM, marque como "Não é spam" para receber futuros emails na caixa de entrada.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #555;">
              <strong>Horário de envio:</strong> ${new Date().toLocaleString()}<br>
              <strong>Email ID:</strong> Será mostrado no console
            </p>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #6c757d;">
              Este email foi enviado através do Resend API usando o domínio de teste.
            </p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Email 1 enviado com sucesso!');
    console.log('ID:', result1.data?.id || result1.id);
    
    // Aguardar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Email 2: Simulação de formulário de contato
    console.log('\nEnviando email simulando formulário de contato...');
    const result2 = await resend.emails.send({
      from: 'DevTone Agency <onboarding@resend.dev>',
      to: targetEmail,
      subject: '📬 Nova Mensagem de Contato - DevTone',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: #ffffff; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Nova Mensagem de Contato</h1>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="color: #333; margin-bottom: 20px;">Detalhes do Contato:</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Nome:</strong> Cliente Teste</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> teste@example.com</p>
        <p style="margin: 5px 0;"><strong>Telefone:</strong> (11) 99999-9999</p>
        <p style="margin: 5px 0;"><strong>Assunto:</strong> Teste do Sistema de Email</p>
      </div>
      
      <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px;">
        <h3 style="color: #495057; margin-top: 0;">Mensagem:</h3>
        <p style="color: #495057; line-height: 1.6;">
          Esta é uma mensagem de teste para verificar se o sistema de email está funcionando corretamente. 
          Se você está recebendo este email, o sistema de contato está operacional!
        </p>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background-color: #d1ecf1; border-radius: 8px; border-left: 4px solid #0c5460;">
        <p style="margin: 0; color: #0c5460;">
          <strong>📌 Nota:</strong> Este é um email de teste. Em produção, você receberá as mensagens reais dos visitantes do site.
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
      
      <p style="text-align: center; color: #6c757d; font-size: 14px;">
        Enviado em: ${new Date().toLocaleString()}<br>
        Sistema de Contato DevTone
      </p>
    </div>
    
  </div>
</body>
</html>
      `
    });
    
    console.log('✅ Email 2 enviado com sucesso!');
    console.log('ID:', result2.data?.id || result2.id);
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    console.error('Detalhes:', error.message);
    if (error.response) {
      console.error('Resposta:', error.response.data);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 INSTRUÇÕES IMPORTANTES:');
  console.log('='.repeat(60));
  console.log('\n1. VERIFIQUE ESTAS PASTAS NO GMAIL:');
  console.log('   ✓ Caixa de Entrada principal');
  console.log('   ✓ Pasta SPAM (muito importante!)');
  console.log('   ✓ Aba Promoções');
  console.log('   ✓ Todas as mensagens');
  console.log('\n2. PROCURE POR:');
  console.log('   ✓ Remetente: onboarding@resend.dev');
  console.log('   ✓ Assunto: "Teste do Sistema"');
  console.log('   ✓ Assunto: "Nova Mensagem de Contato"');
  console.log('\n3. SE ENCONTRAR NA PASTA SPAM:');
  console.log('   ✓ Abra o email');
  console.log('   ✓ Clique em "Não é spam"');
  console.log('   ✓ Isso garantirá que futuros emails cheguem na caixa de entrada');
  console.log('\n4. VERIFIQUE O STATUS:');
  console.log('   ✓ https://resend.com/emails');
  console.log('   ✓ Procure pelos IDs dos emails acima');
}

// Executar
console.log('🚀 Iniciando envio de email para sweepeasellc@gmail.com...\n');
sendToSweepeasellc();