// Simple proxy for N8N webhooks to avoid CORS issues
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to N8N
    const n8nResponse = await fetch('https://eae.app.n8n.cloud/webhook/12083862-0339-4d6e-9168-288d61e7cd52', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Also send to test webhook
    try {
      await fetch('https://eae.app.n8n.cloud/webhook-test/239bb0c5-e4c8-4de1-9b94-8686e41c7098', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
    } catch (testError) {
      console.error('Error sending to test webhook:', testError);
      // Continue even if test webhook fails
    }

    // Return the response from N8N
    const data = await n8nResponse.text();
    
    return res.status(n8nResponse.status).send(data);
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return res.status(500).json({ error: 'Failed to forward request to N8N' });
  }
}