export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight check
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
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
      features: features?.length ? features.join(', ') : 'No features selected',
      retainer: retainer || 'Not specified',
      submittedAt: new Date().toLocaleString()
    };

    // 1. Send email to team
    const teamEmailData = {
      sender: { name: 'DevTone Website', email: 'team@devtone.agency' },
      to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
      templateId: 2,
      params: sharedParams
    };

    const teamResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(teamEmailData)
    });

    if (!teamResponse.ok) {
      const errorText = await teamResponse.text();
      console.error('❌ Failed to send email to team:', errorText);
      return res.status(500).json({ error: 'Failed to send team email', details: errorText });
    }

    const emailResult = await teamResponse.json();

    // 2. Send confirmation to client
    const clientEmailData = {
      sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
      to: [{ email, name }],
      templateId: 8, // Use client-facing template here
      params: {
        ...sharedParams,
        source: 'Estimate Form - Client Confirmation'
      }
    };

    const clientRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(clientEmailData)
    });

    if (!clientRes.ok) {
      const warn = await clientRes.text();
      console.warn('⚠️ Failed to send confirmation email to client:', warn);
    }

    // 3. Create/update Brevo contact
    const contactPayload = {
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
    };

    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(contactPayload)
    });

    if (!contactRes.ok) {
      const contactError = await contactRes.text();
      console.error('❌ Failed to sync contact to Brevo:', contactError);
    }

    return res.status(200).json({
      success: true,
      message: 'Estimate email and contact saved successfully',
      messageId: emailResult.messageId
    });

  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
