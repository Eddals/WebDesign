import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Forward the request body to HubSpot webhook endpoint
    const hubspotRes = await fetch('https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/cq2QrNJ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required HubSpot headers here (e.g., Authorization) if needed
      },
      body: JSON.stringify(req.body),
    });

    const data = await hubspotRes.json().catch(() => ({}));
    res.status(hubspotRes.status).json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
