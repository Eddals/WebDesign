export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: 'DevTone Website',
          email: 'team@devtone.agency',
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        templateId: 5, // 👈 Altere aqui para o ID do seu template de contato
      }),
    });

    const result = await response.json();
    console.log('📩 Brevo Contact Response:', result);

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send contact email via Brevo' });
    }

    return res.status(200).json({ success: true, message: 'Contact email sent successfully' });
  } catch (err) {
    console.error('❌ Brevo contact error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
