import { Resend } from 'resend';
import { getContactClientTemplate, getContactAdminTemplate } from './lib/email-templates.js';

// Initialize Resend with the API key
const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

export default async function handler(req, res) {
  // Enable CORS
  const allowedOrigins = [
    'https://devtone.agency',
    'https://www.devtone.agency',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    console.log('=== CONTACT FORM SUBMISSION RECEIVED ===');
    console.log('From:', formData.full_name || formData.name, formData.email);
    console.log('Subject:', formData.subject);
    
    // Prepare contact data
    const contactData = {
      name: formData.full_name || formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
      company: formData.company || 'Not provided',
      preferredContact: formData.preferredContact || 'email',
      submittedAt: new Date().toLocaleString(),
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    try {
      // Send email to client using Resend
      const clientEmailResult = await resend.emails.send({
        from: 'DevTone Agency <onboarding@resend.dev>',
        to: formData.email,
        subject: '✨ We Received Your Message - DevTone Agency',
        html: getContactClientTemplate(contactData),
      });

      console.log('✅ Client email sent:', clientEmailResult);

      // Send email to admin using Resend
      const adminEmailResult = await resend.emails.send({
        from: 'DevTone Contact System <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL || 'team@devtone.agency',
        replyTo: formData.email,
        subject: `📬 New Contact Form: ${contactData.name} - ${formData.subject}`,
        html: getContactAdminTemplate(contactData),
      });

      console.log('✅ Admin email sent:', adminEmailResult);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        emailSent: true,
        details: {
          clientEmailId: clientEmailResult.id,
          adminEmailId: adminEmailResult.id
        }
      });
    } catch (emailError) {
      console.error('❌ Error sending emails with Resend:', emailError);
      
      // Still return success if email fails but form was received
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
      error: error.message
    });
  }
}