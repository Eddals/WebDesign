// This file should be placed in your API folder or backend server

// Import required modules if using Node.js
// const fetch = require('node-fetch');
// const cors = require('cors');
// const express = require('express');
// const app = express();

// app.use(cors());
// app.use(express.json());

/**
 * HubSpot Webhook Proxy
 * 
 * This endpoint receives data from your frontend and forwards it to HubSpot webhook
 * It helps bypass CORS issues that occur when trying to call HubSpot directly from browser
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { webhookUrl, ...data } = req.body;
    
    // Validate webhook URL
    if (!webhookUrl || !webhookUrl.includes('hubapi.com')) {
      return res.status(400).json({ error: 'Invalid webhook URL' });
    }
    
    // Forward the data to HubSpot webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // Get response from HubSpot
    const responseData = await response.json().catch(() => ({}));
    
    // Return the response to the client
    return res.status(response.status).json({
      success: response.ok,
      status: response.status,
      data: responseData,
    });
  } catch (error) {
    console.error('Error forwarding to HubSpot webhook:', error);
    return res.status(500).json({ 
      error: 'Failed to forward data to HubSpot webhook',
      message: error.message 
    });
  }
}

// If using Express directly:
// app.post('/api/hubspot-webhook', handler);
// 
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });