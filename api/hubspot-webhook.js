// Simple Express server to proxy requests to HubSpot
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Enable CORS for your domain
app.use(cors({
  origin: 'https://devtone.agency'
}));

app.use(express.json());

// Proxy endpoint
app.post('/webhook', async (req, res) => {
  try {
    const webhookUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/cq2QrNJ';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.text();
    
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Error proxying to HubSpot:', error);
    res.status(500).json({ error: 'Failed to send data to HubSpot' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});