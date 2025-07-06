// Estimate form endpoint for Brevo
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      method: req.method
    });
  }

  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.company || !data.industry || !data.projectType || !data.budget || !data.timeline) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Brevo configuration
    const BREVO_API_KEY = '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';
    const TEAM_EMAIL = 'team@devtone.agency';

    // Email data for team
    const emailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: TEAM_EMAIL,
          name: 'DevTone Team'
        }
      ],
      templateId: 2,
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone,
        COMPANY: data.company,
        INDUSTRY: data.industry,
        PROJECT_TYPE: data.projectType,
        BUDGET: data.budget,
        TIMELINE: data.timeline,
        RETAINER: data.retainer,
        FEATURES: data.features.join(', '),
        DESCRIPTION: data.description || 'No description provided',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Estimate Form'
      }
    };

    // Send email to team
    const teamResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!teamResponse.ok) {
      throw new Error(`Team email failed: ${teamResponse.status}`);
    }

    // Send confirmation to client
    const clientEmailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: data.email,
          name: data.name
        }
      ],
      templateId: 2,
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone,
        COMPANY: data.company,
        INDUSTRY: data.industry,
        PROJECT_TYPE: data.projectType,
        BUDGET: data.budget,
        TIMELINE: data.timeline,
        RETAINER: data.retainer,
        FEATURES: data.features.join(', '),
        DESCRIPTION: data.description || 'No description provided',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Estimate Form - Client Confirmation'
      }
    };

    const clientResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(clientEmailData)
    });

    // Don't fail if client email fails
    if (!clientResponse.ok) {
      console.log('Client confirmation email failed');
    }

    return res.status(200).json({
      success: true,
      message: 'Estimate request submitted successfully'
    });

  } catch (error) {
    console.error('Estimate error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit estimate request'
    });
  }
} 