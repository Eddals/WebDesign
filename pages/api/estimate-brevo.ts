import { NextApiRequest, NextApiResponse } from 'next';

interface EstimateFormData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  setor: string;
  tipoProj: string;
  orcamento: string;
  prazo: string;
  descricao: string;
  funcionalidades: string[];
  retentor: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Aceitar somente requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Receber os dados do formulário
    const {
      nome,
      email,
      telefone,
      empresa,
      setor,
      tipoProj,
      orcamento,
      prazo,
      descricao,
      funcionalidades,
      retentor
    }: EstimateFormData = req.body;

    // Verificar se a chave da API Brevo está configurada
    const brevoApiKey = process.env.BREVO_API_KEY || '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';
    
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
      
      <p>Olá <strong>${nome}</strong>,</p>
      
      <p>Recebemos sua solicitação de orçamento e entraremos em contato em breve!</p>
      
      <h3>Detalhes do Projeto:</h3>
      <ul>
        <li><strong>Nome:</strong> ${nome}</li>
        <li><strong>Empresa:</strong> ${empresa}</li>
        <li><strong>Tipo de Projeto:</strong> ${tipoProj}</li>
        <li><strong>Descrição:</strong> ${descricao}</li>
        <li><strong>Orçamento:</strong> ${orcamento}</li>
        <li><strong>Prazo:</strong> ${prazo}</li>
        ${funcionalidades && funcionalidades.length > 0 ? 
          `<li><strong>Funcionalidades:</strong> ${funcionalidades.join(', ')}</li>` : 
          ''
        }
      </ul>
      
      <p>Nossa equipe analisará sua solicitação e retornará com uma proposta personalizada.</p>
      
      <p>Atenciosamente,<br>
      Equipe DevTone</p>
    `;

    // Enviar email via API Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify({
        sender: {
          name: 'DevTone Agency',
          email: 'noreply@devtone.agency'
        },
        to: [
          {
            email: email,
            name: nome
          }
        ],
        subject: `Confirmação de Orçamento - ${tipoProj}`,
        htmlContent: emailContent
      })
    });

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