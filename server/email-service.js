const nodemailer = require('nodemailer');
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

  return {
    subject: `New Estimate Request from ${formData.name} - ${formData.projectType}`,
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
          .highlight { background-color: #e9d5ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Estimate Request</h1>
          </div>
          <div class="content">
            <div class="highlight">
              <h2 style="margin-top: 0;">Quick Summary</h2>
              <p><strong>${formData.name}</strong> from <strong>${formData.company || 'N/A'}</strong> has requested an estimate for a <strong>${formData.projectType}</strong> project.</p>
              <p>Budget: <strong>${formData.budget}</strong> | Timeline: <strong>${formData.timeline}</strong></p>
            </div>

            <div class="section">
              <h3>Contact Information</h3>
              <div class="field">
                <span class="label">Name:</span> <span class="value">${formData.name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span> <span class="value"><a href="mailto:${formData.email}">${formData.email}</a></span>
              </div>
              <div class="field">
                <span class="label">Phone:</span> <span class="value">${formData.phone || 'Not provided'}</span>
              </div>
              <div class="field">
                <span class="label">Company:</span> <span class="value">${formData.company || 'Not provided'}</span>
              </div>
              <div class="field">
                <span class="label">Country:</span> <span class="value">${formData.country || 'Not provided'}</span>
              </div>
              <div class="field">
                <span class="label">Industry:</span> <span class="value">${formData.industry || 'Not provided'}</span>
              </div>
            </div>

            <div class="section">
              <h3>Project Details</h3>
              <div class="field">
                <span class="label">Project Type:</span> <span class="value">${formData.projectType}</span>
              </div>
              <div class="field">
                <span class="label">Budget Range:</span> <span class="value">${formData.budget}</span>
              </div>
              <div class="field">
                <span class="label">Timeline:</span> <span class="value">${formData.timeline}</span>
              </div>
              <div class="field">
                <span class="label">Additional Features:</span> <span class="value">${features}</span>
              </div>
            </div>

            <div class="section">
              <h3>Project Description</h3>
              <div style="background-color: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                ${formData.description || 'No description provided'}
              </div>
            </div>

            <div class="footer">
              <p>This estimate request was submitted on ${new Date().toLocaleString()}</p>
              <p>Please respond to the client within 24 hours.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Estimate Request from ${formData.name}

CONTACT INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Country: ${formData.country || 'Not provided'}
Industry: ${formData.industry || 'Not provided'}

PROJECT DETAILS:
Project Type: ${formData.projectType}
Budget Range: ${formData.budget}
Timeline: ${formData.timeline}
Additional Features: ${features}

PROJECT DESCRIPTION:
${formData.description || 'No description provided'}

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

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
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
    
    const mailOptions = {
      from: `"DevTone" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: 'We received your estimate request - DevTone',
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Estimate Request!</h1>
            </div>
            <div class="content">
              <p>Hi ${formData.name},</p>
              
              <p>We've received your estimate request for a <strong>${formData.projectType}</strong> project. Our team is reviewing your requirements and will get back to you within 24 hours with a detailed proposal.</p>
              
              <h3>What happens next?</h3>
              <ul>
                <li>Our team will carefully review your project requirements</li>
                <li>We'll prepare a detailed proposal with timeline and pricing</li>
                <li>You'll receive our proposal via email within 24 hours</li>
                <li>We'll schedule a call to discuss your project in detail</li>
              </ul>
              
              <p>In the meantime, feel free to browse our portfolio or contact us if you have any questions.</p>
              
              <div style="text-align: center;">
                <a href="https://devtone.com" class="button">Visit Our Website</a>
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

Thank you for your estimate request!

We've received your request for a ${formData.projectType} project. Our team is reviewing your requirements and will get back to you within 24 hours with a detailed proposal.

What happens next?
- Our team will carefully review your project requirements
- We'll prepare a detailed proposal with timeline and pricing
- You'll receive our proposal via email within 24 hours
- We'll schedule a call to discuss your project in detail

In the meantime, feel free to visit our website at https://devtone.com or contact us if you have any questions.

Best regards,
The DevTone Team

This is an automated confirmation email. Please do not reply to this email.
© ${new Date().getFullYear()} DevTone. All rights reserved.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Client confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending client confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEstimateEmail,
  sendClientConfirmationEmail
};