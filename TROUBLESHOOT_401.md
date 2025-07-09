# 🚨 TROUBLESHOOT: Erro 401 - Estimate Form

## 🎯 Problema Atual
```
Form submission error: Error: API error (401): [object Object]
```

## 🔧 Ferramentas de Debug Criadas

### 1. **debug-brevo.html** 
Arquivo para testar todos os endpoints e diagnosticar o problema:
- Abra `debug-brevo.html` no navegador
- Execute os 3 testes na ordem

### 2. **Endpoints de Teste Criados:**
- `/api/test-env` - Verifica variáveis de ambiente
- `/api/test-brevo-direct` - Testa API key diretamente
- `/api/estimate-brevo` - Endpoint principal com logs detalhados

## 🧪 Passos para Diagnosticar

### Passo 1: Verificar Variáveis de Ambiente
```bash
# Teste: GET /api/test-env
# Deve retornar se a BREVO_API_KEY está disponível
```

### Passo 2: Testar API Key Diretamente
```bash
# Teste: GET /api/test-brevo-direct  
# Testa a chave direto na API da Brevo
```

### Passo 3: Testar Endpoint Principal
```bash
# Teste: POST /api/estimate-brevo
# Com dados de teste para ver logs detalhados
```

## 🔍 Possíveis Causas do Erro 401

### 1. **Variável de Ambiente Não Configurada no Vercel**
- ❌ `BREVO_API_KEY` não foi adicionada no dashboard do Vercel
- ❌ Não foi feito redeploy após adicionar a variável

### 2. **API Key Inválida ou Expirada**
- ❌ Chave foi desabilitada no painel da Brevo
- ❌ Chave não tem permissões de SMTP
- ❌ Chave foi digitada incorretamente

### 3. **Headers Incorretos**
- ❌ Header `api-key` com formato errado
- ❌ Content-Type incorreto

### 4. **Domínio Não Verificado**
- ❌ Email `team@devtone.agency` não verificado na Brevo
- ❌ Domínio `devtone.agency` não configurado

## ✅ Soluções por Prioridade

### 🥇 **PRIMEIRA PRIORIDADE: Configurar Vercel**
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **WebDesignS**
3. Settings → Environment Variables
4. Adicione:
   ```
   Name: BREVO_API_KEY
   Value: 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
   Environment: Production, Preview, Development
   ```
5. **IMPORTANTE:** Faça REDEPLOY após salvar

### 🥈 **SEGUNDA PRIORIDADE: Verificar API Key**
1. Acesse: https://app.brevo.com/settings/keys/api
2. Confirme se a chave está **ATIVA**
3. Verifique se tem permissões **SMTP**
4. Se necessário, gere uma nova chave

### 🥉 **TERCEIRA PRIORIDADE: Verificar Domínio**
1. Acesse: https://app.brevo.com/senders/domain
2. Confirme se `devtone.agency` está verificado
3. Confirme se `team@devtone.agency` está na lista de remetentes

## 🧪 Como Usar o Debug

### Opção 1: Interface Visual
1. Abra `debug-brevo.html` no navegador
2. Clique nos botões de teste na ordem
3. Analise os resultados

### Opção 2: Teste Manual
```bash
# 1. Testar variáveis de ambiente
curl https://devtone.agency/api/test-env

# 2. Testar API key
curl https://devtone.agency/api/test-brevo-direct

# 3. Testar endpoint principal
curl -X POST https://devtone.agency/api/estimate-brevo \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"123","company":"Test Co","industry":"Tech","projectType":"business","budget":"$1,500","timeline":"1 Month","description":"Test","features":[],"retainer":"none"}'
```

## 📊 Interpretando os Resultados

### ✅ **Se test-env retornar:**
```json
{
  "hasApiKey": true,
  "apiKeyLength": 75,
  "apiKeyStart": "xkeysib-09...",
  "allEnvKeys": ["BREVO_API_KEY"]
}
```
**→ Variável de ambiente OK, prossiga para próximo teste**

### ❌ **Se test-env retornar:**
```json
{
  "hasApiKey": false,
  "apiKeyLength": 0,
  "apiKeyStart": "Not found",
  "allEnvKeys": []
}
```
**→ PROBLEMA: Configure a variável no Vercel e faça redeploy**

### ✅ **Se test-brevo-direct retornar:**
```json
{
  "success": true,
  "message": "Brevo API key is working!",
  "account": {...}
}
```
**→ API key OK, problema pode ser no endpoint principal**

### ❌ **Se test-brevo-direct retornar 401:**
```json
{
  "error": "Brevo API test failed",
  "status": 401,
  "details": {"message": "API Key is not enabled"}
}
```
**→ PROBLEMA: API key inválida, gere uma nova no painel da Brevo**

## 🎯 Próximos Passos

1. **Execute o debug primeiro**: `debug-brevo.html`
2. **Identifique onde está falhando**
3. **Aplique a solução correspondente**
4. **Teste novamente até funcionar**

---

**Status**: 🔧 Ferramentas de debug criadas
**Próximo**: Executar testes e identificar a causa raiz