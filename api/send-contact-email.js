import nodemailer from 'nodemailer';
import { getContactClientTemplate, getContactAdminTemplate } from './lib/email-templates.js';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

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
    console.log('=== CONTACT FORM SUBMISSION RECEIVED ===');
    console.log('From:', formData.full_name || formData.name, formData.email);
    console.log('Subject:', formData.subject);
    
    // Create transporter
    const transporter = createTransporter();
    
    // Prepare contact data
    const contactData = {
      name: formData.full_name || formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
      company: formData.company || 'Not provided',
      preferredContact: formData.preferredContact || 'email',
      submittedAt: new Date().toLocaleString()
    };

    // Send email to client
    const clientMailOptions = {
      from: `"DevTone Agency" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: '✨ We Received Your Message - DevTone Agency',
      html: getContactClientTemplate(contactData),
    };

    // Send email to admin
    const adminMailOptions = {
      from: `"DevTone Contact System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      replyTo: formData.email,
      subject: `📬 New Contact Form: ${contactData.name} - ${formData.subject}`,
      html: getContactAdminTemplate(contactData),
    };

    try {
      // Send both emails
      await Promise.all([
        transporter.sendMail(clientMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);

      console.log('✅ Contact emails sent successfully');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        emailSent: true
      });
    } catch (emailError) {
      console.error('❌ Error sending emails:', emailError);
      
      // Still return success if email fails but form was received
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form received. We will get back to you soon.',
        emailSent: false
      });
    }

  } catch (error) {
    console.error('❌ Server error processing contact form:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error processing your request' 
    });
  }
}