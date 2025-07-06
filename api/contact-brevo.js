export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const API_KEY = process.env.BREVO_API_KEY;

  if (!API_KEY) {
    console.error('❌ BREVO_API_KEY is missing in environment variables');
    return res.status(500).json({ error: 'Server misconfiguration: Missing API Key' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Website', email: 'team@devtone.agency' },
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        subject: `New Contact from ${name}`,
        htmlContent: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br/>${message}</p>
          <hr/>
          <p><em>Sent on ${new Date().toLocaleString()}</em></p>
        `
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Brevo API response error:', response.status, errorText);
      return res.status(500).json({ error: 'Failed to send email via Brevo', details: errorText });
    }

    return res.status(200).json({ success: true, msg: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Contact form server error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
