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
    // Receber os dados do formulário de orçamento
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

    // Exibir os dados no log do console
    console.log('=== DADOS DO FORMULÁRIO DE ORÇAMENTO ===');
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Telefone:', telefone);
    console.log('Empresa:', empresa);
    console.log('Setor:', setor);
    console.log('Tipo de Projeto:', tipoProj);
    console.log('Orçamento:', orcamento);
    console.log('Prazo:', prazo);
    console.log('Descrição:', descricao);
    console.log('Funcionalidades:', funcionalidades);
    console.log('Retentor:', retentor);
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