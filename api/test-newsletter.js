// Simple test endpoint to verify API is working
export default function handler(req, res) {
  console.log('Test newsletter endpoint called');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'CORS preflight for test endpoint' });
  }

  return res.status(200).json({ 
    success: true, 
    message: 'Test newsletter endpoint is working!',
    method: req.method,
    timestamp: new Date().toISOString(),
    body: req.body
  });
}