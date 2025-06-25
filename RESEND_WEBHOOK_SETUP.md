# 🔗 Configuração do Webhook Resend

## 📍 URL do Webhook

Use uma dessas URLs dependendo do seu ambiente:

### Desenvolvimento Local (com ngrok):
```
https://seu-tunel.ngrok.io/api/webhooks/resend
```

### Produção (Vercel):
```
https://seu-dominio.vercel.app/api/webhooks/resend
```

### Produção (Domínio próprio):
```
https://devtone.com/api/webhooks/resend
```

## 🚀 Como Configurar

### 1. No Dashboard do Resend:
1. Acesse [app.resend.com/webhooks](https://app.resend.com/webhooks)
2. Clique em "Create Webhook"
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.com/api/webhooks/resend`
   - **Events**: Selecione os eventos que deseja receber:
     - ✅ `email.sent` - Email enviado
     - ✅ `email.delivered` - Email entregue
     - ✅ `email.opened` - Email aberto
     - ✅ `email.clicked` - Link clicado
     - ✅ `email.bounced` - Email rejeitado
     - ✅ `email.complained` - Marcado como spam

### 2. Para Desenvolvimento Local:

Use **ngrok** para expor seu localhost:

```bash
# Instale o ngrok
npm install -g ngrok

# Inicie seu app Next.js
npm run dev

# Em outro terminal, exponha a porta 3000
ngrok http 3000

# Use a URL fornecida pelo ngrok
# Exemplo: https://abc123.ngrok.io/api/webhooks/resend
```

### 3. Segurança (Opcional):

Adicione um webhook secret no `.env.local`:
```env
RESEND_WEBHOOK_SECRET=whsec_seu_secret_aqui
```

## 📊 O que o Webhook Faz

O webhook recebe notificações em tempo real sobre:

1. **Email Sent** - Confirmação que o email foi enviado
2. **Email Delivered** - Email chegou na caixa de entrada
3. **Email Opened** - Cliente abriu o email
4. **Email Clicked** - Cliente clicou em algum link
5. **Email Bounced** - Email foi rejeitado
6. **Spam Complaint** - Email foi marcado como spam

## 🔧 Testando o Webhook

### No Resend Dashboard:
1. Vá para a página do webhook
2. Clique em "Send test webhook"
3. Verifique os logs do seu servidor

### Logs no Vercel:
```bash
vercel logs --follow
```

### Logs locais:
Veja no console do terminal onde está rodando `npm run dev`

## 💡 Casos de Uso

Com os webhooks você pode:

1. **Rastrear Taxa de Abertura**
   - Saber quantos clientes abrem os emails de confirmação

2. **Monitorar Entregas**
   - Verificar se os emails estão chegando

3. **Detectar Problemas**
   - Ser notificado de bounces ou spam complaints

4. **Analytics Avançado**
   - Integrar com seu dashboard para métricas

## 🚨 Importante

- **Bounces**: Remova emails que dão bounce repetidamente
- **Spam Complaints**: SEMPRE remova quem marca como spam
- **Rate Limits**: O webhook pode receber muitos eventos, implemente throttling se necessário

## 📝 Exemplo de Payload

```json
{
  "type": "email.delivered",
  "created_at": "2023-12-07T22:44:52.000Z",
  "data": {
    "email_id": "180f3db3-4c7f-4a70-a43c-4b8f3f9c6058",
    "from": "onboarding@resend.dev",
    "to": ["sweepeasellc@gmail.com"],
    "subject": "Thank you for your estimate request!"
  }
}
```

---

Após configurar, todos os eventos de email serão registrados automaticamente!