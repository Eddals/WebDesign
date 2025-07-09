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
    // Receber os dados do formulário de orçamento
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

    // Exibir os dados no log do console
    console.log('=== DADOS DO FORMULÁRIO DE ORÇAMENTO ===');
    console.log('Nome:', name);
    console.log('Email:', email);
    console.log('Telefone:', phone);
    console.log('Empresa:', company);
    console.log('Setor:', industry);
    console.log('Tipo de Projeto:', projectType);
    console.log('Orçamento:', budget);
    console.log('Prazo:', timeline);
    console.log('Descrição:', description);
    console.log('Funcionalidades:', features);
    console.log('Retentor:', retainer);
    console.log('Data/Hora:', new Date().toISOString());
    console.log('========================================');

    // Retornar resposta JSON de sucesso
    return res.status(200).json({
      success: true,
      message: 'Dados do orçamento recebidos com sucesso',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao processar dados do orçamento:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}