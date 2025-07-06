// 🧪 TESTE DIRETO NO CONSOLE DO NAVEGADOR
// Copie e cole este código no console do navegador (F12)

console.log('🧪 Iniciando teste do endpoint /api/contact-brevo...');

const testData = {
  name: 'Matheus',
  email: 'matheus@email.com',
  message: 'Testando'
};

console.log('📧 Dados de teste:', testData);

fetch('/api/contact-brevo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(res => {
  console.log('📊 Status da resposta:', res.status);
  console.log('📊 Status Text:', res.statusText);
  return res.json();
})
.then(data => {
  console.log('✅ Resposta de sucesso:', data);
})
.catch(error => {
  console.error('❌ Erro:', error);
});

// 🧪 TESTE ALTERNATIVO - Verificar se o endpoint existe
console.log('🔍 Verificando se o endpoint existe...');

fetch('/api/contact-brevo', {
  method: 'GET'
})
.then(res => {
  console.log('📊 GET Status:', res.status);
  console.log('📊 GET Status Text:', res.statusText);
  if (res.status === 405) {
    console.log('✅ Endpoint existe! (405 é esperado para GET)');
  } else {
    console.log('❓ Status inesperado:', res.status);
  }
})
.catch(error => {
  console.error('❌ Erro no teste GET:', error);
}); 