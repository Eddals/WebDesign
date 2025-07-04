import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Esta rota é apenas para teste
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Dados de teste para enviar ao HubSpot
  const testData = {
    name: 'Teste API',
    email: 'teste@example.com',
    phone: '123456789',
    company: 'Empresa Teste',
    country: 'Brasil',
    industry: 'Tecnologia'
  };

  try {
    // Fazer uma chamada para a API do HubSpot
    // Usando URL absoluta para garantir que a chamada funcione
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const apiUrl = `${protocol}://${host}/api/hubspot`;
    
    console.log('Chamando API do HubSpot em:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    // Processar a resposta
    const data = await response.json();

    // Retornar os resultados
    return res.status(200).json({
      success: true,
      message: 'Teste da API do HubSpot',
      requestData: testData,
      responseStatus: response.status,
      responseData: data
    });
  } catch (error) {
    console.error('Erro no teste da API do HubSpot:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}