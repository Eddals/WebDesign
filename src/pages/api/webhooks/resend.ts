import type { NextApiRequest, NextApiResponse } from 'next';

// Resend webhook handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature (optional but recommended)
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers['resend-signature'] as string;
    // Add signature verification logic here if needed
  }

  try {
    const event = req.body;
    
    console.log('📨 Resend webhook received:', {
      type: event.type,
      emailId: event.data?.email_id,
      timestamp: new Date().toISOString()
    });

    // Handle different event types
    switch (event.type) {
      case 'email.sent':
        console.log('✅ Email sent successfully:', event.data);
        break;
        
      case 'email.delivered':
        console.log('📬 Email delivered:', event.data);
        break;
        
      case 'email.opened':
        console.log('👀 Email opened:', event.data);
        // You could track this in your database
        break;
        
      case 'email.clicked':
        console.log('🖱️ Link clicked:', event.data);
        // Track which links are being clicked
        break;
        
      case 'email.bounced':
        console.error('❌ Email bounced:', event.data);
        // Handle bounced emails (maybe notify admin)
        break;
        
      case 'email.complained':
        console.error('⚠️ Spam complaint:', event.data);
        // Important: Remove this email from your list
        break;
        
      default:
        console.log('Unknown event type:', event.type);
    }

    // Return success
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
}