import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Envia os dados recebidos para o webhook do HubSpot
    const hubspotRes = await fetch('https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/JHi6t1H', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await hubspotRes.json().catch(() => ({}));
    res.status(hubspotRes.status).json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
