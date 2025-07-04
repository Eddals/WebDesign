// Webhook para processar dados do formulário e enviar emails automáticos
// Endpoint: https://devtone.agency/api/webhooks/contact-form

import { Resend } from 'resend';

// Inicializar o cliente Resend com a chave API
const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extrair dados do corpo da requisição
    const { name, email, phone, company, subject, message, preferredContact } = req.body;

    // Validar dados obrigatórios
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Preparar dados para o email
    const contactData = {
      name,
      email,
      phone: phone || 'Not provided',
      company: company || 'Not provided',
      subject: subject || 'Website Contact Form',
      message,
      preferredContact: preferredContact || 'Email',
      submittedAt: new Date().toLocaleString()
    };

    console.log('📧 Processando formulário de contato:', contactData);

    // Enviar email para o administrador
    const adminResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      replyTo: email,
      subject: `📬 New Contact Form: ${contactData.name} - ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">New Contact Form Submission</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            <p><strong>Phone:</strong> ${contactData.phone}</p>
            <p><strong>Company:</strong> ${contactData.company}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Preferred Contact Method:</strong> ${contactData.preferredContact}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${contactData.message}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Sent from DevTone Contact Form at ${contactData.submittedAt}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email para administrador enviado:', adminResult);
    
    // Enviar email de confirmação para o cliente
    const firstName = (contactData.name || '').split(' ')[0] || 'there';
    const clientResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: email,
      subject: '✨ We Received Your Message - DevTone Agency',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Hi ${firstName},</p>
          <p>Thanks for contacting <b>Devtone</b>  I truly appreciate you reaching out.</p>
          <p>This is just a quick note to let you know we’ve received your message, and we’ll get back to you as soon as possible. We usually reply within a couple of hours. If it’s evening or the weekend, it may take just a little longer  but I promise you’re on our radar.</p>
          <p>If your question is about one of our services or a specific idea you have in mind, feel free to share more details by replying to this email. The more we know, the better we can help.</p>
          <p>In the meantime, feel free to check out our website for quick insights, common questions, and project tips.</p>
          <p>Looking forward to connecting with you soon.</p>
          <p>Warm regards,</p>
        </div>
      `,
    });
    
    console.log('✅ Email para cliente enviado:', clientResult);

    // Retornar resposta de sucesso
    return res.status(200).json({
      success: true,
      message: 'Contact form processed successfully',
      emailSent: true,
      details: {
        adminEmailId: adminResult.id,
        clientEmailId: clientResult.id
      }
    });
  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process contact form',
      details: error.message
    });
  }
}