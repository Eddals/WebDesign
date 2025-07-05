// Direct Brevo email endpoint that bypasses Vercel issues
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

    console.log('📤 Sending Brevo email directly...');
    console.log('📋 To:', email);
    console.log('📋 Name:', name);
    console.log('📋 Message length:', message.length);

    // Use your Brevo API key
    const apiKey = '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';

    // Prepare the email data for Brevo API
    const emailData = {
      to: [
        {
          email: email,
          name: name
        }
      ],
      templateId: 2, // Your template ID
      params: {
        FIRSTNAME: name.split(' ')[0], // First name extraction
        message: message
      },
      sender: {
        name: 'Devtone Agency',
        email: 'team@devtone.agency'
      }
    };

    console.log('📧 Email data prepared:', JSON.stringify(emailData, null, 2));

    // Send email using Brevo API directly with fetch
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    console.log('📥 Brevo API response status:', brevoResponse.status);
    console.log('📥 Brevo API response headers:', Object.fromEntries(brevoResponse.headers.entries()));

    const responseText = await brevoResponse.text();
    console.log('📥 Brevo API response text:', responseText);

    if (!brevoResponse.ok) {
      console.error('❌ Brevo API error:', responseText);
      return res.status(500).json({
        success: false,
        error: `Brevo API error: ${brevoResponse.status} ${brevoResponse.statusText}`,
        details: responseText
      });
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Brevo response:', parseError);
      return res.status(500).json({
        success: false,
        error: 'Invalid response from Brevo API',
        rawResponse: responseText
      });
    }

    console.log('✅ Brevo email sent successfully!');
    console.log('📧 Response data:', responseData);
    
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully via Brevo',
      data: responseData,
      sentTo: email,
      templateId: 2
    });
  } catch (error) {
    console.error('❌ Error sending Brevo email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while sending the email'
    });
  }
} 