import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// Helper to verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Resend webhook handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers['resend-signature'] as string;
    
    if (!signature) {
      console.error('❌ No signature provided');
      return res.status(401).json({ error: 'No signature provided' });
    }

    try {
      const payload = JSON.stringify(req.body);
      const isValid = verifyWebhookSignature(payload, signature, webhookSecret);
      
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } catch (error) {
      console.error('❌ Signature verification failed:', error);
      return res.status(401).json({ error: 'Signature verification failed' });
    }
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
        console.log('✅ Email sent successfully');
        console.log('   To:', event.data.to);
        console.log('   Subject:', event.data.subject);
        console.log('   ID:', event.data.email_id);
        break;
        
      case 'email.delivered':
        console.log('📬 Email delivered');
        console.log('   To:', event.data.to);
        console.log('   Subject:', event.data.subject);
        console.log('   Delivered at:', event.data.delivered_at);
        break;
        
      case 'email.opened':
        console.log('👀 Email opened');
        console.log('   By:', event.data.to);
        console.log('   Subject:', event.data.subject);
        console.log('   Opened at:', event.data.opened_at);
        console.log('   Device:', event.data.user_agent);
        // You could track open rates in your database
        break;
        
      case 'email.clicked':
        console.log('🖱️ Link clicked');
        console.log('   By:', event.data.to);
        console.log('   Link:', event.data.link);
        console.log('   Clicked at:', event.data.clicked_at);
        // Track which links are most popular
        break;
        
      case 'email.bounced':
        console.error('❌ Email bounced');
        console.error('   To:', event.data.to);
        console.error('   Reason:', event.data.bounce_type);
        console.error('   Description:', event.data.bounce_description);
        // TODO: Mark this email as invalid in your database
        break;
        
      case 'email.complained':
        console.error('⚠️ SPAM COMPLAINT - URGENT');
        console.error('   From:', event.data.to);
        console.error('   Subject:', event.data.subject);
        console.error('   Complained at:', event.data.complained_at);
        // CRITICAL: Remove this email from all lists immediately
        break;
        
      default:
        console.log('📨 Unknown event:', event.type);
        console.log('   Data:', JSON.stringify(event.data, null, 2));
    }

    // Return success
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
}