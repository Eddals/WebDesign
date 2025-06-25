# 🔧 Como Corrigir o Template do EmailJS

## ❌ Erro Atual
```
Status: 422
Response: The recipients address is empty
```

## ✅ Solução Passo a Passo

### 1. Acesse o Dashboard do EmailJS
- Vá para: https://dashboard.emailjs.com
- Faça login com sua conta

### 2. Edite seu Template
- Clique em **"Email Templates"** no menu lateral
- Encontre o template: **template_vtmfiqh**
- Clique em **"Edit"**

### 3. Configure os Campos Obrigatórios

#### 📧 Campo "To email" (MAIS IMPORTANTE)
No campo **"To email"**, você tem 3 opções:

**Opção 1 - Email Fixo (RECOMENDADO):**
```
team@devtone.agency
```

**Opção 2 - Usar Variável:**
```
{{to_email}}
```

**Opção 3 - Múltiplos Emails:**
```
team@devtone.agency, outro@email.com
```

#### 👤 Campo "From name"
```
{{from_name}}
```

#### 📨 Campo "From email"
```
{{from_email}}
```

#### 💬 Campo "Reply-To"
```
{{from_email}}
```

### 4. Configure o Assunto (Subject)
```
Nova Solicitação de Orçamento - {{from_name}} - {{project_type}}
```

### 5. Configure o Conteúdo do Email

**Na aba "Content", cole este HTML:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
    .header { background: #8b5cf6; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-group { margin-bottom: 25px; background: #f5f5f5; padding: 15px; border-radius: 8px; }
    .info-group h3 { color: #8b5cf6; margin-top: 0; }
    .info-item { margin: 10px 0; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .cta-button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Nova Solicitação de Orçamento</h1>
    </div>
    
    <div class="content">
      <div class="info-group">
        <h3>👤 Informações de Contato</h3>
        <div class="info-item">
          <span class="label">Nome:</span>
          <span class="value">{{from_name}}</span>
        </div>
        <div class="info-item">
          <span class="label">Email:</span>
          <span class="value"><a href="mailto:{{from_email}}">{{from_email}}</a></span>
        </div>
        <div class="info-item">
          <span class="label">Telefone:</span>
          <span class="value">{{phone}}</span>
        </div>
        <div class="info-item">
          <span class="label">Empresa:</span>
          <span class="value">{{company}}</span>
        </div>
        <div class="info-item">
          <span class="label">País:</span>
          <span class="value">{{country}}</span>
        </div>
        <div class="info-item">
          <span class="label">Indústria:</span>
          <span class="value">{{industry}}</span>
        </div>
      </div>
      
      <div class="info-group">
        <h3>💼 Detalhes do Projeto</h3>
        <div class="info-item">
          <span class="label">Tipo de Projeto:</span>
          <span class="value">{{project_type}}</span>
        </div>
        <div class="info-item">
          <span class="label">Orçamento:</span>
          <span class="value">{{budget_formatted}}</span>
        </div>
        <div class="info-item">
          <span class="label">Prazo:</span>
          <span class="value">{{timeline_formatted}}</span>
        </div>
        <div class="info-item">
          <span class="label">Recursos Solicitados:</span>
          <span class="value">{{features}}</span>
        </div>
      </div>
      
      <div class="info-group">
        <h3>📝 Descrição do Projeto</h3>
        <p>{{description}}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="mailto:{{from_email}}" class="cta-button">Responder ao Cliente</a>
      </div>
    </div>
  </div>
</body>
</html>
```

### 6. Salve o Template
- Clique no botão **"Save"**
- Aguarde a confirmação

### 7. Teste Novamente
```bash
# Abra o teste no navegador
open test-emailjs.html
```

## 🎯 Verificação Rápida

Após salvar, verifique se:
- [ ] Campo "To email" tem: `team@devtone.agency`
- [ ] Campo "From name" tem: `{{from_name}}`
- [ ] Campo "From email" tem: `{{from_email}}`
- [ ] O template foi salvo com sucesso

## 💡 Dica Importante

Se você colocar `{{to_email}}` no campo "To email", o código já está enviando `team@devtone.agency` como valor. Mas é mais seguro colocar o email diretamente no template.

## 🚨 Se Ainda Não Funcionar

1. Verifique se o Gmail está conectado ao EmailJS
2. Tente criar um novo template do zero
3. Verifique o limite de emails (200/mês no plano gratuito)

Após fazer essas alterações, o erro "The recipients address is empty" será resolvido!