import { Resend } from 'resend';
import { getNewsletterSubscriberTemplate, getNewsletterAdminTemplate } from './lib/email-templates.js';

// Initialize Resend
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

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
    const { name, email, source = 'website_footer' } = req.body;

    // Validate inputs
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    // Subscriber data
    const subscriberInfo = {
      name,
      email,
      source,
      subscribedAt: new Date().toLocaleString()
    };

    // Send emails
    await Promise.all([
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

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { name, email }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process subscription'
    });
  }
}