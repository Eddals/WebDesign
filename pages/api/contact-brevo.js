// Contact form endpoint for Brevo
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method Not Allowed',
      method: req.method 
    });
  }

  // Basic test response
  res.status(200).json({ 
    success: true,
    message: 'Contact form received successfully',
    data: req.body,
    timestamp: new Date().toISOString()
  });
} 