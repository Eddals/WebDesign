import { Resend } from 'resend';
import { getContactClientTemplate, getContactAdminTemplate } from './lib/email-templates.js';

// Initialize Resend with the API key
const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

export default async function handler(req, res) {
  // Enable CORS - aceitar todas as origens para facilitar o desenvolvimento
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed',
      error: 'Only POST requests are accepted'
    });
  }

  try {
    const formData = req.body;
    console.log('=== CONTACT FORM SUBMISSION RECEIVED ===');
    console.log('From:', formData.full_name || formData.name, formData.email);
    console.log('Subject:', formData.subject);
    
    // Validação básica
    if (!formData.email || !formData.message || !(formData.full_name || formData.name)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        error: 'Please provide name, email and message'
      });
    }
    
    // Prepare contact data
    const contactData = {
      name: formData.full_name || formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject || 'Contact Form Submission',
      message: formData.message,
      company: formData.company || 'Not provided',
      preferredContact: formData.preferredContact || 'email',
      submittedAt: new Date().toLocaleString(),
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    try {
      // Enviar email para o administrador
      const emailResult = await resend.emails.send({
        from: 'DevTone Agency <team@devtone.agency>',
        to: 'sweepeasellc@gmail.com',
        replyTo: formData.email,
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

      console.log('✅ Email para administrador enviado:', emailResult);
      
      // Enviar email para o cliente
      const clientEmailResult = await resend.emails.send({
        from: 'DevTone Agency <team@devtone.agency>',
        to: formData.email,
        subject: '✨ We Received Your Message - DevTone Agency',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4a6cf7;">Thank You for Contacting Us!</h1>
            <p>Hello ${contactData.name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p>${contactData.message.replace(/\n/g, '<br>')}</p>
            </div>
            <p>Next steps:</p>
            <ol>
              <li>Our team will review your message within 2-4 business hours</li>
              <li>You'll receive a personalized response within 24 hours</li>
              <li>If needed, we'll schedule a call to discuss your requirements in detail</li>
            </ol>
            <p>Best regards,<br>The DevTone Team</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              DevTone Agency<br>
              Email: team@devtone.agency<br>
              Website: <a href="https://devtone.agency">devtone.agency</a>
            </p>
          </div>
        `,
      });
      
      console.log('✅ Email para cliente enviado:', clientEmailResult);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        emailSent: true,
        details: {
          adminEmailId: emailResult.id,
          clientEmailId: clientEmailResult.id
        }
      });
    } catch (emailError) {
      console.error('❌ Error sending emails with Resend:', emailError);
      
      // Ainda retorna sucesso se o email falhar mas o formulário foi recebido
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form received. We will get back to you soon.',
        emailSent: false,
        error: emailError.message
      });
    }

  } catch (error) {
    console.error('❌ Server error processing contact form:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error processing your request',
      error: error.message || 'Unknown server error'
    });
  }
}