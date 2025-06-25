# 📧 Sistema de Email Automático - DevTone

## Visão Geral

O sistema agora envia **2 emails automáticos** quando alguém preenche o formulário de estimate:

1. **Email para Admin** (team@devtone.agency)
2. **Email de Confirmação para o Cliente**

## 🚀 Como Funciona

### 1. Cliente preenche o formulário
- Nome, email, telefone
- Tipo de projeto, orçamento, prazo
- Descrição e recursos desejados

### 2. Sistema envia email para Admin
**Destinatário**: team@devtone.agency  
**Assunto**: New Estimate Request - [Nome] - [Tipo de Projeto]  
**Conteúdo**: Todos os detalhes do formulário formatados

### 3. Sistema envia confirmação para Cliente
**Destinatário**: Email do cliente  
**Assunto**: 
- 🇺🇸 Inglês: "We received your estimate request - DevTone"
- 🇧🇷 Português: "Recebemos sua solicitação de orçamento - DevTone"

**Conteúdo**: 
- Resumo do que foi solicitado
- Próximos passos detalhados
- Informações de contato
- Timeline do processo

## 🌍 Suporte Multi-idioma

O sistema detecta automaticamente se deve enviar em português quando:
- País selecionado é "Brazil"
- Email termina com ".br"

## 📊 Informações Técnicas

### Serviço: Web3Forms
- **Access Key**: 3dba5685-e5bf-4a0e-9f94-15f2d38e47ff
- **Limite**: 250 emails grátis/mês
- **API Endpoint**: https://api.web3forms.com/submit

### Emails Enviados

#### 1. Email Admin (team@devtone.agency)
```
NEW ESTIMATE REQUEST

CONTACT INFORMATION:
• Name: [Nome]
• Email: [Email]
• Phone: [Telefone]
• Company: [Empresa]
• Country: [País]
• Industry: [Indústria]

PROJECT DETAILS:
• Project Type: [Tipo]
• Budget: [Orçamento Formatado]
• Timeline: [Prazo Formatado]
• Features: [Recursos]

PROJECT DESCRIPTION:
[Descrição]
```

#### 2. Email Cliente (Confirmação)
```
Hi [Nome],

Thank you for your interest in DevTone! 
We've received your estimate request...

HERE'S A SUMMARY OF YOUR REQUEST:
[Detalhes do pedido]

WHAT HAPPENS NEXT?
1. PROJECT REVIEW (Within 2-4 hours)
2. CUSTOM PROPOSAL (Within 24 hours)
3. CONSULTATION CALL (Within 48 hours)
4. PROJECT KICKOFF

NEED IMMEDIATE ASSISTANCE?
• Call us: +1 917-741-3468
• Email: team@devtone.agency
```

## 🔧 Configuração

### Para testar:
```bash
# Teste rápido
open test-web3forms.html

# Teste completo
npm run dev
# Acesse /estimate e preencha o formulário
```

### Para mudar destinatários:
No arquivo `src/pages/Estimate.tsx`:
- Linha ~193: `to: 'team@devtone.agency'` (email admin)
- Linha ~265: `to: formData.email` (email cliente)

## 📈 Monitoramento

- Verifique o dashboard do Web3Forms para ver histórico
- Limite de 250 emails/mês no plano gratuito
- Cada submissão conta como 2 emails (admin + cliente)

## 🚨 Troubleshooting

### Email não chegou?
1. Verifique pasta de spam
2. Confirme que o email está correto
3. Verifique console do navegador para erros
4. Verifique limite mensal (250 emails)

### Erro ao enviar?
- Verifique conexão com internet
- Confirme que a Access Key está correta
- Verifique se não excedeu o limite

## 🎯 Próximas Melhorias Possíveis

1. **Templates HTML** mais elaborados
2. **Anexar PDF** com informações da empresa
3. **Integração com CRM** (HubSpot, Pipedrive)
4. **Notificação SMS** para projetos urgentes
5. **Email de follow-up** automático após 48h

## 📞 Suporte

Problemas com o sistema de email?
- Email: team@devtone.agency
- Telefone: +1 917-741-3468