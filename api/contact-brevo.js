export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, subject, message } = req.body;

  try {
    // Send email to team using Brevo template ID #5
    const emailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: 'team@devtone.agency',
          name: 'DevTone Team'
        }
      ],
      templateId: 5,
      params: {
        NAME: name,
        EMAIL: email,
        PHONE: phone || 'Not provided',
        COMPANY: company || 'Not provided',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: 'email',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Contact Form'
      }
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Brevo API error:', error);
      return res.status(500).json({ error: `Brevo API error: ${response.status}` });
    }

    // Send confirmation email to client
    const confirmationData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: email,
          name: name
        }
      ],
      templateId: 5,
      params: {
        NAME: name,
        EMAIL: email,
        PHONE: phone || 'Not provided',
        COMPANY: company || 'Not provided',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: 'email',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Contact Form - Client Confirmation'
      }
    };

    const confirmationResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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',
      },
      body: JSON.stringify(confirmationData)
    });

    // Don't fail if confirmation email fails
    if (!confirmationResponse.ok) {
      console.error('Confirmation email failed');
    }

    return res.status(200).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ error: error.message });
  }
} 