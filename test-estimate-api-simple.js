// Teste simples da API de estimate
const testData = {
  name: "João Silva",
  email: "joao@teste.com",
  phone: "(11) 99999-9999",
  company: "Empresa Teste",
  industry: "Tecnologia",
  projectType: "business",
  budget: "$1,500 - $5,000",
  timeline: "1 Month",
  description: "Preciso de um site profissional para minha empresa",
  features: ["contact_form", "seo", "gallery"],
  retainer: "none"
};

async function testEstimateAPI() {
  console.log('🧪 Testando API de Estimate...');
  console.log('📤 Dados de teste:', JSON.stringify(testData, null, 2));
  
  try {
    // Teste 1: Webhook
    console.log('\n1️⃣ Testando Webhook...');
    const webhookResponse = await fetch('http://localhost:3000/api/estimate-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Status Webhook:', webhookResponse.status);
    const webhookResult = await webhookResponse.json();
    console.log('📋 Resultado Webhook:', webhookResult);
    
    // Teste 2: Brevo
    console.log('\n2️⃣ Testando Brevo...');
    const brevoResponse = await fetch('http://localhost:3000/api/estimate-brevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Status Brevo:', brevoResponse.status);
    const brevoResult = await brevoResponse.json();
    console.log('📋 Resultado Brevo:', brevoResult);
    
    if (brevoResponse.ok && brevoResult.success) {
      console.log('\n✅ SUCESSO! Email enviado via Brevo');
    } else {
      console.log('\n❌ ERRO! Falha ao enviar email via Brevo');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste se for chamado diretamente
if (typeof window === 'undefined') {
  testEstimateAPI();
}

// Exportar para uso em browser
if (typeof window !== 'undefined') {
  window.testEstimateAPI = testEstimateAPI;
}