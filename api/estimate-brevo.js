// Vercel serverless function for estimate form
export default async function handler(req, res) {
  // Set CORS headers for API routes
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, industry, projectType, budget, timeline, description, features, retainer } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !company || !projectType || !budget || !timeline) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Format features as a list if present
    const featuresList = features && features.length > 0 
      ? features.join(', ')
      : 'None selected';

    // Send email using Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify({
        to: [{ email: email, name: name }],
        templateId: 2,
        params: {
          FIRSTNAME: name,
          COMPANY: company,
          PROJECT_TYPE: projectType,
          BUDGET: budget,
          TIMELINE: timeline,
          FEATURES: featuresList,
          DESCRIPTION: description || 'No description provided',
          INDUSTRY: industry || 'Not specified',
          RETAINER: retainer || 'None',
          PHONE: phone
        },
        sender: {
          name: 'DevTone Agency',
          email: 'team@devtone.agency'
        }
      })
    });

    // Handle API response
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ 
        error: `Email service error: ${response.status}`, 
        details: errorText 
      });
    }

    // Send notification to team
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify({
        to: [{ email: 'team@devtone.agency', name: 'DevTone Team' }],
        subject: `New Estimate Request: ${name} - ${projectType}`,
        htmlContent: `
          <h2>New Estimate Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Industry:</strong> ${industry || 'Not specified'}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          <p><strong>Features:</strong> ${featuresList}</p>
          <p><strong>Retainer:</strong> ${retainer || 'None'}</p>
          <p><strong>Description:</strong> ${description || 'No description provided'}</p>
        `,
        sender: {
          name: 'DevTone Estimate Form',
          email: 'noreply@devtone.agency'
        }
      })
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process estimate request' });
  }
}