const nodemailer = require('nodemailer');
const { addSignatureToEmail } = require('./email-signature');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Using Gmail SMTP as default, but can be configured for any SMTP service
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email address
      pass: process.env.SMTP_PASS  // Your email password or app-specific password
    }
  });
};

// Email template for estimate form submissions
const createEstimateEmailTemplate = (formData) => {
  const features = formData.features && formData.features.length > 0 
    ? formData.features.join(', ') 
    : 'None selected';

  // Generate a priority indicator based on budget and timeline
  const getPriorityIndicator = () => {
    if (formData.budget === 'enterprise' || formData.timeline === 'asap') {
      return '🔥 HIGH PRIORITY';
    } else if (formData.budget === 'premium') {
      return '⭐ PRIORITY';
    }
    return '📋 STANDARD';
  };

  // Generate budget range in dollars
  const getBudgetRange = () => {
    const ranges = {
      'starter': '$500 - $2,000',
      'professional': '$2,000 - $5,000',
      'premium': '$5,000 - $15,000',
      'enterprise': '$15,000+'
    };
    return ranges[formData.budget] || formData.budget;
  };

  // Generate timeline description
  const getTimelineDescription = () => {
    const timelines = {
      'asap': '1-2 Weeks (Rush)',
      '1month': '1 Month',
      '2months': '2-3 Months',
      'flexible': 'Flexible Timeline'
    };
    return timelines[formData.timeline] || formData.timeline;
  };

  return {
    subject: `${getPriorityIndicator()} New ${formData.projectType} Project - ${formData.name} (${getBudgetRange()})`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <style>
          :root {
            color-scheme: light only;
            supported-color-schemes: light only;
          }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1f2937 !important;
            margin: 0;
            padding: 0;
            background-color: #ffffff !important;
            background: #ffffff !important;
          }
          
          .wrapper {
            background-color: #f9fafb;
            padding: 40px 20px;
          }
          
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .header { 
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white; 
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.3; }
          }
          
          .logo { 
            margin-bottom: 20px; 
            position: relative;
            z-index: 1;
          }
          
          .logo img { 
            max-width: 120px; 
            height: auto;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
          }
          
          h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .content { 
            padding: 40px 30px;
            background-color: #ffffff;
          }
          
          .alert-card {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
            padding: 24px;
            margin: 0 0 24px 0;
          }
          
          .alert-title {
            color: #16a34a;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .alert-content {
            color: #374151;
            font-size: 16px;
            line-height: 1.6;
          }
          
          .alert-content strong {
            color: #16a34a;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 24px 0;
          }
          
          .info-card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
          }
          
          .info-card.full-width {
            grid-column: 1 / -1;
          }
          
          .card-title {
            color: #8b5cf6;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .info-item:last-child {
            border-bottom: none;
          }
          
          .info-label {
            color: #6b7280;
            font-size: 14px;
          }
          
          .info-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: 500;
            text-align: right;
          }
          
          .info-value a {
            color: #8b5cf6;
            text-decoration: none;
          }
          
          .info-value a:hover {
            text-decoration: underline;
          }
          
          .description-section {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          
          .description-title {
            color: #7c3aed;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 16px 0;
          }
          
          .description-text {
            color: #4b5563;
            font-size: 15px;
            line-height: 1.8;
            white-space: pre-wrap;
          }
          
          .action-section {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            text-align: center;
          }
          
          .action-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 16px 0;
          }
          
          .action-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .action-button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s ease;
          }
          
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          }
          
          .action-button.secondary {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            color: #7c3aed;
          }
          
          .footer {
            text-align: center;
            padding: 30px;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer-text {
            color: #6b7280;
            font-size: 12px;
            line-height: 1.6;
          }
          
          .timestamp {
            color: #8b5cf6;
            font-weight: 500;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
          <tr>
            <td>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">
                <img src="https://i.imgur.com/qZ9tgbe.png" alt="DevTone Logo">
              </div>
              <h1>New Estimate Request</h1>
            </div>
            
            <div class="content">
              <div class="alert-card">
                <h2 class="alert-title">
                  <span>🎯</span> ${getPriorityIndicator()} - New Lead Alert
                </h2>
                <div class="alert-content">
                  <strong>${formData.name}</strong> from <strong>${formData.company || 'Individual'}</strong> 
                  ${formData.country ? `in <strong>${formData.country}</strong>` : ''} 
                  has requested an estimate for a <strong>${formData.projectType}</strong> project.
                  <br><br>
                  💰 Budget: <strong>${getBudgetRange()}</strong> | ⏱️ Timeline: <strong>${getTimelineDescription()}</strong>
                  ${formData.industry ? `<br>🏢 Industry: <strong>${formData.industry}</strong>` : ''}
                </div>
              </div>

              <div class="info-grid">
                <div class="info-card">
                  <h3 class="card-title">
                    <span>👤</span> Contact Information
                  </h3>
                  <div class="info-item">
                    <span class="info-label">Name</span>
                    <span class="info-value">${formData.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value"><a href="mailto:${formData.email}">${formData.email}</a></span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${formData.phone || 'Not provided'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Company</span>
                    <span class="info-value">${formData.company || 'Not provided'}</span>
                  </div>
                </div>

                <div class="info-card">
                  <h3 class="card-title">
                    <span>💼</span> Project Details
                  </h3>
                  <div class="info-item">
                    <span class="info-label">Type</span>
                    <span class="info-value">${formData.projectType}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Budget</span>
                    <span class="info-value">${getBudgetRange()}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Timeline</span>
                    <span class="info-value">${getTimelineDescription()}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Features</span>
                    <span class="info-value">${features}</span>
                  </div>
                </div>

                ${formData.country || formData.industry || formData.location ? `
                <div class="info-card full-width">
                  <h3 class="card-title">
                    <span>🌍</span> Additional Information
                  </h3>
                  ${formData.country ? `
                  <div class="info-item">
                    <span class="info-label">Country</span>
                    <span class="info-value">${formData.country}</span>
                  </div>` : ''}
                  ${formData.location ? `
                  <div class="info-item">
                    <span class="info-label">Location</span>
                    <span class="info-value">${formData.location}</span>
                  </div>` : ''}
                  ${formData.industry ? `
                  <div class="info-item">
                    <span class="info-label">Industry</span>
                    <span class="info-value">${formData.industry}</span>
                  </div>` : ''}
                </div>
                ` : ''}
              </div>

              <div class="description-section">
                <h3 class="description-title">📝 Project Description</h3>
                <div class="description-text">${formData.description || 'No description provided'}</div>
              </div>

              <div class="action-section">
                <h3 class="action-title">Quick Actions</h3>
                <div class="action-buttons">
                  <a href="mailto:${formData.email}?subject=Re: Your ${formData.projectType} Project Estimate&body=Hi ${formData.name},%0D%0A%0D%0AThank you for your interest in DevTone! I've reviewed your project requirements and I'm excited to discuss how we can help bring your vision to life.%0D%0A%0D%0ABased on your requirements for a ${formData.projectType} with a budget of ${getBudgetRange()} and timeline of ${getTimelineDescription()}, I'd like to schedule a brief call to better understand your needs and provide you with a detailed proposal.%0D%0A%0D%0AWould you be available for a 15-minute call tomorrow? Please let me know what time works best for you.%0D%0A%0D%0ALooking forward to speaking with you!%0D%0A%0D%0ABest regards,%0D%0ADevTone Team" class="action-button">Reply with Template</a>
                  ${formData.phone ? `<a href="tel:${formData.phone}" class="action-button secondary">Call Client</a>` : ''}
                </div>
              </div>

              <div class="info-card full-width" style="margin-top: 24px; background: #fef3c7; border-color: #fbbf24;">
                <h3 class="card-title" style="color: #d97706;">
                  <span>💡</span> Response Tips
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                  <li>Respond within 2-4 hours for best conversion rates</li>
                  <li>Reference their specific project type and requirements</li>
                  <li>Suggest a brief discovery call to understand their needs better</li>
                  <li>Mention similar projects you've completed in their industry</li>
                  ${formData.timeline === 'asap' ? '<li><strong>⚡ This is a RUSH project - prioritize immediate response!</strong></li>' : ''}
                  ${formData.budget === 'enterprise' ? '<li><strong>💎 Enterprise budget - ensure senior team involvement</strong></li>' : ''}
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-text">
                This estimate request was submitted on <span class="timestamp">${new Date().toLocaleString()}</span>
                <br>Please respond to the client within 24 hours.
              </p>
            </div>
          </div>
        </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
${getPriorityIndicator()} - NEW ESTIMATE REQUEST

LEAD SUMMARY:
${formData.name} from ${formData.company || 'Individual'} ${formData.country ? `in ${formData.country}` : ''} has requested an estimate for a ${formData.projectType} project.

CONTACT INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Country: ${formData.country || 'Not provided'}
Industry: ${formData.industry || 'Not provided'}

PROJECT DETAILS:
Project Type: ${formData.projectType}
Budget Range: ${getBudgetRange()}
Timeline: ${getTimelineDescription()}
Additional Features: ${features}

PROJECT DESCRIPTION:
${formData.description || 'No description provided'}

QUICK ACTIONS:
- Reply to client: ${formData.email}
${formData.phone ? `- Call client: ${formData.phone}` : ''}

RESPONSE TIPS:
- Respond within 2-4 hours for best conversion rates
- Reference their specific project type and requirements
- Suggest a brief discovery call
${formData.timeline === 'asap' ? '⚡ RUSH PROJECT - Prioritize immediate response!' : ''}
${formData.budget === 'enterprise' ? '💎 ENTERPRISE BUDGET - Ensure senior team involvement' : ''}

Submitted on: ${new Date().toLocaleString()}
    `
  };
};

// Send estimate email
const sendEstimateEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    const emailTemplate = createEstimateEmailTemplate(formData);
    
    // Email options
    const mailOptions = {
      from: `"DevTone Estimates" <${process.env.SMTP_USER}>`,
      to: process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER, // Where to send estimate emails
      replyTo: formData.email, // Reply directly to the client
      ...emailTemplate
    };

    // Add signature to email and send
    const emailWithSignature = {
      ...mailOptions,
      ...addSignatureToEmail({ html: mailOptions.html, text: mailOptions.text })
    };
    
    const info = await transporter.sendMail(emailWithSignature);
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send confirmation email to client
const sendClientConfirmationEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    
    const features = formData.features && formData.features.length > 0 
      ? formData.features.join(', ') 
      : 'None selected';
    
    const mailOptions = {
      from: `"DevTone" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: '✨ We received your estimate request - DevTone',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light only">
          <style>
            :root {
              color-scheme: light only;
              supported-color-schemes: light only;
            }
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #1f2937 !important;
              margin: 0;
              padding: 0;
              background-color: #ffffff !important;
              background: #ffffff !important;
            }
            
            .wrapper {
              background-color: #f9fafb;
              padding: 40px 20px;
            }
            
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            
            .header { 
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              color: white; 
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: pulse 4s ease-in-out infinite;
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.5; }
              50% { transform: scale(1.1); opacity: 0.3; }
            }
            
            .logo { 
              margin-bottom: 20px; 
              position: relative;
              z-index: 1;
            }
            
            .logo img { 
              max-width: 120px; 
              height: auto;
              filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
            }
            
            h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              position: relative;
              z-index: 1;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .content { 
              padding: 40px 30px;
              background-color: #ffffff;
            }
            
            .greeting {
              font-size: 18px;
              color: #1f2937;
              margin-bottom: 20px;
            }
            
            .intro {
              color: #6b7280;
              margin-bottom: 30px;
            }
            
            .summary-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
            }
            
            .summary-title {
              color: #8b5cf6;
              font-size: 20px;
              font-weight: 600;
              margin: 0 0 20px 0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .field-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .field-row:last-child {
              border-bottom: none;
            }
            
            .field-label {
              color: #6b7280;
              font-size: 14px;
              font-weight: 500;
            }
            
            .field-value {
              color: #1f2937;
              font-size: 14px;
              font-weight: 600;
              text-align: right;
            }
            
            .description-box {
              background: #f3f4f6;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 20px;
              margin: 24px 0;
            }
            
            .description-title {
              color: #7c3aed;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 12px 0;
            }
            
            .description-text {
              color: #4b5563;
              font-size: 14px;
              line-height: 1.6;
            }
            
            .timeline-section {
              margin: 32px 0;
            }
            
            .timeline-title {
              color: #1f2937;
              font-size: 20px;
              font-weight: 600;
              margin: 0 0 24px 0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .timeline-item {
              position: relative;
              padding-left: 40px;
              margin-bottom: 24px;
            }
            
            .timeline-item::before {
              content: '';
              position: absolute;
              left: 0;
              top: 8px;
              width: 24px;
              height: 24px;
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .timeline-item::after {
              content: '';
              position: absolute;
              left: 11px;
              top: 32px;
              width: 2px;
              height: calc(100% + 8px);
              background: #e5e7eb;
            }
            
            .timeline-item:last-child::after {
              display: none;
            }
            
            .timeline-step {
              color: #8b5cf6;
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 4px;
            }
            
            .timeline-desc {
              color: #6b7280;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .timeline-list {
              margin: 8px 0 0 0;
              padding-left: 20px;
            }
            
            .timeline-list li {
              color: #4b5563;
              font-size: 13px;
              margin-bottom: 4px;
            }
            
            .contact-card {
              background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
              border: 1px solid rgba(139, 92, 246, 0.2);
              border-radius: 12px;
              padding: 20px;
              margin: 24px 0;
              text-align: center;
            }
            
            .contact-title {
              color: #1f2937;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 12px 0;
            }
            
            .contact-info {
              color: #4b5563;
              font-size: 14px;
              line-height: 1.8;
            }
            
            .contact-info a {
              color: #8b5cf6;
              text-decoration: none;
              font-weight: 500;
            }
            
            .contact-info a:hover {
              text-decoration: underline;
            }
            
            .resources {
              margin: 32px 0;
            }
            
            .resources-title {
              color: #1f2937;
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 16px 0;
            }
            
            .resource-links {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .resource-link {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              color: #8b5cf6;
              text-decoration: none;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s ease;
            }
            
            .resource-link:hover {
              color: #a78bfa;
              transform: translateX(4px);
            }
            
            .cta-section {
              text-align: center;
              margin: 40px 0;
            }
            
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
              transition: all 0.3s ease;
            }
            
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
            }
            
            .footer {
              text-align: center;
              padding: 30px;
              background-color: #f9fafb;
              border-top: 1px solid #e5e7eb;
            }
            
            .footer-text {
              color: #6b7280;
              font-size: 12px;
              line-height: 1.6;
            }
            
            .footer-text a {
              color: #8b5cf6;
              text-decoration: none;
            }
            
            .icon {
              width: 20px;
              height: 20px;
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
            <tr>
              <td>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div class="logo">
                  <img src="https://i.imgur.com/qZ9tgbe.png" alt="DevTone Logo">
                </div>
                <h1>Thank You for Your Estimate Request!</h1>
              </div>
              
              <div class="content">
                <div class="greeting">Hi ${formData.name},</div>
                
                <p class="intro">We've received your estimate request and our team is excited to learn more about your project. Here's a summary of what you submitted:</p>
                
                <div class="summary-card">
                  <h3 class="summary-title">
                    <span>📋</span> Your Project Details
                  </h3>
                  <div class="field-row">
                    <span class="field-label">Project Type</span>
                    <span class="field-value">${formData.projectType || formData.service_type || 'Not specified'}</span>
                  </div>
                  <div class="field-row">
                    <span class="field-label">Budget Range</span>
                    <span class="field-value">${formData.budget || formData.estimated_budget || 'Not specified'}</span>
                  </div>
                  <div class="field-row">
                    <span class="field-label">Timeline</span>
                    <span class="field-value">${formData.timeline || formData.preferred_timeline || 'Not specified'}</span>
                  </div>
                  ${formData.company ? `
                  <div class="field-row">
                    <span class="field-label">Company</span>
                    <span class="field-value">${formData.company}</span>
                  </div>` : ''}
                  ${formData.location ? `
                  <div class="field-row">
                    <span class="field-label">Location</span>
                    <span class="field-value">${formData.location}</span>
                  </div>` : ''}
                </div>
                
                ${formData.description || formData.project_description ? `
                <div class="description-box">
                  <h4 class="description-title">Project Description</h4>
                  <p class="description-text">${(formData.description || formData.project_description || '').replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}
                
                <div class="timeline-section">
                  <h3 class="timeline-title">
                    <span>🚀</span> What Happens Next?
                  </h3>
                  
                  <div class="timeline-item">
                  <div class="timeline-step">1. Immediate Review (Next 2-4 hours)</div>
                  <div class="timeline-desc">Our expert team is analyzing your ${formData.projectType} requirements right now</div>
                  </div>
                  
                  <div class="timeline-item">
                  <div class="timeline-step">2. Custom Proposal (Within 24 hours)</div>
                  <div class="timeline-desc">
                  You'll receive a personalized proposal including:
                  <ul class="timeline-list">
                  <li>Detailed project roadmap tailored to your needs</li>
                  <li>Clear milestone schedule with deliverables</li>
                  <li>Transparent investment breakdown</li>
                  <li>Technology stack recommendations</li>
                  <li>Success metrics and KPIs</li>
                  </ul>
                  </div>
                  </div>
                  
                  <div class="timeline-item">
                  <div class="timeline-step">3. Strategy Session (Within 48 hours)</div>
                  <div class="timeline-desc">We'll schedule a 30-minute strategy call to dive deep into your vision and ensure perfect alignment</div>
                  </div>
                  
                  <div class="timeline-item">
                  <div class="timeline-step">4. Fast-Track Development</div>
                  <div class="timeline-desc">Upon approval, your dedicated team begins immediately${formData.timeline === 'asap' ? ' with rush priority' : ''}</div>
                  </div>
                </div>
                
                <div class="contact-card">
                  <h4 class="contact-title">Need Immediate Assistance?</h4>
                  <div class="contact-info">
                    📞 Call us at: <a href="tel:+19177413468">+1 917-741-3468</a><br>
                    ✉️ Email: <a href="mailto:team@devtone.agency">team@devtone.agency</a>
                  </div>
                </div>
                
                <div class="resources">
                  <h4 class="resources-title">Helpful Resources</h4>
                  <div class="resource-links">
                    <a href="https://devtone.agency/services" class="resource-link">
                      <span>→</span> Explore our services in detail
                    </a>
                    <a href="https://devtone.agency/about" class="resource-link">
                      <span>→</span> Learn more about our team
                    </a>
                    <a href="https://devtone.agency/faq" class="resource-link">
                      <span>→</span> Check our frequently asked questions
                    </a>
                  </div>
                </div>
                
                <div class="cta-section">
                  <a href="https://devtone.agency" class="cta-button">Visit Our Website</a>
                </div>
                
                ${formData.projectType === 'ecommerce' ? `
                <div class="info-card full-width" style="margin-top: 24px; background: #e0e7ff; border-color: #6366f1;">
                  <h3 class="card-title" style="color: #4f46e5;">
                    <span>🛍️</span> E-commerce Expertise
                  </h3>
                  <p style="color: #4338ca; margin: 0;">
                    Great choice! Our e-commerce solutions have helped businesses increase their online sales by an average of 150%. 
                    We'll ensure your store is optimized for conversions, mobile-friendly, and equipped with all the features modern shoppers expect.
                  </p>
                </div>
                ` : ''}

                ${formData.projectType === 'webapp' ? `
                <div class="info-card full-width" style="margin-top: 24px; background: #dcfce7; border-color: #22c55e;">
                  <h3 class="card-title" style="color: #16a34a;">
                    <span>💻</span> Web Application Excellence
                  </h3>
                  <p style="color: #15803d; margin: 0;">
                    Exciting! We specialize in building scalable, secure web applications using cutting-edge technologies. 
                    Your custom application will be built with performance, security, and user experience at its core.
                  </p>
                </div>
                ` : ''}

                ${formData.projectType === 'business' ? `
                <div class="info-card full-width" style="margin-top: 24px; background: #fef3c7; border-color: #fbbf24;">
                  <h3 class="card-title" style="color: #d97706;">
                    <span>🏢</span> Professional Business Solutions
                  </h3>
                  <p style="color: #92400e; margin: 0;">
                    Perfect! A professional website is crucial for business growth. We'll create a stunning, SEO-optimized site 
                    that establishes your credibility and converts visitors into customers.
                  </p>
                </div>
                ` : ''}

                <p style="color: #4b5563; text-align: center; margin-top: 32px;">
                  We're looking forward to bringing your ${formData.projectType} vision to life!
                </p>
                
                <p style="color: #6b7280; text-align: center; margin-top: 24px;">
                  Best regards,<br>
                  <strong style="color: #1f2937;">The DevTone Team</strong>
                </p>
              </div>
              
              <div class="footer">
                <p class="footer-text">
                  This is an automated confirmation email. For inquiries, please contact us at <a href="mailto:team@devtone.agency">team@devtone.agency</a><br>
                  © ${new Date().getFullYear()} DevTone. All rights reserved.
                </p>
              </div>
            </div>
          </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
Hi ${formData.name},

Thank you for your estimate request!

We've received your estimate request and our team is excited to learn more about your project. Here's a summary of what you submitted:

YOUR ESTIMATE REQUEST SUMMARY
Project Type: ${formData.projectType || formData.service_type || 'Not specified'}
Budget Range: ${formData.budget || formData.estimated_budget || 'Not specified'}
Timeline: ${formData.timeline || formData.preferred_timeline || 'Not specified'}
${formData.company ? `Company: ${formData.company}` : ''}
${formData.industry ? `Industry: ${formData.industry}` : ''}

${formData.description || formData.project_description ? `PROJECT DESCRIPTION:
${formData.description || formData.project_description}` : ''}

WHAT HAPPENS NEXT?

1. Review (Within 2-4 hours): Our team will carefully analyze your project requirements

2. Proposal (Within 24 hours): You'll receive a detailed proposal including:
   - Comprehensive project scope
   - Detailed timeline with milestones
   - Transparent pricing breakdown
   - Our recommended approach

3. Consultation Call: We'll schedule a call to discuss your project in detail and answer any questions

4. Project Kickoff: Once approved, we'll begin working on your project immediately

Need immediate assistance?
Call us at: +1 917-741-3468
Email: team@devtone.agency

In the meantime, here are some resources you might find helpful:
- Explore our services: https://devtone.agency/services
- Learn more about our team: https://devtone.agency/about
- Check our FAQ: https://devtone.agency/faq

We're looking forward to working with you on this exciting project!

Best regards,
The DevTone Team

This is an automated confirmation email. For inquiries, please contact us at team@devtone.agency
© ${new Date().getFullYear()} DevTone. All rights reserved.
      `
    };

    // Add signature to email and send
    const emailWithSignature = {
      ...mailOptions,
      ...addSignatureToEmail({ html: mailOptions.html, text: mailOptions.text })
    };
    
    await transporter.sendMail(emailWithSignature);
    console.log('Client confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending client confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Email template for contact form submissions
const createContactEmailTemplate = (formData) => {
  return {
    subject: `New Contact Form Message: ${formData.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #6B46C1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #6B46C1; margin-bottom: 10px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
          .message-box { background-color: white; padding: 20px; border-radius: 5px; border: 1px solid #ddd; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://i.imgur.com/qZ9tgbe.png" alt="DevTone Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
            </div>
            <h1>New Contact Form Message</h1>
          </div>
          <div class="content">
            <div class="section">
              <h3>Contact Information</h3>
              <div class="field">
                <span class="label">Name:</span> <span class="value">${formData.name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span> <span class="value"><a href="mailto:${formData.email}">${formData.email}</a></span>
              </div>
              <div class="field">
                <span class="label">Phone:</span> <span class="value">${formData.phone}</span>
              </div>
              <div class="field">
                <span class="label">Subject:</span> <span class="value">${formData.subject}</span>
              </div>
            </div>

            <div class="section">
              <h3>Message</h3>
              <div class="message-box">
                ${formData.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="footer">
              <p>This message was submitted on ${new Date().toLocaleString()}</p>
              <p>Please respond to the sender within 24 hours.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Contact Form Message

CONTACT INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}

MESSAGE:
${formData.message}

Submitted on: ${new Date().toLocaleString()}
    `
  };
};

// Send contact form email to admin
const sendContactEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    const emailTemplate = createContactEmailTemplate(formData);
    
    // Email options
    const mailOptions = {
      from: `"DevTone Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT_EMAIL || process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER,
      replyTo: formData.email, // Reply directly to the sender
      ...emailTemplate
    };

    // Add signature to email and send
    const emailWithSignature = {
      ...mailOptions,
      ...addSignatureToEmail({ html: mailOptions.html, text: mailOptions.text })
    };
    
    const info = await transporter.sendMail(emailWithSignature);
    
    console.log('Contact email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return { success: false, error: error.message };
  }
};

// Send confirmation email to contact form sender
const sendContactConfirmationEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"DevTone" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: 'We received your message - DevTone',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6B46C1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #6B46C1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
            .summary { background-color: #e9d5ff; padding: 20px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
            <div class="logo">
            <img src="https://i.imgur.com/qZ9tgbe.png" alt="DevTone Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
            </div>
            <h1>Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
              <p>Hi ${formData.name},</p>
              
              <p>We've received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you as soon as possible.</p>
              
              <div class="summary">
                <h3>Your Message Summary:</h3>
                <p><strong>Subject:</strong> ${formData.subject}</p>
                <p><strong>Message:</strong><br>${formData.message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <h3>What happens next?</h3>
              <ul>
                <li>Our team will review your message carefully</li>
                <li>We typically respond within 24 business hours</li>
                <li>You'll receive a personalized response to your inquiry</li>
                <li>If urgent, feel free to call us at +1 917-741-3468</li>
              </ul>
              
              <p>In the meantime, you might find these resources helpful:</p>
              <ul>
                <li><a href="https://devtone.agency/services">Browse our services</a></li>
                <li><a href="https://devtone.agency/about">Learn more about us</a></li>
                <li><a href="https://devtone.agency/faq">Check our FAQ</a></li>
              </ul>
              
              <div style="text-align: center;">
                <a href="https://devtone.agency" class="button">Visit Our Website</a>
              </div>
              
              <p>Best regards,<br>The DevTone Team</p>
              
              <div class="footer">
                <p>This is an automated confirmation email. Please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} DevTone. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${formData.name},

Thank you for contacting us!

We've received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you as soon as possible.

Your Message Summary:
Subject: ${formData.subject}
Message: ${formData.message}

What happens next?
- Our team will review your message carefully
- We typically respond within 24 business hours
- You'll receive a personalized response to your inquiry
- If urgent, feel free to call us at +1 917-741-3468

In the meantime, you might find these resources helpful:
- Browse our services: https://devtone.agency/services
- Learn more about us: https://devtone.agency/about
- Check our FAQ: https://devtone.agency/faq

Best regards,
The DevTone Team

This is an automated confirmation email. Please do not reply to this email.
© ${new Date().getFullYear()} DevTone. All rights reserved.
      `
    };

    // Add signature to email and send
    const emailWithSignature = {
      ...mailOptions,
      ...addSignatureToEmail({ html: mailOptions.html, text: mailOptions.text })
    };
    
    await transporter.sendMail(emailWithSignature);
    console.log('Contact confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEstimateEmail,
  sendClientConfirmationEmail,
  sendContactEmail,
  sendContactConfirmationEmail
};