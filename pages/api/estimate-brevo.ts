import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    email,
    nome,
    company,
    industry,
    projectType,
    budget,
    timeline,
    features,
    retainer
  } = req.body

  if (!email || !nome) {
    return res.status(400).json({ error: 'Email and nome are required' })
  }

  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'BREVO_API_KEY environment variable is not configured' })
  }

  try {
    // 1. Cria ou atualiza o contato com os atributos
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: nome,
          COMPANY: company || 'Not provided',
          INDUSTRY: industry || 'Not provided',
          PROJECTTYPE: projectType || 'Not provided',
          BUDGET: budget || 'Not provided',
          TIMELINE: timeline || 'Not provided',
          FEATURES: features ? features.join(', ') : 'Not provided',
          RETAINER: retainer || 'Not provided'
        },
        updateEnabled: true // Atualiza se já existir
      })
    })

    if (!contactResponse.ok) {
      const err = await contactResponse.json()
      console.error('Erro ao salvar contato:', err)
      return res.status(500).json({ error: 'Erro ao salvar contato', details: err })
    }

    console.log('Contato salvo/atualizado com sucesso')

    // 2. Envia o e-mail com o template ID #2
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: [{ email, name: nome }],
        templateId: 2,
        params: {
          EMAIL: email,
          FIRSTNAME: nome,
          COMPANY: company || 'Not provided',
          INDUSTRY: industry || 'Not provided',
          PROJECTTYPE: projectType || 'Not provided',
          BUDGET: budget || 'Not provided',
          TIMELINE: timeline || 'Not provided',
          FEATURES: features ? features.join(', ') : 'Not provided',
          RETAINER: retainer || 'Not provided'
        }
      })
    })

    if (!emailResponse.ok) {
      const err = await emailResponse.json()
      console.error('Erro ao enviar e-mail:', err)
      return res.status(500).json({ error: 'Erro ao enviar e-mail', details: err })
    }

    console.log('E-mail enviado com sucesso usando template #2')

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Erro geral:', error)
    res.status(500).json({ 
      error: error.message,
      details: error.toString()
    })
  }
} 