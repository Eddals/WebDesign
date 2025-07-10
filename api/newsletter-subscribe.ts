export default async function handler(req, res) {
  const allowedOrigins = [
    'https://devtone.agency',
    'https://www.devtone.agency',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { firstName, email, phone } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: firstName, email'
      });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const contactData = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        ...(phone && phone.trim() && { SMS: phone.trim() })
      },
      listIds: [2],
      updateEnabled: true
    };

    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.text();
      if (errorData.includes('duplicate_parameter')) {
        return res.status(400).json({
          success: false,
          error: 'This phone number is already registered. Please use a different one or leave it blank.'
        });
      } else if (errorData.includes('already exists')) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed! We\'ll keep you updated.'
        });
      } else {
        return res.status(contactResponse.status).json({
          success: false,
          error: 'Failed to subscribe to newsletter',
          details: errorData
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing! Check your email for confirmation.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
