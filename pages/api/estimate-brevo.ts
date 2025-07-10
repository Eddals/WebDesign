export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, firstname } = req.body;

  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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
          name: firstname || 'Client'
        }
      ],
      templateId: 2
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Erro Brevo:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail', details: error });
  }

  return res.status(200).json({ success: true });
} 