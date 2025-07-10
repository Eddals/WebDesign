export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, email, phone } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ error: 'First name and email are required' });
    }

    const payload = {
      email: email,
      attributes: {
        FIRSTNAME: firstName,
        ...(phone && phone.trim() && { SMS: phone.trim() })
      },
      listIds: [2],
      updateEnabled: true
    };

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || ''
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return res.status(200).json({ 
        success: true, 
        message: 'Thank you for subscribing! Check your email for confirmation.' 
      });
    } else {
      const errorData = await response.json();
      if (errorData.code === 'duplicate_parameter') {
        return res.status(400).json({ 
          success: false, 
          error: 'This phone number is already registered. Please use a different one or leave it blank.' 
        });
      } else if (errorData.message && errorData.message.includes('already exists')) {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already subscribed! We\'ll keep you updated.' 
        });
      } else {
        throw new Error('Subscription failed');
      }
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Something went wrong. Please try again.' 
    });
  }
}
