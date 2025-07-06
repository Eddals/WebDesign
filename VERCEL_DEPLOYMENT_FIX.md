# 🚀 Correção do Deployment Vercel - Erro 405

## 🚨 Problema Identificado
```
POST https://devtone.agency/api/send-brevo-email 405 (Method Not Allowed)
```

O erro 405 está acontecendo no Vercel porque os endpoints da API não estão sendo reconhecidos corretamente como serverless functions.

## 🔧 Soluções Implementadas

### 1. **Configuração do Vercel Corrigida** (`vercel.json`)
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

### 2. **Script de Build Personalizado** (`vercel-build.js`)
- ✅ Verifica se os arquivos da API existem
- ✅ Cria endpoint de health check
- ✅ Garante configuração correta

### 3. **Endpoints de Teste**
- ✅ `api/vercel-test.js` - Teste específico do Vercel
- ✅ `api/health.js` - Health check automático
- ✅ `api/test-endpoint.js` - Teste geral

## 🧪 Como Testar no Vercel

### 1. **Teste Básico do Vercel**
```bash
# Teste se o Vercel está funcionando
curl https://devtone.agency/api/vercel-test
```

### 2. **Teste via Console do Navegador**
```javascript
// Teste básico do Vercel
fetch('https://devtone.agency/api/vercel-test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err));

// Teste do endpoint Brevo
fetch('https://devtone.agency/api/send-brevo-email', {
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
```

### 3. **Teste do Endpoint Simples**
```javascript
// Use o endpoint simples se o original falhar
fetch('https://devtone.agency/api/send-brevo-email-simple', {
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
```

## 🔄 Passos para Deploy

### 1. **Commit das Mudanças**
```bash
git add .
git commit -m "Fix Vercel deployment - API endpoints configuration"
git push origin main
```

### 2. **Verificar no Vercel Dashboard**
- Acesse: https://vercel.com/dashboard
- Vá para o projeto `devtone-website`
- Verifique se o deploy foi bem-sucedido
- Confirme se os logs mostram os endpoints sendo reconhecidos

### 3. **Verificar Variáveis de Ambiente**
No Vercel Dashboard:
- Vá em Settings > Environment Variables
- Confirme que `BREVO_API_KEY` está configurada
- Confirme que `NODE_ENV` está como `production`

## 🚀 Solução Alternativa

Se o problema persistir, use o endpoint simples que não depende do SDK:

### Atualizar o Frontend
```typescript
// Em src/lib/brevo-email-service.ts, mude a URL:
const response = await fetch('/api/send-brevo-email-simple', {
  // ... resto do código
});
```

## 📋 Checklist de Verificação

### ✅ Antes do Deploy
- [x] `vercel.json` configurado corretamente
- [x] `vercel-build.js` criado
- [x] Endpoints de teste criados
- [x] Dependências no `package.json`

### ✅ Após o Deploy
- [ ] Teste `/api/vercel-test` - deve retornar 200
- [ ] Teste `/api/health` - deve retornar status healthy
- [ ] Teste `/api/send-brevo-email` - deve aceitar POST
- [ ] Verifique logs no Vercel Dashboard

### ✅ Se Ainda Falhar
- [ ] Use `/api/send-brevo-email-simple`
- [ ] Verifique variáveis de ambiente
- [ ] Teste localmente com `vercel dev`

## 🔍 Debugging

### 1. **Verificar Logs do Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Ver logs
vercel logs devtone.agency
```

### 2. **Teste Local com Vercel**
```bash
# Teste local
vercel dev

# Teste os endpoints localmente
curl http://localhost:3000/api/vercel-test
```

### 3. **Verificar Build**
```bash
# Build local
npm run build

# Verificar se os arquivos foram criados
ls -la dist/
ls -la api/
```

## 🎯 Resultado Esperado

Após as correções:
- ✅ **Erro 405**: Resolvido - endpoints reconhecidos como serverless functions
- ✅ **Build**: Configurado corretamente para Vercel
- ✅ **Logs**: Detalhados para debugging
- ✅ **Fallbacks**: Múltiplas opções de endpoint

---

**Status**: ✅ **CONFIGURAÇÃO VERCEL CORRIGIDA**
**Próximo passo**: Fazer deploy e testar os endpoints 

# Correção do Erro de Runtime no Vercel

## 🚨 Erro Identificado
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

## 🔧 Correções Aplicadas

### 1. vercel.json Corrigido
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

### 2. Removido node-fetch
- Substituído por fetch nativo (disponível no Node.js 18+)
- Removido import `node-fetch` dos endpoints

### 3. package.json Atualizado
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 4. .vercelignore Criado
- Exclui arquivos desnecessários do deploy
- Otimiza o build

## 🚀 Deploy

### 1. Commit das Correções
```bash
git add .
git commit -m "Fix Vercel runtime error and remove node-fetch dependency"
git push origin main
```

### 2. Verificar no Vercel
1. Acesse o painel do Vercel
2. Vá para o projeto
3. Verifique se o deploy foi bem-sucedido
4. Confirme que não há erros de build

### 3. Testar Endpoints
1. **Health Check**: `https://devtone.agency/api/health`
2. **Contact**: `https://devtone.agency/api/contact-brevo`
3. **Estimate**: `https://devtone.agency/api/estimate-brevo`

## 🔍 Verificações

### Build Logs
- ✅ Sem erros de runtime
- ✅ APIs sendo buildadas corretamente
- ✅ Vite build funcionando

### Function Logs
- ✅ Endpoints respondendo
- ✅ CORS funcionando
- ✅ Brevo API conectando

### Site Funcionando
- ✅ Formulários enviando
- ✅ Emails chegando
- ✅ Sem erros 405

## 📋 Checklist Final

- [ ] vercel.json com builds corretos
- [ ] node-fetch removido
- [ ] package.json com engines
- [ ] .vercelignore configurado
- [ ] Deploy sem erros
- [ ] Health check funcionando
- [ ] Formulários funcionando
- [ ] Emails sendo enviados

## 🛠️ Se Ainda Houver Problemas

### 1. Verificar Versão do Node.js
No Vercel, confirme que está usando Node.js 18+

### 2. Limpar Cache
```bash
# No Vercel, vá em Settings > General > Clear Build Cache
```

### 3. Rebuild Manual
No Vercel, force um novo deploy

### 4. Verificar Dependências
Confirme que todas as dependências estão em `dependencies` e não em `devDependencies`

---

**Status**: 🔧 Corrigindo erro de runtime
**Última atualização**: $(date) 