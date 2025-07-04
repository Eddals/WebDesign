import type { NextApiRequest, NextApiResponse } from 'next';

// Definindo a interface para os dados do formulário
interface FormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  industry?: string;
}

// Definindo a interface para a resposta da API
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Verificar se o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Esta API aceita apenas o método POST'
    });
  }

  // Extrair dados do corpo da requisição
  const { name, email, phone, company, country, industry } = req.body as FormData;

  // Validar campos obrigatórios
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Os campos name e email são obrigatórios'
    });
  }

  try {
    // Configurar a requisição para o HubSpot
    const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const hubspotToken = 'pat-na2-0e94e7a3-5904-4247-ba2c-68dcf7c50c08';
    
    // Preparar os dados para envio
    const hubspotData = {
      properties: {
        firstname: name,
        email: email,
        phone: phone || '',
        company: company || '',
        country: country || '',
        industry: industry || ''
      }
    };

    // Enviar dados para o HubSpot
    const response = await fetch(hubspotUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hubspotToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hubspotData)
    });

    // Processar a resposta
    const data = await response.json();

    // Verificar se a requisição foi bem-sucedida
    if (!response.ok) {
      console.error('Erro na API do HubSpot:', data);
      return res.status(response.status).json({
        success: false,
        error: 'HubSpot API Error',
        message: data.message || 'Erro ao enviar dados para o HubSpot',
        data: data
      });
    }

    // Retornar sucesso
    return res.status(200).json({
      success: true,
      message: 'Contato criado com sucesso no HubSpot',
      data: data
    });
  } catch (error) {
    // Capturar e tratar erros inesperados
    console.error('Erro na integração com HubSpot:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Erro desconhecido ao processar a requisição'
    });
  }
}
