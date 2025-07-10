// Contact form endpoint for Brevo
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, company, subject, message, preferredContact } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, subject, message'
      });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // 1. Criar/atualizar contato e adicionar à lista #7
    const contactData = {
      email: email,
      attributes: {
        FIRSTNAME: name,
        PHONE: phone || '',
        COMPANY: company || '',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: preferredContact || 'email'
      },
      listIds: [7],
      updateEnabled: true
    };

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
      return res.status(contactResponse.status).json({
        success: false,
        error: 'Failed to create contact',
        details: errorData
      });
    }

    // 2. Enviar e-mail de confirmação usando template #3
    const emailData = {
      to: [{ email, name }],
      templateId: 3,
      params: {
        FIRSTNAME: name,
        EMAIL: email,
        PHONE: phone || 'Not provided',
        COMPANY: company || 'Not provided',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: preferredContact || 'email'
      }
    };

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    const emailResult = await emailResponse.json().catch(() => null);
    if (!emailResponse.ok) {
      return res.status(emailResponse.status).json({
        success: false,
        error: 'Failed to send confirmation email',
        details: emailResult
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      emailId: emailResult && emailResult.messageId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 