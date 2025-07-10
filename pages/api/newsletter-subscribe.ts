import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Permitir apenas solicitações POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Obter dados do formulário
  const { firstName, email, phone } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: firstName or email' 
    });
  }

  // Simular sucesso
  return res.status(200).json({
    success: true,
    message: 'Successfully subscribed to newsletter'
  });
}