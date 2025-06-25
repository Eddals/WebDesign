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
    console.log('=== ESTIMATE REQUEST RECEIVED ===');
    console.log('Client:', formData.name, formData.email);
    console.log('Project:', formData.projectType);
    console.log('Resend API configured:', !!resend);
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    
    // Track email sending status
    let adminEmailSent = false;
    let clientEmailSent = false;

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
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #1a1a1a;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, rgb(109 40 217 / .9) 0%, rgb(109 40 217) 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 40px 30px;
    }
    .info-section {
      border-left: 3px solid rgb(109 40 217);
      padding-left: 20px;
      margin-bottom: 30px;
    }
    .info-section h2 {
      color: rgb(109 40 217);
      font-size: 18px;
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .field { 
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
    }
    .label { 
      font-weight: 600; 
      color: #666;
      min-width: 120px;
      font-size: 14px;
    }
    .value { 
      color: #1a1a1a;
      flex: 1;
    }
    .features { 
      display: inline-block; 
      margin: 2px; 
      padding: 4px 12px; 
      background: rgb(109 40 217 / .1); 
      color: rgb(109 40 217); 
      border-radius: 4px; 
      font-size: 13px; 
    }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background: rgb(109 40 217); 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
      font-weight: 500;
      margin-top: 20px;
    }
    .footer {
      background: #f8f8f8;
      padding: 20px 30px;
      text-align: center;
      font-size: 13px;
      color: #666;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Estimate Request</h1>
      <p>Project inquiry received</p>
    </div>
    <div class="content">
      <!-- Client Information Section -->
      <div class="info-section">
        <h2>
          <img src="https://img.icons8.com/fluency/24/user-male-circle.png" alt="Client" width="20" height="20">
          Client Information
        </h2>
        <div class="field">
          <div class="label">Name:</div>
          <div class="value">${formData.name}</div>
        </div>
        <div class="field">
          <div class="label">Email:</div>
          <div class="value"><a href="mailto:${formData.email}" style="color: rgb(109 40 217);">${formData.email}</a></div>
        </div>
        ${formData.phone ? `
        <div class="field">
          <div class="label">Phone:</div>
          <div class="value">${formData.phone}</div>
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
          <div class="label">Location:</div>
          <div class="value">${formData.country}</div>
        </div>
        ` : ''}
        ${formData.industry ? `
        <div class="field">
          <div class="label">Industry:</div>
          <div class="value">${formData.industry}</div>
        </div>
        ` : ''}
      </div>

      <!-- Project Details Section -->
      <div class="info-section">
        <h2>
          <img src="https://img.icons8.com/fluency/24/project.png" alt="Project" width="20" height="20">
          Project Details
        </h2>
        <div class="field">
          <div class="label">Type:</div>
          <div class="value">${formData.projectType}</div>
        </div>
        <div class="field">
          <div class="label">Budget:</div>
          <div class="value" style="font-weight: 600; color: rgb(109 40 217);">${formData.budget}</div>
        </div>
        <div class="field">
          <div class="label">Timeline:</div>
          <div class="value">${formData.timeline}</div>
        </div>
        ${formData.features && formData.features.length > 0 ? `
        <div class="field">
          <div class="label">Features:</div>
          <div class="value">
            ${formData.features.map(f => `<span class="features">${f}</span>`).join(' ')}
          </div>
        </div>
        ` : ''}
        ${formData.description ? `
        <div class="field">
          <div class="label">Description:</div>
          <div class="value">${formData.description}</div>
        </div>
        ` : ''}
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${formData.email}" class="button">Reply to Client</a>
      </div>
    </div>
    <div class="footer">
      <p>Submitted on ${new Date().toLocaleString()}</p>
      <p>DevTone Agency - Professional Web Solutions</p>
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
        console.error('❌ ADMIN EMAIL FAILED:', adminError);
        console.error('Failed to send to team@devtone.agency');
        console.error('Full error details:', JSON.stringify(adminError, null, 2));
        
        // Try to understand the error
        if (adminError.message) {
          console.error('Error message:', adminError.message);
        }
        if (adminError.name === 'validation_error') {
          console.error('Validation error - check email format and domain verification');
        }
      } else {
        adminEmailSent = true;
        console.log('✅ ADMIN EMAIL SENT to team@devtone.agency');
        console.log('Email ID:', adminEmail?.id);
      }
      } catch (emailError) {
        console.error('Critical error sending admin email:', emailError);
        console.error('Failed to notify team@devtone.agency about new estimate request');
        
        // Try a simpler email format as fallback
        try {
          console.log('Attempting fallback email to team@devtone.agency...');
          const { data: fallbackEmail, error: fallbackError } = await resend.emails.send({
            from: 'noreply@devtone.agency',
            to: 'team@devtone.agency',
            subject: `Estimate Request: ${formData.name}`,
            text: `New estimate request from ${formData.name} (${formData.email})\nProject: ${formData.projectType}\nBudget: ${formData.budget}`,
          });
          
          if (fallbackError) {
            console.error('❌ FALLBACK EMAIL ALSO FAILED:', fallbackError);
          } else {
            adminEmailSent = true;
            console.log('✅ FALLBACK EMAIL SENT to team@devtone.agency');
          }
        } catch (fallbackErr) {
          console.error('Fallback email error:', fallbackErr);
        }
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
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #1a1a1a;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, rgb(109 40 217 / .9) 0%, rgb(109 40 217) 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 40px 30px;
    }
    .timeline { 
      background: #f9f9f9; 
      padding: 25px; 
      border-radius: 8px; 
      margin: 25px 0;
      border: 1px solid #eee;
    }
    .timeline h2 {
      color: rgb(109 40 217);
      font-size: 18px;
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .step { 
      display: flex; 
      align-items: flex-start; 
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .step:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .step-icon { 
      width: 40px;
      height: 40px;
      margin-right: 15px; 
      flex-shrink: 0;
    }
    .step-content strong {
      color: rgb(109 40 217);
      display: block;
      margin-bottom: 4px;
    }
    .summary {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #eee;
    }
    .summary-item {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .summary-item:last-child {
      border-bottom: none;
    }
    .summary-label {
      font-weight: 600;
      color: #666;
      min-width: 100px;
    }
    .summary-value {
      color: #1a1a1a;
    }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background: rgb(109 40 217); 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
      font-weight: 500;
      margin: 8px;
    }
    .button-secondary { 
      background: #f0f0f0; 
      color: #333;
    }
    .footer {
      background: #f8f8f8;
      padding: 20px 30px;
      text-align: center;
      font-size: 13px;
      color: #666;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You, ${formData.name}!</h1>
      <p>Your estimate request has been received</p>
    </div>
    <div class="content">
      <p>Thank you for choosing DevTone Agency. We appreciate your interest in our services and look forward to bringing your vision to life.</p>
      
      <div class="timeline">
        <h2>
          <img src="https://img.icons8.com/fluency/24/time-machine.png" alt="Timeline" width="20" height="20">
          Next Steps
        </h2>
        
        <div class="step">
          <img src="https://img.icons8.com/fluency/48/task-planning.png" alt="Review" class="step-icon">
          <div class="step-content">
            <strong>Project Review</strong>
            Our team will analyze your requirements within 2-4 hours
          </div>
        </div>
        
        <div class="step">
          <img src="https://img.icons8.com/fluency/48/document.png" alt="Proposal" class="step-icon">
          <div class="step-content">
            <strong>Custom Proposal</strong>
            You'll receive a detailed proposal within 24 hours
          </div>
        </div>
        
        <div class="step">
          <img src="https://img.icons8.com/fluency/48/phone.png" alt="Call" class="step-icon">
          <div class="step-content">
            <strong>Consultation</strong>
            We'll schedule a call to discuss your project in detail
          </div>
        </div>
      </div>
      
      <div class="summary">
        <h3 style="color: rgb(109 40 217); margin: 0 0 15px 0; font-size: 16px;">Project Summary</h3>
        <div class="summary-item">
          <div class="summary-label">Project Type:</div>
          <div class="summary-value">${formData.projectType}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Budget:</div>
          <div class="summary-value">${formData.budget}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Timeline:</div>
          <div class="summary-value">${formData.timeline}</div>
        </div>
        ${formData.features && formData.features.length > 0 ? `
        <div class="summary-item">
          <div class="summary-label">Features:</div>
          <div class="summary-value">${formData.features.join(', ')}</div>
        </div>
        ` : ''}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; margin-bottom: 15px;">Questions? Contact us directly:</p>
        <a href="mailto:team@devtone.agency" class="button">Email Us</a>
        <a href="https://wa.me/19177413468" class="button button-secondary">
          <img src="https://img.icons8.com/color/16/whatsapp.png" alt="WhatsApp" style="vertical-align: middle; margin-right: 5px;">
          WhatsApp
        </a>
      </div>
    </div>
    <div class="footer">
      <p>Best regards,<br><strong>The DevTone Team</strong></p>
      <p><a href="https://devtone.agency" style="color: rgb(109 40 217); text-decoration: none;">devtone.agency</a></p>
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
        console.error('❌ CLIENT EMAIL FAILED:', clientError);
      } else {
        clientEmailSent = true;
        console.log('✅ CLIENT EMAIL SENT to', formData.email);
      }
      } catch (emailError) {
        console.error('Error sending client email:', emailError);
      }
    } else {
      console.error('❌ RESEND NOT CONFIGURED - No API key found!');
      console.error('Please add RESEND_API_KEY to Vercel environment variables');
    }
    
    // Log final email status
    console.log('=== EMAIL STATUS SUMMARY ===');
    console.log('Admin email sent:', adminEmailSent ? '✅ YES' : '❌ NO');
    console.log('Client email sent:', clientEmailSent ? '✅ YES' : '❌ NO');
    
    // CRITICAL: If admin email failed, include admin details in ActivePieces
    const includeAdminNotification = !adminEmailSent;

    // Also send to ActivePieces as backup
    try {
      console.log('Sending to ActivePieces webhook...');
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
          fonte: 'devtone-website',
          // Add notification flag if admin email failed
          admin_notification_failed: includeAdminNotification,
          notify_admin: includeAdminNotification ? 'URGENT: Admin email to team@devtone.agency failed!' : ''
        }),
      });
      console.log('✅ ActivePieces webhook called successfully');
    } catch (error) {
      console.error('❌ ActivePieces error:', error);
    }
    
    // Final response with status info
    const response = {
      success: true,
      message: 'Your estimate request has been received. We will contact you within 24 hours.',
      // Include debug info in development
      ...(process.env.NODE_ENV !== 'production' && {
        debug: {
          adminEmailSent,
          clientEmailSent,
          resendConfigured: !!resend
        }
      })
    };

    console.log('=== REQUEST COMPLETED ===');
    return res.status(200).json(response);

  } catch (error) {
    console.error('Error processing estimate:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again later.'
    });
  }
}