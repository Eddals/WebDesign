// API route for HubSpot integration
export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const HUBSPOT_TOKEN = 'pat-na2-0e94e7a3-5904-4247-ba2c-68dcf7c50c08';
  const { name, email, phone, company, country, industry } = req.body;

  console.log('Received contact data:', { name, email, phone, company, country, industry });

  // Create a contact in HubSpot
  try {
    console.log('Sending data to HubSpot CRM API...');
    
    const hubspotRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_TOKEN}`
      },
      body: JSON.stringify({
        properties: {
          firstname: name?.split(' ')[0] || '',
          lastname: name?.split(' ').slice(1).join(' ') || '',
          email,
          phone: phone || '',
          company: company || '',
          country: country || '',
          industry: industry || '',
          source: 'website_form'
        }
      })
    });
    
    console.log('HubSpot API status:', hubspotRes.status);
    
    let data;
    try {
      data = await hubspotRes.json();
      console.log('HubSpot API response:', data);
    } catch (jsonError) {
      console.error('Error parsing HubSpot response:', jsonError);
      data = { error: 'Failed to parse response' };
    }
    
    if (!hubspotRes.ok) {
      return res.status(400).json({ 
        error: data.message || 'HubSpot error',
        details: data
      });
    }
    
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error sending to HubSpot:', err);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message 
    });
  }
}
