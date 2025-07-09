# 🧩 Integração Completa com Brevo - Devtone Agency

## 📁 Estrutura de Arquivos Criada

```
/api
  ├── send-email.ts          # Endpoint principal para envio de emails
  ├── estimate-brevo.ts      # Endpoint específico para formulário de orçamento
  ├── test-env.ts           # Teste de variáveis de ambiente
  └── test-brevo-direct.ts  # Teste direto da API Brevo

/src
  ├── components/
  │   └── EmailForm.tsx     # Componente de formulário de email
  └── pages/
      └── EmailTest.tsx     # Página de teste da integração

/
├── .env.local            # Variáveis de ambiente (local)
├── debug-brevo.html      # Interface de debug
└── test-brevo-key.html   # Teste da API key
```

## 🔐 Configuração de Variáveis de Ambiente

### 1. **Arquivo `.env.local` (Local)**
```ini
BREVO_API_KEY=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
```

### 2. **Vercel Dashboard (Produção)**
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **WebDesignS**
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Name:** `BREVO_API_KEY`
   - **Value:** `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`
   - **Environment:** Production, Preview, Development
5. **IMPORTANTE:** Faça redeploy após salvar

## 📧 Endpoints Criados

### 1. **`/api/send-email` - Endpoint Principal**
```typescript
// Uso básico
POST /api/send-email
Content-Type: application/json

{
  "to": "cliente@exemplo.com",
  "name": "Nome do Cliente",
  "subject": "Assunto do Email",
  "htmlContent": "<h1>Conteúdo HTML</h1>"
}
```

**Resposta de Sucesso:**
```json
{
  "message": "E-mail enviado com sucesso!",
  "data": { ... }
}
```

**Resposta de Erro:**
```json
{
  "message": "Erro ao enviar e-mail",
  "error": { ... }
}
```

### 2. **`/api/estimate-brevo` - Formulário de Orçamento**
Endpoint específico para o formulário de estimate com templates personalizados.

### 3. **`/api/test-env` - Teste de Variáveis**
```bash
GET /api/test-env
```
Retorna informações sobre as variáveis de ambiente disponíveis.

### 4. **`/api/test-brevo-direct` - Teste da API**
```bash
GET /api/test-brevo-direct
```
Testa a API key diretamente com a Brevo.

## 🎨 Componente EmailForm

### **Uso Básico:**
```tsx
import EmailForm from '@/components/EmailForm'

function MyPage() {
  return (
    <EmailForm />
  )
}
```

### **Uso Customizado:**
```tsx
<EmailForm
  title="Newsletter Personalizada"
  subtitle="Receba nossas novidades"
  placeholder="seu-email@exemplo.com"
  buttonText="Inscrever-se"
  successMessage="Inscrição realizada!"
  className="my-custom-class"
/>
```

### **Props Disponíveis:**
```typescript
interface EmailFormProps {
  title?: string           // Título do formulário
  subtitle?: string        // Subtítulo/descrição
  placeholder?: string     // Placeholder do input
  buttonText?: string      // Texto do botão
  successMessage?: string  // Mensagem de sucesso
  className?: string       // Classes CSS adicionais
}
```

## 🧪 Como Testar

### **Opção 1: Interface Visual**
1. Acesse: `https://devtone.agency/email-test`
2. Teste os formulários interativos
3. Verifique os botões de debug

### **Opção 2: Debug Manual**
1. Abra: `debug-brevo.html`
2. Execute os testes na ordem:
   - Check Environment Variables
   - Test Brevo API Key
   - Test Estimate Endpoint

### **Opção 3: Teste via cURL**
```bash
# Teste básico
curl -X POST https://devtone.agency/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "name": "Test User",
    "subject": "Teste de Email",
    "htmlContent": "<h1>Olá!</h1><p>Este é um teste.</p>"
  }'

# Verificar variáveis de ambiente
curl https://devtone.agency/api/test-env

# Testar API key
curl https://devtone.agency/api/test-brevo-direct
```

## 📧 Templates de Email

### **Template Newsletter (Padrão):**
- Design responsivo
- Cores da marca Devtone
- Seções organizadas
- Call-to-action
- Footer com informações

### **Template Estimate (Orçamento):**
- Email de confirmação para cliente
- Email de notificação para equipe
- Resumo completo do projeto
- Próximos passos explicados

## 🔧 Funcionalidades

### ✅ **Implementado:**
- [x] Endpoint de envio de email
- [x] Componente de formulário responsivo
- [x] Templates HTML profissionais
- [x] Validação de dados
- [x] Tratamento de erros
- [x] Loading states
- [x] Feedback visual
- [x] Testes automatizados
- [x] Debug tools
- [x] Página de demonstração

### 🎯 **Características:**
- **Responsivo:** Funciona em desktop e mobile
- **Acessível:** Suporte a screen readers
- **Performático:** Lazy loading e otimizações
- **Seguro:** Validação server-side
- **Escalável:** Fácil de customizar e estender

## 🚀 Deploy e Produção

### **Checklist de Deploy:**
- [ ] Variável `BREVO_API_KEY` configurada no Vercel
- [ ] Redeploy realizado após configurar variável
- [ ] Teste de `/api/test-env` retorna API key
- [ ] Teste de `/api/test-brevo-direct` retorna sucesso
- [ ] Formulário de email funciona na página `/email-test`
- [ ] Emails são recebidos corretamente

### **Monitoramento:**
- Logs disponíveis no Vercel Dashboard
- Erros capturados e logados
- Status de envio retornado para frontend

## 🎯 Próximos Passos

1. **Teste a integração:** Acesse `/email-test`
2. **Configure no Vercel:** Adicione a variável de ambiente
3. **Faça redeploy:** Para aplicar as configurações
4. **Teste em produção:** Verifique se emails são enviados
5. **Integre nos formulários:** Use o componente EmailForm

---

**Status**: ✅ Integração completa implementada
**Próximo**: Testar e configurar no Vercel