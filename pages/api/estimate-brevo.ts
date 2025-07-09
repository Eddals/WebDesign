import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, nome, ...params } = req.body

  if (!email || !nome) {
    return res.status(400).json({ error: 'Email and nome are required' })
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': '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',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Devtone', email: 'team@devtone.agency' },
        to: [{ email, name: nome }],
        templateId: 2,
        params: {
          NOME: nome,
          ...params
        }
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Brevo error')

    res.status(200).json({ success: true, data })
  } catch (error: any) {
    console.error('Brevo API error:', error)
    res.status(500).json({ error: error.message })
  }
} 