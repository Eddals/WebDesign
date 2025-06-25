# 🚨 IMPORTANTE: Emails SÓ Funcionam com API Key no Vercel!

## Por que não está funcionando?

O código está correto, mas a API key do Resend (`re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR`) precisa estar nas variáveis de ambiente do Vercel.

## PASSO A PASSO VISUAL

### 1️⃣ Acesse o Vercel
```
https://vercel.com/dashboard
```

### 2️⃣ Clique no seu projeto
```
🔍 Procure por: devtone
📁 Clique no projeto
```

### 3️⃣ Vá em Settings (Configurações)
```
⚙️ Settings (no menu superior)
```

### 4️⃣ Environment Variables (menu lateral esquerdo)
```
🔐 Environment Variables
```

### 5️⃣ Add New Variable
```
➕ Add New
```

### 6️⃣ Preencha EXATAMENTE assim:
```
┌─────────────────────────────────────────┐
│ Key:   RESEND_API_KEY                   │
│                                         │
│ Value: re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR │
│                                         │
│ Environment:                            │
│ ☑️ Production                           │
│ ☑️ Preview                              │
│ ☑️ Development                          │
└─────────────────────────────────────────┘
```

### 7️⃣ Clique em Save

### 8️⃣ MUITO IMPORTANTE: Redeploy
```
Opção A:
- Vá em "Deployments"
- Clique nos 3 pontinhos (...) 
- "Redeploy"

Opção B:
- No terminal:
  git commit --allow-empty -m "Redeploy with API key"
  git push
```

## ✅ PRONTO!

Após o redeploy (2-3 minutos), os emails funcionarão em https://devtone.agency

## 🧪 Como Testar

```bash
# Execute este comando para testar:
node scripts/verificar-email-producao.js
```

## ❓ Ainda não funciona?

1. **Verifique se salvou a variável:**
   - Vercel → Settings → Environment Variables
   - Deve mostrar: RESEND_API_KEY (com valor oculto)

2. **Verifique os logs do Vercel:**
   - Functions → send-estimate-resend → Logs

3. **Certifique-se que fez redeploy APÓS adicionar a variável**

## 📌 Resumo

```
Localhost = Funciona porque lê do arquivo .env local
Produção = SÓ funciona se a API key estiver no Vercel
```

**Sem a API key no Vercel = Sem emails em produção!**