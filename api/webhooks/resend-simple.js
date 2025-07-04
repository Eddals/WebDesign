import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

const getEmailTemplate = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Devtone</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .content { padding: 20px; border: 1px solid #ddd; border-radius: 5px; background: #fff; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; }
    a { color:rgb(132, 0, 255); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="content">
    <p>Hi ${name},</p>
    <p>Thank you for getting in touch with Devtone — truly appreciate you reaching out! 😊</p>
    <p>This is just a quick note to let you know we’ve received your message and will get back to you as soon as possible. We usually reply within a couple of hours during business hours. If it’s the evening or a weekend, it might take a little longer — but rest assured, you’re on our radar.</p>
    <p>If you’re reaching out with a specific idea or service request, feel free to reply with more details. The more we understand your vision, the better we can assist you.</p>
    <p>While you wait, you’re welcome to explore our website for project insights, FAQs, and inspiration: <a href="https://devtone.agency">devtone.agency</a></p>
    <p>Looking forward to speaking with you soon!</p>
    <p>Warm regards,<br><b>Matheus Silva</b><br>Founder & Owner, Devtone Agency</p>
  </div>
  <div class="footer">
    <p>© 2025 Devtone Agency. All rights reserved.</p>
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
    // Send confirmation email to user
    const userMail = await resend.emails.send({
      from: 'Devtone Agency <matheus.silva@devtone.agency>',
      to: email,
      subject: 'Thank You for Contacting Devtone Agency',
      html: getEmailTemplate(name),
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
