import { Resend } from 'resend';
import { getNewsletterSubscriberTemplate, getNewsletterAdminNotificationTemplate } from './lib/newsletter-templates.js';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send confirmation email to subscriber
    const subscriberEmailResult = await resend.emails.send({
      from: 'DevTone Agency <newsletter@devtone.agency>',
      to: email,
      subject: '🎉 Welcome to DevTone Newsletter!',
      html: getNewsletterSubscriberTemplate({ name, email }),
    });

    // Send notification to admin
    const adminEmailResult = await resend.emails.send({
      from: 'DevTone Newsletter <notifications@devtone.agency>',
      to: 'team@devtone.agency',
      subject: '📧 New Newsletter Subscriber',
      html: getNewsletterAdminNotificationTemplate({ name, email, source }),
    });

    console.log('Newsletter subscription successful:', {
      subscriber: subscriberEmailResult,
      admin: adminEmailResult
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { name, email }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      error: 'Failed to process newsletter subscription',
      details: error.message
    });
  }
}