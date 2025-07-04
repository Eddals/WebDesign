// API route for HubSpot integration
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const HUBSPOT_TOKEN = 'pat-na2-0e94e7a3-5904-4247-ba2c-68dcf7c50c08';
  const { name, email, phone, company, country, industry } = req.body;

  // Example: create a contact in HubSpot
  try {
    const hubspotRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_TOKEN}`
      },
      body: JSON.stringify({
        properties: {
          firstname: name,
          email,
          phone,
          company,
          country,
          industry
        }
      })
    });
    const data = await hubspotRes.json();
    if (!hubspotRes.ok) {
      return res.status(400).json({ error: data.message || 'HubSpot error' });
    }
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
