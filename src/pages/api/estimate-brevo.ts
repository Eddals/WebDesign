import type { NextApiRequest, NextApiResponse } from 'next';
import Brevo from '@getbrevo/brevo';

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error('BREVO_API_KEY não está definida nas variáveis de ambiente.');
}

const brevoClient = Brevo.ApiClient.instance;
const apiKeyInstance = brevoClient.authentications['api-key'];
apiKeyInstance.apiKey = apiKey;

const emailApi = new Brevo.TransactionalEmailsApi();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Exemplo: espere receber { email, nome, ... } do formulário
    const { email, nome, ...rest } = req.body;
    if (!email || !nome) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    // Substitua pelos parâmetros do seu template #2
    const templateId = 2;
    const to = [{ email, name: nome }];
    const params = {
      NOME: nome,
      // Adicione outros parâmetros do template aqui, conforme necessário
      ...rest
    };

    const sendSmtpEmail = {
      to,
      templateId,
      params,
    };

    await emailApi.sendTransacEmail(sendSmtpEmail);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    // Log detalhado para debug
    console.error('Erro ao enviar e-mail Brevo:', error);
    if (error.response && error.response.body) {
      return res.status(500).json({ error: error.response.body });
    }
    return res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
} 