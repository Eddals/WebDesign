export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic security - only allow from your domain or with a secret
  const secret = req.query.secret;
  if (secret !== 'devtone-check-2024') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const config = {
    resendApiKeyExists: !!process.env.RESEND_API_KEY,
    resendApiKeyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
    resendApiKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    timestamp: new Date().toISOString()
  };

  return res.status(200).json({
    status: 'Email Configuration Check',
    config,
    instructions: {
      ifNotWorking: [
        '1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables',
        '2. Add RESEND_API_KEY with your API key from https://resend.com/api-keys',
        '3. Redeploy your project',
        '4. Make sure devtone.agency domain is verified in Resend dashboard'
      ]
    }
  });
}