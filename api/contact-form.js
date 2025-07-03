const nodemailer = require('nodemailer');

// Create SMTP transporter with IONOS credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'matheus.silva@devtone.agency',
    pass: 'Alebaba1!'
  }
});

// Email template with placeholders
const getEmailTemplate = (firstName) => {
  const businessHours = 'Monday to Friday, 12pm to 6pm EST';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Devtone</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(to right, #a855f7, #8b5cf6); padding: 20px; color: white; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; }
    a { color: #a855f7; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Thank You for Contacting Us!</h1>
  </div>
  <div class="content">
    <p>Hi ${firstName},</p>
    <p>Thanks for contacting Devtone — I truly appreciate you reaching out.</p>
    <p>This is just a quick note to let you know we've received your message, and we'll get back to you as soon as possible. During our normal business hours (${businessHours}), we usually reply within a couple of hours. If it's evening or the weekend, it may take just a little longer — but I promise you're on our radar.</p>
    <p>If your question is about one of our services or a specific idea you have in mind, feel free to share more details by replying to this email. The more we know, the better we can help.</p>
    <p>In the meantime, feel free to check out our <a href="https://devtone.agency/faq">FAQ page</a> for common questions, or our <a href="https://devtone.agency/estimate">estimate page</a> for project creation.</p>
    <p>Best regards,<br>Matheus Silva<br>Devtone Agency</p>
  </div>
  <div class="footer">
    <p>© 2024 Devtone Agency. All rights reserved.</p>
  </div>
</body>
</html>
  `;
};

module.exports = async (req, res) => {
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
    
    if (!full_name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const firstName = full_name.split(' ')[0];
    
    // Send confirmation email to user
    try {
      const userMailOptions = {
        from: '"Devtone Agency" <matheus.silva@devtone.agency>',
        to: email,
        subject: 'Thank You for Contacting Devtone Agency',
        html: getEmailTemplate(firstName),
        replyTo: 'matheus.silva@devtone.agency'
      };

      const userInfo = await transporter.sendMail(userMailOptions);
      console.log('User confirmation email sent:', userInfo.messageId);
    } catch (emailError) {
      console.error('Error sending user confirmation email:', emailError);
    }
    
    // Send notification to admin
    try {
      const adminMailOptions = {
        from: '"Devtone Website" <matheus.silva@devtone.agency>',
        to: 'matheus.silva@devtone.agency',
        subject: `New Contact Form: ${full_name} - ${subject || 'No Subject'}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${full_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
          <p><strong>Preferred Contact:</strong> ${preferredContact || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message || 'No message content'}</p>
        `,
        replyTo: email
      };

      const adminInfo = await transporter.sendMail(adminMailOptions);
      console.log('Admin notification email sent:', adminInfo.messageId);
    } catch (adminEmailError) {
      console.error('Error sending admin notification email:', adminEmailError);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};