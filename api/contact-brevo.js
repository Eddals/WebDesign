export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // Certifique-se que isso está no painel da Vercel
      },
      body: JSON.stringify({
        templateId: 5, // <- seu template
        sender: {
          name: 'DevTone Website',
          email: 'team@devtone.agency',
        },
        to: [
          {
            email: email, // vai para o cliente
            name: name,
          },
        ],
        params: {
          contact: {
            FIRSTNAME: name, // <- usado no template como {{ contact.FIRSTNAME }}
          },
        },
      }),
    });

    const result = await response.json();
    console.log('📩 Brevo Response:', result);

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send email via Brevo' });
    }

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Brevo error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
