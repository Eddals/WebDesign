// Script para testar o envio de email usando o endpoint simplificado
// Execute com: node test-simple-email.js

import { Resend } from 'resend';

// Inicializar o cliente Resend com a chave API
const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

async function testSimpleEmail() {
  try {
    console.log('🚀 Enviando email de teste simples...');
    
    // Dados de teste
    const testData = {
      name: 'Teste Simples',
      email: 'teste@example.com',
      subject: 'Teste de Email Simples',
      message: 'Esta é uma mensagem de teste simples para verificar se o envio de email está funcionando.'
    };
    
    // Enviar email
    const result = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      subject: `📬 Teste Simples: ${testData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Novo Email de Teste</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Nome:</strong> ${testData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${testData.email}">${testData.email}</a></p>
            <p><strong>Assunto:</strong> ${testData.subject}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${testData.message}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Enviado do script de teste em ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email enviado com sucesso:', result);
    console.log('📧 ID do email:', result.id);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

testSimpleEmail();