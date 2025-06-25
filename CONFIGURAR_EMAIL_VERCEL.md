# CONFIGURAR EMAIL NO VERCEL - PASSO A PASSO

## O Problema
Os emails só funcionam no localhost porque a API key do Resend não está configurada no Vercel.

## SOLUÇÃO RÁPIDA (2 minutos)

### 1. Abra o Vercel
Vá para: https://vercel.com/dashboard

### 2. Clique no seu projeto "devtone"

### 3. Vá em "Settings" (Configurações)

### 4. Clique em "Environment Variables" (Variáveis de Ambiente)

### 5. Clique em "Add New" (Adicionar Nova)

### 6. Adicione EXATAMENTE assim:

```
Key: RESEND_API_KEY
Value: re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR
Environment: Production, Preview, Development (marque todas)
```

### 7. Clique em "Save" (Salvar)

### 8. IMPORTANTE: Faça um novo deploy

Opção 1 - Pelo Vercel:
- Vá em "Deployments"
- Clique nos 3 pontinhos do último deploy
- Clique em "Redeploy"

Opção 2 - Pelo Git:
```bash
git add .
git commit -m "Force redeploy with Resend API key"
git push
```

## PRONTO! 🎉

Agora os emails vão funcionar no site devtone.agency!

## Como Testar

1. Espere o deploy terminar (2-3 minutos)
2. Vá em: https://devtone.agency/estimate
3. Preencha e envie o formulário
4. Verifique o email: team@devtone.agency

## Verificar se Está Funcionando

1. Vá no Resend: https://resend.com/emails
2. Você verá os emails enviados

## Se Não Funcionar

1. **Verifique no Vercel se a variável foi salva:**
   - Settings → Environment Variables
   - Deve aparecer RESEND_API_KEY

2. **Verifique os logs:**
   - No Vercel, vá em "Functions"
   - Clique em "send-estimate-resend"
   - Veja os logs

3. **Certifique-se que fez o redeploy**
   - As variáveis só funcionam DEPOIS de um novo deploy

## Resumo

❌ Sem a API key no Vercel = emails só funcionam no localhost
✅ Com a API key no Vercel = emails funcionam no site

**A API key DEVE estar no Vercel para funcionar em produção!**