// Vercel Serverless Function with Email Support
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

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
        fonte: 'devtone-vercel-api'
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
      }
    } catch (webhookError) {
      console.error('ActivePieces webhook error:', webhookError);
    }

    // Send email notifications if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        // Admin notification email
        const adminEmail = await resend.emails.send({
          from: 'DevTone Estimates <noreply@devtone.agency>',
          to: process.env.ADMIN_EMAIL || 'team@devtone.agency',
          subject: `New Estimate Request from ${formData.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #6366f1; }
                .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
                .features { display: inline-block; margin: 5px; padding: 5px 10px; background: #e0e7ff; color: #6366f1; border-radius: 15px; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Estimate Request</h1>
                  <p>You have received a new project estimate request</p>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">Client Name:</div>
                    <div class="value">${formData.name}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Email:</div>
                    <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
                  </div>
                  
                  ${formData.phone ? `
                  <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value"><a href="tel:${formData.phone}">${formData.phone}</a></div>
                  </div>
                  ` : ''}
                  
                  ${formData.company ? `
                  <div class="field">
                    <div class="label">Company:</div>
                    <div class="value">${formData.company}</div>
                  </div>
                  ` : ''}
                  
                  <div class="field">
                    <div class="label">Project Type:</div>
                    <div class="value">${formData.projectType}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Budget:</div>
                    <div class="value" style="font-weight: bold; color: #6366f1;">${formData.budget}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">Timeline:</div>
                    <div class="value">${formData.timeline}</div>
                  </div>
                  
                  ${formData.features && formData.features.length > 0 ? `
                  <div class="field">
                    <div class="label">Requested Features:</div>
                    <div class="value">
                      ${formData.features.map(f => `<span class="features">${f}</span>`).join(' ')}
                    </div>
                  </div>
                  ` : ''}
                  
                  ${formData.description ? `
                  <div class="field">
                    <div class="label">Project Description:</div>
                    <div class="value">${formData.description}</div>
                  </div>
                  ` : ''}
                  
                  <div style="margin-top: 30px; text-align: center;">
                    <a href="mailto:${formData.email}" style="display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px;">Reply to Client</a>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `
        });

        // Client confirmation email (send to both client and admin)
        const adminEmailAddress = process.env.ADMIN_EMAIL || 'team@devtone.agency';
        const clientEmail = await resend.emails.send({
          from: 'DevTone Agency <noreply@devtone.agency>',
          to: [formData.email, adminEmailAddress], // Send to both client and admin
          subject: 'We received your estimate request - DevTone',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .timeline { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .step { display: flex; align-items: start; margin-bottom: 15px; }
                .step-number { background: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
                .button { display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You, ${formData.name}!</h1>
                  <p>We've received your estimate request</p>
                </div>
                <div class="content">
                  <p>Thank you for choosing DevTone Agency for your ${formData.projectType} project. We're excited about the opportunity to work with you!</p>
                  
                  <div class="timeline">
                    <h2 style="color: #6366f1; margin-bottom: 20px;">What Happens Next?</h2>
                    
                    <div class="step">
                      <div class="step-number">1</div>
                      <div>
                        <strong>Project Review (2-4 hours)</strong><br>
                        Our team will carefully review your requirements and project details.
                      </div>
                    </div>
                    
                    <div class="step">
                      <div class="step-number">2</div>
                      <div>
                        <strong>Custom Proposal (Within 24 hours)</strong><br>
                        You'll receive a detailed proposal with pricing breakdown and timeline.
                      </div>
                    </div>
                    
                    <div class="step">
                      <div class="step-number">3</div>
                      <div>
                        <strong>Consultation Call (Within 48 hours)</strong><br>
                        We'll schedule a call to discuss your project in detail and answer any questions.
                      </div>
                    </div>
                  </div>
                  
                  <h3 style="color: #6366f1;">Your Project Summary:</h3>
                  <ul style="background: white; padding: 20px; border-radius: 10px;">
                    <li><strong>Project Type:</strong> ${formData.projectType}</li>
                    <li><strong>Budget Range:</strong> ${formData.budget}</li>
                    <li><strong>Timeline:</strong> ${formData.timeline}</li>
                  </ul>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666;">Need to reach us sooner?</p>
                    <a href="https://wa.me/19177413468" class="button" style="background: #25D366;">WhatsApp Us</a>
                    <a href="mailto:team@devtone.agency" class="button">Email Us</a>
                  </div>
                  
                  <p style="text-align: center; color: #999; margin-top: 30px; font-size: 14px;">
                    Best regards,<br>
                    <strong>The DevTone Team</strong><br>
                    <a href="https://devtone.agency" style="color: #6366f1;">devtone.agency</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        });

        console.log('Emails sent successfully');
        emailSuccess = true;
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Your estimate request has been received. We will contact you soon.',
      emailsSent: {
        webhook: webhookSuccess,
        email: emailSuccess
      }
    });

  } catch (error) {
    console.error('Error processing estimate:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    });
  }
}