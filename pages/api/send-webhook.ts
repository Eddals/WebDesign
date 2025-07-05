import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // HubSpot webhook URL
    const hubspotWebhookUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/d2CLZAZ';
    
    // Create test data for the webhook
    const testData = {
      name: req.body.name || 'Test User',
      email: req.body.email || 'test@example.com',
      message: req.body.message || 'This is a test webhook message from DevTone'
    };

    // Send the webhook to HubSpot
    const response = await fetch(hubspotWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HubSpot webhook failed with status: ${response.status}`);
    }

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook sent to HubSpot successfully' 
    });
  } catch (error) {
    console.error('Error sending webhook:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send webhook to HubSpot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}