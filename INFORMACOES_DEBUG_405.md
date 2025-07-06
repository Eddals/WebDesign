# 📋 Informações para Debug - Erro 405

## 🎯 Estrutura das Pastas (Confirmada ✅)

```
devtone-agency/
├─ api/
│  └─ contact-brevo.js   ✅ <- Serverless function (na raiz, fora do src)
├─ src/                  ✅ <- Frontend (Vite)
├─ package.json          ✅
├─ vite.config.ts        ✅
└─ vercel.json           ✅
```

## 📄 Conteúdo Exato do contact-brevo.js

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Para teste básico
  return res.status(200).json({ success: true, msg: 'Received!' });
}
```

## 🧪 Teste com Postman

**URL:** `https://devtone.agency/api/contact-brevo`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "name": "Matheus",
  "email": "matheus@email.com",
  "message": "Testando"
}
```

## 🧪 Teste com Frontend

**Arquivo:** `test-contact-final.html`
**URL:** `https://devtone.agency/test-contact-final.html`

**Código JavaScript:**
```javascript
fetch('/api/contact-brevo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Matheus',
    email: 'matheus@email.com',
    message: 'Testando'
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
```

## 🎯 Resultado Esperado

### ✅ Sucesso (200):
```json
{
  "success": true,
  "msg": "Received!"
}
```

### ❌ Erro 400 (campos faltando):
```json
{
  "error": "Missing required fields"
}
```

### ❌ Erro 405 (método não permitido):
```json
{
  "error": "Method Not Allowed"
}
```

## 🚀 Deploy

```bash
git add .
git commit -m "Apply exact instructions for 405 fix"
git push origin main
```

## 📋 Checklist de Verificação

- [ ] Arquivo `api/contact-brevo.js` na raiz (fora do src) ✅
- [ ] Código exato aplicado ✅
- [ ] Deploy realizado
- [ ] Teste com Postman
- [ ] Teste com HTML
- [ ] Verificar console do navegador

## 🚨 Se Ainda Der 405

1. **Verifique no Vercel Dashboard:**
   - Vá em Deployments
   - Clique em "Redeploy"
   - Aguarde o deploy terminar

2. **Verifique os logs:**
   - Vercel Dashboard > Functions
   - Verifique se há erros

3. **Teste local (opcional):**
   ```bash
   npm run dev
   # Teste em http://localhost:5173/api/contact-brevo
   ```

---

**Status**: ✅ Estrutura e código corretos aplicados
**Próximo**: Deploy e teste 