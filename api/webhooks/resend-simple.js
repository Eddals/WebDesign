import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

const getEmailTemplate = (firstName) => {
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
    <p>Thanks for contacting <b>Devtone</b> — I truly appreciate you reaching out.</p>
    <p>This is just a quick note to let you know we've received your message, and we'll get back to you as soon as possible. We usually reply within a couple of hours. If it's evening or the weekend, it may take just a little longer — but I promise you're on our radar.</p>
    <p>If your question is about one of our services or a specific idea you have in mind, feel free to share more details by replying to this email. The more we know, the better we can help.</p>
    <p>In the meantime, feel free to check out our website for quick insights, common questions, and project tips.</p>
    <p>Looking forward to connecting with you soon.</p>
    <p>Warm regards,</p>
  </div>
  <div class="footer">
    <p>© 2024 Devtone Agency. All rights reserved.</p>
  </div>
</body>
</html>
  `;
};

export default async function handler(req, res) {
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
    const { name, email, subject, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const firstName = name.split(' ')[0] || 'there';

    // Send confirmation email to user
    const userMail = await resend.emails.send({
      from: 'Devtone Agency <matheus.silva@devtone.agency>',
      to: email,
      subject: 'Thank You for Contacting Devtone Agency',
      html: getEmailTemplate(firstName),
      reply_to: 'matheus.silva@devtone.agency'
    });

    // Send notification to admin
    const adminMail = await resend.emails.send({
      from: 'Devtone Website <matheus.silva@devtone.agency>',
      to: 'matheus.silva@devtone.agency',
      subject: `New Contact Form: ${name} - ${subject || 'No Subject'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message content'}</p>
      `,
      reply_to: email
    });

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
}
