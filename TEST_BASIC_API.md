# Teste Básico da API - Passo a Passo

## 🧪 Teste Simples Implementado

### 1. API Simplificada
Criado `pages/api/contact-brevo.js` com teste básico:
```javascript
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method Not Allowed',
      method: req.method 
    });
  }

  // Basic test response
  res.status(200).json({ 
    success: true,
    message: 'Contact form received successfully',
    data: req.body,
    timestamp: new Date().toISOString()
  });
}
```

## 🚀 Teste Agora

### Passo 1: Deploy
```bash
git add .
git commit -m "Add basic API test for contact form"
git push origin main
```

### Passo 2: Aguardar Deploy
- Vá para o painel do Vercel
- Aguarde o deploy terminar
- Verifique se não há erros

### Passo 3: Testar com Postman/Insomnia
**URL:** `https://devtone.agency/api/contact-brevo`
**Method:** POST
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test Subject",
  "message": "Test Message"
}
```

### Passo 4: Resultado Esperado
```json
{
  "success": true,
  "message": "Contact form received successfully",
  "data": {
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test Message"
  },
  "timestamp": "2024-..."
}
```

### Passo 5: Testar no Site
Se o Postman funcionar, teste no site:
- Acesse: `https://devtone.agency/contact`
- Preencha o formulário
- Envie

## 🔍 Diagnóstico

### ✅ Se funcionar no Postman:
- API está funcionando
- Problema pode ser no frontend ou CORS

### ❌ Se não funcionar no Postman:
- Problema é na API
- Verificar logs no Vercel
- Verificar se o arquivo está em `pages/api/contact-brevo.js`

### ✅ Se funcionar no site:
- Tudo OK
- Podemos adicionar o código do Brevo

### ❌ Se não funcionar no site:
- Problema de CORS
- Verificar console do navegador

## 📋 Checklist

- [ ] Deploy realizado
- [ ] Postman test funcionando
- [ ] Site test funcionando
- [ ] Logs aparecendo no Vercel

## 🎯 Próximos Passos

1. **Teste com Postman primeiro**
2. **Se funcionar, teste no site**
3. **Me informe o resultado de cada teste**
4. **Se funcionar, adicionamos o código do Brevo**

---

**Status**: 🧪 Testando API básica
**Próximo**: Testar com Postman 