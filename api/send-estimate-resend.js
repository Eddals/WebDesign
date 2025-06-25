import { Resend } from 'resend';

// Initialize Resend - Make sure to add RESEND_API_KEY to Vercel environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export default async function handler(req, res) {
  // Enable CORS
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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    console.log('Received estimate request:', formData);
    console.log('Resend API configured:', !!resend);
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

    // Send admin notification email
    if (resend) {
      try {
        // ALWAYS send to team@devtone.agency
        const adminEmailAddress = 'team@devtone.agency';
        console.log('Sending admin notification to:', adminEmailAddress);
        
        const { data: adminEmail, error: adminError } = await resend.emails.send({
        from: 'DevTone Estimates <noreply@devtone.agency>',
        to: [adminEmailAddress],
        subject: `New Estimate Request: ${formData.name} - ${formData.projectType}`,
        reply_to: formData.email,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #6366f1; }
    .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
    .features { display: inline-block; margin: 5px; padding: 5px 10px; background: #e0e7ff; color: #6366f1; border-radius: 15px; font-size: 14px; }
    .button { display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
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
      
      ${formData.country ? `
      <div class="field">
        <div class="label">Country:</div>
        <div class="value">${formData.country}</div>
      </div>
      ` : ''}
      
      ${formData.industry ? `
      <div class="field">
        <div class="label">Industry:</div>
        <div class="value">${formData.industry}</div>
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
      
      <div style="text-align: center;">
        <a href="mailto:${formData.email}" class="button">Reply to Client</a>
      </div>
      
      <p style="text-align: center; color: #999; margin-top: 30px; font-size: 12px;">
        Submitted on ${new Date().toLocaleString()}
      </p>
    </div>
  </div>
</body>
</html>
        `,
        text: `
New Estimate Request from DevTone Website

CLIENT INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Country: ${formData.country || 'Not provided'}
Industry: ${formData.industry || 'Not provided'}

PROJECT DETAILS:
Project Type: ${formData.projectType}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Features: ${Array.isArray(formData.features) ? formData.features.join(', ') : 'None'}

DESCRIPTION:
${formData.description || 'No description provided'}

Submitted on: ${new Date().toLocaleString()}
        `
      });

      if (adminError) {
        console.error('Admin email error:', adminError);
        console.error('Failed to send to team@devtone.agency');
        // Log the full error for debugging
        console.error('Full error details:', JSON.stringify(adminError, null, 2));
      } else {
        console.log('Admin email sent successfully to team@devtone.agency');
        console.log('Email ID:', adminEmail?.id);
      }
      } catch (emailError) {
        console.error('Critical error sending admin email:', emailError);
        console.error('Failed to notify team@devtone.agency about new estimate request');
      }

      // Send client confirmation email (only to client)
      try {
        const { data: clientEmail, error: clientError } = await resend.emails.send({
        from: 'DevTone Agency <noreply@devtone.agency>',
        to: [formData.email], // Send only to client
        subject: 'We received your estimate request - DevTone',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .timeline { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .step { display: flex; align-items: start; margin-bottom: 15px; }
    .step-number { background: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
    .button { display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
    .button-whatsapp { background: #25D366; }
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
        ${formData.features && formData.features.length > 0 ? `<li><strong>Features:</strong> ${formData.features.join(', ')}</li>` : ''}
      </ul>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666;">Need to reach us sooner?</p>
        <a href="https://wa.me/19177413468" class="button button-whatsapp">WhatsApp Us</a>
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
        `,
        text: `
Thank You, ${formData.name}!

We've received your estimate request for your ${formData.projectType} project.

What Happens Next?

1. Project Review (2-4 hours)
   Our team will carefully review your requirements and project details.

2. Custom Proposal (Within 24 hours)
   You'll receive a detailed proposal with pricing breakdown and timeline.

3. Consultation Call (Within 48 hours)
   We'll schedule a call to discuss your project in detail and answer any questions.

Your Project Summary:
- Project Type: ${formData.projectType}
- Budget Range: ${formData.budget}
- Timeline: ${formData.timeline}
${formData.features && formData.features.length > 0 ? `- Features: ${formData.features.join(', ')}` : ''}

Need to reach us sooner?
- WhatsApp: +1 917-741-3468
- Email: team@devtone.agency

Best regards,
The DevTone Team
devtone.agency
        `
      });

      if (clientError) {
        console.error('Client email error:', clientError);
      } else {
        console.log('Client email sent:', clientEmail);
      }
      } catch (emailError) {
        console.error('Error sending client email:', emailError);
      }
    } else {
      console.log('Resend API key not configured - emails will not be sent');
    }

    // Also send to ActivePieces as backup
    try {
      await fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone || '',
          empresa: formData.company || '',
          pais: formData.country || '',
          industria: formData.industry || '',
          tipo_projeto: formData.projectType,
          orcamento: formData.budget,
          prazo: formData.timeline,
          mensagem: formData.description || '',
          recursos: Array.isArray(formData.features) ? formData.features.join(', ') : formData.features || '',
          timestamp: new Date().toISOString(),
          fonte: 'devtone-website'
        }),
      });
    } catch (error) {
      console.error('ActivePieces error:', error);
    }

    return res.status(200).json({
      success: true,
      message: 'Your estimate request has been received. We will contact you within 24 hours.'
    });

  } catch (error) {
    console.error('Error processing estimate:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again later.'
    });
  }
}