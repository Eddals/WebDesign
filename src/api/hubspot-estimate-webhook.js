// HubSpot Estimate Webhook Handler

/**
 * This endpoint handles sending estimate form data to HubSpot webhook
 * It formats the data properly and handles errors
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Format data for HubSpot
    const hubspotData = {
      properties: {
        firstname: formData.full_name?.split(' ')[0] || '',
        lastname: formData.full_name?.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone || '',
        company: formData.property_type || '',
        country: formData.location || '',
        industry: formData.service_type || '',
        budget: formData.estimated_budget || '',
        timeline: formData.preferred_timeline || '',
        message: formData.project_description || '',
        property_size: formData.property_size || '',
        source: 'estimate_form',
        form_submission_date: new Date().toISOString()
      }
    };
    
    // HubSpot webhook URL
    const hubspotWebhookUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi';
    
    console.log('Sending data to HubSpot webhook:', hubspotData);
    
    // Send data to HubSpot
    const response = await fetch(hubspotWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotData),
    });
    
    console.log('HubSpot webhook response status:', response.status);
    
    // Try to get response data
    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      responseData = { message: 'No JSON response' };
    }
    
    // Return response to client
    return res.status(response.ok ? 200 : 400).json({
      success: response.ok,
      status: response.status,
      data: responseData
    });
    
  } catch (error) {
    console.error('Error sending to HubSpot webhook:', error);
    return res.status(500).json({ 
      error: 'Failed to send data to HubSpot webhook',
      message: error.message 
    });
  }
}