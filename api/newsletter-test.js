// Simple test endpoint for newsletter API

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return a simple JSON response
  return res.status(200).json({
    success: true,
    message: 'Newsletter API is working',
    timestamp: new Date().toISOString()
  });
}