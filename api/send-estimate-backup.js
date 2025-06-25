/**
 * Backup email handler using alternative methods
 * This ensures you get notified even if Resend fails
 */

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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    console.log('=== BACKUP ESTIMATE HANDLER ===');
    console.log('Received from:', formData.name, formData.email);
    
    const notifications = [];
    
    // 1. Send to Slack webhook (if configured)
    if (process.env.SLACK_WEBHOOK_URL) {
      notifications.push(
        fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 New Estimate Request`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: '📋 New Estimate Request'
                }
              },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Name:*\n${formData.name}` },
                  { type: 'mrkdwn', text: `*Email:*\n${formData.email}` },
                  { type: 'mrkdwn', text: `*Project:*\n${formData.projectType}` },
                  { type: 'mrkdwn', text: `*Budget:*\n${formData.budget}` },
                  { type: 'mrkdwn', text: `*Timeline:*\n${formData.timeline}` },
                  { type: 'mrkdwn', text: `*Company:*\n${formData.company || 'N/A'}` }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Description:*\n${formData.description || 'No description provided'}`
                }
              }
            ]
          })
        }).catch(err => console.error('Slack error:', err))
      );
    }
    
    // 2. Send to Discord webhook (if configured)
    if (process.env.DISCORD_WEBHOOK_URL) {
      notifications.push(
        fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: '@everyone New Estimate Request!',
            embeds: [{
              title: '📋 New Estimate Request',
              color: 0x6d28d9, // Purple color
              fields: [
                { name: 'Client Name', value: formData.name, inline: true },
                { name: 'Email', value: formData.email, inline: true },
                { name: 'Phone', value: formData.phone || 'N/A', inline: true },
                { name: 'Company', value: formData.company || 'N/A', inline: true },
                { name: 'Project Type', value: formData.projectType, inline: true },
                { name: 'Budget', value: formData.budget, inline: true },
                { name: 'Timeline', value: formData.timeline, inline: true },
                { name: 'Features', value: formData.features?.join(', ') || 'None', inline: false },
                { name: 'Description', value: formData.description || 'No description', inline: false }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        }).catch(err => console.error('Discord error:', err))
      );
    }
    
    // 3. Send to Telegram (if configured)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `
🚨 *New Estimate Request*

👤 *Client:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *Phone:* ${formData.phone || 'N/A'}
🏢 *Company:* ${formData.company || 'N/A'}

📋 *Project Type:* ${formData.projectType}
💰 *Budget:* ${formData.budget}
⏱️ *Timeline:* ${formData.timeline}

📝 *Description:*
${formData.description || 'No description provided'}

🔗 [Reply to client](mailto:${formData.email})
      `;
      
      notifications.push(
        fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
          })
        }).catch(err => console.error('Telegram error:', err))
      );
    }
    
    // 4. Store in database as backup (using Supabase)
    if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      notifications.push(
        fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/estimate_requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            country: formData.country,
            industry: formData.industry,
            project_type: formData.projectType,
            budget: formData.budget,
            timeline: formData.timeline,
            features: formData.features,
            description: formData.description,
            created_at: new Date().toISOString()
          })
        }).catch(err => console.error('Supabase error:', err))
      );
    }
    
    // Wait for all notifications
    await Promise.allSettled(notifications);
    
    console.log('Backup notifications sent');
    
    return res.status(200).json({
      success: true,
      message: 'Estimate request received and processed'
    });
    
  } catch (error) {
    console.error('Backup handler error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process request'
    });
  }
}