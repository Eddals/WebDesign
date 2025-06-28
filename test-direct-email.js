// Script para testar o envio direto de email usando a API do Resend
// Execute com: node test-direct-email.js

import { Resend } from 'resend';

// Inicializar o cliente Resend com a chave API
const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

async function testDirectEmail() {
  try {
    console.log('🚀 Enviando email de teste diretamente...');
    
    // Enviar email para o administrador
    const adminResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      subject: '📬 Teste Direto - Email para Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Teste de Email Direto</h1>
          <p>Este é um teste direto do envio de email usando a API do Resend.</p>
          <p>Se você está vendo este email, significa que a configuração está correta!</p>
        </div>
      `,
    });
    
    console.log('✅ Email para administrador enviado:', adminResult);
    
    // Enviar email para o cliente (usando o mesmo email para teste)
    const clientResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      subject: '✨ Teste Direto - Email para Cliente',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4a6cf7;">Teste de Email para Cliente</h1>
          <p>Este é um teste do email que seria enviado para o cliente.</p>
          <p>Se você está vendo este email, significa que a configuração está correta!</p>
        </div>
      `,
    });
    
    console.log('✅ Email para cliente enviado:', clientResult);
    
    console.log('📧 Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao enviar emails:', error);
  }
}

testDirectEmail();