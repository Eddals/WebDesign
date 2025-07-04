import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

export default async function handler(req, res) {
  // Enable CORS
  const allowedOrigins = [
    'https://devtone.agency',
    'https://www.devtone.agency',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
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
    // Validate required fields
    if (!formData.email || !formData.subject || !formData.message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, subject, and message are required'
      });
    }
    // Prepare contact data
    const contactData = {
      name: formData.full_name || formData.name || 'Not provided',
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
      company: formData.company || 'Not provided',
      preferredContact: formData.preferredContact || 'email',
      submittedAt: new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      ipAddress: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Not available'
    };
    // Extract first name for client email
    const firstName = (contactData.name || '').split(' ')[0] || 'there';
    // Admin notification email
    const adminEmail = {
      from: 'DevTone Contact System <matheus.silva@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      reply_to: contactData.email,
      subject: `📬 New Contact Form: ${contactData.name} - ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Phone:</strong> ${contactData.phone}</p>
        <p><strong>Company:</strong> ${contactData.company}</p>
        <p><strong>Preferred Contact:</strong> ${contactData.preferredContact}</p>
        <p><strong>Submitted At:</strong> ${contactData.submittedAt}</p>
        <p><strong>IP Address:</strong> ${contactData.ipAddress}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong><br>${contactData.message}</p>
      `
    };
    // Client confirmation email
    const clientEmail = {
      from: 'Devtone Agency <matheus.silva@devtone.agency>',
      to: contactData.email,
      subject: '✨ We Received Your Message - DevTone Agency',
      html: `
        <p>Hi ${firstName},</p>
        <p>Thanks for contacting <b>Devtone</b>  I truly appreciate you reaching out.</p>
        <p>This is just a quick note to let you know we’ve received your message, and we’ll get back to you as soon as possible. We usually reply within a couple of hours. If it’s evening or the weekend, it may take just a little longer  but I promise you’re on our radar.</p>
        <p>If your question is about one of our services or a specific idea you have in mind, feel free to share more details by replying to this email. The more we know, the better we can help.</p>
        <p>In the meantime, feel free to check out our website for quick insights, common questions, and project tips.</p>
        <p>Looking forward to connecting with you soon.</p>
        <p>Warm regards,</p>
      `
    };
    // Send both emails in parallel
    await Promise.all([
      resend.emails.send(adminEmail),
      resend.emails.send(clientEmail)
    ]);
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.',
      emailSent: true
    });
  } catch (error) {
    console.error('❌ Error sending emails with Resend:', error);
    return res.status(200).json({
      success: true,
      message: 'Contact form received. We will get back to you soon.',
      emailSent: false,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Email service temporarily unavailable'
    });
  }
}
