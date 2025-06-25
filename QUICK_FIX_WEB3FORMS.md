# 🚀 Solução Rápida: Trocar EmailJS por Web3Forms

## Opção 1: Web3Forms (Recomendado - 250 emails grátis/mês)

### 1. Obtenha sua Access Key (1 minuto)
1. Vá para https://web3forms.com
2. Digite `team@devtone.agency`
3. Copie a Access Key que aparecer

### 2. Atualize o código

No arquivo `src/pages/Estimate.tsx`, substitua a parte do EmailJS:

**ENCONTRE ESTE CÓDIGO (linha ~178):**
```javascript
// Initialize EmailJS (only needed once, but safe to call multiple times)
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Prepare email parameters
const emailParams = {
  // ... todo o código do EmailJS
};

// Send email using EmailJS
const emailResponse = await emailjs.send(
  EMAILJS_CONFIG.SERVICE_ID,
  EMAILJS_CONFIG.TEMPLATE_ID,
  emailParams
);
```

**SUBSTITUA POR:**
```javascript
// Send via Web3Forms (better alternative)
const web3Response = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    access_key: 'SUA_ACCESS_KEY_AQUI', // <-- Cole sua key aqui
    subject: `New Estimate - ${formData.name} - ${formData.projectType}`,
    from_name: formData.name,
    email: formData.email,
    to: 'team@devtone.agency',
    message: `
NEW ESTIMATE REQUEST

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}
- Company: ${formData.company || 'Not provided'}
- Country: ${formData.country || 'Not provided'}
- Industry: ${formData.industry || 'Not provided'}

Project Details:
- Type: ${formData.projectType}
- Budget: ${budgetRanges.find(b => b.value === formData.budget)?.label || formData.budget}
- Timeline: ${timelineOptions.find(t => t.value === formData.timeline)?.label || formData.timeline}
- Features: ${formData.features.join(', ') || 'None'}

Description:
${formData.description || 'No description provided'}
    `
  })
});

const result = await web3Response.json();
if (!result.success) {
  throw new Error(result.message || 'Failed to send email');
}

console.log('✅ Email sent via Web3Forms');
```

### 3. Remova imports do EmailJS

**REMOVA:**
```javascript
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';
```

### 4. Pronto! 🎉

## Opção 2: FormSubmit (Mais Simples - Totalmente Grátis)

Se preferir ainda mais simples, use FormSubmit:

```javascript
// Em vez do EmailJS, use:
const formBody = new FormData();
formBody.append('_subject', `New Estimate - ${formData.name}`);
formBody.append('name', formData.name);
formBody.append('email', formData.email);
formBody.append('phone', formData.phone || 'Not provided');
formBody.append('company', formData.company || 'Not provided');
formBody.append('project_type', formData.projectType);
formBody.append('budget', budgetRanges.find(b => b.value === formData.budget)?.label);
formBody.append('timeline', timelineOptions.find(t => t.value === formData.timeline)?.label);
formBody.append('description', formData.description);
formBody.append('_captcha', 'false');
formBody.append('_template', 'table');

const response = await fetch('https://formsubmit.co/team@devtone.agency', {
  method: 'POST',
  body: formBody
});

if (!response.ok) {
  throw new Error('Failed to send email');
}
```

## ✅ Vantagens da Mudança

### Web3Forms:
- ✅ 250 emails grátis/mês (vs 200 do EmailJS)
- ✅ Não precisa configurar template
- ✅ Funciona imediatamente
- ✅ Melhor documentação

### FormSubmit:
- ✅ 100% grátis, sem limites
- ✅ Não precisa nem de conta
- ✅ Zero configuração

## 🧪 Teste

Após fazer a mudança:
1. Salve o arquivo
2. Teste o formulário
3. Verifique o email em team@devtone.agency

Pronto! Sem mais erros de "recipients address is empty"! 🎊