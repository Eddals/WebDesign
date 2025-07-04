# HubSpot Webhook Integration

## O Problema de CORS

O erro que você está vendo:

```
Access to fetch at 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/JHi6t1H' from origin 'https://devtone.agency' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Este é um erro de CORS (Cross-Origin Resource Sharing). O HubSpot não permite chamadas diretas do navegador para seus webhooks a partir de domínios diferentes.

## Solução: Servidor Proxy

A única solução confiável é usar um servidor proxy:

1. Instale as dependências:
   ```
   npm install express cors node-fetch
   ```

2. Execute o servidor proxy:
   ```
   npm run proxy
   ```

3. Atualize a URL do proxy no arquivo `test-hubspot.tsx` para apontar para seu servidor:
   - Produção: `https://seu-servidor-proxy.com/webhook`
   - Desenvolvimento: `http://localhost:3001/webhook`

## Como funciona

1. O navegador envia a solicitação para o seu servidor proxy
2. O servidor proxy encaminha a solicitação para o HubSpot
3. O HubSpot responde ao seu servidor
4. Seu servidor encaminha a resposta de volta para o navegador

Esta abordagem contorna as restrições de CORS porque as solicitações servidor-para-servidor não estão sujeitas às mesmas restrições que as solicitações do navegador.

## Implantação

Para implantar em produção:

1. Hospede o servidor proxy em um serviço como:
   - Heroku
   - AWS Lambda
   - Vercel Serverless Functions
   - Netlify Functions

2. Atualize a URL do proxy no código para apontar para seu servidor em produção.