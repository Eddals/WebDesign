// Simplified Brevo email endpoint using fetch instead of SDK
export default async function handler(req, res) {
  // Enable CORS for your domain
  const allowedOrigins = [
    'https://devtone.agency',
    'https://www.devtone.agency',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      allowedMethods: ['POST'],
      receivedMethod: req.method
    });
  }

  try {
    // Validate required fields
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Use environment variable if available, otherwise use the hardcoded key
    const apiKeyValue = process.env.BREVO_API_KEY || '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';

    // Prepare the email data for Brevo API
    const emailData = {
      to: [
        {
          email: email,
          name: name
        }
      ],
      templateId: 2, // ID of your template in Brevo
      params: {
        FIRSTNAME: name.split(' ')[0], // First name extraction
        message: message
      },
      sender: {
        name: 'Devtone Agency',
        email: 'team@devtone.agency'
      }
    };

    // Send email using Brevo API directly with fetch
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKeyValue
      },
      body: JSON.stringify(emailData)
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error('Brevo API error:', errorText);
      return res.status(500).json({
        success: false,
        error: `Brevo API error: ${brevoResponse.status} ${brevoResponse.statusText}`,
        details: errorText
      });
    }

    const responseData = await brevoResponse.json();
    
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: responseData
    });
  } catch (error) {
    console.error('Error sending Brevo email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while sending the email'
    });
  }
} 