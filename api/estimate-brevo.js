export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
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

    // Validação básica
    if (!name || !email || !phone || !company || !industry || !projectType || !budget || !timeline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = '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';

    const sharedParams = {
      name,
      email,
      phone,
      company,
      industry,
      projectType,
      budget,
      timeline,
      description: description || 'Not provided',
      features: features?.length ? features.join(', ') : 'No features selected',
      retainer: retainer || 'Not specified',
      submittedAt: new Date().toLocaleString(),
    };

    // 1. Email para a equipe (templateId 2)
    const teamEmail = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Website', email: 'team@devtone.agency' },
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        templateId: 2,
        params: sharedParams,
      }),
    });

    if (!teamEmail.ok) {
      const msg = await teamEmail.text();
      console.error('❌ Team email failed:', msg);
      return res.status(500).json({ error: 'Failed to send team email', details: msg });
    }

    // 2. Email para o cliente (templateId 8)
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
        to: [{ email, name }],
        templateId: 8,
        params: {
          ...sharedParams,
          source: 'Estimate Form - Client Confirmation',
        },
      }),
    });

    // 3. Criar contato no Brevo (lista ID 7)
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name.split(' ')[0],
          SMS: phone.startsWith('+') ? phone : `+1${phone}`,
          COMPANY: company,
          INDUSTRY: industry,
          PROJECTTYPE: projectType,
          BUDGET: budget,
          TIMELINE: timeline,
          FEATURES: features?.join(', ') || '',
          RETAINER: retainer || '',
          DESCRIPTION: description || '',
        },
        listIds: [7],
        updateEnabled: true,
      }),
    });

    return res.status(200).json({ success: true, message: 'Everything sent and saved successfully' });

  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
