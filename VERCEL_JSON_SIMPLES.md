# ✅ Vercel.json Simples Recriado

## 🎯 Configuração Correta

### ✅ vercel.json Simplificado
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
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

## 🔧 O que isso faz

### 1. ✅ Build Configuration
- Usa `@vercel/static-build` para Vite
- Output directory: `dist/`
- Baseado no `package.json`

### 2. ✅ Routing
- `filesystem` primeiro (para arquivos estáticos)
- Fallback para `index.html` (SPA routing)

### 3. ✅ API Detection
- Vercel detecta automaticamente a pasta `api/`
- Não precisa configurar manualmente as APIs

## 🚀 Deploy e Teste

### Passo 1: Deploy
```bash
git add .
git commit -m "Add simple vercel.json configuration"
git push origin main
```

### Passo 2: Teste Simples
**URL:** `https://devtone.agency/api/test-simple`
**Method:** POST
**Body:** `{"test": "data"}`

### Passo 3: Teste Brevo Key
**URL:** `https://devtone.agency/api/test-brevo-key`
**Method:** POST
**Body:** `{}`

### Passo 4: Teste Contact Form
**URL:** `https://devtone.agency/api/contact-brevo`
**Method:** POST
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

## 🎯 Respostas Esperadas

### ✅ Teste Simples (200):
```json
{
  "success": true,
  "message": "Test endpoint working!",
  "body": {"test": "data"}
}
```

### ✅ Brevo Key Funcionando (200):
```json
{
  "success": true,
  "message": "Brevo API key is working!",
  "account": { ... }
}
```

### ✅ Contact Form (200):
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

## 📋 Checklist

- [ ] Deploy realizado sem erros
- [ ] `/api/test-simple` funciona
- [ ] `/api/test-brevo-key` funciona
- [ ] `/api/contact-brevo` funciona
- [ ] Site funciona normalmente

## 🎯 Próximos Passos

1. **Deploy e aguarde terminar**
2. **Teste `/api/test-simple` primeiro**
3. **Se funcionar, teste `/api/test-brevo-key`**
4. **Se funcionar, teste contact form**
5. **Me informe o resultado**

---

**Status**: ✅ vercel.json simples recriado
**Próximo**: Deploy e teste 