import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function sendWithVerifiedDomain() {
  const targetEmail = 'sweepeasellc@gmail.com';
  console.log('🚀 Enviando email usando domínio verificado devtone.agency\n');
  console.log(`📧 Destinatário: ${targetEmail}\n`);
  
  try {
    // Email 1: Teste direto
    console.log('1️⃣ Enviando email de teste...');
    const result1 = await resend.emails.send({
      from: 'DevTone Agency <noreply@devtone.agency>',
      to: targetEmail,
      subject: 'Teste com Domínio Verificado - DevTone Contact Form',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">✅ Email Enviado com Sucesso!</h1>
          </div>
          <div style="padding: 30px; background: #f5f5f5;">
            <h2 style="color: #333;">Teste do Sistema de Contato DevTone</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Este email foi enviado usando o domínio verificado <strong>devtone.agency</strong>.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #333;">
                <strong>De:</strong> noreply@devtone.agency<br>
                <strong>Para:</strong> ${targetEmail}<br>
                <strong>Horário:</strong> ${new Date().toLocaleString()}<br>
                <strong>Status:</strong> ✅ Domínio Verificado
              </p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Se você está recebendo este email, o sistema de contato está funcionando perfeitamente!
            </p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Email 1 enviado!');
    console.log('Resposta:', JSON.stringify(result1, null, 2));
    
    // Aguardar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Email 2: Simulação de formulário
    console.log('\n2️⃣ Enviando simulação de formulário de contato...');
    const result2 = await resend.emails.send({
      from: 'DevTone Contact Form <noreply@devtone.agency>',
      to: targetEmail,
      subject: '📬 Nova Mensagem de Contato - DevTone Agency',
      html: `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <div style="background: #333; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Nova Mensagem de Contato</h1>
    </div>
    
    <div style="padding: 30px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Informações do Contato:</h3>
        <p style="margin: 5px 0; color: #666;">
          <strong>Nome:</strong> Cliente Teste<br>
          <strong>Email:</strong> cliente@example.com<br>
          <strong>Telefone:</strong> (11) 99999-9999<br>
          <strong>Assunto:</strong> Teste do Sistema
        </p>
      </div>
      
      <div style="background: #e9ecef; padding: 20px; border-radius: 8px;">
        <h3 style="color: #333; margin-top: 0;">Mensagem:</h3>
        <p style="color: #666; line-height: 1.6;">
          Esta é uma mensagem de teste enviada através do formulário de contato.
          O sistema está usando o domínio verificado devtone.agency para garantir
          a entrega dos emails.
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
      
      <p style="text-align: center; color: #999; font-size: 14px;">
        Enviado através do sistema de contato DevTone<br>
        ${new Date().toLocaleString()}
      </p>
    </div>
    
  </div>
</body>
</html>
      `
    });
    
    console.log('✅ Email 2 enviado!');
    console.log('Resposta:', JSON.stringify(result2, null, 2));
    
    // Email 3: Para o admin também
    console.log('\n3️⃣ Enviando cópia para team@devtone.agency...');
    const result3 = await resend.emails.send({
      from: 'DevTone System <noreply@devtone.agency>',
      to: 'team@devtone.agency',
      subject: 'Cópia: Email enviado para ' + targetEmail,
      text: `Uma cópia do email foi enviada para ${targetEmail}. IDs dos emails: ${result1.data?.id || 'N/A'}, ${result2.data?.id || 'N/A'}`
    });
    
    console.log('✅ Email 3 enviado!');
    console.log('Resposta:', JSON.stringify(result3, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMO:');
  console.log('='.repeat(60));
  console.log('\n✅ Usando domínio verificado: devtone.agency');
  console.log('✅ Remetente: noreply@devtone.agency');
  console.log('✅ Destinatário: ' + targetEmail);
  console.log('\n📧 VERIFIQUE:');
  console.log('1. Caixa de entrada principal');
  console.log('2. Pasta Spam (pode ir para lá na primeira vez)');
  console.log('3. Aba Promoções (Gmail)');
  console.log('\n💡 DICA:');
  console.log('Se encontrar na pasta Spam, marque como "Não é spam"');
  console.log('para garantir que futuros emails cheguem na caixa de entrada.');
}

// Executar
console.log('Iniciando envio com domínio verificado...\n');
sendWithVerifiedDomain();