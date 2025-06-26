import nodemailer from 'nodemailer';
import { getNewsletterSubscriberTemplate, getNewsletterAdminTemplate } from './lib/email-templates.js';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
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
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Create transporter
    const transporter = createTransporter();

    // Prepare email data
    const subscriberData = {
      name,
      email,
      source,
      subscribedAt: new Date().toLocaleString()
    };

    // Send email to subscriber
    const subscriberMailOptions = {
      from: `"DevTone Agency" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 Welcome to DevTone Newsletter!',
      html: getNewsletterSubscriberTemplate(subscriberData),
    };

    // Send email to admin
    const adminMailOptions = {
      from: `"DevTone Newsletter System" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `📧 New Newsletter Subscriber: ${name}`,
      html: getNewsletterAdminTemplate(subscriberData),
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(subscriberMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    // Log the subscription (you can also save to database here)
    console.log('New newsletter subscription:', subscriberData);

    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      data: { name, email }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      error: 'Failed to process subscription',
      message: error.message 
    });
  }
}