import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

// NEW STYLE: Use the circular, modern style from getContactClientTemplate in email-templates.js
function getContactConfirmationEmailHTML(name, subject, message, email, phone, company, preferredContact) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 20px; overflow: hidden;">
    <!-- Logo -->
    <div style="text-align: center; padding: 30px 0 10px 0; background: #fff;">
      <img src="https://devtone.agency/logo.png" alt="DevTone Agency Logo" style="height: 60px; margin-bottom: 10px;" />
    </div>
    <!-- Decorative Image -->
    <div style="text-align: center;">
      <img src="https://devtone.agency/api/webhooks/images/image-1.png" alt="Decorative" style="max-width: 90%; border-radius: 12px; margin-bottom: 20px;" />
    </div>
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: #ffffff; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Thank You for Contacting Us!</h1>
      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">We've received your message</p>
    </div>
    <div style="padding: 40px 30px;">
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Hello ${name},
      </p>
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Thank you for reaching out to DevTone Agency. We appreciate your interest and have successfully received your message.
      </p>
      <!-- Message Summary -->
      <div style="background-color: #f9f9f9; padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 4px solid #4a6cf7;">
        <h3 style="color: #2541b2; margin: 0 0 15px 0; font-size: 18px;">Your Message Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px 0; color: #333;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td><td style="padding: 8px 0; color: #333;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-weight: bold;">Phone:</td><td style="padding: 8px 0; color: #333;">${phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-weight: bold;">Company:</td><td style="padding: 8px 0; color: #333;">${company || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-weight: bold;">Preferred Contact:</td><td style="padding: 8px 0; color: #333;">${preferredContact || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-weight: bold;">Subject:</td><td style="padding: 8px 0; color: #333;">${subject}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px 0; color: #333;">${message.replace(/\n/g, '<br>')}</td></tr>
        </table>
      </div>
      <!-- What Happens Next -->
      <div style="background-color: #f0f7ff; padding: 25px; border-radius: 15px; margin: 25px 0;">
        <h3 style="color: #2541b2; margin: 0 0 15px 0; font-size: 18px; text-align: center;">What Happens Next?</h3>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; background-color: #4a6cf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
              <span style="font-size: 20px; color: #ffffff;">1</span>
            </div>
            <div>
              <h4 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Message Review</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">Our team will review your message within 2-4 business hours.</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; background-color: #4a6cf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
              <span style="font-size: 20px; color: #ffffff;">2</span>
            </div>
            <div>
              <h4 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Personal Response</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">You'll receive a personalized response within 24 hours.</p>
            </div>
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; background-color: #4a6cf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
              <span style="font-size: 20px; color: #ffffff;">3</span>
            </div>
            <div>
              <h4 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Follow-up</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">If needed, we'll schedule a call to discuss your requirements in detail.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Contact Information -->
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Need immediate assistance?</p>
        <p style="margin: 0; color: #333; font-size: 14px;">
          Email: team@devtone.agency<br>
          WhatsApp: +1 (917) 741-3468<br>
          Website: <a href="https://devtone.agency" style="color: #4a6cf7; text-decoration: none;">devtone.agency</a>
        </p>
      </div>
    </div>
    <!-- Footer -->
    <div style="background-color: #f5f7fa; padding: 25px; text-align: center; border-radius: 0 0 20px 20px;">
      <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
        Best regards,<br>
        <strong>The DevTone Team</strong>
      </p>
      <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
        © ${new Date().getFullYear()} DevTone Agency. All rights reserved.
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
