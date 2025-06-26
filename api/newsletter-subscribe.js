import { Resend } from 'resend';
import { getNewsletterSubscriberTemplate, getNewsletterAdminTemplate } from './lib/email-templates.js';

// Initialize Resend
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

// Make sure we have the templates
if (typeof getNewsletterSubscriberTemplate !== 'function') {
  console.error('getNewsletterSubscriberTemplate is not a function');
}

if (typeof getNewsletterAdminTemplate !== 'function') {
  console.error('getNewsletterAdminTemplate is not a function');
}

export default async function handler(req, res) {
  // CORS setup
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

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get form data
    const { name, email, source = 'website_footer' } = req.body || {};

    // Log the request for debugging
    console.log('Newsletter request body:', req.body);

    // Validate inputs
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and email are required' 
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Subscriber data
    const subscriberInfo = {
      name,
      email,
      source,
      subscribedAt: new Date().toLocaleString()
    };

    try {
      // Send emails
      const [subscriberResult, adminResult] = await Promise.all([
        // Subscriber email
        resend.emails.send({
          from: 'DevTone Agency <noreply@devtone.agency>',
          to: email,
          subject: 'Thanks for Subscribing',
          html: getNewsletterSubscriberTemplate(subscriberInfo),
        }),
        
        // Admin notification
        resend.emails.send({
          from: 'DevTone Newsletter <noreply@devtone.agency>',
          to: 'sweepeasellc@gmail.com',
          reply_to: email,
          subject: `New Newsletter Subscriber: ${name}`,
          html: getNewsletterAdminTemplate(subscriberInfo),
        })
      ]);

      // Log results for debugging
      console.log('Email sending results:', { 
        subscriber: subscriberResult, 
        admin: adminResult 
      });

      // Check for errors
      if (subscriberResult.error || adminResult.error) {
        console.error('Email sending errors:', {
          subscriberError: subscriberResult.error,
          adminError: adminResult.error
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Error sending emails:', emailError);
      // We'll still return success since the subscription was processed
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { name, email }
    });

  } catch (error) {
    // Log the full error for debugging
    console.error('Newsletter subscription error:', error);
    
    // Always return a valid JSON response
    return res.status(500).json({
      success: false,
      error: 'Failed to process subscription',
      message: error.message || 'An unexpected error occurred'
    });
  }
}