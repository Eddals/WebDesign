// api/estimate-brevo.ts
import type { NextApiRequest, NextApiResponse } from 'next';

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

    const apiKey = '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';

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
    const teamRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Website', email: 'team@devtone.agency' },
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        templateId: 2,
        params
      })
    });

    if (!teamRes.ok) {
      const err = await teamRes.text();
      return res.status(500).json({ error: 'Failed to send team email', details: err });
    }

    // Email para o cliente
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
