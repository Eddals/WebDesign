// netlify/functions/hubspot-webhook.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Verificar se é uma requisição POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  try {
    // Obter os dados do corpo da requisição
    const data = JSON.parse(event.body);
    const { webhookUrl, ...contactData } = data;

    // Verificar se a URL do webhook foi fornecida
    if (!webhookUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webhook URL is required' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log('Enviando dados para o webhook do HubSpot:', webhookUrl);
    console.log('Dados:', contactData);

    // Enviar os dados para o webhook do HubSpot
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    // Verificar a resposta do webhook
    const responseStatus = response.status;
    console.log('Status da resposta do webhook HubSpot:', responseStatus);

    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = { status: responseStatus };
    }

    // Retornar sucesso
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        hubspotStatus: responseStatus,
        hubspotResponse: responseBody
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error sending data to HubSpot webhook:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send data to HubSpot webhook',
        message: error.message
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};