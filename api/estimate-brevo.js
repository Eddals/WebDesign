export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, industry, projectType, budget, timeline, description, features, retainer } = req.body;

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
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify({
        to: [{ email, name }],
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
          RETAINER: retainer || 'None'
        },
        sender: {
          name: 'DevTone Agency',
          email: 'team@devtone.agency'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      return res.status(500).json({ error: `Email service error: ${errorData.message || 'Unknown error'}` });
    }

    // Also send notification to team
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
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
    } catch (notificationError) {
      // Log but don't fail if team notification fails
      console.error('Team notification error:', notificationError);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Estimate submission error:', error);
    return res.status(500).json({ error: 'Failed to process estimate request' });
  }
}