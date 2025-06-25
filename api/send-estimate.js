// Vercel Serverless Function for Estimate Submission
// This handles the /api/send-estimate endpoint

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
    console.log('Received estimate request:', req.body);

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

    let webhookSuccess = false;
    let emailSuccess = false;

    // Send to ActivePieces webhook
    try {
      const webhookPayload = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        empresa: formData.company,
        pais: formData.country,
        industria: formData.industry,
        tipo_projeto: formData.projectType,
        orcamento: formData.budget,
        prazo: formData.timeline,
        mensagem: formData.description,
        recursos: Array.isArray(formData.features) ? formData.features.join(', ') : formData.features,
        timestamp: new Date().toISOString(),
        fonte: 'devtone-vercel-api',
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        navegador: req.headers['user-agent']
      };

      const webhookResponse = await fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (webhookResponse.ok) {
        console.log('Successfully sent to ActivePieces webhook');
        webhookSuccess = true;
      } else {
        console.warn('ActivePieces webhook returned:', webhookResponse.status);
      }
    } catch (webhookError) {
      console.error('ActivePieces webhook error:', webhookError);
    }

    // Send email notifications using a service like SendGrid, Resend, or SMTP
    // For now, we'll rely on the ActivePieces webhook to handle notifications
    
    // If you have email service configured, uncomment and adapt this:
    /*
    try {
      // Send admin notification
      if (process.env.SENDGRID_API_KEY) {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const adminMsg = {
          to: process.env.ADMIN_EMAIL || 'team@devtone.agency',
          from: 'noreply@devtone.agency',
          subject: `New Estimate Request from ${formData.name}`,
          html: `
            <h2>New Estimate Request</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Company:</strong> ${formData.company}</p>
            <p><strong>Project Type:</strong> ${formData.projectType}</p>
            <p><strong>Budget:</strong> ${formData.budget}</p>
            <p><strong>Timeline:</strong> ${formData.timeline}</p>
            <p><strong>Description:</strong> ${formData.description}</p>
            <p><strong>Features:</strong> ${Array.isArray(formData.features) ? formData.features.join(', ') : formData.features}</p>
          `
        };
        
        await sgMail.send(adminMsg);
        emailSuccess = true;
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
    }
    */

    // Return success if webhook was sent
    if (webhookSuccess) {
      return res.status(200).json({
        success: true,
        message: 'Your estimate request has been received. We will contact you soon.',
        emailsSent: {
          webhook: true,
          email: emailSuccess
        }
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