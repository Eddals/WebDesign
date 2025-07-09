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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Estimate Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">DevTone Agency</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Professional Web Development</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Estimate Request Received!</h2>
          
          <p>Hello <strong>${name}</strong>,</p>
          
          <p>Thank you for your interest in DevTone Agency! We've received your project estimate request and our team will review it carefully.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Project Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 8px;"><strong>Name:</strong> ${name}</li>
              <li style="margin-bottom: 8px;"><strong>Company:</strong> ${company || 'Not specified'}</li>
              <li style="margin-bottom: 8px;"><strong>Industry:</strong> ${industry || 'Not specified'}</li>
              <li style="margin-bottom: 8px;"><strong>Project Type:</strong> ${projectType}</li>
              <li style="margin-bottom: 8px;"><strong>Budget Range:</strong> ${budget}</li>
              <li style="margin-bottom: 8px;"><strong>Timeline:</strong> ${timeline}</li>
              <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone || 'Not provided'}</li>
              ${description ? `<li style="margin-bottom: 8px;"><strong>Description:</strong> ${description}</li>` : ''}
              ${features && features.length > 0 ? 
                `<li style="margin-bottom: 8px;"><strong>Features:</strong> ${features.join(', ')}</li>` : 
                ''
              }
              ${retainer && retainer !== 'none' ? `<li style="margin-bottom: 8px;"><strong>Monthly Retainer:</strong> ${retainer}</li>` : ''}
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">What Happens Next?</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our team will review your requirements (2-4 hours)</li>
              <li style="margin-bottom: 8px;">We'll prepare a detailed proposal with pricing (within 24 hours)</li>
              <li style="margin-bottom: 8px;">Schedule a consultation call to discuss details (within 48 hours)</li>
              <li style="margin-bottom: 8px;">Finalize the project scope and timeline</li>
            </ol>
          </div>
          
          <p>We're excited about the possibility of working with you and will be in touch soon!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0;"><strong>Best regards,</strong><br>
            The DevTone Team</p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              📧 team@devtone.agency<br>
              🌐 devtone.agency
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This email was sent because you requested an estimate from DevTone Agency.</p>
        </div>
      </body>
      </html>
    `;

    // Preparar dados para envio
    const emailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: email,
          name: name
        }
      ],
      subject: `Estimate Confirmation - ${projectType}`,
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