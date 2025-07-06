# Configuração do Domínio Brevo para devtone.agency

## Problema Atual
Os emails estão sendo enviados com o domínio `brevosend.com` em vez de `devtone.agency`.

## Solução

### 1. Verificar Domínio no Brevo

1. **Acesse o painel do Brevo**
   - Vá para [app.brevo.com](https://app.brevo.com)
   - Faça login na sua conta

2. **Vá para Configurações de Domínio**
   - Menu lateral → **Senders & IP** → **Senders**
   - Ou **Settings** → **Senders & IP** → **Senders**

3. **Verificar se devtone.agency está configurado**
   - Procure por `devtone.agency` na lista de domínios
   - Se não estiver, você precisa adicionar

### 2. Adicionar Domínio (se necessário)

1. **Clique em "Add a new sender"**
2. **Preencha os dados:**
   - **Email**: `team@devtone.agency`
   - **Name**: `DevTone Team`
   - **Company**: `DevTone Agency`

3. **Verificar o email**
   - Brevo enviará um email de verificação
   - Clique no link para confirmar

### 3. Configurar DNS (se necessário)

Se o domínio não estiver verificado, você pode precisar adicionar registros DNS:

#### Registros SPF (recomendado)
```
TXT @ "v=spf1 include:spf.brevo.com ~all"
```

#### Registros DKIM (opcional)
O Brevo fornecerá registros DKIM específicos após a verificação.

### 4. Testar Configuração

Após configurar, teste com:

```bash
node scripts/test-brevo-integration.js
```

## Configuração Atual do Código

### Emails Configurados:
- **Team Notification**: `team@devtone.agency` → `team@devtone.agency`
- **Client Confirmation**: `team@devtone.agency` → `client@email.com`

### Template Usado:
- **Template ID #2** para ambos os emails

## Alternativas Temporárias

Se não conseguir configurar o domínio imediatamente:

### Opção 1: Usar email verificado
```javascript
sender: {
  name: 'DevTone Agency',
  email: 'seu-email-verificado@brevo.com' // Email que você usou para criar a conta
}
```

### Opção 2: Usar email do Brevo com nome personalizado
```javascript
sender: {
  name: 'DevTone Agency - team@devtone.agency',
  email: 'noreply@brevosend.com' // Email padrão do Brevo
}
```

## Verificação

Para verificar se está funcionando:

1. **Envie um email de teste**
2. **Verifique o cabeçalho "From"**
3. **Confirme que aparece `team@devtone.agency`**

## Suporte

Se precisar de ajuda:
1. Documentação Brevo: [Senders & IP](https://help.brevo.com/hc/en-us/articles/209480485-Senders-IP)
2. Suporte Brevo: [Contact Support](https://www.brevo.com/support/)

## Próximos Passos

1. ✅ Configurar domínio no Brevo
2. ✅ Verificar email `team@devtone.agency`
3. ✅ Testar envio de emails
4. ✅ Confirmar que emails vêm de `devtone.agency` 