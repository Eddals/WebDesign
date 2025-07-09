# 🚀 Configuração da Variável de Ambiente no Vercel

## ✅ Passo a Passo para Configurar BREVO_API_KEY no Vercel

### 1. **Acesse o Dashboard do Vercel**
- Vá em: https://vercel.com/dashboard
- Clique no seu projeto **WebDesignS**

### 2. **Configure a Variável de Ambiente**
- Clique na aba **"Settings"**
- No menu lateral, clique em **"Environment Variables"**
- Clique em **"Add New"**

### 3. **Adicione a Chave da API**
```
Name: BREVO_API_KEY
Value: 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
Environment: Production, Preview, Development (selecione todos)
```

### 4. **Salve e Redeploy**
- Clique em **"Save"**
- Vá na aba **"Deployments"**
- Clique nos 3 pontinhos do último deployment
- Clique em **"Redeploy"**

## 🔧 Código Atualizado

O arquivo `api/estimate-brevo.ts` agora está configurado corretamente:

```typescript
// ✅ Busca a chave das variáveis de ambiente
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
  return res.status(500).json({ error: 'API key not found' });
}

// ✅ Headers corretos conforme documentação da Brevo
headers: {
  'accept': 'application/json',
  'api-key': apiKey,
  'content-type': 'application/json'
}
```

## 🧪 Como Testar

### Opção 1: Teste Local
1. Certifique-se que `.env.local` existe na raiz do projeto
2. Execute `npm run dev`
3. Teste o formulário de estimate

### Opção 2: Teste em Produção
1. Após configurar no Vercel e fazer redeploy
2. Acesse https://devtone.agency/estimate
3. Preencha e submeta o formulário

## 🚨 Troubleshooting

### Se ainda der erro 401:
1. **Verifique se a variável foi salva no Vercel**
2. **Confirme se fez o redeploy**
3. **Teste a chave diretamente na API da Brevo**

### Teste direto da chave:
```bash
curl -X GET "https://api.brevo.com/v3/account" \
  -H "accept: application/json" \
  -H "api-key: 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"
```

## ✅ Checklist Final

- [ ] Variável `BREVO_API_KEY` configurada no Vercel
- [ ] Redeploy realizado
- [ ] Código atualizado para usar `process.env.BREVO_API_KEY`
- [ ] Headers corretos implementados
- [ ] Teste do formulário funcionando

---

**Status**: 🔧 Configurado para usar variáveis de ambiente do Vercel
**Próximo**: Configurar no dashboard do Vercel e testar