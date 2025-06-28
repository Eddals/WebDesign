// Servidor local para testar as APIs
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar o Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

// Endpoint de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API local funcionando!', timestamp: new Date().toISOString() });
});

// Endpoint de email simples
app.post('/api/simple-email', async (req, res) => {
  try {
    console.log('📧 Recebida requisição de email:', req.body);
    
    // Extrair dados do corpo da requisição
    const { name, email, subject, message } = req.body;

    // Validar dados obrigatórios
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    console.log('📧 Enviando email simples...');
    console.log('📋 Dados:', { name, email, subject, message });

    // 1. Enviar email para o administrador
    const adminResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: process.env.ADMIN_EMAIL || 'sweepeasellc@gmail.com',
      reply_to: email,
      subject: `📬 Novo Contato: ${name} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Novo Contato Recebido</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Assunto:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
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
      to: email,
      subject: '✨ Recebemos sua mensagem - DevTone Agency',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4a6cf7;">Obrigado por entrar em contato!</h1>
          <p>Olá ${name},</p>
          <p>Recebemos sua mensagem e retornaremos em breve, geralmente dentro de 24 horas.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Sua mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
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

    return res.status(200).json({ 
      success: true, 
      message: 'Emails sent successfully',
      emailSent: true,
      details: {
        adminEmailId: adminResult.data?.id,
        clientEmailId: clientResult.data?.id
      }
    });
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor local rodando em http://localhost:${port}`);
  console.log(`📧 Resend API Key: ${process.env.RESEND_API_KEY ? 'Configurada' : 'Não configurada'}`);
  console.log(`📮 Admin Email: ${process.env.ADMIN_EMAIL || 'sweepeasellc@gmail.com'}`);
});