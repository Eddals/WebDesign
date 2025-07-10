import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Permitir apenas solicitações POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Obter a URL do endpoint Brevo e os dados do corpo da solicitação
  const { endpoint, data, apiKey } = req.body;

  if (!endpoint || !data || !apiKey) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required parameters: endpoint, data, or apiKey' 
    });
  }

  try {
    // Construir a URL completa do Brevo
    const brevoUrl = `https://api.brevo.com/v3/${endpoint}`;

    // Fazer a solicitação para o Brevo
    const response = await fetch(brevoUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(data)
    });

    // Obter o corpo da resposta como texto
    const responseText = await response.text();

    // Tentar analisar como JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // Se não for JSON válido, usar o texto como está
      responseData = { text: responseText };
    }

    // Retornar a resposta com o mesmo status e corpo
    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data: responseData
    });
  } catch (error) {
    console.error('Brevo proxy error:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}