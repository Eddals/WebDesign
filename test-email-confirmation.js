// Teste para verificar se o email de confirmação automática está funcionando
import { Resend } from 'resend';

const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

async function testEmailConfirmation() {
  try {
    console.log('🧪 Testando sistema de confirmação automática...');
    
    // Dados de teste simulando um cliente real
    const testData = {
      name: 'Maria Silva',
      email: 'maria.silva@example.com', // Email do cliente
      subject: 'Desenvolvimento de Site Corporativo',
      message: 'Olá! Preciso de um site corporativo para minha empresa. Gostaria de saber mais sobre os serviços e valores. Obrigada!'
    };
    
    console.log('📋 Simulando envio do formulário:', testData);
    
    // 1. Email para o administrador (notificação)
    console.log('\n📧 Enviando notificação para administrador...');
    const adminResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      reply_to: testData.email,
      subject: `📬 Novo Contato: ${testData.name} - ${testData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Novo Contato Recebido</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Nome:</strong> ${testData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${testData.email}">${testData.email}</a></p>
            <p><strong>Assunto:</strong> ${testData.subject}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${testData.message}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Enviado do formulário de contato em ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email para administrador enviado:', adminResult.data?.id);
    
    // 2. Email de confirmação automática para o cliente
    console.log('\n📧 Enviando confirmação automática para cliente...');
    const clientResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: testData.email, // Email do cliente
      subject: '✅ Confirmação de Contato - DevTone Agency',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 30px; background-color: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; font-size: 28px; margin: 0; font-weight: 700;">DevTone Agency</h1>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 16px;">Desenvolvimento Web & Soluções Digitais</p>
          </div>

          <!-- Confirmação -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px;">✅ Mensagem Recebida com Sucesso!</h2>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Olá ${testData.name}, obrigado por entrar em contato conosco!</p>
          </div>

          <!-- Resumo da mensagem -->
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📋 Resumo da sua mensagem:</h3>
            <p style="margin: 0 0 10px 0; color: #475569;"><strong>Assunto:</strong> ${testData.subject}</p>
            <p style="margin: 0 0 15px 0; color: #475569;"><strong>Mensagem:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #334155; line-height: 1.6;">${testData.message}</p>
            </div>
          </div>

          <!-- Próximos Passos -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px;">🚀 Próximos Passos Automáticos:</h3>
            
            <!-- Passo 1 -->
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
              <div style="margin-bottom: 8px;">
                <span style="background-color: #0ea5e9; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 10px;">1</span>
                <strong style="color: #0c4a6e; font-size: 16px;">Análise Imediata (0-2 horas)</strong>
              </div>
              <p style="margin: 0; color: #075985; font-size: 14px; margin-left: 34px;">Nossa equipe técnica analisará sua solicitação e identificará a melhor abordagem para seu projeto.</p>
            </div>

            <!-- Passo 2 -->
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
              <div style="margin-bottom: 8px;">
                <span style="background-color: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 10px;">2</span>
                <strong style="color: #14532d; font-size: 16px;">Resposta Personalizada (2-24 horas)</strong>
              </div>
              <p style="margin: 0; color: #166534; font-size: 14px; margin-left: 34px;">Você receberá uma proposta detalhada com cronograma, orçamento e especificações técnicas do seu projeto.</p>
            </div>

            <!-- Passo 3 -->
            <div style="margin-bottom: 15px; padding: 15px; background-color: #fefce8; border-radius: 8px; border-left: 4px solid #eab308;">
              <div style="margin-bottom: 8px;">
                <span style="background-color: #eab308; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 10px;">3</span>
                <strong style="color: #713f12; font-size: 16px;">Reunião de Alinhamento (Se necessário)</strong>
              </div>
              <p style="margin: 0; color: #a16207; font-size: 14px; margin-left: 34px;">Agendaremos uma videochamada para discutir detalhes específicos e esclarecer dúvidas sobre o projeto.</p>
            </div>

            <!-- Passo 4 -->
            <div style="margin-bottom: 15px; padding: 15px; background-color: #fdf2f8; border-radius: 8px; border-left: 4px solid #ec4899;">
              <div style="margin-bottom: 8px;">
                <span style="background-color: #ec4899; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 10px;">4</span>
                <strong style="color: #831843; font-size: 16px;">Início do Desenvolvimento</strong>
              </div>
              <p style="margin: 0; color: #be185d; font-size: 14px; margin-left: 34px;">Após aprovação, iniciamos o desenvolvimento com atualizações regulares sobre o progresso.</p>
            </div>
          </div>

          <!-- Informações de Contato -->
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📞 Precisa de algo urgente?</h3>
            <p style="margin: 0 0 15px 0; color: #475569;">Entre em contato conosco diretamente:</p>
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;"><strong>📧 Email:</strong> <a href="mailto:team@devtone.agency" style="color: #2563eb; text-decoration: none;">team@devtone.agency</a></p>
            <p style="margin: 0; color: #64748b; font-size: 14px;"><strong>🌐 Website:</strong> <a href="https://devtone.agency" style="color: #2563eb; text-decoration: none;">devtone.agency</a></p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
              <strong>DevTone Agency</strong> - Transformando ideias em soluções digitais
            </p>
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Este é um email automático de confirmação. Não responda a este email.
            </p>
          </div>
        </div>
      `,
    });
    
    console.log('✅ Email de confirmação para cliente enviado:', clientResult.data?.id);
    
    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   • Email para admin: ${adminResult.data?.id}`);
    console.log(`   • Email para cliente: ${clientResult.data?.id}`);
    console.log(`   • Cliente receberá confirmação em: ${testData.email}`);
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testEmailConfirmation();