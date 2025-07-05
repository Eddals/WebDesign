// Vercel Serverless Function for sending emails via Brevo
// This handles the /api/send-brevo-email endpoint

import SibApiV3Sdk from 'sib-api-v3-sdk';

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
      error: 'Method not allowed' 
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

    // 1. Authentication setup
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';

    // 2. Create API instance for transactional emails
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // 3. Prepare the email with template ID and parameters
    const sendSmtpEmail = {
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

    // 4. Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: response
    });
  } catch (error) {
    console.error('Error sending Brevo email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while sending the email'
    });
  }
}