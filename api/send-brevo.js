export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { firstName, email, phone } = req.body

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify({
        email,
        phone: phone || '',
        attributes: { 
          FIRSTNAME: firstName
        },
        listIds: [2],
        updateEnabled: true
      })
    })

    if (response.ok) {
      res.status(200).json({ success: true })
    } else {
      throw new Error('Brevo API error')
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' })
  }
}