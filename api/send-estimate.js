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

    // Send confirmation email to client using Resend
    try {
      const { Resend } = await import('resend');
      const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');
      const firstName = formData.name.split(' ')[0] || formData.name;
      const featuresList = Array.isArray(formData.features) && formData.features.length > 0
        ? `<li><b>Features:</b> ${formData.features.join(', ')}</li>`
        : '';
      const summaryHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Hi ${firstName},</p>
          <p>Thank you for requesting a quote with <b>Devtone</b> — we’re excited to learn more about your project and explore how we can bring it to life.</p>
          <p>Here’s a quick summary of what you submitted:</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <div style="background: #f9f9f9; padding: 16px; border-radius: 6px;">
            <b>📌 Project Summary:</b><br>
            <ul style="list-style: disc; padding-left: 20px;">
              <li><b>Project Type:</b> ${formData.projectType}</li>
              <li><b>Goal:</b> ${formData.description || 'Not specified'}</li>
              <li><b>Timeline:</b> ${formData.timeline}</li>
              <li><b>Estimated Budget:</b> ${formData.budget}</li>
              ${featuresList}
            </ul>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p>Our team is reviewing your request and will reach out shortly with a personalized proposal. We usually respond within 2 business hours.</p>
          <p>In the meantime, feel free to explore our website to learn more about our services and past projects: <a href="https://devtone.agency">devtone.agency</a></p>
          <p>If you’d like to share more details or make changes, just reply to this email.</p>
          <p>Looking forward to connecting with you.</p>
          <p>Warm regards,<br><b>Matheus Silva</b><br>Founder & Owner – Devtone Agency</p>
        </div>
      `;
      await resend.emails.send({
        from: 'Devtone Agency <matheus.silva@devtone.agency>',
        to: formData.email,
        subject: 'We’ve received your quote request',
        html: summaryHtml,
        reply_to: 'matheus.silva@devtone.agency'
      });
      emailSuccess = true;
    } catch (emailError) {
      console.error('Estimate confirmation email error:', emailError);
    }

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