import type { NextApiRequest, NextApiResponse } from 'next';

// Importação dinâmica para evitar erro em build sem dependência
let Brevo: any;
try {
  Brevo = require('@getbrevo/brevo');
} catch (e) {
  // Se não instalado, retorna erro claro
}

// Chave fixa fornecida pelo usuário
const apiKey = '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';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!Brevo) {
    return res.status(500).json({ error: 'Dependência @getbrevo/brevo não instalada. Rode npm install @getbrevo/brevo' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key do Brevo não definida.' });
  }

  const brevoClient = Brevo.ApiClient.instance;
  const apiKeyInstance = brevoClient.authentications['api-key'];
  apiKeyInstance.apiKey = apiKey;
  const emailApi = new Brevo.TransactionalEmailsApi();

  try {
    // Espera receber pelo menos email e nome
    const { email, nome, ...params } = req.body;
    if (!email || !nome) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: email e nome.' });
    }

    const sendSmtpEmail = {
      to: [{ email, name: nome }],
      templateId: 2,
      params: { NOME: nome, ...params },
    };

    await emailApi.sendTransacEmail(sendSmtpEmail);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    // Log para debug
    console.error('Erro Brevo:', error);
    if (error.response && error.response.body) {
      return res.status(500).json({ error: error.response.body });
    }
    return res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
} 