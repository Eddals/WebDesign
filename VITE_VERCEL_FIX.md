# 🔧 Correção Vite + Vercel - Erro 405

## ✅ Problema Identificado

**O projeto é Vite, não Next.js!** 
- Vercel não reconhece automaticamente `pages/api/` em projetos Vite
- Precisamos usar a pasta `api/` com configuração manual no `vercel.json`

## 🔧 Correções Aplicadas

### 1. **vercel.json Corrigido**
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
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
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

### 2. **APIs Movidas para pasta `api/`**
- ✅ `api/contact-brevo.js` - Contact form
- ✅ `api/test-simple.js` - Test endpoint
- ❌ Removidos arquivos de `pages/api/`

### 3. **Estrutura Correta para Vite**
```
/
├── api/
│   ├── contact-brevo.js    ← Serverless function
│   └── test-simple.js      ← Test endpoint
├── src/
├── vercel.json             ← Configuração Vercel
└── package.json
```

## 🧪 Teste Agora

### Passo 1: Deploy
```bash
git add .
git commit -m "Fix Vite + Vercel: move APIs to api/ folder and update vercel.json"
git push origin main
```

### Passo 2: Teste com Postman

#### Teste 1: Endpoint Simples
**URL:** `https://devtone.agency/api/test-simple`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "test": "data"
}
```

#### Teste 2: Contact Form
**URL:** `https://devtone.agency/api/contact-brevo`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test Subject",
  "message": "Test Message"
}
```

### Passo 3: Teste no Site
1. Acesse: `https://devtone.agency/contact`
2. Abra DevTools (F12)
3. Vá na aba Console
4. Preencha e envie o formulário
5. Verifique os logs

## 🎯 Respostas Esperadas

### ✅ Sucesso (200):
```json
{
  "success": true,
  "message": "Contact form received successfully",
  "data": { ... },
  "timestamp": "2024-..."
}
```

### ❌ Se ainda der 405:
- Aguarde o deploy terminar completamente
- Limpe cache do navegador
- Teste com Postman primeiro

## 📋 Checklist

- [ ] Deploy realizado com sucesso
- [ ] `/api/test-simple` responde com POST
- [ ] `/api/contact-brevo` responde com POST
- [ ] Site funciona sem erros 405
- [ ] Console mostra logs corretos

## 🚨 Debug se necessário

### Verificar se o deploy foi bem-sucedido:
1. Vá no dashboard do Vercel
2. Verifique se não há erros no build
3. Confirme que os arquivos `api/` foram deployados

### Teste local (opcional):
```bash
npm run dev
# Teste localmente se necessário
```

## 🎯 Próximos Passos

1. **Deploy e aguarde terminar**
2. **Teste com Postman primeiro**
3. **Se funcionar, teste no site**
4. **Me informe o resultado**
5. **Se funcionar, adicionamos o código do Brevo**

---

**Status**: 🔧 Correções aplicadas para Vite + Vercel
**Próximo**: Deploy e teste 