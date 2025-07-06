# 🧪 Teste do Formulário de Contato - Brevo

## ✅ **Atualizações Realizadas**

1. **✅ Página de contato atualizada** para usar diretamente o endpoint Brevo
2. **✅ Endpoint configurado** com Template ID #5
3. **✅ Página de teste criada** para verificação direta

## 🚀 **Como Testar**

### **Opção 1: Teste Direto (Recomendado)**

1. **Inicie o servidor:**
   ```bash
   node local-api-server.js
   ```

2. **Abra o arquivo de teste:**
   - Abra `test-contact-simple.html` no navegador
   - Ou acesse: `file:///caminho/para/test-contact-simple.html`

3. **Preencha e envie:**
   - Os campos já vêm preenchidos com dados de teste
   - Clique em "📧 Enviar Mensagem"
   - Verifique o resultado na tela

### **Opção 2: Teste via Formulário Original**

1. **Inicie ambos os servidores:**
   ```bash
   # Terminal 1 - API Server
   node local-api-server.js
   
   # Terminal 2 - Vite Dev Server
   npm run dev
   ```

2. **Acesse o formulário:**
   - Vá para: http://localhost:5173/contact
   - Preencha o formulário
   - Envie a mensagem

3. **Verifique os logs:**
   ```bash
   # No terminal do API server, você deve ver:
   📧 Recebida requisição para Brevo Contact: {...}
   ✅ Team email sent successfully
   ✅ Confirmation email sent successfully
   ```

### **Opção 3: Teste via Script**

```bash
# Execute o script de teste
node scripts/test-contact-brevo.js
```

## 📧 **O que Deve Acontecer**

### **Emails Enviados:**
1. **Para a equipe** (`team@devtone.agency`):
   - Template ID #5
   - Notificação de novo contato
   - Todos os detalhes do formulário

2. **Para o cliente** (email do formulário):
   - Template ID #5
   - Confirmação de recebimento
   - Cópia dos dados enviados

### **Logs Esperados:**
```bash
📧 Recebida requisição para Brevo Contact: {
  name: 'João Silva',
  email: 'joao.silva@exemplo.com',
  phone: '+55 (11) 99999-9999',
  company: 'Empresa Teste Ltda',
  subject: 'general-inquiry',
  message: 'Olá! Gostaria de saber mais...',
  preferredContact: 'email'
}
✅ Team email sent successfully
✅ Confirmation email sent successfully
```

## 🔍 **Solução de Problemas**

### **Problema: "Erro de conexão"**
- **Solução**: Verifique se o servidor está rodando
  ```bash
  node local-api-server.js
  ```

### **Problema: "Template not found"**
- **Solução**: Verifique se o Template ID #5 existe no Brevo
- Acesse: [app.brevo.com](https://app.brevo.com) → Templates

### **Problema: "API key error"**
- **Solução**: Verifique se a API key está correta no código
- Confirme no arquivo `local-api-server.js`

### **Problema: Emails não chegam**
- **Verificações**:
  1. Verifique a pasta de spam
  2. Confirme se o domínio está verificado no Brevo
  3. Verifique os logs do servidor

## 📊 **Verificação de Sucesso**

### **✅ Indicadores de Sucesso:**
- [ ] Servidor responde com status 200
- [ ] Logs mostram "Team email sent successfully"
- [ ] Logs mostram "Confirmation email sent successfully"
- [ ] Email chega na caixa da equipe
- [ ] Email de confirmação chega no email do cliente

### **❌ Indicadores de Problema:**
- [ ] Erro de conexão no teste
- [ ] Status 400/500 na resposta
- [ ] Logs mostram "Brevo API error"
- [ ] Emails não chegam

## 🎯 **Próximos Passos**

1. **✅ Teste o endpoint** usando uma das opções acima
2. **✅ Verifique os emails** recebidos
3. **✅ Confirme o template** no painel do Brevo
4. **🔄 Configure personalização** se necessário

## 📞 **Suporte**

Se houver problemas:
1. Verifique os logs do servidor
2. Teste com a página HTML simples
3. Confirme configuração do Brevo
4. Verifique se o Template ID #5 está ativo

---

**Status**: ✅ **Pronto para Teste**

Use a página `test-contact-simple.html` para um teste rápido e direto! 