// Estimate form endpoint for Brevo
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).json({ success: true, message: 'CORS preflight' });
    return;
  }

  // Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    company,
    industry,
    projectType,
    budget,
    timeline,
    description,
    features,
    retainer
  } = req.body;

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        subject: `New Estimate Request: ${projectType}`,
        htmlContent: `
          <h2>New Estimate Request</h2>
          <h3>Client Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Industry:</strong> ${industry}</p>
          
          <h3>Project Details</h3>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          <p><strong>Retainer:</strong> ${retainer || 'Not specified'}</p>
          
          <h3>Features Requested</h3>
          <ul>
            ${features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
          
          <h3>Description</h3>
          <p>${description || 'No description provided'}</p>
          
          <hr>
          <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
        `
      }),
    });

    if (!brevoRes.ok) {
      const error = await brevoRes.text();
      console.error('Brevo API error:', error);
      return res.status(500).json({ error: `Brevo API error: ${brevoRes.status}` });
    }

    // Send confirmation email to the client
    const confirmationRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
        to: [{ email: email, name: name }],
        subject: 'Your Estimate Request - DevTone Agency',
        htmlContent: `
          <h2>Thank you for your estimate request!</h2>
          <p>Dear ${name},</p>
          <p>We have received your estimate request for a <strong>${projectType}</strong> project and will review it carefully.</p>
          
          <h3>What happens next?</h3>
          <ol>
            <li><strong>Project Review (2-4 hours):</strong> Our expert team will analyze your requirements</li>
            <li><strong>Custom Proposal (Within 24 hours):</strong> You'll receive a detailed proposal with pricing and timeline</li>
            <li><strong>Consultation Call (Within 48 hours):</strong> We'll schedule a call to discuss your project</li>
          </ol>
          
          <h3>Your Project Summary</h3>
          <p><strong>Type:</strong> ${projectType}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          
          <hr>
          <p>Best regards,<br>The DevTone Team</p>
          <p><em>We'll be in touch soon!</em></p>
        `
      }),
    });

    // Don't fail if confirmation email fails
    if (!confirmationRes.ok) {
      console.error('Confirmation email failed');
    }

    res.status(200).json({ success: true, message: 'Estimate request submitted successfully' });
  } catch (err) {
    console.error('Estimate submission error:', err);
    res.status(500).json({ error: err.message });
  }
}
