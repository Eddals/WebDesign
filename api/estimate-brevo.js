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

    // Log the request for debugging
    console.log('Sending estimate email to:', email);
    
    // Send email using Brevo API - DIRECT APPROACH
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
        headers: {
          'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
      })
    });

    // Log the response for debugging
    const responseText = await response.text();
    console.log('Brevo API response:', response.status, responseText);

    if (!response.ok) {
      return res.status(500).json({ 
        error: `Email service error: ${response.status}`, 
        details: responseText 
      });
    }

    // Also send notification to team with a different approach
    try {
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
    } catch (notificationError) {
      console.error('Team notification error:', notificationError);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Estimate submission error:', error);
    return res.status(500).json({ error: 'Failed to process estimate request' });
  }
}