// pages/api/estimate-brevo.ts
export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: 'CORS preflight success' });
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
      retainer
    } = req.body;

    // ✅ Validação básica
    if (!name || !email || !phone || !company || !industry || !projectType || !budget || !timeline) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'company', 'industry', 'projectType', 'budget', 'timeline']
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
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
      features: features?.join(', ') || 'No features selected',
      retainer: retainer || 'Not specified',
      submittedAt: new Date().toLocaleString()
    };

    // ✅ 1. Enviar e-mail para a equipe
    const teamEmail = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Website', email: 'team@devtone.agency' },
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        templateId: 2,
        params: sharedParams
      })
    });

    if (!teamEmail.ok) {
      const errorText = await teamEmail.text();
      console.error('❌ Failed to send team email:', errorText);
      return res.status(500).json({ error: 'Failed to send team email' });
    }

    const emailResult = await teamEmail.json();

    // ✅ 2. Enviar confirmação ao cliente
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
        to: [{ email, name }],
        templateId: 8,
        params: { ...sharedParams, source: 'Estimate Form - Client Confirmation' }
      })
    });

    // ✅ 3. Criar ou atualizar contato no Brevo
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
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
          DESCRIPTION: description || ''
        },
        listIds: [7],
        updateEnabled: true
      })
    });

    // ✅ Retorno final
    return res.status(200).json({
      success: true,
      message: 'Estimate sent and contact synced successfully',
      messageId: emailResult.messageId
    });

  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
