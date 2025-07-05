// Proxy for webhooks to avoid CORS issues
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the target from query params or use default
    const target = req.query.target || 'n8n';
    console.log(`Proxying webhook request to ${target}`);
    
    let targetUrl;
    let requestBody = req.body;
    
    // Determine the target URL based on the target parameter
    if (target === 'hubspot') {
      targetUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi';
      
      // Format data for HubSpot webhook
      requestBody = {
        submittedAt: Date.now(),
        fields: Object.entries(req.body).map(([name, value]) => ({
          name,
          value: value || ''
        })),
        context: {
          pageUri: "estimate-form",
          pageName: "Estimate Request Form"
        }
      };
    } else {
      // Default to N8N
      targetUrl = 'https://eae.app.n8n.cloud/webhook/a6db0e86-ac57-49bc-ac5b-aed7c1ddd0e3';
    }
    
    console.log(`Forwarding to: ${targetUrl}`);
    console.log('Request body:', JSON.stringify(requestBody));
    
    // Forward the request to the target URL
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Response status: ${response.status}`);
    
    // Try to get the response text
    let responseText;
    try {
      responseText = await response.text();
      console.log('Response text:', responseText);
    } catch (textError) {
      console.error('Error getting response text:', textError);
      responseText = 'Error getting response text';
    }
    
    // Return the response from the target
    return res.status(response.status).send(responseText || '');
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to forward request',
      message: error.message
    });
  }
}