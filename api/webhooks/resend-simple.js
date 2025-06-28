import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

function getContactConfirmationEmailHTML(name, subject, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .timeline { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .step { display: flex; align-items: start; margin-bottom: 15px; }
        .step-number { background: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
        .button { display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You, ${name}!</h1>
          <p>We've received your message</p>
        </div>
        <div class="content">
          <p>Thank you for contacting DevTone Agency. We're excited to connect with you!</p>
          <div class="timeline">
            <h2 style="color: #6366f1; margin-bottom: 20px;">What Happens Next?</h2>
            <div class="step">
              <div class="step-number">1</div>
              <div>
                <strong>Message Review (0-2 hours)</strong><br>
                Our team will review your message and requirements.
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div>
                <strong>Personalized Response (within 24 hours)</strong><br>
                You'll receive a detailed reply or proposal from our team.
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div>
                <strong>Schedule a Call (if needed)</strong><br>
                We'll arrange a call to discuss your needs in detail if required.
              </div>
            </div>
          </div>
          <h3 style="color: #6366f1;">Your Message:</h3>
          <ul style="background: white; padding: 20px; border-radius: 10px;">
            <li><strong>Subject:</strong> ${subject}</li>
            <li><strong>Message:</strong> ${message.replace(/\n/g, '<br>')}</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Need to reach us sooner?</p>
            <a href="mailto:team@devtone.agency" class="button">Email Us</a>
            <a href="https://wa.me/19177413468" class="button" style="background: #25D366;">WhatsApp Us</a>
          </div>
          <p style="text-align: center; color: #999; margin-top: 30px; font-size: 14px;">
            Best regards,<br>
            <strong>The DevTone Team</strong><br>
            <a href="https://devtone.agency" style="color: #6366f1;">devtone.agency</a>
          </p>
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
