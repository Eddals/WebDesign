// Teste de envio direto para o webhook do HubSpot
import fetch from 'node-fetch';

async function testDirectHubSpotWebhook() {
  console.log('Testando envio direto para o webhook do HubSpot...');
  
  // Dados de teste
  const testData = {
    submittedAt: Date.now(),
    fields: [
      { name: "firstname", value: "Teste" },
      { name: "lastname", value: "Direto" },
      { name: "email", value: "teste.direto@example.com" },
      { name: "phone", value: "+1234567890" },
      { name: "company", value: "Empresa Teste" },
      { name: "country", value: "Brasil" },
      { name: "industry", value: "Tecnologia" },
      { name: "budget", value: "$5000" },
      { name: "timeline", value: "1-2 semanas" },
      { name: "message", value: "Esta é uma mensagem de teste direto para o webhook." },
      { name: "property_size", value: "100m²" },
      { name: "source", value: "teste_direto" }
    ],
    context: {
      pageUri: "teste-direto",
      pageName: "Teste Direto"
    }
  };
  
  try {
    console.log('Enviando dados de teste para o webhook do HubSpot...');
    
    const response = await fetch('https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Status da resposta:', response.status);
    
    let responseText;
    try {
      responseText = await response.text();
      console.log('Texto da resposta:', responseText);
    } catch (error) {
      console.error('Erro ao obter texto da resposta:', error);
    }
    
    if (response.ok) {
      console.log('✅ Teste bem-sucedido! O webhook do HubSpot está funcionando corretamente.');
    } else {
      console.error('❌ Teste falhou! O webhook do HubSpot retornou um erro.');
    }
  } catch (error) {
    console.error('Erro ao enviar dados de teste:', error);
  }
}

// Executar o teste
testDirectHubSpotWebhook();