import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, nome, ...params } = req.body

  if (!email || !nome) {
    return res.status(400).json({ error: 'Email and nome are required' })
  }

  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({ error: 'BREVO_API_KEY environment variable is not configured' })
  }

  try {
    console.log('Sending email to:', email, 'with name:', nome)
    
    const emailData = {
      sender: { 
        name: 'DevTone Agency', 
        email: 'noreply@devtone.agency' 
      },
      to: [{ 
        email: email, 
        name: nome 
      }],
      templateId: 2,
      params: {
        EMAIL: email,
        FIRSTNAME: nome,
        COMPANY: params.company || 'Not provided',
        INDUSTRY: params.industry || 'Not provided',
        PROJECTTYPE: params.projectType || 'Not provided',
        BUDGET: params.budget || 'Not provided',
        TIMELINE: params.timeline || 'Not provided',
        FEATURES: params.features ? params.features.join(', ') : 'Not provided',
        RETAINER: params.retainer || 'Not provided'
      }
    }

    console.log('Email data:', JSON.stringify(emailData, null, 2))

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    const data = await response.json()
    console.log('Response data:', data)

    if (!response.ok) {
      console.error('Brevo API error response:', data)
      throw new Error(data.message || data.error || `HTTP ${response.status}`)
    }

    res.status(200).json({ success: true, data })
  } catch (error: any) {
    console.error('Brevo API error:', error)
    res.status(500).json({ 
      error: error.message,
      details: error.toString()
    })
  }
} 