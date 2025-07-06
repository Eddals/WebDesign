# Debug do Erro 405 no Vercel

## 🚨 Problema Identificado
- **Erro**: 405 Method Not Allowed
- **Localização**: `/api/contact-brevo`
- **Sintoma**: "Unexpected end of JSON input"

## 🔧 Correções Aplicadas

### 1. CORS Melhorado
```javascript
// Antes
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

// Depois  
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
res.setHeader('Access-Control-Max-Age', '86400');
```

### 2. Tratamento de Erros Melhorado
```javascript
// Adicionado fallback para JSON inválido
try {
  return res.status(500).json({ ... });
} catch (jsonError) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(500).end(JSON.stringify({ ... }));
}
```

### 3. vercel.json Simplificado
```json
{
  "version": 2,
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🧪 Testes para Fazer

### 1. Teste de Health Check
Acesse: `https://devtone.agency/api/health`

**Resultado esperado:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-...",
  "method": "GET",
  "environment": "production"
}
```

### 2. Teste de CORS
No console do navegador, execute:
```javascript
fetch('https://devtone.agency/api/health', {
  method: 'OPTIONS',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(r => console.log('Status:', r.status));
```

**Resultado esperado:** Status 200

### 3. Teste do Contact Form
Acesse: `https://devtone.agency/contact`

Preencha o formulário e envie. Verifique:
- Console do navegador para erros
- Network tab para ver a requisição
- Logs no Vercel

## 🔍 Como Verificar Logs no Vercel

1. Acesse o painel do Vercel
2. Vá para o projeto
3. Clique em "Functions"
4. Procure por `contact-brevo` ou `estimate-brevo`
5. Clique no endpoint
6. Verifique os logs em tempo real

## 🛠️ Possíveis Causas do Erro 405

### 1. Problema de Roteamento
- O Vercel não está roteando corretamente para a função
- Solução: vercel.json simplificado

### 2. Problema de CORS
- Preflight OPTIONS não está sendo tratado
- Solução: CORS headers melhorados

### 3. Problema de Runtime
- Node.js version incompatível
- Solução: Especificado nodejs18.x

### 4. Problema de Build
- Função não está sendo buildada corretamente
- Solução: Verificar logs de build no Vercel

## 📋 Checklist de Verificação

- [ ] Health check funciona (`/api/health`)
- [ ] CORS preflight funciona (OPTIONS)
- [ ] Contact form envia requisição POST
- [ ] Estimate form envia requisição POST
- [ ] Logs aparecem no Vercel
- [ ] Emails são enviados pelo Brevo

## 🚀 Próximos Passos

1. **Deploy as correções:**
   ```bash
   git add .
   git commit -m "Fix 405 error and improve CORS handling"
   git push origin main
   ```

2. **Aguarde o deploy automático**

3. **Teste os endpoints:**
   - `/api/health`
   - `/api/contact-brevo`
   - `/api/estimate-brevo`

4. **Verifique os logs no Vercel**

5. **Teste os formulários no site**

## 📞 Se o Problema Persistir

1. Verifique se as variáveis de ambiente estão configuradas no Vercel
2. Confirme se o domínio está apontando corretamente
3. Verifique se não há cache do navegador
4. Teste em modo incógnito
5. Verifique se o Brevo está funcionando com o endpoint de teste

---

**Status**: 🔧 Corrigindo erro 405
**Última atualização**: $(date) 