import nodemailer from 'nodemailer';

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
    console.log('=== CONTACT FORM SUBMISSION RECEIVED ===');
    console.log('From:', formData.full_name || formData.name, formData.email);
    console.log('Subject:', formData.subject);
    
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

    try {
      // Configure nodemailer SMTP transport
      const transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false, // TLS
        auth: {
          user: 'matheus.silva@devtone.agency',
          pass: 'Alebaba1!'
        }
      });

      // Admin notification email
      const adminMailOptions = {
        from: 'DevTone Contact System <matheus.silva@devtone.agency>',
        to: 'sweepeasellc@gmail.com',
        replyTo: formData.email,
        subject: `📬 New Contact Form: ${contactData.name} - ${formData.subject}`,
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

      // Extract first name for client email
      const firstName = (contactData.name || '').split(' ')[0] || 'there';
      // Client confirmation email
      const clientMailOptions = {
        from: 'Devtone Agency <matheus.silva@devtone.agency>',
        to: contactData.email,
        subject: '✨ We Received Your Message - DevTone Agency',
        html: `
          <p>Hi ${firstName},</p>
          <p>Thanks for contacting <b>Devtone</b> — I truly appreciate you reaching out.</p>
          <p>This is just a quick note to let you know we’ve received your message, and we’ll get back to you as soon as possible. During our normal business hours (<b>[business_hours]</b>), we usually reply within a couple of hours. If it’s evening or the weekend, it may take just a little longer — but I promise you’re on our radar.</p>
          <p>If your question is about one of our services or a specific idea you have in mind, feel free to share more details by replying to this email. The more we know, the better we can help.</p>
          <p>In the meantime, feel free to check out our <a href="https://devtone.agency/faq">FAQ</a> for common questions, also <a href="https://devtone.agency/estimate">project's creations</a>.</p>
        `
      };

      // Send both emails in parallel
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(clientMailOptions)
      ]);

      return res.status(200).json({ 
        success: true, 
        message: 'Your message has been sent successfully! We\'ll get back to you soon.',
        emailSent: true
      });
    } catch (emailError) {
      console.error('❌ Error sending emails with SMTP:', emailError);
      // Still return success if email fails but form was received
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form received. We will get back to you soon.',
        emailSent: false,
        error: process.env.NODE_ENV === 'development' ? emailError.message : 'Email service temporarily unavailable'
      });
    }

  } catch (error) {
    console.error('❌ Server error processing contact form:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error processing your request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}