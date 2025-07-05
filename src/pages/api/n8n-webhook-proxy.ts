import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Forward the request to n8n webhook
    const webhookUrl = 'https://devtone.app.n8n.cloud/webhook-test/https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/cq2QrNJ';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Get response data
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { status: response.status };
    }

    // Return the response from n8n
    res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data: responseData
    });
  } catch (error: any) {
    console.error('Error forwarding to n8n webhook:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error forwarding request to webhook',
      error: error.message 
    });
  }
}