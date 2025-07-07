export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: 'CORS preflight' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      company,
      industry,
      projectType,
      budget,
      timeline,
      description,
      features,
      retainer,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !company || !industry || !projectType || !budget || !timeline) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'company', 'industry', 'projectType', 'budget', 'timeline']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('📧 Sending estimate email via Brevo...');
    console.log('📋 Data:', { name, email, company, projectType, budget });

    // Use environment variable or fallback API key
    const apiKey = process.env.BREVO_API_KEY || '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';

    // Send email to team using Brevo template ID #2
    const emailData = {
      sender: {
        name: 'DevTone Website',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: 'team@devtone.agency',
          name: 'DevTone Team'
        }
      ],
      templateId: 2, // 🟣 ID do template Brevo para o orçamento
      params: {
        name,
        email,
        phone,
        company,
        industry,
        projectType,
        budget,
        timeline,
        description: description || 'Not provided',
        features: features && features.length ? features.join(', ') : 'No features selected',
        retainer: retainer || 'Not specified',
        submittedAt: new Date().toLocaleString(),
      },
    };

    console.log('📤 Sending to Brevo API...');
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(emailData),
    });

    console.log('📥 Brevo response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Brevo API error:', errorText);
      return res.status(500).json({ 
        error: 'Failed to send estimate via Brevo',
        details: errorText
      });
    }

    const result = await response.json();
    console.log('✅ Brevo response:', result);

    // Send confirmation email to client
    const clientEmailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: email,
          name: name
        }
      ],
      templateId: 2, // Using same template for client confirmation
      params: {
        name,
        email,
        phone,
        company,
        industry,
        projectType,
        budget,
        timeline,
        description: description || 'Not provided',
        features: features && features.length ? features.join(', ') : 'No features selected',
        retainer: retainer || 'Not specified',
        submittedAt: new Date().toLocaleString(),
        source: 'Estimate Form - Client Confirmation'
      },
    };

    console.log('📤 Sending confirmation email to client...');
    const clientResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(clientEmailData),
    });

    if (!clientResponse.ok) {
      console.warn('⚠️ Client confirmation email failed, but team email was sent');
    } else {
      console.log('✅ Client confirmation email sent successfully');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Estimate email sent successfully',
      messageId: result.messageId
    });

  } catch (err) {
    console.error('❌ Estimate submission error:', err);
    return res.status(500).json({ 
      error: 'Server error',
      message: err.message 
    });
  }
}
