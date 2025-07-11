import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
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

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Test API endpoint is working!',
      timestamp: new Date().toISOString(),
      method: req.method
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'Test POST endpoint is working!',
      receivedData: req.body,
      timestamp: new Date().toISOString(),
      method: req.method
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 