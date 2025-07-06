# Debug - APIs não funcionam no Vercel

## 🚨 Problema Identificado
- Erro 405 Method Not Allowed
- Vercel retorna HTML em vez de JSON da API
- APIs não estão sendo reconhecidas como serverless functions

## 🔧 Correções Aplicadas

### 1. Removido vercel.json conflitante
- Deletado `api/vercel.json` que estava causando conflito

### 2. Atualizado vercel.json principal
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

### 3. Corrigido package.json
- Mudado `main` de `index.js` para `src/main.js`

### 4. Criado endpoint de teste simples
- `api/hello.js` - endpoint básico para teste

## 🧪 Teste Passo a Passo

### Passo 1: Deploy
```bash
git add .
git commit -m "Fix Vercel API recognition and remove conflicting files"
git push origin main
```

### Passo 2: Aguardar Deploy
- Vá para o painel do Vercel
- Aguarde o deploy terminar
- Verifique se não há erros

### Passo 3: Testar Endpoint Hello
Acesse: `https://devtone.agency/api/hello`

**Resultado esperado:**
```json
{
  "message": "Hello from API!"
}
```

### Passo 4: Se Funcionar, Testar Contact
Acesse: `https://devtone.agency/contact`

Preencha e envie o formulário.

## 🔍 Verificações no Vercel

### 1. Functions
- Vá em "Functions" no painel do Vercel
- Deve aparecer: `hello`, `contact-brevo`, `estimate-brevo`, etc.

### 2. Build Logs
- Verifique se não há erros de build
- Confirme que as APIs estão sendo buildadas

### 3. Function Logs
- Clique em cada função
- Verifique se há logs de execução

## 🛠️ Se Ainda Não Funcionar

### Opção 1: Estrutura Alternativa
Mover as APIs para uma estrutura diferente:
```
pages/api/contact-brevo.js
pages/api/estimate-brevo.js
```

### Opção 2: Configuração Manual
Forçar configuração manual no Vercel:
1. Vá em Settings > General
2. Configure "Build Command" manualmente
3. Configure "Output Directory" como "dist"

### Opção 3: Verificar Domínio
- Confirme que o domínio está apontando corretamente
- Verifique se não há cache do CDN

## 📋 Checklist

- [ ] vercel.json sem conflitos
- [ ] package.json com main correto
- [ ] Deploy sem erros
- [ ] `/api/hello` funcionando
- [ ] Functions aparecendo no painel
- [ ] Contact form funcionando

## 📞 Próximos Passos

1. **Teste o endpoint `/api/hello` primeiro**
2. **Se funcionar, teste o contact**
3. **Se não funcionar, verifique as Functions no painel**
4. **Me informe o resultado de cada teste**

---

**Status**: 🔧 Corrigindo reconhecimento de APIs
**Próximo**: Testar endpoint hello 