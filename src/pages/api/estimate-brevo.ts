import type { NextApiRequest, NextApiResponse } from 'next';

const BREVO_CONFIG = {
  API_KEY: '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',
  API_URL: 'https://api.brevo.com/v3/smtp/email',
  TEAM_EMAIL: 'team@devtone.agency'
};

interface EstimateData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
  retainer: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API endpoint called');
    
    const data: EstimateData = req.body;
    console.log('Received data:', data);

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.company || !data.industry || !data.projectType || !data.budget || !data.timeline) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Validation passed, sending email...');

    // Send email to team using Brevo template ID #2
    const emailData = {
      sender: {
        name: 'DevTone Estimate Form',
        email: 'noreply@devtone.agency'
      },
      to: [
        {
          email: BREVO_CONFIG.TEAM_EMAIL,
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

    console.log('Sending email data:', emailData);

    // Send email via Brevo API
    const brevoResponse = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY
      },
      body: JSON.stringify(emailData)
    });

    console.log('Brevo response status:', brevoResponse.status);

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error('Brevo API error:', errorData);
      throw new Error(`Brevo API error: ${brevoResponse.status} - ${errorData}`);
    }

    console.log('Team email sent successfully');

    // Send confirmation email to the client using Brevo template
    const confirmationEmailData = {
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
      templateId: 3, // Using template ID 3 for client confirmation
      params: {
        CLIENT_NAME: data.name,
        PROJECT_TYPE: data.projectType,
        BUDGET: data.budget,
        TIMELINE: data.timeline,
        FEATURES: data.features.join(', ') || 'No specific features selected',
        WEBSITE_URL: 'https://devtone.agency',
        TEAM_EMAIL: 'team@devtone.agency'
      }
    };

    console.log('Sending confirmation email...');

    // Send confirmation email
    const confirmationResponse = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY
      },
      body: JSON.stringify(confirmationEmailData)
    });

    console.log('Confirmation response status:', confirmationResponse.status);

    if (!confirmationResponse.ok) {
      const errorData = await confirmationResponse.text();
      console.error('Confirmation email failed:', errorData);
      // Don't fail the whole request if confirmation email fails
    } else {
      console.log('Confirmation email sent successfully');
    }

    console.log('Sending success response');
    res.status(200).json({ 
      success: true, 
      message: 'Estimate request submitted successfully' 
    });

  } catch (error) {
    console.error('Estimate submission error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit estimate request' 
    });
  }
} 