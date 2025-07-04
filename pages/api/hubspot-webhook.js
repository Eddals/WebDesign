// pages/api/hubspot-webhook.js
import fetch from 'node-fetch';

// Solução para o erro "fetch is not a function" no Vercel
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

export default async function handler(req, res) {
  // Apenas aceitar requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { webhookUrl, ...contactData } = req.body;

    if (!webhookUrl) {
      return res.status(400).json({ error: 'Webhook URL is required' });
    }

    console.log('Enviando dados para o webhook do HubSpot:', webhookUrl);
    
    // Enviar os dados para o webhook do HubSpot
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    const responseStatus = response.status;
    console.log('Status da resposta do webhook HubSpot:', responseStatus);

    // Retornar sucesso
    return res.status(200).json({ 
      success: true,
      hubspotStatus: responseStatus
    });
  } catch (error) {
    console.error('Erro ao enviar dados para o webhook do HubSpot:', error);
    return res.status(500).json({ 
      error: 'Falha ao enviar dados para o webhook do HubSpot',
      message: error.message 
    });
  }
}