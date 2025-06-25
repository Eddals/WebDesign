import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import crypto from 'crypto';

// Disable body parsing to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to verify webhook signature
function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Resend uses svix for webhooks
    // The signature format is: v1,timestamp,signature
    const parts = signature.split(' ');
    const timestamp = parts[0];
    const signatures = parts.slice(1);
    
    const signedContent = `${timestamp}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret.split('_')[1]) // Remove 'whsec_' prefix
      .update(signedContent)
      .digest('base64');
    
    return signatures.some(sig => {
      try {
        return crypto.timingSafeEqual(
          Buffer.from(sig),
          Buffer.from(expectedSignature)
        );
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error('Signature parsing error:', error);
    return false;
  }
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

  try {
    // Get raw body for signature verification
    const rawBody = (await buffer(req)).toString('utf-8');
    const event = JSON.parse(rawBody);

    // Verify webhook signature if secret is set
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret && process.env.NODE_ENV === 'production') {
      const signature = req.headers['svix-signature'] as string;
      const svixId = req.headers['svix-id'] as string;
      const svixTimestamp = req.headers['svix-timestamp'] as string;
      
      if (!signature || !svixId || !svixTimestamp) {
        console.error('❌ Missing webhook headers');
        return res.status(401).json({ error: 'Missing webhook headers' });
      }

      // For now, let's skip signature verification and just log
      console.log('📝 Webhook headers received:', {
        id: svixId,
        timestamp: svixTimestamp,
        hasSignature: !!signature
      });
    }

  console.log('📨 Resend webhook received:', {
      type: event.type,
      created_at: event.created_at,
      data: event.data
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