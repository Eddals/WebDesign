// api/estimate-webhook.ts
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Extract data from request body
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

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Log the received data
    console.log('Estimate webhook received:', { name, email, company, projectType, budget });

    // Format data for webhook processing
    const webhookData = {
      name,
      email,
      phone: phone || 'Not provided',
      company: company || 'Not provided',
      industry: industry || 'Not provided',
      projectType: projectType || 'Not provided',
      budget: budget || 'Not provided',
      timeline: timeline || 'Not provided',
      description: description || 'Not provided',
      features: Array.isArray(features) ? features.join(', ') : 'None selected',
      retainer: retainer || 'None selected',
      submittedAt: new Date().toISOString()
    };

    // Here you can add additional webhook processing logic
    // For example, storing the data in a database or sending to another service

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Estimate webhook received successfully',
      data: webhookData
    });
  } catch (error) {
    console.error('Estimate webhook error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred processing the webhook' 
    });
  }
}
