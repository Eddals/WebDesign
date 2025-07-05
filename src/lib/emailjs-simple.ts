/**
 * Solução SIMPLES de email usando EmailJS
 * Funciona 100% sem complicações de API keys
 */

// Configuração EmailJS
const EMAILJS_SERVICE_ID = 'service_brevo_smtp';
const EMAILJS_TEMPLATE_ID = 'template_estimate_confirmation';
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // Você precisa criar uma conta no EmailJS

/**
 * Enviar email de confirmação de estimativa via EmailJS
 */
export const sendEstimateEmailSimple = async (formData: any) => {
  try {
    console.log('📧 Enviando email via EmailJS...');
    
    // Dados do formulário
    const templateParams = {
      to_name: formData.name || formData.full_name,
      to_email: formData.email,
      project_type: formData.projectType || formData.service_type || 'Não especificado',
      budget: formData.budget || formData.estimated_budget || 'Não especificado',
      timeline: formData.timeline || formData.preferred_timeline || 'Não especificado',
      description: formData.description || formData.project_description || 'Não fornecido',
      phone: formData.phone || 'Não fornecido'
    };

    console.log('📋 Parâmetros:', templateParams);

    // Enviar via EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams
      })
    });

    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Email enviado com sucesso via EmailJS!');
      return {
        success: true,
        message: 'Email enviado com sucesso',
        method: 'EmailJS'
      };
    } else {
      const errorText = await response.text();
      console.error('❌ Erro EmailJS:', errorText);
      return {
        success: false,
        error: `EmailJS error: ${response.status}`,
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
 * Solução alternativa usando Web3Forms (100% gratuito e simples)
 */
export const sendEstimateEmailWeb3Forms = async (formData: any) => {
  try {
    console.log('📧 Enviando email via Web3Forms...');
    
    // Web3Forms é 100% gratuito e não precisa de configuração
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: 'YOUR_WEB3FORMS_KEY', // Você precisa pegar uma chave gratuita em web3forms.com
        name: formData.name || formData.full_name,
        email: formData.email,
        phone: formData.phone,
        project_type: formData.projectType || formData.service_type,
        budget: formData.budget || formData.estimated_budget,
        timeline: formData.timeline || formData.preferred_timeline,
        description: formData.description || formData.project_description,
        subject: 'Nova solicitação de orçamento - Devtone Agency'
      })
    });

    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Email enviado com sucesso via Web3Forms!');
      return {
        success: true,
        message: 'Email enviado com sucesso',
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