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
  debug?: any;
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

  // Log para debug
  console.log('Requisição recebida em /api/hubspot:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  // Extrair dados do corpo da requisição
  const { name, email, phone, company, country, industry } = req.body as FormData;

  // Log dos dados extraídos
  console.log('Dados extraídos:', { name, email, phone, company, country, industry });

  // Validar campos obrigatórios
  if (!name || !email) {
    console.error('Campos obrigatórios faltando:', { name, email });
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Os campos name e email são obrigatórios'
    });
  }

  try {
    // Configurar a requisição para o HubSpot
    const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
    // Token de API do HubSpot (Private App Token)
    const hubspotToken = 'pat-na2-0e94e7a3-5904-4247-ba2c-68dcf7c50c08';
    
    // Preparar os dados para envio conforme documentação do HubSpot
    // https://developers.hubspot.com/docs/api/crm/contacts
    
    // Dividir o nome completo em primeiro nome e sobrenome
    let firstname = name;
    let lastname = '';
    
    if (name && name.includes(' ')) {
      const nameParts = name.split(' ');
      firstname = nameParts[0];
      lastname = nameParts.slice(1).join(' ');
    }
    
    const hubspotData = {
      properties: {
        email: email,
        firstname: firstname,
        lastname: lastname || '',
        phone: phone || '',
        company: company || '',
        // Usando propriedades padrão do HubSpot quando possível
        // e mapeando as personalizadas conforme necessário
        country: country || '',
        industry: industry || ''
      }
    };

    // Log dos dados que serão enviados para o HubSpot
    console.log('Dados a serem enviados para o HubSpot:', hubspotData);

    // Enviar dados para o HubSpot
    // Garantir que o token está no formato correto: Bearer {token}
    const authHeader = `Bearer ${hubspotToken}`;
    console.log('Authorization Header:', authHeader.replace(/Bearer (.{5}).*/, 'Bearer $1*****')); // Log seguro do token
    
    // Configurar timeout para a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
    
    let response;
    try {
      response = await fetch(hubspotUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(hubspotData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Limpar o timeout se a requisição completar
    } catch (fetchError) {
      clearTimeout(timeoutId); // Limpar o timeout em caso de erro
      
      // Verificar se é um erro de timeout
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('A requisição para o HubSpot excedeu o tempo limite de 10 segundos');
      }
      
      // Repassar outros erros
      throw fetchError;
    }

    // Log da resposta do HubSpot
    console.log('Status da resposta do HubSpot:', response.status);
    
    // Processar a resposta
    const data = await response.json();
    console.log('Resposta do HubSpot:', data);

    // Verificar se a requisição foi bem-sucedida
    // HubSpot retorna 201 para criação bem-sucedida
    const isSuccess = response.status === 201 || response.status === 200;
    
    if (!isSuccess) {
      console.error('Erro na API do HubSpot:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      return res.status(response.status).json({
        success: false,
        error: 'HubSpot API Error',
        message: data.message || 'Erro ao enviar dados para o HubSpot',
        data: data,
        debug: {
          requestData: hubspotData,
          responseStatus: response.status,
          responseStatusText: response.statusText
        }
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
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar a requisição';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: errorMessage,
      debug: {
        stack: errorStack,
        errorObject: JSON.stringify(error)
      }
    });
  }
}
