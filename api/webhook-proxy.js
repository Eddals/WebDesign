// Simple proxy for N8N webhooks to avoid CORS issues
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to N8N using the new webhook URL
    const n8nResponse = await fetch('https://eae.app.n8n.cloud/webhook/a6db0e86-ac57-49bc-ac5b-aed7c1ddd0e3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Return the response from N8N
    const data = await n8nResponse.text();
    
    return res.status(n8nResponse.status).send(data);
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return res.status(500).json({ error: 'Failed to forward request to N8N' });
  }
}