# ✅ Solução Final - Erro 405

## 🎯 Seguindo Exatamente as Instruções

### 1. ✅ Estrutura Correta
```
devtone-agency/
├─ api/
│  └─ contact-brevo.js ✅ (na raiz, fora do src)
├─ src/
│  └─ ...
├─ index.html
├─ vite.config.js
└─ vercel.json
```

### 2. ✅ Código Simplificado (`api/contact-brevo.js`)
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, subject, message } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': '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',
      },
      body: JSON.stringify({
        sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
        to: [{ email: 'team@devtone.agency' }],
        subject: `New contact: ${subject}`,
        htmlContent: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### 3. ✅ vercel.json Simplificado
```json
{
  "functions": {
    "api/contact-brevo.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 🚀 Deploy e Teste

### Passo 1: Deploy
```bash
git add .
git commit -m "Fix 405: simplify API code and vercel.json"
git push origin main
```

### Passo 2: Teste com Postman
**URL:** `https://devtone.agency/api/contact-brevo`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "123456789",
  "company": "Test Company",
  "subject": "Test Subject",
  "message": "Test message content"
}
```

### Passo 3: Teste Simples
**URL:** `https://devtone.agency/api/test-simple`
**Method:** POST
**Body:** `{"test": "data"}`

## 🎯 Respostas Esperadas

### ✅ Sucesso (200):
```json
{
  "success": true
}
```

### ❌ Erro 405 (se ainda houver problema):
```json
{
  "error": "Method not allowed"
}
```

## 📋 Checklist

- [ ] Arquivo `api/contact-brevo.js` na raiz ✅
- [ ] Código simplificado sem CORS complexo ✅
- [ ] vercel.json com runtime nodejs18.x ✅
- [ ] Deploy realizado
- [ ] Teste com Postman funcionando
- [ ] Site funcionando sem erro 405

## 🚨 Se Ainda Der 405

1. **Aguarde o deploy terminar completamente**
2. **Limpe cache do navegador**
3. **Teste com Postman primeiro**
4. **Verifique se a URL está correta: `https://devtone.agency/api/contact-brevo`**

## 🎯 Próximos Passos

1. **Deploy e aguarde terminar**
2. **Teste com Postman**
3. **Se funcionar, teste no site**
4. **Me informe o resultado**

---

**Status**: ✅ Código simplificado seguindo instruções
**Próximo**: Deploy e teste 