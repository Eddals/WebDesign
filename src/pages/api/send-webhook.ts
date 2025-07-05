import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Envia os dados recebidos para o webhook do HubSpot
    const hubspotRes = await fetch('https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/d2CLZAZ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await hubspotRes.json().catch(() => ({}));
    if (hubspotRes.ok) {
      res.status(200).json({ success: true, message: 'Webhook enviado com sucesso', hubspot: data });
    } else {
      res.status(hubspotRes.status).json({ success: false, message: 'Erro ao enviar para o HubSpot', hubspot: data });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erro interno no servidor', error: error.message });
  }
}
