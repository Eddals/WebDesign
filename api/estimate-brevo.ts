export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body;

    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) {
      return res.status(500).json({ error: 'Missing BREVO_API_KEY' });
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Devtone', email: 'seu@email.com' },
        to: [{ email: body.email, name: body.name }],
        subject: 'Estimate Confirmation',
        htmlContent: `<p>Olá ${body.name}, recebemos sua solicitação de orçamento!</p>`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Brevo handler error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
