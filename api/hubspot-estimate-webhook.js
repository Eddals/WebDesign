// HubSpot Estimate Webhook Handler
import fetch from 'node-fetch';

/**
 * This endpoint handles sending estimate form data to HubSpot webhook
 * It formats the data properly and handles errors
 */
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
    const formData = req.body;
    console.log('Received form data:', formData);
    
    // Format data for HubSpot - using the format from HubSpot's documentation
    const hubspotData = {
      // This is the format HubSpot expects for webhook triggers
      submittedAt: Date.now(),
      fields: [
        {
          name: "firstname",
          value: formData.full_name?.split(' ')[0] || ''
        },
        {
          name: "lastname",
          value: formData.full_name?.split(' ').slice(1).join(' ') || ''
        },
        {
          name: "email",
          value: formData.email
        },
        {
          name: "phone",
          value: formData.phone || ''
        },
        {
          name: "company",
          value: formData.property_type || ''
        },
        {
          name: "country",
          value: formData.location || ''
        },
        {
          name: "industry",
          value: formData.service_type || ''
        },
        {
          name: "budget",
          value: formData.estimated_budget || ''
        },
        {
          name: "timeline",
          value: formData.preferred_timeline || ''
        },
        {
          name: "message",
          value: formData.project_description || ''
        },
        {
          name: "property_size",
          value: formData.property_size || ''
        },
        {
          name: "source",
          value: "estimate_form"
        }
      ],
      context: {
        pageUri: "estimate-form",
        pageName: "Estimate Request Form"
      }
    };
    
    // HubSpot webhook URL - use the URL provided by HubSpot
    const hubspotWebhookUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi';
    
    console.log('Sending data to HubSpot webhook...');
    
    // Send data to HubSpot
    const response = await fetch(hubspotWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotData),
    });
    
    console.log('HubSpot webhook response status:', response.status);
    
    // Try to get response data
    let responseData;
    try {
      const text = await response.text();
      console.log('Response text:', text);
      responseData = text ? JSON.parse(text) : { message: 'Empty response' };
    } catch (error) {
      console.log('Error parsing response:', error.message);
      responseData = { message: 'No JSON response or invalid JSON' };
    }
    
    // Return response to client
    return res.status(response.ok ? 200 : 400).json({
      success: response.ok,
      status: response.status,
      data: responseData
    });
    
  } catch (error) {
    console.error('Error sending to HubSpot webhook:', error);
    return res.status(500).json({ 
      error: 'Failed to send data to HubSpot webhook',
      message: error.message 
    });
  }
}