export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test Brevo API key with a simple request
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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',
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Brevo API test error:', error);
      return res.status(500).json({ 
        error: `Brevo API test failed: ${response.status}`,
        details: error
      });
    }

    const accountInfo = await response.json();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Brevo API key is working!',
      account: accountInfo
    });
  } catch (error) {
    console.error('Brevo API test error:', error);
    return res.status(500).json({ error: error.message });
  }
} 