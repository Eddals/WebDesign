const { Resend } = require('resend');

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

module.exports = async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    console.log('Received data:', { name, email, subject, message });

    // Enviar e-mail
    const data = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: email,
      subject: `Confirmação: ${subject}`,
      html: `
        <h2>Olá ${name}!</h2>
        <p>Obrigado por entrar em contato conosco.</p>
        <p>Recebemos sua mensagem sobre: <strong>${subject}</strong></p>
        <p>Sua mensagem: ${message}</p>
        <p>Responderemos em breve!</p>
        <br>
        <p>Atenciosamente,<br>Equipe DevTone Agency</p>
      `,
      text: `Olá ${name}!\n\nObrigado por entrar em contato.\n\nRecebemos sua mensagem sobre: ${subject}\n\nSua mensagem: ${message}\n\nResponderemos em breve!\n\nAtenciosamente,\nEquipe DevTone Agency`
    });

    console.log('Email sent:', data);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
};