// Using native fetch (available in Node.js 18+)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('🧪 Testing Brevo API connection...');

  try {
    const BREVO_CONFIG = {
      API_KEY: process.env.BREVO_API_KEY || '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',
      API_URL: 'https://api.brevo.com/v3/smtp/email',
      TEAM_EMAIL: process.env.TEAM_EMAIL || 'team@devtone.agency'
    };

    // Test email data
    const testEmailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: BREVO_CONFIG.TEAM_EMAIL,
          name: 'DevTone Team'
        }
      ],
      templateId: 2,
      params: {
        NAME: 'Test User',
        EMAIL: 'test@example.com',
        PHONE: '+1234567890',
        COMPANY: 'Test Company',
        INDUSTRY: 'Technology',
        PROJECT_TYPE: 'Website',
        BUDGET: '$5,000 - $10,000',
        TIMELINE: '1-2 months',
        RETAINER: 'No',
        FEATURES: 'Responsive Design, SEO, Contact Form',
        DESCRIPTION: 'This is a test email to verify Brevo API integration',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'API Test'
      }
    };

    console.log('Sending test request to Brevo API...');
    console.log('API URL:', BREVO_CONFIG.API_URL);
    console.log('API Key (first 10 chars):', BREVO_CONFIG.API_KEY.substring(0, 10) + '...');

    const brevoResponse = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify(testEmailData)
    });

    console.log('Brevo response status:', brevoResponse.status);
    console.log('Brevo response headers:', Object.fromEntries(brevoResponse.headers.entries()));

    if (brevoResponse.ok) {
      const responseData = await brevoResponse.json();
      console.log('✅ Brevo API test successful!');
      console.log('Response data:', responseData);
      
      return res.status(200).json({
        success: true,
        message: 'Brevo API test successful',
        response: responseData,
        config: {
          apiUrl: BREVO_CONFIG.API_URL,
          teamEmail: BREVO_CONFIG.TEAM_EMAIL,
          apiKeyConfigured: !!BREVO_CONFIG.API_KEY
        }
      });
    } else {
      const errorData = await brevoResponse.text();
      console.error('❌ Brevo API test failed');
      console.error('Error data:', errorData);
      
      return res.status(500).json({
        success: false,
        message: 'Brevo API test failed',
        error: errorData,
        status: brevoResponse.status,
        config: {
          apiUrl: BREVO_CONFIG.API_URL,
          teamEmail: BREVO_CONFIG.TEAM_EMAIL,
          apiKeyConfigured: !!BREVO_CONFIG.API_KEY
        }
      });
    }

  } catch (error) {
    console.error('❌ Error testing Brevo API:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error testing Brevo API',
      error: error.message,
      stack: error.stack
    });
  }
} 