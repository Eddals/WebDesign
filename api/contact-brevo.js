import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

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

  console.log('📧 Recebida requisição para Brevo Contact:', req.body);
  
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Validation passed, sending email...');

    const BREVO_CONFIG = {
      API_KEY: process.env.BREVO_API_KEY || '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',
      API_URL: 'https://api.brevo.com/v3/smtp/email',
      TEAM_EMAIL: process.env.TEAM_EMAIL || 'team@devtone.agency'
    };

    // Send email to team using Brevo template ID #5
    const emailData = {
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
      templateId: 5,
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone || 'Not provided',
        COMPANY: data.company || 'Not provided',
        SUBJECT: data.subject,
        MESSAGE: data.message,
        PREFERRED_CONTACT: data.preferredContact || 'email',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Contact Form'
      }
    };

    console.log('Sending email data:', emailData);

    // Send email via Brevo API
    console.log('Sending request to Brevo API:', BREVO_CONFIG.API_URL);
    console.log('Using API Key:', BREVO_CONFIG.API_KEY.substring(0, 10) + '...');
    
    const brevoResponse = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    console.log('Brevo response status:', brevoResponse.status);
    console.log('Brevo response headers:', Object.fromEntries(brevoResponse.headers.entries()));

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error('Brevo API error:', errorData);
      console.error('Response status:', brevoResponse.status);
      console.error('Response headers:', Object.fromEntries(brevoResponse.headers.entries()));
      throw new Error(`Brevo API error: ${brevoResponse.status} - ${errorData}`);
    }

    console.log('Team email sent successfully');

    // Send confirmation email to the client using Brevo template ID #5
    const confirmationEmailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: data.email,
          name: data.name
        }
      ],
      templateId: 5, // Using template ID 5 for client confirmation
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone || 'Not provided',
        COMPANY: data.company || 'Not provided',
        SUBJECT: data.subject,
        MESSAGE: data.message,
        PREFERRED_CONTACT: data.preferredContact || 'email',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Contact Form - Client Confirmation'
      }
    };

    console.log('Sending confirmation email...');

    // Send confirmation email
    const confirmationResponse = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY
      },
      body: JSON.stringify(confirmationEmailData)
    });

    console.log('Confirmation response status:', confirmationResponse.status);

    if (!confirmationResponse.ok) {
      const errorData = await confirmationResponse.text();
      console.error('Confirmation email failed:', errorData);
      // Don't fail the whole request if confirmation email fails
    } else {
      console.log('Confirmation email sent successfully');
    }

    console.log('Sending success response');
    return res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    
    // Ensure we always return a valid JSON response
    try {
      return res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to submit contact form',
        timestamp: new Date().toISOString()
      });
    } catch (jsonError) {
      // Fallback if JSON serialization fails
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).end(JSON.stringify({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }));
    }
  }
} 