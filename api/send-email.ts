// api/send-email.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const { to, subject, htmlContent, name } = req.body

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY || '',
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { 
          name: 'Devtone Agency', 
          email: 'team@devtone.agency' // email validado no Brevo
        },
        to: [{ email: to, name: name || '' }],
        subject,
        htmlContent
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Brevo API error:', data)
      return res.status(response.status).json({ 
        message: 'Erro ao enviar e-mail', 
        error: data 
      })
    }

    return res.status(200).json({ 
      message: 'E-mail enviado com sucesso!', 
      data 
    })
  } catch (error) {
    console.error('Send email error:', error)
    return res.status(500).json({ 
      message: 'Erro interno do servidor', 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}