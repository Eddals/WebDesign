import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Extrair dados do formulário
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

  // Validar campos obrigatórios
  if (!email || !nome) {
    return res.status(400).json({ error: 'Email and nome are required' })
  }

  // Verificar se a API key está configurada
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'BREVO_API_KEY environment variable is not configured' })
  }

  try {
    console.log('Iniciando processo de salvamento do contato e envio de e-mail...')

    // Ação 1: Criar ou atualizar contato na Brevo
    console.log('Salvando contato na Brevo...')
    const contactData = {
      email: email,
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
      updateEnabled: true
    }

    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    })

    if (!contactResponse.ok) {
      const contactError = await contactResponse.json()
      console.error('Erro ao salvar contato:', contactError)
      return res.status(500).json({ 
        error: 'Erro ao salvar contato na Brevo', 
        details: contactError 
      })
    }

    console.log('Contato salvo/atualizado com sucesso na Brevo')

    // Ação 2: Enviar e-mail usando template #2
    console.log('Enviando e-mail usando template #2...')
    const emailData = {
      to: [{ email: email, name: nome }],
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
    }

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!emailResponse.ok) {
      const emailError = await emailResponse.json()
      console.error('Erro ao enviar e-mail:', emailError)
      return res.status(500).json({ 
        error: 'Erro ao enviar e-mail via template #2', 
        details: emailError 
      })
    }

    console.log('E-mail enviado com sucesso usando template #2')

    // Resposta de sucesso
    return res.status(200).json({ success: true })

  } catch (error: any) {
    console.error('Erro geral no processo:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    })
  }
} 