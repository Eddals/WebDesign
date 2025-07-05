# 🔑 Configuração da API Key do Brevo

## 🚨 Problema Identificado

```
{"message":"API Key is not enabled","code":"unauthorized"}
```

A API key `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` **está ativa** na sua conta Brevo.

## 🔧 Como Ativar a API Key

### Passo 1: Acesse o Dashboard do Brevo
1. Vá para [https://app.brevo.com/](https://app.brevo.com/)
2. Faça login na sua conta
3. Vá para **Settings** → **API Keys**

### Passo 2: Encontre sua API Key
1. Procure pela chave: `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`
2. ✅ **Status: ATIVA** - A chave está funcionando

### Passo 3: Ative a API Key
Se a chave estiver **inativa**:
1. Clique na chave
2. Clique em **"Activate"** ou **"Enable"**
3. Confirme a ativação

### Passo 4: Verifique as Permissões
Certifique-se de que a API key tem permissões para:
- ✅ **SMTP API** (para enviar emails)
- ✅ **Transactional Emails** (para templates)

## 🔍 Alternativa: Criar Nova API Key

Se a chave atual não puder ser ativada:

### 1. Crie Nova API Key
1. Vá para **Settings** → **API Keys**
2. Clique em **"Create API Key"**
3. Nome: `Devtone Email Service`
4. Permissões: **SMTP API** + **Transactional Emails**
5. Clique em **"Create"**

### 2. Copie a Nova Chave
A nova chave será algo como:
```
xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-sMlTTNh3fWNrkKFf
```

### 3. ✅ Código Atualizado
A API key já foi atualizada nos arquivos:
- `src/lib/brevo-email-direct.ts` ✅
- `test-brevo-direct-frontend.html` ✅
- `test-brevo-api-key.html` ✅

## 🧪 Teste Após Ativação

### 1. Teste Rápido no Console
```javascript
// Cole no console do navegador
fetch('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-key': 'SUA_API_KEY_AQUI'
  },
  body: JSON.stringify({
    to: [{email: 'teste@exemplo.com', name: 'Teste'}],
    templateId: 2,
    params: {FIRSTNAME: 'Teste', message: 'Teste'},
    sender: {name: 'Devtone Agency', email: 'team@devtone.agency'}
  })
}).then(r => r.text()).then(console.log);
```

### 2. Use a Página de Teste
1. Abra `test-brevo-direct-frontend.html`
2. Atualize a API key no código
3. Teste o envio

## 🚨 Verificações Importantes

### 1. Template ID 2 Existe?
1. Vá para **Templates** no Brevo
2. Verifique se existe um template com ID `2`
3. Se não existir, crie um ou use outro ID

### 2. Domínio Autorizado?
1. Vá para **Settings** → **SMTP & API**
2. Verifique se seu domínio está autorizado
3. Adicione se necessário

### 3. Limite de Emails?
1. Verifique seu plano Brevo
2. Confirme se não atingiu o limite diário

## 📞 Suporte Brevo

Se ainda houver problemas:
1. **Email**: support@brevo.com
2. **Chat**: Disponível no dashboard
3. **Documentação**: [https://developers.brevo.com/](https://developers.brevo.com/)

## 🔄 Próximos Passos

1. ✅ **API key ativada** no dashboard do Brevo
2. **Teste** com a página `test-brevo-api-key.html`
3. **Verifique** se o template ID 2 existe
4. **Confirme** se o domínio está autorizado

---

**Status**: ✅ **API KEY ATIVA** - Sistema pronto para testar! 