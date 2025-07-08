// api/estimate-brevo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { BREVO_CONFIG, EMAIL_TEMPLATES } from '../src/config/brevo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS for testing (adjust later)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

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

    // Use the API key from the config file
    const apiKey = BREVO_CONFIG.API_KEY;
    const teamEmail = BREVO_CONFIG.TEAM_EMAIL;

    const params = {
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

    // Email para a equipe
    const teamRes = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: EMAIL_TEMPLATES.ESTIMATE_NOTIFICATION.sender,
        to: [{ email: teamEmail, name: 'DevTone Team' }],
        templateId: 2,
        params
      })
    });

    if (!teamRes.ok) {
      const err = await teamRes.text();
      return res.status(500).json({ error: 'Failed to send team email', details: err });
    }

    // Email para o cliente
    await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: EMAIL_TEMPLATES.ESTIMATE_CONFIRMATION.sender,
        to: [{ email, name }],
        templateId: 8,
        params
      })
    });

    // Criar/Atualizar contato no Brevo
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
          SMS: phone,
          COMPANY: company,
          INDUSTRY: industry,
          PROJECTTYPE: projectType,
          BUDGET: budget,
          TIMELINE: timeline,
          DESCRIPTION: description || '',
          FEATURES: features?.join(', ') || '',
          RETAINER: retainer || ''
        },
        listIds: [7],
        updateEnabled: true
      })
    });

    return res.status(200).json({ success: true, message: 'Estimate sent successfully' });

  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
