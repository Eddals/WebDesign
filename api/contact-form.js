import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { full_name, email, phone, company, subject, message, preferredContact } = req.body;
    
    console.log('📧 Contact form received:', { full_name, email, subject });
    
    // Send admin notification
    const adminEmail = await resend.emails.send({
      from: 'DevTone Contact <noreply@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      replyTo: email,
      subject: `New Contact: ${full_name} - ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Preferred Contact:</strong> ${preferredContact}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });
    
    // Send customer confirmation
    const customerEmail = await resend.emails.send({
      from: 'DevTone Agency <noreply@devtone.agency>',
      to: email,
      subject: 'We received your message - DevTone Agency',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Hi ${full_name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>DevTone Team</p>
      `
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!',
      adminId: adminEmail.data?.id,
      customerId: customerEmail.data?.id
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}