// /api/contact-brevo.js
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
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, company, subject, message, preferredContact } = req.body;

    // Validação básica
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, subject, message'
      });
    }

    // Use hardcoded API key as fallback if environment variable is not set
    const BREVO_API_KEY = process.env.BREVO_API_KEY || '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';
    if (!BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    console.log('Processing contact form submission for:', email);

    // 1. Criar/atualizar contato e adicionar à lista #8
    const contactData = {
      email,
      attributes: {
        FIRSTNAME: name,
        PHONE: phone || '',
        COMPANY: company || '',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: preferredContact || 'email'
      },
      listIds: [8],
      updateEnabled: true
    };

    console.log('Adding contact to Brevo list');
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.text();
      console.error('Failed to create contact:', errorData);
      // Continue even if contact creation fails - we still want to send the notification email
    } else {
      console.log('Contact added successfully to Brevo list');
    }

    // 2. Send notification email to team@devtone.agency
    console.log('Sending notification email to team@devtone.agency');
    const notificationData = {
      sender: {
        name: 'DevTone Website',
        email: 'team@devtone.agency'  // Using verified domain
      },
      to: [
        {
          email: 'team@devtone.agency',
          name: 'DevTone Team'
        }
      ],
      subject: `New Contact Form Submission: ${subject}`,
      htmlContent: `
        <html>
          <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Preferred Contact Method:</strong> ${preferredContact || 'Email'}</p>
            <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
          </body>
        </html>
      `
    };

    const notificationResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(notificationData)
    });

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.text();
      console.error('Failed to send notification email:', errorData);
    } else {
      console.log('Notification email sent successfully to team@devtone.agency');
    }

    // 3. Send confirmation email to the user
    console.log('Sending confirmation email to user:', email);
    const confirmationData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'  // Using verified domain
      },
      to: [
        {
          email: email,
          name: name
        }
      ],
      subject: 'Thank you for contacting DevTone Agency',
      htmlContent: `
        <html>
          <body>
            <h2>Thank you for contacting DevTone Agency!</h2>
            <p>Hello ${name},</p>
            <p>We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
            <p>Here's a copy of your message:</p>
            <blockquote>${message}</blockquote>
            <p>Best regards,<br>The DevTone Team</p>
          </body>
        </html>
      `
    };

    const confirmationResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(confirmationData)
    });

    if (!confirmationResponse.ok) {
      const errorData = await confirmationResponse.text();
      console.error('Failed to send confirmation email:', errorData);
    } else {
      console.log('Confirmation email sent successfully to user:', email);
    }

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in contact-brevo API:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 