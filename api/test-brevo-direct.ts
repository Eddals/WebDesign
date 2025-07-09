export default async function handler(req, res) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not found in environment variables',
        availableEnvVars: Object.keys(process.env).filter(key => key.includes('BREVO'))
      });
    }

    // Test the API key with Brevo's account endpoint
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Brevo API key is working!',
        account: data,
        apiKeyUsed: apiKey.substring(0, 10) + '...'
      });
    } else {
      return res.status(response.status).json({
        error: 'Brevo API test failed',
        status: response.status,
        details: data,
        apiKeyUsed: apiKey.substring(0, 10) + '...'
      });
    }
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
}