import { Resend } from 'resend';

// Inicializar Resend com a chave correta do ambiente
const resend = new Resend(process.env.RESEND_API_KEY || 're_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

// Template HTML para o e-mail de confirmação
const getConfirmationEmailHTML = (name, subject, message) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Contato - DevTone Agency</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 32px 24px; text-align: center; }
        .content { padding: 32px 24px; }
        .message-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .info-section { margin: 30px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 14px 30px; border-radius: 25px; font-weight: 600; text-decoration: none; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 24px; text-align: center; color: #666; font-size: 14px; }
        .divider { height: 1px; background: #e0e0e0; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Obrigado pelo seu contato!</h1>
        </div>
        <div class="content">
            <h2>Olá ${name}! 👋</h2>
            <p>Recebemos sua mensagem e este e-mail é para confirmar que seu contato foi registrado com sucesso.</p>
            <div class="message-box">
                <strong>Assunto:</strong> ${subject}<br>
                <strong>Mensagem:</strong><br>${message.replace(/\n/g, '<br>')}
            </div>
            <div class="info-section">
                <h3>⏰ Próximos passos</h3>
                <p>Nossa equipe já foi notificada e responderá em até <strong>24 horas úteis</strong>.</p>
                <p>Se quiser, conheça mais sobre nossos serviços:</p>
                <a href="https://devtone.agency" class="cta-button">Visitar nosso site</a>
            </div>
            <div class="divider"></div>
            <div class="info-section">
                <h3>💡 Sobre a DevTone</h3>
                <p>Somos especialistas em desenvolvimento web, SEO e marketing digital. Conte conosco para transformar suas ideias em realidade digital!</p>
            </div>
        </div>
        <div class="footer">
            <strong>DevTone Agency</strong><br>
            team@devtone.agency<br>
            +1 (718) 419-3863<br>
            <span style="font-size:12px;color:#999;">Este é um e-mail automático, por favor não responda.</span>
        </div>
    </div>
</body>
</html>
`;

const getConfirmationEmailText = (name, subject, message) => `
Olá ${name}!

Recebemos sua mensagem e este e-mail é para confirmar que seu contato foi registrado com sucesso.

Assunto: ${subject}
Mensagem: ${message}

Nossa equipe já foi notificada e responderá em até 24 horas úteis.

DevTone Agency
team@devtone.agency
+1 (718) 419-3863
https://devtone.agency

Este é um e-mail automático, por favor não responda.
`;

export default async function handler(req, res) {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { name, email, phone, company, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando: nome, email, assunto e mensagem são necessários' });
    }
    // Enviar e-mail de confirmação para o usuário
    const confirmationEmail = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: email,
      subject: `Confirmação de Contato - ${subject}`,
      html: getConfirmationEmailHTML(name, subject, message),
      text: getConfirmationEmailText(name, subject, message),
    });
    // Enviar notificação para a equipe
    const teamNotification = await resend.emails.send({
      from: 'DevTone Contact Form <team@devtone.agency>',
      to: 'team@devtone.agency',
      subject: `Novo Contato: ${subject} - ${name}`,
      html: `<h2>Novo contato recebido</h2><p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Telefone:</strong> ${phone || 'Não informado'}</p><p><strong>Empresa:</strong> ${company || 'Não informada'}</p><p><strong>Assunto:</strong> ${subject}</p><p><strong>Mensagem:</strong></p><p>${message.replace(/\n/g, '<br>')}</p><hr><p><small>Enviado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</small></p>`,
      text: `Novo contato recebido\n\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone || 'Não informado'}\nEmpresa: ${company || 'Não informada'}\nAssunto: ${subject}\n\nMensagem:\n${message}\n\n--\nEnviado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
    });
    return res.status(200).json({
      success: true,
      message: 'E-mails enviados com sucesso',
      confirmationId: confirmationEmail.id,
      notificationId: teamNotification.id
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar solicitação', details: error.message });
  }
}
