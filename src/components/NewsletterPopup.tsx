import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, phone, preferredContact } = req.body;

  if (!firstName || !lastName || !email || !phone || !preferredContact) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Devtone Agency', email: 'your@sender.com' },
        to: [{ email, name: `${firstName} ${lastName}` }],
        templateId: 7, // Your newsletter template ID
        params: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          PHONE: phone,
          PREFERRED_CONTACT: preferredContact,
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: `Brevo error: ${error}` });
    }

    return res.status(200).json({ message: 'Email sent successfully' });

  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
