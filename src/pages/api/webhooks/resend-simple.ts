import type { NextApiRequest, NextApiResponse } from 'next';

// Simple Resend webhook handler without signature verification for testing
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    
    // Log the entire webhook payload for debugging
    console.log('📨 Resend webhook received:');
    console.log(JSON.stringify(event, null, 2));

    // Check if this is a Resend webhook event
    if (!event.type || !event.data) {
      console.log('⚠️ Invalid webhook format');
      return res.status(400).json({ error: 'Invalid webhook format' });
    }

    // Handle different event types
    switch (event.type) {
      case 'email.sent':
        console.log('✅ Email sent successfully');
        if (event.data.to) console.log('   To:', event.data.to);
        if (event.data.subject) console.log('   Subject:', event.data.subject);
        break;
        
      case 'email.delivered':
        console.log('📬 Email delivered');
        if (event.data.to) console.log('   To:', event.data.to);
        if (event.data.subject) console.log('   Subject:', event.data.subject);
        break;
        
      case 'email.opened':
        console.log('👀 Email opened');
        if (event.data.to) console.log('   By:', event.data.to);
        if (event.data.subject) console.log('   Subject:', event.data.subject);
        break;
        
      case 'email.clicked':
        console.log('🖱️ Link clicked');
        if (event.data.to) console.log('   By:', event.data.to);
        if (event.data.click?.link) console.log('   Link:', event.data.click.link);
        break;
        
      case 'email.bounced':
        console.error('❌ Email bounced');
        if (event.data.to) console.error('   To:', event.data.to);
        if (event.data.bounce?.message) console.error('   Reason:', event.data.bounce.message);
        break;
        
      case 'email.complained':
        console.error('⚠️ SPAM COMPLAINT');
        if (event.data.to) console.error('   From:', event.data.to);
        break;
        
      default:
        console.log('📨 Event type:', event.type);
        console.log('   Data:', event.data);
    }

    // Always return 200 OK to acknowledge receipt
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    // Still return 200 to prevent retries
    return res.status(200).json({ received: true, error: 'Processing error' });
  }
}