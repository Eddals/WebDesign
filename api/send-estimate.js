// Vercel Serverless Function for Estimate Submission
// This handles the /api/send-estimate endpoint

import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

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

    // Build plain text summary
    const firstName = formData.name.split(' ')[0] || formData.name;
    const featuresText = Array.isArray(formData.features) && formData.features.length > 0
      ? `• Features: ${formData.features.join(', ')}`
      : '';
    const summaryText = `Subject: We’ve received your quote request\n\nHi ${firstName},\n\nThank you for requesting a quote with Devtone — we’re excited to learn more about your project and explore how we can bring it to life.\n\nHere’s a quick summary of what you submitted:\n\n* * *\n\n📌 Project Summary:\n• Project Type: ${formData.projectType}\n• Goal: ${formData.description || 'Not specified'}\n• Timeline: ${formData.timeline}\n• Estimated Budget: ${formData.budget}\n${featuresText ? featuresText + '\n' : ''}\n* * *\n\nOur team is reviewing your request and will reach out shortly with a personalized proposal. We usually respond within 2 business hours.\n\nIn the meantime, feel free to explore our website to learn more about our services and past projects: devtone.agency\n\nIf you’d like to share more details or make changes, just reply to this email.\n\nLooking forward to connecting with you.\n\nWarm regards,\nMatheus Silva\nFounder & Owner – Devtone Agency`;

    // Send confirmation email to client using Resend
    let emailSuccess = false;
    try {
      await resend.emails.send({
        from: 'Devtone Agency <matheus.silva@devtone.agency>',
        to: formData.email,
        subject: 'We’ve received your quote request',
        text: summaryText,
        reply_to: 'matheus.silva@devtone.agency'
      });
      emailSuccess = true;
    } catch (emailError) {
      console.error('Estimate confirmation email error:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: 'Your estimate request has been received. We will contact you soon.',
      emailsSent: {
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
