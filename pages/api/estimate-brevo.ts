export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    email,
    firstname,
    company,
    industry,
    projectType,
    budget,
    timeline,
    features,
    retainer
  } = req.body;

  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  // 1. Criar ou atualizar contato
  const contact = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      attributes: {
        FIRSTNAME: firstname,
        COMPANY: company,
        INDUSTRY: industry,
        PROJECTTYPE: projectType,
        BUDGET: budget,
        TIMELINE: timeline,
        FEATURES: Array.isArray(features) ? features.join(', ') : features,
        RETAINER: retainer
      },
      updateEnabled: true
    })
  });

  if (!contact.ok) {
    const error = await contact.json();
    return res.status(500).json({ error: 'Erro ao salvar contato', details: error });
  }

  // 2. Adicionar o contato à lista #7
  const addToList = await fetch('https://api.brevo.com/v3/contacts/lists/7/contacts/add', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emails: [email]
    })
  });

  if (!addToList.ok) {
    const error = await addToList.json();
    return res.status(500).json({ error: 'Erro ao adicionar contato à lista', details: error });
  }

  // 3. Enviar email com template ID #2
  const emailData = {
    to: [{ email, name: firstname }],
    templateId: 2,
    params: {
      FIRSTNAME: firstname,
      EMAIL: email,
      COMPANY: company || 'Not provided',
      INDUSTRY: industry || 'Not provided',
      PROJECTTYPE: projectType || 'Not provided',
      BUDGET: budget || 'Not provided',
      TIMELINE: timeline || 'Not provided',
      FEATURES: Array.isArray(features) ? features.join(', ') : features || 'Not provided',
      RETAINER: retainer || 'Not provided'
    }
  };

  console.log('Enviando e-mail com dados:', JSON.stringify(emailData, null, 2));

  const emailSend = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  if (!emailSend.ok) {
    const error = await emailSend.json();
    return res.status(500).json({ error: 'Erro ao enviar e-mail', details: error });
  }

  return res.status(200).json({ success: true });
} 