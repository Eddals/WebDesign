import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ error: 'Missing required fields: email and firstName' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '', // Certifique-se de definir isso no seu .env
      },
      body: JSON.stringify({
        to: [{ email, name: firstName }],
        sender: {
          name: 'Devtone Agency',
          email: 'team@devtone.agency',
        },
        templateId: 7, // ID do seu template do Brevo
        params: {
          FIRSTNAME: firstName,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      return res.status(500).json({ error: 'Failed to send email via Brevo', details: errorData });
    }

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
