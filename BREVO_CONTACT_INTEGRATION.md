# Brevo Contact Integration - Template ID #5

## ✅ **Implementação Concluída**

O formulário de contato foi integrado com o Brevo usando o **Template ID #5**.

## 📧 **Configuração dos Emails**

### **Template ID #5 - Contact Form**
- **Para equipe**: Notificação de novo contato
- **Para cliente**: Confirmação de recebimento

### **Parâmetros do Template:**
```javascript
{
  NAME: data.name,
  EMAIL: data.email,
  PHONE: data.phone || 'Not provided',
  COMPANY: data.company || 'Not provided',
  SUBJECT: data.subject,
  MESSAGE: data.message,
  PREFERRED_CONTACT: data.preferredContact || 'email',
  SUBMISSION_DATE: new Date().toLocaleString(),
  SOURCE: 'Contact Form'
}
```

## 🔧 **Endpoints Configurados**

### **1. Servidor Local (`local-api-server.js`)**
- **Endpoint**: `POST /api/contact-brevo`
- **Template**: ID #5
- **Remetente**: `team@devtone.agency`

### **2. Serviço de Contato (`contact-service.ts`)**
- **Prioridade**: Brevo endpoint primeiro
- **Fallback**: Endpoints antigos
- **URL**: `http://localhost:3001/api/contact-brevo` (desenvolvimento)

## 📋 **Campos do Formulário**

### **Campos Obrigatórios:**
- ✅ **Nome** (`name`)
- ✅ **Email** (`email`)
- ✅ **Assunto** (`subject`)
- ✅ **Mensagem** (`message`)

### **Campos Opcionais:**
- 📞 **Telefone** (`phone`)
- 🏢 **Empresa** (`company`)
- 📧 **Contato Preferido** (`preferredContact`)

## 🎯 **Fluxo de Funcionamento**

### **1. Usuário Submete Formulário**
```javascript
// Página de contato envia dados
const formData = {
  name: 'João Silva',
  email: 'joao@exemplo.com',
  phone: '+55 11 99999-9999',
  company: 'Empresa Ltda',
  subject: 'general-inquiry',
  message: 'Olá! Gostaria de informações...',
  preferredContact: 'email'
};
```

### **2. Serviço Processa**
```javascript
// contact-service.ts tenta Brevo primeiro
const apiUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api/contact-brevo'
  : '/api/contact-brevo';
```

### **3. Brevo Envia Emails**
- **Email para equipe**: `team@devtone.agency`
- **Email para cliente**: `joao@exemplo.com`
- **Template**: ID #5 para ambos

## 🧪 **Teste da Integração**

### **1. Teste Local:**
```bash
# Inicie o servidor
node local-api-server.js

# Em outro terminal, teste o contato
node scripts/test-contact-brevo.js
```

### **2. Teste do Formulário:**
1. Acesse: http://localhost:5173/contact
2. Preencha o formulário
3. Verifique os emails recebidos

### **3. Verificar Logs:**
```bash
# Logs do servidor
📧 Recebida requisição para Brevo Contact: {...}
✅ Team email sent successfully
✅ Confirmation email sent successfully
```

## 📊 **Configuração do Template #5**

### **Estrutura Recomendada:**
```html
<!-- Cabeçalho -->
<h1>Nova Mensagem de Contato</h1>

<!-- Detalhes do Cliente -->
<div>
  <p><strong>Nome:</strong> {{NAME}}</p>
  <p><strong>Email:</strong> {{EMAIL}}</p>
  <p><strong>Telefone:</strong> {{PHONE}}</p>
  <p><strong>Empresa:</strong> {{COMPANY}}</p>
  <p><strong>Assunto:</strong> {{SUBJECT}}</p>
  <p><strong>Contato Preferido:</strong> {{PREFERRED_CONTACT}}</p>
</div>

<!-- Mensagem -->
<div>
  <h3>Mensagem:</h3>
  <p>{{MESSAGE}}</p>
</div>

<!-- Metadados -->
<div>
  <p><strong>Data:</strong> {{SUBMISSION_DATE}}</p>
  <p><strong>Origem:</strong> {{SOURCE}}</p>
</div>
```

## 🔄 **Fallback System**

### **Ordem de Prioridade:**
1. **Brevo endpoint** (`/api/contact-brevo`)
2. **Primary endpoint** (`/api/webhooks/resend-simple`)
3. **Alternative endpoints** (vários)
4. **Local storage** (último recurso)

### **Mensagens de Erro:**
- "Brevo endpoint failed" → Tenta próximo
- "All contact endpoints failed" → Salva localmente
- "API temporarily unavailable" → Avisa usuário

## 🎨 **Personalização**

### **Nomes dos Remetentes:**
- **Para equipe**: "DevTone Agency - Contact Form"
- **Para cliente**: "DevTone Agency - team@devtone.agency"

### **Configuração no Brevo:**
1. Acesse: [app.brevo.com](https://app.brevo.com)
2. Vá para: Templates → Template #5
3. Personalize cores, layout, conteúdo

## 📱 **Responsividade**

O formulário e emails são responsivos:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 🚀 **Deploy**

### **Para Produção:**
1. Configure o domínio no Brevo
2. Atualize URLs no `contact-service.ts`
3. Teste em ambiente de produção

### **URLs de Produção:**
```javascript
// Em produção, usa URL relativa
const apiUrl = '/api/contact-brevo';
```

## 📈 **Métricas**

### **Monitoramento:**
- ✅ Emails enviados
- ✅ Taxa de entrega
- ✅ Taxa de abertura
- ✅ Conversões

### **Logs Importantes:**
```bash
📧 Recebida requisição para Brevo Contact
✅ Team email sent successfully
✅ Confirmation email sent successfully
❌ Brevo API error: [detalhes]
```

## 🔍 **Solução de Problemas**

### **Problema: Template não encontrado**
- Verifique se o Template ID #5 existe no Brevo
- Confirme se está ativo

### **Problema: Emails não chegam**
- Verifique logs do servidor
- Confirme API key do Brevo
- Teste com script de teste

### **Problema: Campos faltando**
- Verifique validação no endpoint
- Confirme estrutura do template

## 🎯 **Próximos Passos**

1. ✅ Endpoint implementado
2. ✅ Serviço atualizado
3. ✅ Script de teste criado
4. 🔄 Testar em desenvolvimento
5. 🔄 Configurar template no Brevo
6. 🔄 Deploy em produção

---

**Status**: ✅ **Implementado e Pronto para Teste**

O formulário de contato agora usa o Brevo com Template ID #5, mantendo fallbacks para garantir funcionamento. 