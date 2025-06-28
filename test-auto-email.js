// Script para testar a automação de email
// Execute com: node test-auto-email.js

import { Resend } from 'resend';

// Inicializar o cliente Resend com a chave API
const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

async function testAutoEmail() {
  try {
    console.log('🚀 Testando automação de email...');
    
    // Dados de teste (simulando um cliente preenchendo o formulário)
    const clientData = {
      name: 'Cliente de Teste',
      email: 'sweepeasellc@gmail.com', // Usando o mesmo email para teste
      subject: 'Teste de Automação de Email',
      message: 'Esta é uma mensagem de teste para verificar se a automação de email está funcionando corretamente.'
    };
    
    console.log('📧 Enviando emails...');
    
    // 1. Enviar email para o administrador
    const adminResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      reply_to: clientData.email,
      subject: `📬 Novo Contato: ${clientData.name} - ${clientData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Novo Contato Recebido</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Nome:</strong> ${clientData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${clientData.email}">${clientData.email}</a></p>
            <p><strong>Assunto:</strong> ${clientData.subject}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${clientData.message}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Enviado do formulário de contato em ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email para administrador enviado:', adminResult);
    
    // 2. Enviar email de confirmação para o cliente
    const clientResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: clientData.email, // Usar o email fornecido pelo cliente
      subject: '✨ Recebemos sua mensagem - DevTone Agency',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4a6cf7;">Obrigado por entrar em contato!</h1>
          <p>Olá ${clientData.name},</p>
          <p>Recebemos sua mensagem e retornaremos em breve, geralmente dentro de 24 horas.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Sua mensagem:</strong></p>
            <p>${clientData.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>Próximos passos:</p>
          <ol>
            <li>Nossa equipe analisará sua mensagem nas próximas 2-4 horas</li>
            <li>Você receberá uma resposta personalizada em até 24 horas</li>
            <li>Se necessário, agendaremos uma chamada para discutir seus requisitos em detalhes</li>
          </ol>
          <p>Atenciosamente,<br>Equipe DevTone</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            DevTone Agency<br>
            Email: team@devtone.agency<br>
            Website: <a href="https://devtone.agency">devtone.agency</a>
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email para cliente enviado:', clientResult);
    console.log('📧 Automação de email testada com sucesso!');
    console.log('📧 IDs dos emails:');
    console.log('   - Admin:', adminResult.id);
    console.log('   - Cliente:', clientResult.id);
  } catch (error) {
    console.error('❌ Erro ao testar automação de email:', error);
  }
}

testAutoEmail();