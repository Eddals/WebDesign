import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { firstName, email, phone } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not defined in environment variables');
    return res.status(500).json({ 
      success: false, 
      error: 'Server configuration error' 
    });
  }

  try {
    // Adicionar contato à lista #2 do Brevo (lista de newsletter)
    const contactData = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        SMS: phone || ''
      },
      listIds: [2], // ID da lista de newsletter
      updateEnabled: true
    };

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add contact to Brevo newsletter list:', errorText);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to subscribe to newsletter' 
      });
    }

    // Opcional: Enviar email de confirmação
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'Devtone Agency',
            email: 'team@devtone.agency'
          },
          to: [
            {
              email,
              name: firstName
            }
          ],
          subject: 'Welcome to Devtone Newsletter!',
          htmlContent: `
            <html>
              <body>
                <h1>Welcome to our Newsletter, ${firstName}!</h1>
                <p>Thank you for subscribing to the Devtone Agency newsletter.</p>
                <p>You'll now receive our latest web development tips, industry insights, and exclusive offers.</p>
                ${phone ? `<p>We've also registered your phone number: ${phone} for important updates.</p>` : ''}
                <p>Best regards,<br>The Devtone Team</p>
              </body>
            </html>
          `
        })
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with success response even if confirmation email fails
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An unexpected error occurred' 
    });
  }
}