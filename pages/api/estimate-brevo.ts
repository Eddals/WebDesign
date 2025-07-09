import { NextApiRequest, NextApiResponse } from 'next';

interface EstimateFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
  retainer: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Aceitar somente requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Log dos dados recebidos
    console.log('📥 Dados recebidos na API:', req.body);

    // Receber os dados do formulário
    const {
      name,
      email,
      phone,
      company,
      industry,
      projectType,
      budget,
      timeline,
      description,
      features,
      retainer
    }: EstimateFormData = req.body;

    // Verificar se os campos obrigatórios estão presentes
    if (!name || !email || !projectType) {
      console.error('❌ Campos obrigatórios faltando:', { name, email, projectType });
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando: name, email, projectType'
      });
    }

    // Verificar se a chave da API Brevo está configurada
    const brevoApiKey = process.env.BREVO_API_KEY || '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';
    
    console.log('🔑 Usando API Key:', brevoApiKey ? 'Configurada' : 'Não configurada');
    
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY não está configurada');
      return res.status(500).json({
        success: false,
        error: 'Configuração de email não encontrada'
      });
    }

    // Preparar o conteúdo do email
    const emailContent = `
      <h2>Confirmação de Orçamento Recebido</h2>
      
      <p>Olá <strong>${name}</strong>,</p>
      
      <p>Recebemos sua solicitação de orçamento e entraremos em contato em breve!</p>
      
      <h3>Detalhes do Projeto:</h3>
      <ul>
        <li><strong>Nome:</strong> ${name}</li>
        <li><strong>Empresa:</strong> ${company}</li>
        <li><strong>Tipo de Projeto:</strong> ${projectType}</li>
        <li><strong>Descrição:</strong> ${description}</li>
        <li><strong>Orçamento:</strong> ${budget}</li>
        <li><strong>Prazo:</strong> ${timeline}</li>
        ${features && features.length > 0 ? 
          `<li><strong>Funcionalidades:</strong> ${features.join(', ')}</li>` : 
          ''
        }
      </ul>
      
      <p>Nossa equipe analisará sua solicitação e retornará com uma proposta personalizada.</p>
      
      <p>Atenciosamente,<br>
      Equipe DevTone</p>
    `;

    // Preparar dados para envio
    const emailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'noreply@devtone.agency'
      },
      to: [
        {
          email: email,
          name: name
        }
      ],
      subject: `Confirmação de Orçamento - ${projectType}`,
      htmlContent: emailContent
    };

    console.log('📧 Preparando envio de email para:', email);
    console.log('📋 Dados do email:', JSON.stringify(emailData, null, 2));

    // Enviar email via API Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(emailData)
    });

    console.log('📤 Status da resposta Brevo:', brevoResponse.status);

    // Verificar se o email foi enviado com sucesso
    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error('Erro ao enviar email via Brevo:', errorData);
      
      return res.status(500).json({
        success: false,
        error: 'Falha ao enviar email de confirmação',
        details: errorData
      });
    }

    const responseData = await brevoResponse.json();
    console.log('Email enviado com sucesso via Brevo:', responseData);

    // Criar/Atualizar contato no Brevo com ID da lista #7
    try {
      console.log('👤 Criando/atualizando contato no Brevo...');
      
      const contactData = {
        email: email,
        attributes: {
          FIRSTNAME: name.split(' ')[0] || name,
          LASTNAME: name.split(' ').slice(1).join(' ') || '',
          SMS: phone || '',
          COMPANY: company || '',
          INDUSTRY: industry || '',
          PROJECTTYPE: projectType || '',
          BUDGET: budget || '',
          TIMELINE: timeline || '',
          DESCRIPTION: description || '',
          FEATURES: features && features.length > 0 ? features.join(', ') : '',
          RETAINER: retainer || ''
        },
        listIds: [7], // ID da lista para estimate
        updateEnabled: true
      };

      console.log('📋 Dados do contato:', JSON.stringify(contactData, null, 2));

      const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify(contactData)
      });

      console.log('👤 Status da criação do contato:', contactResponse.status);

      if (contactResponse.ok) {
        const contactResult = await contactResponse.json();
        console.log('✅ Contato criado/atualizado com sucesso:', contactResult);
      } else {
        const contactError = await contactResponse.text();
        console.log('⚠️ Aviso: Falha ao criar contato (não crítico):', contactError);
      }

    } catch (contactError) {
      console.log('⚠️ Aviso: Erro ao criar contato (não crítico):', contactError);
    }

    // Retornar sucesso
    return res.status(200).json({
      success: true,
      message: 'Email de confirmação enviado com sucesso',
      messageId: responseData.messageId
    });

  } catch (error) {
    console.error('Erro interno ao processar solicitação:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}