
// ✅ Este código contém o formulário + envio automático para a API do Brevo dentro do próprio componente Estimate
// 🔒 Certifique-se de que a variável BREVO_API_KEY está definida no painel de variáveis da Vercel
// 📂 Coloque esse arquivo em: pages/api/estimate-brevo.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

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
  } = req.body;

  const htmlContent = `
    <h2>New Estimate Request from ${name}</h2>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Industry:</strong> ${industry}</p>
    <p><strong>Project Type:</strong> ${projectType}</p>
    <p><strong>Budget:</strong> ${budget}</p>
    <p><strong>Timeline:</strong> ${timeline}</p>
    <p><strong>Retainer:</strong> ${retainer}</p>
    <p><strong>Features:</strong> ${features?.join(', ')}</p>
    <p><strong>Description:</strong></p>
    <p>${description}</p>
  `;

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'Devtone Agency',
          email: 'noreply@devtone.agency'
        },
        to: [{ email: email, name: name }],
        subject: `Estimate Request Confirmation - ${projectType}`,
        htmlContent
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY || '',
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      }
    );

    return res.status(200).json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Brevo error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'Failed to send email via Brevo' });
  }
}
