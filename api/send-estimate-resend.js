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
      // Use Gmail address for admin notifications
      const adminEmails = [
        'sweepeasellc@gmail.com'
      ];
      
      for (const adminEmail of adminEmails) {
        try {
          console.log(`Attempting to send admin notification to: ${adminEmail}`);
          
          const { data, error } = await resend.emails.send({
            from: 'noreply@devtone.agency',
            to: adminEmail,
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

          if (error) {
            console.error(`❌ Failed to send to ${adminEmail}:`, error);
            if (error.message) {
              console.error('Error message:', error.message);
            }
          } else {
            adminEmailSent = true;
            console.log(`✅ ADMIN EMAIL SENT to ${adminEmail}`);
            console.log('Email ID:', data?.id);
            break; // Stop trying other emails if one succeeds
          }
        } catch (emailError) {
          console.error(`Error sending to ${adminEmail}:`, emailError);
        }
      }
      
      // If all admin emails failed, try a simple text email
      if (!adminEmailSent) {
        console.log('All HTML emails failed. Trying simple text format...');
        try {
          const { data, error } = await resend.emails.send({
            from: 'noreply@devtone.agency',
            to: 'sweepeasellc@gmail.com',
            subject: `Estimate: ${formData.name}`,
            text: `New estimate request:
            
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}
Company: ${formData.company || 'N/A'}
Project Type: ${formData.projectType}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Features: ${formData.features?.join(', ') || 'N/A'}
Description: ${formData.description || 'N/A'}

Submitted at: ${new Date().toISOString()}`
          });
          
          if (!error) {
            adminEmailSent = true;
            console.log('✅ Simple text email sent successfully');
          } else {
            console.error('❌ Simple text email also failed:', error);
          }
        } catch (err) {
          console.error('Text email error:', err);
        }
      }

      // Send client confirmation email (only to client)
      try {
        const { data: clientEmail, error: clientError } = await resend.emails.send({
        from: 'DevTone Agency <hello@devtone.agency>',
        to: [formData.email], // Send only to client
        subject: 'Your Project Estimate Request - DevTone Agency',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
    }
    .header { 
      background: rgb(88, 28, 135); 
      color: white; 
      padding: 30px; 
      text-align: left;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 400;
      letter-spacing: 0.5px;
    }
    .content { 
      padding: 30px;
      background: white;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
      color: #333;
      margin-bottom: 25px;
    }
    .timeline-box {
      border: 1px solid #e0e0e0;
      padding: 20px;
      margin: 20px 0;
      background: #fafafa;
    }
    .timeline-title {
      font-size: 16px;
      font-weight: 600;
      color: rgb(88, 28, 135);
      margin-bottom: 15px;
    }
    .timeline-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      font-size: 14px;
    }
    .timeline-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      flex-shrink: 0;
      filter: brightness(0) saturate(100%) invert(17%) sepia(89%) saturate(1352%) hue-rotate(257deg) brightness(92%) contrast(109%);
    }
    .timeline-text {
      flex: 1;
    }
    .timeline-text strong {
      display: block;
      color: #333;
      margin-bottom: 2px;
    }
    .summary-box {
      background: #f8f8f8;
      border-left: 3px solid rgb(88, 28, 135);
      padding: 15px 20px;
      margin: 20px 0;
      font-size: 14px;
    }
    .summary-row {
      display: flex;
      padding: 5px 0;
    }
    .summary-label {
      font-weight: 600;
      color: #666;
      min-width: 100px;
    }
    .summary-value {
      color: #333;
    }
    .contact-info {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 14px;
      color: #666;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 14px;
      color: #333;
    }
    .signature-name {
      font-weight: 600;
      color: rgb(88, 28, 135);
      margin-bottom: 5px;
    }
    .footer {
      background: #f8f8f8;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #999;
      border-top: 1px solid #e0e0e0;
    }
    a {
      color: rgb(88, 28, 135);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Estimate Request Confirmation</h1>
    </div>
    <div class="content">
      <div class="greeting">
        Dear ${formData.name},
      </div>
      
      <div class="message">
        Thank you for your interest in DevTone Agency. We have successfully received your project estimate request and our team is reviewing the details.
      </div>
      
      <div class="timeline-box">
        <div class="timeline-title">What Happens Next</div>
        
        <div class="timeline-item">
          <img src="https://img.icons8.com/ios-glyphs/30/000000/task-planning.png" alt="Review" class="timeline-icon">
          <div class="timeline-text">
            <strong>1. Project Review</strong>
            Our team will analyze your requirements (2-4 hours)
          </div>
        </div>
        
        <div class="timeline-item">
          <img src="https://img.icons8.com/ios-glyphs/30/000000/document.png" alt="Proposal" class="timeline-icon">
          <div class="timeline-text">
            <strong>2. Custom Proposal</strong>
            You'll receive a detailed proposal (within 24 hours)
          </div>
        </div>
        
        <div class="timeline-item">
          <img src="https://img.icons8.com/ios-glyphs/30/000000/phone.png" alt="Consultation" class="timeline-icon">
          <div class="timeline-text">
            <strong>3. Consultation</strong>
            We'll schedule a call to discuss your project
          </div>
        </div>
      </div>
      
      <div class="summary-box">
        <strong style="color: rgb(88, 28, 135); margin-bottom: 10px; display: block;">Your Project Details</strong>
        <div class="summary-row">
          <div class="summary-label">Project Type:</div>
          <div class="summary-value">${formData.projectType}</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Budget:</div>
          <div class="summary-value">${formData.budget}</div>
        </div>
        <div class="summary-row">
          <div class="summary-label">Timeline:</div>
          <div class="summary-value">${formData.timeline}</div>
        </div>
        ${formData.features && formData.features.length > 0 ? `
        <div class="summary-row">
          <div class="summary-label">Features:</div>
          <div class="summary-value">${formData.features.join(', ')}</div>
        </div>
        ` : ''}
      </div>
      
      <div class="contact-info">
        If you have any immediate questions, please don't hesitate to reach out:
        <br><br>
        <strong>Email:</strong> <a href="mailto:hello@devtone.agency">hello@devtone.agency</a><br>
        <strong>Phone:</strong> <a href="tel:+19177413468">+1 (917) 741-3468</a><br>
        <strong>WhatsApp:</strong> <a href="https://wa.me/19177413468">+1 (917) 741-3468</a>
      </div>
      
      <div class="signature">
        <div class="signature-name">Matheus Brito</div>
        <div>Founder & Lead Developer</div>
        <div>DevTone Agency</div>
        <div style="margin-top: 10px;">
          <a href="https://devtone.agency">devtone.agency</a> | 
          <a href="https://linkedin.com/company/devtone">LinkedIn</a>
        </div>
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} DevTone Agency. All rights reserved.<br>
      This email was sent to ${formData.email} regarding your estimate request.
    </div>
  </div>
</body>
</html>
        `,
        text: `
Dear ${formData.name},

Thank you for your interest in DevTone Agency. We have successfully received your project estimate request and our team is reviewing the details.

WHAT HAPPENS NEXT

1. Project Review
   Our team will analyze your requirements (2-4 hours)

2. Custom Proposal
   You'll receive a detailed proposal (within 24 hours)

3. Consultation
   We'll schedule a call to discuss your project

YOUR PROJECT DETAILS
- Project Type: ${formData.projectType}
- Budget: ${formData.budget}
- Timeline: ${formData.timeline}
${formData.features && formData.features.length > 0 ? `- Features: ${formData.features.join(', ')}` : ''}

If you have any immediate questions, please don't hesitate to reach out:

Email: hello@devtone.agency
Phone: +1 (917) 741-3468
WhatsApp: +1 (917) 741-3468

Best regards,

Matheus Brito
Founder & Lead Developer
DevTone Agency
devtone.agency

© ${new Date().getFullYear()} DevTone Agency. All rights reserved.
This email was sent to ${formData.email} regarding your estimate request.
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

    // CRITICAL: Send to multiple backup systems
    const backupNotifications = [];
    
    // 1. ActivePieces webhook
    backupNotifications.push(
      fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
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
          admin_notification_failed: !adminEmailSent,
          notify_admin: !adminEmailSent ? 'URGENT: Email to team@devtone.agency failed! Check logs.' : '',
          email_status: {
            admin_sent: adminEmailSent,
            client_sent: clientEmailSent
          }
        }),
      }).then(() => console.log('✅ ActivePieces notified'))
        .catch(err => console.error('❌ ActivePieces failed:', err))
    );
    
    // 2. Try webhook.site as emergency backup
    if (!adminEmailSent) {
      console.log('⚠️  EMERGENCY: Trying webhook.site backup...');
      backupNotifications.push(
        fetch('https://webhook.site/your-unique-url-here', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            alert: 'ADMIN EMAIL FAILED',
            estimate_request: formData,
            timestamp: new Date().toISOString()
          }),
        }).catch(err => console.error('Webhook.site error:', err))
      );
    }
    
    // Wait for all backup notifications
    await Promise.allSettled(backupNotifications);
    
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