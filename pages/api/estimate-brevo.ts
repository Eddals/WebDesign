import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, nome, ...params } = req.body

  if (!email || !nome) {
    return res.status(400).json({ error: 'Email and nome are required' })
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
      subject: `Olá ${nome}, seu orçamento foi recebido!`,
      htmlContent: `
        <h1>Olá ${nome}!</h1>
        <p>Recebemos seu pedido de orçamento com sucesso.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${params.phone || 'Não informado'}</p>
        <p><strong>Empresa:</strong> ${params.company || 'Não informado'}</p>
        <p><strong>Indústria:</strong> ${params.industry || 'Não informado'}</p>
        <p><strong>Tipo de Projeto:</strong> ${params.projectType || 'Não informado'}</p>
        <p><strong>Orçamento:</strong> ${params.budget || 'Não informado'}</p>
        <p><strong>Prazo:</strong> ${params.timeline || 'Não informado'}</p>
        <p><strong>Descrição:</strong> ${params.description || 'Não informado'}</p>
        <br>
        <p>Nossa equipe entrará em contato em até 24 horas!</p>
        <p>Atenciosamente,<br>Equipe DevTone</p>
      `
    }

    console.log('Email data:', JSON.stringify(emailData, null, 2))

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': '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',
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