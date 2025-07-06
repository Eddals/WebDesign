# Configuração do Email Sender - Brevo

## 🎯 **Objetivo**
Configurar os emails para aparecerem como vindos de `team@devtone.agency` em vez de `brevosend.com`

## ✅ **Configuração Atual**

### **Emails Configurados:**
```javascript
// Email para a equipe
sender: {
  name: 'DevTone Agency - Estimate Form',
  email: 'team@devtone.agency'
}

// Email de confirmação para o cliente
sender: {
  name: 'DevTone Agency - team@devtone.agency',
  email: 'team@devtone.agency'
}
```

## 🔧 **Passos para Configurar o Domínio**

### **1. Acessar o Painel do Brevo**
- Vá para: [app.brevo.com](https://app.brevo.com)
- Faça login na sua conta

### **2. Configurar Senders**
- Menu lateral → **Senders & IP** → **Senders**
- Ou **Settings** → **Senders & IP** → **Senders**

### **3. Adicionar Novo Sender**
- Clique em **"Add a new sender"**
- Preencha os dados:
  - **Email**: `team@devtone.agency`
  - **Name**: `DevTone Agency`
  - **Company**: `DevTone Agency`

### **4. Verificar o Email**
- Brevo enviará um email de verificação para `team@devtone.agency`
- Clique no link para confirmar

### **5. Configurar DNS (se necessário)**

#### **Registros SPF (recomendado):**
```
TXT @ "v=spf1 include:spf.brevo.com ~all"
```

#### **Registros DKIM (opcional):**
O Brevo fornecerá registros DKIM específicos após a verificação.

## 🎨 **Personalização dos Emails**

### **Nome do Remetente:**
- **Para equipe**: "DevTone Agency - Estimate Form"
- **Para clientes**: "DevTone Agency - team@devtone.agency"

### **Assunto dos Emails:**
- **Para equipe**: "Nova solicitação de orçamento - [Nome do Cliente]"
- **Para clientes**: "Confirmação de solicitação - DevTone Agency"

## 🧪 **Teste da Configuração**

### **1. Teste Local:**
```bash
# Inicie o servidor local
node local-api-server.js

# Em outro terminal, teste o envio
node scripts/test-brevo-integration.js
```

### **2. Teste do Formulário:**
1. Acesse: http://localhost:5173/estimate
2. Preencha o formulário
3. Verifique os emails recebidos

### **3. Verificar Headers:**
- **From**: DevTone Agency - team@devtone.agency <team@devtone.agency>
- **Reply-To**: team@devtone.agency

## 🔍 **Solução de Problemas**

### **Problema: Email ainda aparece como brevosend.com**

#### **Solução 1: Verificar Sender**
1. Vá para Senders & IP → Senders
2. Confirme que `team@devtone.agency` está verificado
3. Status deve ser "Verified"

#### **Solução 2: Usar Email Verificado Temporariamente**
Se não conseguir verificar o domínio, use o arquivo `local-api-server-backup.js`:

```javascript
// Edite a linha 47
const VERIFIED_EMAIL = 'seu-email-verificado@exemplo.com';
```

#### **Solução 3: Configurar DNS**
Adicione os registros DNS no seu provedor de domínio:
```
TXT @ "v=spf1 include:spf.brevo.com ~all"
```

### **Problema: Emails não chegam**

#### **Verificações:**
1. **Spam**: Verifique a pasta de spam
2. **API Key**: Confirme se a API key está correta
3. **Template**: Verifique se o template ID #2 existe
4. **Limites**: Verifique os limites da conta Brevo

## 📊 **Monitoramento**

### **Métricas Importantes:**
- ✅ Taxa de entrega
- ✅ Taxa de abertura
- ✅ Taxa de clique
- ✅ Rejeições

### **Logs do Servidor:**
```bash
# Ver logs em tempo real
node local-api-server.js
```

## 🎯 **Configuração Recomendada**

### **Template ID #2 - Configuração:**
```html
<!-- Cabeçalho -->
<h1>Olá {{NAME}},</h1>

<!-- Conteúdo -->
<p>Recebemos sua solicitação de orçamento para {{PROJECT_TYPE}}.</p>

<!-- Detalhes -->
<ul>
  <li><strong>Empresa:</strong> {{COMPANY}}</li>
  <li><strong>Orçamento:</strong> {{BUDGET}}</li>
  <li><strong>Prazo:</strong> {{TIMELINE}}</li>
</ul>

<!-- Rodapé -->
<p>Atenciosamente,<br>
<strong>Equipe DevTone Agency</strong><br>
team@devtone.agency</p>
```

## 🚀 **Próximos Passos**

1. ✅ Configurar sender no Brevo
2. ✅ Verificar domínio
3. ✅ Testar envio de emails
4. 🔄 Personalizar templates
5. 🔄 Configurar automações

## 📞 **Suporte**

### **Brevo Support:**
- Documentação: [Senders & IP](https://help.brevo.com/hc/en-us/articles/209480485-Senders-IP)
- Suporte: [Contact Support](https://www.brevo.com/support/)

### **DNS Support:**
- Provedor de domínio: Configure registros SPF/DKIM
- Teste DNS: [mxtoolbox.com](https://mxtoolbox.com/)

---

**Status**: 🔄 **Configuração em Andamento**

Após configurar o sender no Brevo, os emails aparecerão corretamente como vindos de `team@devtone.agency`. 