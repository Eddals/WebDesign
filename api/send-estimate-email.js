// Vercel Serverless Function for Estimate Submission (Webhooks Only)
// This handles the /api/send-estimate-email endpoint

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
    const requiredFields = ['name', 'email', 'projectType', 'budget', 'timeline'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Prepare form data
    const formData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      company: req.body.company || '',
      country: req.body.country || '',
      industry: req.body.industry || '',
      projectType: req.body.projectType,
      budget: req.body.budget,
      timeline: req.body.timeline,
      description: req.body.description || '',
      features: req.body.features || []
    };

    // Send to the webhook for email delivery
    let webhookSuccess = false;
    try {
      const webhookResponse = await fetch('https://devtone.agency/api/webhooks/send-estimate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': 'whsec_3eOvuzUj7IZ50uqe2IQAFKn0+591D27E'
        },
        body: JSON.stringify(formData)
      });
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Webhook error response:', errorText);
      }
      webhookSuccess = webhookResponse.ok;
    } catch (webhookError) {
      console.error('Error sending to webhook:', webhookError);
    }

    if (webhookSuccess) {
      return res.status(200).json({
        success: true,
        message: 'Your estimate request has been received. We will contact you soon.',
        webhook: true
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to process estimate request. Please try again or contact us directly.'
      });
    }
  } catch (error) {
    console.error('Error processing estimate:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    });
  }
}
