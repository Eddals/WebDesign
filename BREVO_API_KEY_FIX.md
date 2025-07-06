# 🔧 Fix Brevo API Key Error 401

## 🎯 Problema Identificado

**Erro 401 - "API Key is not enabled"**
- A API está funcionando (erro 405 resolvido! ✅)
- Agora o problema é com a chave do Brevo

## 🔧 Correções Aplicadas

### 1. ✅ vercel.json Corrigido
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

### 2. ✅ API Usando Templates Brevo
- Mudou de HTML direto para templates
- Usando `templateId: 5` para contact form
- Mais confiável que HTML customizado

### 3. ✅ Endpoint de Teste Criado
- `api/test-brevo-key.js` para testar a chave
- Verifica se a chave está ativa

## 🧪 Teste Agora

### Passo 1: Deploy
```bash
git add .
git commit -m "Fix vercel.json and Brevo API key issue"
git push origin main
```

### Passo 2: Teste a Chave do Brevo
**URL:** `https://devtone.agency/api/test-brevo-key`
**Method:** POST
**Body:** `{}`

### Passo 3: Teste Contact Form
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

### ✅ Chave Funcionando:
```json
{
  "success": true,
  "message": "Brevo API key is working!",
  "account": { ... }
}
```

### ❌ Chave com Problema:
```json
{
  "error": "Brevo API test failed: 401",
  "details": "{\"message\":\"API Key is not enabled\",\"code\":\"unauthorized\"}"
}
```

## 🚨 Se a Chave Não Funcionar

### Opções:

1. **Verificar no Brevo Dashboard:**
   - Acesse: https://app.brevo.com/settings/keys/api
   - Confirme se a chave está ativa
   - Verifique se tem permissões de SMTP

2. **Gerar Nova Chave:**
   - Delete a chave atual
   - Crie uma nova chave SMTP
   - Atualize no código

3. **Verificar Domínio:**
   - Confirme se `team@devtone.agency` está verificado
   - Verifique configurações de domínio

## 📋 Checklist

- [ ] Deploy realizado com sucesso
- [ ] `/api/test-brevo-key` funciona
- [ ] Chave do Brevo está ativa
- [ ] `/api/contact-brevo` envia emails
- [ ] Site funciona sem erros

## 🎯 Próximos Passos

1. **Deploy e aguarde terminar**
2. **Teste `/api/test-brevo-key` primeiro**
3. **Se funcionar, teste contact form**
4. **Me informe o resultado**

---

**Status**: 🔧 vercel.json corrigido + Brevo templates
**Próximo**: Testar chave do Brevo 