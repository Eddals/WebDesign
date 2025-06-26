import { Resend } from 'resend';
import { getNewsletterSubscriberTemplate, getNewsletterAdminTemplate } from './lib/email-templates.js';

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

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
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    console.log('=== NEWSLETTER SUBSCRIPTION REQUEST RECEIVED ===');
    
    const { name, email, source = 'website_footer' } = req.body;
    console.log('Subscriber:', name, email);
    console.log('Source:', source);

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and email are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email address' 
      });
    }

    // Prepare subscriber data
    const subscriberInfo = {
      name,
      email,
      source,
      subscribedAt: new Date().toLocaleString()
    };

    // Admin email addresses
    const adminEmails = ['sweepeasellc@gmail.com'];
    
    // Send welcome email to subscriber
    const { data: subscriberEmailData, error: subscriberError } = await resend.emails.send({
      from: 'DevTone Agency <noreply@devtone.agency>',
      to: email,
      subject: '🎉 Welcome to DevTone Newsletter!',
      html: getNewsletterSubscriberTemplate(subscriberInfo),
    });
    
    if (subscriberError) {
      console.error('Error sending subscriber email:', subscriberError);
    } else {
      console.log('Subscriber email sent successfully:', subscriberEmailData);
    }

    // Send notification to admin
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'DevTone Newsletter <noreply@devtone.agency>',
      to: adminEmails,
      reply_to: email,
      subject: `📧 New Newsletter Subscriber: ${name}`,
      html: getNewsletterAdminTemplate(subscriberInfo),
    });
    
    if (adminError) {
      console.error('Error sending admin email:', adminError);
    } else {
      console.log('Admin email sent successfully:', adminData);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { name, email }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process subscription',
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
}