export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body;

    // Use the correct Brevo API key
    const brevoKey = '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';
    if (!brevoKey) {
      return res.status(500).json({ error: 'API Key not found in environment' });
    }

    // Send confirmation email to client
    const clientResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
        to: [{ email: body.email, name: body.name }],
        subject: 'Thank you for your estimate request - DevTone Agency',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Thank you for your estimate request!</h2>
            <p>Hi ${body.name},</p>
            <p>We've received your estimate request for your <strong>${body.projectType}</strong> project. Here's a summary of what you submitted:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Project Details:</h3>
              <ul style="color: #6b7280;">
                <li><strong>Company:</strong> ${body.company}</li>
                <li><strong>Industry:</strong> ${body.industry}</li>
                <li><strong>Project Type:</strong> ${body.projectType}</li>
                <li><strong>Budget Range:</strong> ${body.budget}</li>
                <li><strong>Timeline:</strong> ${body.timeline}</li>
                ${body.features && body.features.length > 0 ? `<li><strong>Features:</strong> ${body.features.join(', ')}</li>` : ''}
                ${body.retainer && body.retainer !== 'none' ? `<li><strong>Monthly Retainer:</strong> ${body.retainer}</li>` : ''}
              </ul>
              ${body.description ? `<p><strong>Description:</strong><br>${body.description}</p>` : ''}
            </div>
            
            <h3 style="color: #7c3aed;">What happens next?</h3>
            <ol style="color: #6b7280;">
              <li><strong>Review (2-4 hours):</strong> Our team will analyze your requirements</li>
              <li><strong>Custom Proposal (24 hours):</strong> You'll receive a detailed proposal with pricing and timeline</li>
              <li><strong>Consultation Call (48 hours):</strong> We'll schedule a call to discuss details</li>
            </ol>
            
            <p style="color: #6b7280;">If you have any questions, feel free to reply to this email or call us.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px;">
                Best regards,<br>
                <strong>DevTone Agency Team</strong><br>
                Email: team@devtone.agency<br>
                Website: https://devtone.agency
              </p>
            </div>
          </div>
        `
      })
    });

    // Send notification email to team
    const teamResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Estimate Form', email: 'noreply@devtone.agency' },
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        subject: `New Estimate Request - ${body.name} from ${body.company}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">🚨 New Estimate Request</h2>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #dc2626;">Contact Information:</h3>
              <ul>
                <li><strong>Name:</strong> ${body.name}</li>
                <li><strong>Email:</strong> ${body.email}</li>
                <li><strong>Phone:</strong> ${body.phone}</li>
                <li><strong>Company:</strong> ${body.company}</li>
                <li><strong>Industry:</strong> ${body.industry}</li>
              </ul>
            </div>
            
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0369a1;">Project Details:</h3>
              <ul>
                <li><strong>Project Type:</strong> ${body.projectType}</li>
                <li><strong>Budget Range:</strong> ${body.budget}</li>
                <li><strong>Timeline:</strong> ${body.timeline}</li>
                ${body.features && body.features.length > 0 ? `<li><strong>Features:</strong> ${body.features.join(', ')}</li>` : ''}
                ${body.retainer && body.retainer !== 'none' ? `<li><strong>Monthly Retainer:</strong> ${body.retainer}</li>` : ''}
              </ul>
              ${body.description ? `<div style="margin-top: 15px;"><strong>Description:</strong><br><p style="background: white; padding: 10px; border-radius: 4px;">${body.description}</p></div>` : ''}
            </div>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #166534;"><strong>⏰ Action Required:</strong> Respond within 24 hours with a detailed proposal.</p>
            </div>
          </div>
        `
      })
    });

    const clientData = await clientResponse.json();
    const teamData = await teamResponse.json();

    if (!clientResponse.ok) {
      console.error('Brevo client email error:', clientData);
      return res.status(clientResponse.status).json({ error: clientData });
    }

    if (!teamResponse.ok) {
      console.error('Brevo team email error:', teamData);
      // Don't fail if team email fails, client confirmation is more important
    }

    return res.status(200).json({ 
      success: true, 
      clientEmailSent: clientResponse.ok,
      teamEmailSent: teamResponse.ok 
    });
  } catch (err) {
    console.error('Brevo handler error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
