# 🔧 Guia de Correção - Erro 405 Brevo Email

## 🚨 Problema Identificado
```
api/send-brevo-email:1 Failed to load resource: 405
SyntaxError: Unexpected end of JSON input
```

## 🔍 Análise do Erro

### Erro 405 (Método não permitido)
- **Causa**: O endpoint está recebendo uma requisição GET em vez de POST
- **Solução**: Garantir que todas as requisições sejam feitas como POST

### SyntaxError: Unexpected end of JSON input
- **Causa**: Tentativa de ler `.json()` de uma resposta vazia ou inválida
- **Solução**: Melhorar o tratamento de erros no frontend

## ✅ Soluções Implementadas

### 1. Endpoint Original Corrigido
**Arquivo**: `api/send-brevo-email.js`
- ✅ Verificação de método HTTP
- ✅ Tratamento de CORS
- ✅ Validação de campos obrigatórios
- ✅ Resposta JSON consistente

### 2. Endpoint Alternativo (Sem SDK)
**Arquivo**: `api/send-brevo-email-simple.js`
- ✅ Usa fetch diretamente em vez do SDK Brevo
- ✅ Menos dependências
- ✅ Melhor tratamento de erros

### 3. Endpoint de Teste
**Arquivo**: `api/test-endpoint.js`
- ✅ Para verificar se o problema é específico do Brevo
- ✅ Testa roteamento da API

### 4. Página de Teste
**Arquivo**: `test-brevo-endpoint.html`
- ✅ Interface para testar o endpoint
- ✅ Debug detalhado
- ✅ Informações de erro completas

## 🧪 Como Testar

### Opção 1: Usar a Página de Teste
1. Abra `test-brevo-endpoint.html` no navegador
2. Preencha os campos de teste
3. Clique em "Send Test Email"
4. Verifique as informações de debug

### Opção 2: Testar via Console
```javascript
// Teste do endpoint original
fetch('/api/send-brevo-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message'
  })
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err));

// Teste do endpoint simples
fetch('/api/send-brevo-email-simple', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message'
  })
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err));

// Teste do endpoint de teste
fetch('/api/test-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err));
```

## 🔧 Correções no Frontend

### 1. Melhorar Tratamento de Erros
```javascript
// Antes (problemático)
const response = await fetch('/api/send-brevo-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
const result = await response.json(); // Pode falhar se resposta não for JSON

// Depois (corrigido)
const response = await fetch('/api/send-brevo-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

let result;
try {
  const responseText = await response.text();
  result = JSON.parse(responseText);
} catch (parseError) {
  console.error('Failed to parse response:', parseError);
  result = { error: 'Invalid response format', rawText: responseText };
}
```

### 2. Verificar Método HTTP
```javascript
// Sempre usar POST para endpoints de envio de email
const response = await fetch('/api/send-brevo-email', {
  method: 'POST', // ✅ Correto
  // method: 'GET', // ❌ Errado - causa erro 405
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

## 🚀 Checklist de Verificação

### ✅ Backend
- [ ] Endpoint responde corretamente a requisições POST
- [ ] CORS configurado corretamente
- [ ] Validação de campos obrigatórios
- [ ] Resposta JSON consistente
- [ ] Tratamento de erros adequado

### ✅ Frontend
- [ ] Requisições feitas como POST
- [ ] Headers Content-Type definidos
- [ ] Body serializado com JSON.stringify()
- [ ] Tratamento de erros robusto
- [ ] Fallback para respostas não-JSON

### ✅ Configuração
- [ ] API Key da Brevo configurada
- [ ] Template ID correto (2)
- [ ] Domínios permitidos no CORS
- [ ] Variáveis de ambiente configuradas

## 🔄 Próximos Passos

1. **Teste o endpoint de teste**: `/api/test-endpoint`
2. **Se funcionar**: O problema é específico do Brevo
3. **Se não funcionar**: Problema de roteamento da API
4. **Use o endpoint simples**: `/api/send-brevo-email-simple`
5. **Verifique logs**: Console do navegador e logs do servidor

## 📞 Suporte

Se o problema persistir:
1. Verifique os logs do Vercel
2. Teste localmente com `npm run dev`
3. Verifique se a API Key da Brevo está ativa
4. Confirme se o template ID 2 existe na sua conta Brevo

---

**Status**: ✅ Soluções implementadas e prontas para teste
**Última atualização**: $(date) 