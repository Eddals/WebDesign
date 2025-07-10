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
    retainer,
    phone,
    description
  } = req.body;

  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  // Adicionar contato à lista #7 do Brevo
  try {
    // Extrair primeiro e último nome
    const nameParts = (firstname || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    const contactData = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        PHONE: phone || '',
        COMPANY: company || '',
        INDUSTRY: industry || '',
        PROJECT_TYPE: projectType || '',
        PROJECTTYPE: projectType || '',
        BUDGET: budget || '',
        TIMELINE: timeline || '',
        FEATURES: Array.isArray(features) ? features.join(', ') : (features || ''),
        DESCRIPTION: description || '',
        RETAINER: retainer || '',
        MESSAGE: description || '',
        SUBJECT: projectType || 'Website Estimate',
        PREFERRED_CONTACT: 'email',
        EXT_ID: `estimate_${Date.now()}`,
        SUBMISSION_DATE: new Date().toISOString()
      },
      listIds: [7],
      updateEnabled: true
    };

    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      console.error('Failed to add contact to Brevo list #7:', await contactResponse.text());
    } else {
      console.log('Contact successfully added to Brevo list #7');
    }
  } catch (contactError) {
    console.error('Error adding contact to Brevo list:', contactError);
  }

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
        RETAINER: retainer || 'Not provided',
        PHONE: phone || 'Not provided',
        DESCRIPTION: description || 'Not provided'
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Erro Brevo:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail', details: error });
  }

  return res.status(200).json({ success: true });
} 