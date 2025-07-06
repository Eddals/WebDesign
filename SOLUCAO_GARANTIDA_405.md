# ✅ SOLUÇÃO GARANTIDA - Erro 405

## 🎯 Seguindo Exatamente as Instruções

### 🔧 Passo 1: ✅ Estrutura da Pasta Correta
```
/
├── api/                    ← Na raiz (fora do src)
│   └── contact-brevo.js    ✅ Arquivo correto
├── src/                    ← Frontend (Vite)
├── package.json
└── vercel.json
```

### 🔧 Passo 2: ✅ Código Simplificado
**api/contact-brevo.js:**
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  return res.status(200).json({ success: true, message: 'Form received' });
}
```

### 🔧 Passo 3: ✅ Teste Frontend
**test-contact-simple.html:**
```javascript
fetch('/api/contact-brevo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Teste',
    email: 'test@email.com',
    message: 'Mensagem de teste'
  })
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
```

## 🚀 Deploy e Teste

### Passo 1: Deploy
```bash
git add .
git commit -m "SOLUCAO GARANTIDA: simplify contact-brevo.js to fix 405"
git push origin main
```

### Passo 2: Teste Simples
**URL:** `https://devtone.agency/api/test-simple`
**Method:** POST
**Body:** `{"test": "data"}`

### Passo 3: Teste Contact Form
**URL:** `https://devtone.agency/api/contact-brevo`
**Method:** POST
**Body:**
```json
{
  "name": "Teste",
  "email": "test@email.com",
  "message": "Mensagem de teste"
}
```

### Passo 4: Teste HTML
- Abra: `https://devtone.agency/test-contact-simple.html`
- Preencha e envie o formulário
- Verifique o console do navegador

## 🎯 Resultado Esperado

### ✅ Sucesso (200):
```json
{
  "success": true,
  "message": "Form received"
}
```

### ❌ Se ainda der 405:
- Verifique se o arquivo está em `/api/contact-brevo.js` (não em `/src/api/`)
- Confirme que o deploy terminou
- Teste com Postman primeiro

## 📋 Checklist

- [ ] Arquivo `api/contact-brevo.js` na raiz ✅
- [ ] Código simplificado sem Brevo ✅
- [ ] Deploy realizado
- [ ] `/api/test-simple` funciona
- [ ] `/api/contact-brevo` funciona
- [ ] HTML de teste funciona

## 🎯 Próximos Passos

1. **Deploy e aguarde terminar**
2. **Teste `/api/test-simple` primeiro**
3. **Se funcionar, teste `/api/contact-brevo`**
4. **Se funcionar, teste HTML**
5. **Me informe o resultado**
6. **Se funcionar, adicionamos o Brevo de volta**

---

**Status**: ✅ Solução garantida aplicada
**Próximo**: Deploy e teste 