import { Resend } from 'resend';
import { getNewsletterSubscriberTemplate, getNewsletterAdminTemplate } from './lib/email-templates.js';

// Initialize Resend - Use environment variable or fallback to direct API key
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
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== NEWSLETTER SUBSCRIPTION REQUEST RECEIVED ===');
    console.log('Request body:', req.body);
    console.log('Resend API configured:', !!resend);
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    
    const { name, email, source = 'website_footer' } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Prepare email data
    const subscriberData = {
      name,
      email,
      source,
      subscribedAt: new Date().toLocaleString()
    };

    // Track email sending status
    let subscriberEmailSent = false;
    let adminEmailSent = false;
    let subscriberEmailData = null;
    let adminEmailData = null;
    let subscriberEmailError = null;
    let adminEmailError = null;

    // Send email to subscriber using Resend
    try {
      console.log(`Attempting to send welcome email to subscriber: ${email}`);
      const { data, error } = await resend.emails.send({
        from: 'DevTone Agency <noreply@devtone.agency>',
        to: email,
        subject: '🎉 Welcome to DevTone Newsletter!',
        html: getNewsletterSubscriberTemplate(subscriberData),
      });
      
      subscriberEmailData = data;
      subscriberEmailError = error;
      subscriberEmailSent = !error;
      
      console.log('Subscriber email result:', { data, error });
    } catch (emailError) {
      console.error('Error sending subscriber email:', emailError);
      subscriberEmailError = emailError;
    }

    // Admin email addresses
    const adminEmails = [
      process.env.ADMIN_EMAIL || 'team@devtone.agency',
      'sweepeasellc@gmail.com'  // Add your email here as a backup
    ];
    
    // Send email to admin using Resend
    for (const adminEmail of adminEmails) {
      try {
        console.log(`Attempting to send admin notification to: ${adminEmail}`);
        const { data, error } = await resend.emails.send({
          from: 'DevTone Newsletter System <noreply@devtone.agency>',
          to: adminEmail,
          reply_to: email,
          subject: `📧 New Newsletter Subscriber: ${name}`,
          html: getNewsletterAdminTemplate(subscriberData),
        });
        
        adminEmailData = data;
        adminEmailError = error;
        adminEmailSent = !error;
        
        console.log(`Admin email to ${adminEmail} result:`, { data, error });
        
        // If successful, break the loop
        if (!error) break;
      } catch (emailError) {
        console.error(`Error sending admin email to ${adminEmail}:`, emailError);
        adminEmailError = emailError;
      }
    }

    // Log the subscription
    console.log('New newsletter subscription:', subscriberData);
    console.log('Email sending status:', { 
      subscriberEmailSent, 
      adminEmailSent,
      subscriberEmailError: subscriberEmailError ? subscriberEmailError.message : null,
      adminEmailError: adminEmailError ? adminEmailError.message : null
    });

    // Even if email sending fails, we consider the subscription successful
    // as long as we received the data - we can retry email sending later
    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      data: { 
        name, 
        email,
        subscriberEmailSent,
        adminEmailSent
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Return a more detailed error response
    res.status(500).json({ 
      success: false,
      error: 'Failed to process subscription',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}