export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body;
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not found', message: 'BREVO_API_KEY not configured in Vercel environment variables' });
    }

    // Montar os parâmetros para o template #2
    const params = {
      FIRSTNAME: body.name,
      COMPANY: body.company,
      INDUSTRY: body.industry,
      PROJECT_TYPE: body.projectType,
      BUDGET: body.budget,
      TIMELINE: body.timeline,
      FEATURES: Array.isArray(body.features) ? body.features.join(', ') : body.features,
      RETAINER: body.retainer,
      DESCRIPTION: body.description,
      EMAIL: body.email,
      PHONE: body.phone
    };

    // Enviar e-mail para o cliente usando o template #2
    const clientResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
        to: [{ email: body.email, name: body.name }],
        templateId: 2,
        params
      })
    });

    // Opcional: Enviar notificação para o time (pode ser removido se não quiser)
    // const teamResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
    //   method: 'POST',
    //   headers: {
    //     'accept': 'application/json',
    //     'api-key': apiKey,
    //     'content-type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     sender: { name: 'DevTone Estimate Form', email: 'noreply@devtone.agency' },
    //     to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
    //     templateId: 2,
    //     params
    //   })
    // });

    const clientData = await clientResponse.json();
    if (!clientResponse.ok) {
      return res.status(clientResponse.status).json({ error: clientData, message: 'Failed to send client confirmation email' });
    }

    return res.status(200).json({ 
      success: true, 
      clientEmailSent: clientResponse.ok,
      message: 'Estimate request processed successfully'
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    });
  }
}