export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: 'CORS preflight' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    company,
    industry,
    projectType,
    budget,
    timeline,
    description,
    features,
    retainer,
  } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Website', email: 'team@devtone.agency' },
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        templateId: 2, // 🟣 ID do template Brevo para o orçamento
        params: {
          name,
          email,
          phone,
          company,
          industry,
          projectType,
          budget,
          timeline,
          description: description || 'Not provided',
          features: features && features.length ? features.join(', ') : 'No features selected',
          retainer: retainer || 'Not specified',
          submittedAt: new Date().toLocaleString(),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Brevo API error:', error);
      return res.status(500).json({ error: 'Failed to send estimate via Brevo' });
    }

    return res.status(200).json({ success: true, message: 'Estimate email sent successfully' });
  } catch (err) {
    console.error('Estimate submission error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
