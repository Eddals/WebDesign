# 🧪 Teste Direto no Site

## 🎯 Como Testar no Site Principal

### Passo 1: Acesse o Site
- Vá para: https://devtone.agency
- Abra o DevTools (F12)
- Vá na aba Console

### Passo 2: Execute o Teste
Copie e cole este código no console:

```javascript
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
```

### Passo 3: Teste Alternativo
Execute também este código para verificar se o endpoint existe:

```javascript
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
```

## 🎯 Resultados Esperados

### ✅ Sucesso (200):
```
📊 Status da resposta: 200
✅ Resposta de sucesso: {success: true, msg: "Received!"}
```

### ❌ Erro 405 (método não permitido):
```
📊 Status da resposta: 405
❌ Erro: {error: "Method Not Allowed"}
```

### ❌ Erro 404 (endpoint não encontrado):
```
❌ Erro: Failed to fetch
```

### ✅ Endpoint Existe (GET):
```
📊 GET Status: 405
✅ Endpoint existe! (405 é esperado para GET)
```

## 🚨 Se Der 404

Se o endpoint não for encontrado (404), significa que:
1. O Vercel não está reconhecendo a pasta `api/`
2. O deploy não foi bem-sucedido
3. Precisa verificar o Vercel Dashboard

## 🚨 Se Der 405 no POST

Se der 405 no POST, mas 405 no GET, significa que:
1. O endpoint existe ✅
2. Mas não está aceitando POST ❌
3. Pode ser problema no código

## 📋 Próximos Passos

1. **Execute o teste no console**
2. **Me informe os resultados exatos**
3. **Se der 404, verifique o Vercel Dashboard**
4. **Se der 405, verifique o código**

---

**Status**: ✅ Script de teste criado
**Próximo**: Teste no console do site 