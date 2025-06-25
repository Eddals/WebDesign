# Configuração das Variáveis de Ambiente no Vercel

## Passo a Passo para Configurar a API de Email

### 1. Acesse o Dashboard do Vercel

1. Vá para [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Faça login com sua conta
3. Selecione o projeto **WebDesign** ou **devtone**

### 2. Configure as Variáveis de Ambiente

1. Clique em **Settings** (Configurações) no menu superior
2. No menu lateral, clique em **Environment Variables**
3. Adicione as seguintes variáveis:

#### Variável 1: RESEND_API_KEY
- **Key**: `RESEND_API_KEY`
- **Value**: `re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR`
- **Environment**: Marque todas as opções (Production, Preview, Development)
- Clique em **Save**

#### Variável 2: ADMIN_EMAIL
- **Key**: `ADMIN_EMAIL`
- **Value**: `team@devtone.agency` (ou o email que você quer receber as notificações)
- **Environment**: Marque todas as opções (Production, Preview, Development)
- Clique em **Save**

### 3. Faça o Deploy

Depois de adicionar as variáveis, você precisa fazer um novo deploy:

```bash
git add .
git commit -m "Fix API endpoint for email notifications"
git push
```

O Vercel irá automaticamente fazer o deploy com as novas variáveis de ambiente.

### 4. Teste a API

Após o deploy, você pode testar se está funcionando:

1. Acesse: https://devtone.agency/estimate
2. Preencha o formulário
3. Envie

### 5. Verificar os Logs (se houver problemas)

1. No dashboard do Vercel, clique em **Functions**
2. Procure por `send-estimate-email`
3. Clique para ver os logs
4. Verifique se há erros

## Troubleshooting

### Se os emails não estão sendo enviados:

1. **Verifique o domínio no Resend**
   - Acesse [https://resend.com/domains](https://resend.com/domains)
   - Verifique se o domínio `devtone.agency` está verificado
   - Se não estiver, adicione os registros DNS necessários

2. **Verifique a chave da API**
   - Certifique-se de que a chave `re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR` está correta
   - Não deve ter espaços ou aspas ao redor

3. **Verifique os logs do Vercel**
   - Dashboard → Functions → send-estimate-email → Logs

### Se a API não está sendo chamada:

1. **Verifique o console do navegador**
   - Abra o DevTools (F12)
   - Vá para a aba Console
   - Veja se há erros de CORS ou 404

2. **Verifique a aba Network**
   - Veja se a requisição está sendo feita para `/api/send-estimate-email`
   - Verifique o status da resposta

## Status Atual

- ✅ Código corrigido para usar o endpoint correto
- ⏳ Aguardando configuração das variáveis no Vercel
- ✅ ActivePieces webhook funcionando como backup
- ✅ Templates de email prontos

## Próximos Passos

1. Configure as variáveis de ambiente no Vercel
2. Faça o push do código corrigido
3. Teste o formulário
4. Verifique se os emails estão chegando

## Suporte

Se precisar de ajuda:
- Email: team@devtone.agency
- WhatsApp: +1 917-741-3468