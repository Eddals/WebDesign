// Vercel-specific test endpoint
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log request details
  console.log('🔍 Vercel test endpoint called');
  console.log('📋 Method:', req.method);
  console.log('📋 URL:', req.url);
  console.log('📋 Headers:', req.headers);
  console.log('📋 Body:', req.body);

  // Test different methods
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Vercel API is working - GET request',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      vercel: true
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'Vercel API is working - POST request',
      receivedData: req.body,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      vercel: true
    });
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST'],
    receivedMethod: req.method
  });
} 