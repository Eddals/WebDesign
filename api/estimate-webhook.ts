// api/estimate-webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Log the received data
    console.log('Estimate webhook received:', req.body);

    // Process the webhook data here
    // You can add additional logic as needed

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Estimate webhook received successfully' 
    });
  } catch (error) {
    console.error('Estimate webhook error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred processing the webhook' 
    });
  }
}