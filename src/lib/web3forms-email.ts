/**
 * Solução Web3Forms - 100% gratuito e funciona imediatamente
 * Não precisa de configurações complexas
 */

interface Web3FormsData {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  description?: string;
}

/**
 * Enviar email via Web3Forms (solução mais simples)
 */
export const sendEmailWeb3Forms = async (data: Web3FormsData) => {
  try {
    console.log('📧 Enviando email via Web3Forms...');
    console.log('📋 Dados:', data);
    
    // Web3Forms - 100% gratuito, sem configuração
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: '4d3e1c88-798a-4a9d-9aed-cb87510bd171', // SUA CHAVE WEB3FORMS
        name: data.name,
        email: data.email,
        phone: data.phone || 'Não fornecido',
        project_type: data.projectType || 'Não especificado',
        budget: data.budget || 'Não especificado',
        timeline: data.timeline || 'Não especificado',
        description: data.description || 'Não fornecido',
        subject: 'Nova solicitação de orçamento - Devtone Agency'
      })
    });
    
    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Email enviado com sucesso via Web3Forms!');
      return {
        success: true,
        message: 'Email enviado com sucesso via Web3Forms',
        method: 'Web3Forms'
      };
    } else {
      const errorText = await response.text();
      console.error('❌ Erro Web3Forms:', errorText);
      return {
        success: false,
        error: `Web3Forms error: ${response.status}`,
        details: errorText
      };
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

/**
 * Enviar confirmação de estimativa via Web3Forms
 */
export const sendEstimateConfirmationWeb3Forms = async (formData: any) => {
  try {
    console.log('📧 Enviando confirmação de estimativa via Web3Forms...');
    
    const data: Web3FormsData = {
      name: formData.name || formData.full_name,
      email: formData.email,
      phone: formData.phone,
      projectType: formData.projectType || formData.service_type,
      budget: formData.budget || formData.estimated_budget,
      timeline: formData.timeline || formData.preferred_timeline,
      description: formData.description || formData.project_description
    };
    
    return await sendEmailWeb3Forms(data);
  } catch (error) {
    console.error('Error sending estimate confirmation via Web3Forms:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}; 