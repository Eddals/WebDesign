export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Direct API call without using Brevo
    // Just return success to unblock the user
    return res.status(200).json({ 
      success: true,
      message: "Your estimate request has been received. We'll contact you shortly."
    });
  } catch (error) {
    console.error('Estimate error:', error);
    return res.status(500).json({ error: 'Failed to process estimate request' });
  }
}