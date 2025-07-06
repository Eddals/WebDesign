# Configuração do Brevo no Vercel

## ✅ Configurações Atualizadas

### 1. APIs Criadas
- ✅ `api/estimate-brevo.js` - Endpoint para formulário de estimativa
- ✅ `api/contact-brevo.js` - Endpoint para formulário de contato
- ✅ `api/test-brevo.js` - Endpoint de teste para verificar conexão

### 2. Configurações do Brevo
- **API Key**: `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`
- **API URL**: `https://api.brevo.com/v3/smtp/email`
- **Email da Equipe**: `team@devtone.agency`
- **Template ID #2**: Para estimativas
- **Template ID #5**: Para contatos

### 3. URLs dos Endpoints
- **Produção**: `https://devtone.agency/api/estimate-brevo`
- **Produção**: `https://devtone.agency/api/contact-brevo`
- **Teste**: `https://devtone.agency/api/test-brevo`

## 🔧 Configuração no Vercel

### 1. Variáveis de Ambiente
No painel do Vercel, adicione estas variáveis de ambiente:

```bash
BREVO_API_KEY=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
TEAM_EMAIL=team@devtone.agency
```

### 2. Configuração do Domínio
- **Domínio Principal**: `devtone.agency`
- **Domínio Alternativo**: `www.devtone.agency`

### 3. Configurações de Build
O projeto já está configurado com:
- ✅ `vercel.json` - Configuração de rotas e builds
- ✅ `next.config.js` - Domínios de imagens atualizados
- ✅ CORS configurado para todos os endpoints

## 🧪 Testando a Configuração

### 1. Teste da API
Acesse: `https://devtone.agency/api/test-brevo`

### 2. Teste do Formulário de Contato
Acesse: `https://devtone.agency/contact`

### 3. Teste do Formulário de Estimativa
Acesse: `https://devtone.agency/estimate`

## 📧 Templates do Brevo

### Template #2 - Estimativas
**Parâmetros disponíveis:**
- `NAME` - Nome do cliente
- `EMAIL` - Email do cliente
- `PHONE` - Telefone
- `COMPANY` - Empresa
- `INDUSTRY` - Setor
- `PROJECT_TYPE` - Tipo de projeto
- `BUDGET` - Orçamento
- `TIMELINE` - Prazo
- `RETAINER` - Retainer
- `FEATURES` - Funcionalidades
- `DESCRIPTION` - Descrição
- `SUBMISSION_DATE` - Data de envio
- `SOURCE` - Origem

### Template #5 - Contatos
**Parâmetros disponíveis:**
- `NAME` - Nome do cliente
- `EMAIL` - Email do cliente
- `PHONE` - Telefone
- `COMPANY` - Empresa
- `SUBJECT` - Assunto
- `MESSAGE` - Mensagem
- `PREFERRED_CONTACT` - Contato preferido
- `SUBMISSION_DATE` - Data de envio
- `SOURCE` - Origem

## 🔍 Logs e Debug

### Logs Disponíveis
Todos os endpoints incluem logs detalhados:
- ✅ Requisições recebidas
- ✅ Validação de dados
- ✅ Configurações do Brevo
- ✅ Respostas da API
- ✅ Erros detalhados

### Como Verificar Logs
1. Acesse o painel do Vercel
2. Vá para "Functions"
3. Clique no endpoint desejado
4. Verifique os logs em tempo real

## 🚀 Deploy

### 1. Push para o GitHub
```bash
git add .
git commit -m "Configuração Brevo para Vercel"
git push origin main
```

### 2. Deploy Automático
O Vercel fará deploy automático quando detectar mudanças no repositório.

### 3. Verificação
- ✅ APIs funcionando
- ✅ Emails sendo enviados
- ✅ Logs aparecendo
- ✅ Formulários funcionando

## 🛠️ Troubleshooting

### Problema: API Key não funciona
**Solução:**
1. Verifique se a API key está correta no Brevo
2. Confirme se está configurada no Vercel
3. Teste com o endpoint `/api/test-brevo`

### Problema: Emails não chegam
**Solução:**
1. Verifique os logs no Vercel
2. Confirme se o template ID está correto
3. Verifique se o email da equipe está correto

### Problema: CORS errors
**Solução:**
1. Os endpoints já têm CORS configurado
2. Verifique se está acessando o domínio correto
3. Confirme se não há bloqueios de firewall

## 📞 Suporte

Se houver problemas:
1. Verifique os logs no Vercel
2. Teste com o endpoint `/api/test-brevo`
3. Confirme as configurações do Brevo
4. Entre em contato: team@devtone.agency

---

**Status**: ✅ Configurado e pronto para produção
**Última atualização**: $(date) 