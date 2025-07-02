import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

// NEW STYLE: Use the circular, modern style from getContactClientTemplate in email-templates.js
function getContactConfirmationEmailHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Thank You - Devtone</title>
<style>
body {margin: 0;font-family: 'Arial', sans-serif;background-color: #f5f5f5;color: #333;}
.header {background-color: #9519cc;color: white;padding: 40px 20px;text-align: center;position: relative;}
.logo {max-height: 40px;margin-bottom: 30px;}
.header img.mascot {position: absolute;right: 20px;top: 40px;max-height: 260px;}
.header h1 {font-size: 36px;margin-bottom: 10px;}
.header p {font-size: 16px;max-width: 600px;margin: 0 auto;}
.content {text-align: center;padding: 40px 20px;}
.content h2 {color: #333;}
.btn {display: inline-block;background: linear-gradient(135deg, #a052e2, #9519cc);color: white;padding: 12px 24px;margin-top: 20px;border: none;border-radius: 25px;font-weight: bold;text-decoration: none;}
.features {display: flex;flex-wrap: wrap;justify-content: center;background-color: #9519cc;color: white;padding: 40px 20px;gap: 40px;}
.feature-box {max-width: 280px;text-align: center;}
.feature-box h3 {margin-top: 10px;font-size: 20px;}
.feature-box p {font-size: 14px;}
@media (max-width: 768px) {.header img.mascot {position: static;max-width: 100%;margin-top: 20px;}.features {flex-direction: column;align-items: center;}}
</style>
</head>
<body>
<div class="header">
<img src="https://i.imgur.com/W7uxhn7.png" alt="DevTone Logo" class="logo"/>
<h1>Thank you for contacting us!</h1>
<p>
Have a question, request, or project in mind? We're here to help.<br>
Fill out the form below and a member of our team will get back to you within 24–48 hours.<br>
Whether you're looking for more information about our services, need a custom quote, or just want to say hello — we’d love to hear from you!
</p>
<img src="https://i.imgur.com/C9BSumy.png" alt="Mascot" class="mascot" />
</div>
<div class="content">
<h2>Hello,</h2>
<p>While we review your message, you can help us move things forward by filling out a quick project form.<br>
This will give us a better understanding of your goals, timeline, and expectations.</p>
<a href="#" class="btn">Get a Estimate</a>
</div>
<div class="features">
<div class="feature-box">
<img src="https://i.imgur.com/eyetkn6.png" alt="Estimate Icon" width="80"/>
<h3>Get a Free Estimate</h3>
<p>Request a quick, no-obligation quote tailored to your needs.</p>
</div>
<div class="feature-box">
<img src="https://i.imgur.com/A7ZOXjo.png" alt="Competitive Icon" width="80"/>
<h3>Competitive</h3>
<p>Offering high-quality services at prices that beat the competition.</p>
</div>
</div>
</body>
</html>
  `;
}

const getContactConfirmationEmailText = (name, subject, message) => `
Thank you, ${name}!

We've received your message at DevTone Agency.

Subject: ${subject}
Message: ${message}

Our team will review your message and reply within 24 hours.

Best regards,
The DevTone Team
https://devtone.agency
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, company, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, subject, message' });
    }
    // Send confirmation email to the user
    const confirmationEmail = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: email,
      subject: `We received your message - DevTone Agency`,
      html: getContactConfirmationEmailHTML(name, subject, message),
      text: getContactConfirmationEmailText(name, subject, message),
    });
    // Send notification to the team
    const teamNotification = await resend.emails.send({
      from: 'DevTone Contact Form <team@devtone.agency>',
      to: 'team@devtone.agency',
      subject: `📬 New Contact Form: ${name} - ${subject}`,
      html: `<h2>New contact received</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'Not provided'}</p><p><strong>Company:</strong> ${company || 'Not provided'}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p><hr><p><small>Sent at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</small></p>`,
      text: `New contact received\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nCompany: ${company || 'Not provided'}\nSubject: ${subject}\n\nMessage:\n${message}\n\n--\nSent at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`,
    });
    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully',
      confirmationId: confirmationEmail.id,
      notificationId: teamNotification.id
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}
