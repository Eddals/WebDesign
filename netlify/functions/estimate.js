// Netlify Function for Estimate API
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ['name', 'email', 'projectType', 'budget', 'timeline'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        })
      };
    }

    // Send emails using the existing email service logic
    const transporter = createTransporter();
    
    // Admin email
    const adminEmail = {
      from: `"DevTone Estimates" <${process.env.SMTP_USER}>`,
      to: process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER,
      subject: `New Estimate Request from ${formData.name}`,
      html: `<h2>New estimate request received</h2>
             <p><strong>Name:</strong> ${formData.name}</p>
             <p><strong>Email:</strong> ${formData.email}</p>
             <p><strong>Project Type:</strong> ${formData.projectType}</p>
             <p><strong>Budget:</strong> ${formData.budget}</p>
             <p><strong>Timeline:</strong> ${formData.timeline}</p>
             <p><strong>Description:</strong> ${formData.description || 'N/A'}</p>`
    };

    await transporter.sendMail(adminEmail);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Estimate request submitted successfully'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Failed to process request'
      })
    };
  }
};