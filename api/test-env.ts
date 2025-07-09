export default async function handler(req, res) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    
    return res.status(200).json({
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyStart: apiKey ? apiKey.substring(0, 10) + '...' : 'Not found',
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('BREVO'))
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}