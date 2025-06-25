# Configuração de Email Duplo - Cliente e Admin

## O que foi alterado

Agora quando um cliente preenche o formulário de estimate, o sistema envia:

### 1. Email de Notificação Admin (já existente)
- **Para**: `team@devtone.agency`
- **Conteúdo**: Todos os detalhes do formulário
- **Assunto**: "New Estimate Request: [Nome] - [Tipo de Projeto]"

### 2. Email de Confirmação Cliente (ATUALIZADO)
- **Para**: Email do cliente E `team@devtone.agency`
- **Conteúdo**: Confirmação com resumo e próximos passos
- **Assunto**: "We received your estimate request - DevTone"

## Como funciona agora

```javascript
// Antes (apenas cliente):
to: [formData.email],

// Agora (cliente + admin):
to: [formData.email, adminEmailAddress], // Send to both
```

## Benefícios desta configuração

1. **Você recebe 2 emails por estimate**:
   - Email de notificação com todos os detalhes
   - Cópia do email que o cliente recebeu

2. **Melhor controle**:
   - Você vê exatamente o que o cliente está recebendo
   - Pode verificar se os emails estão sendo enviados corretamente

3. **Backup automático**:
   - Se o cliente não receber, você tem uma cópia
   - Pode reenviar manualmente se necessário

## Para testar

1. Faça o deploy:
   ```bash
   git add .
   git commit -m "Enviar email de confirmação para cliente e admin"
   git push
   ```

2. Preencha um formulário de teste

3. Verifique em `team@devtone.agency`:
   - Deve receber 2 emails:
     - "New Estimate Request..." (detalhes completos)
     - "We received your estimate request..." (cópia do cliente)

## Personalização adicional

Se quiser enviar para emails diferentes:

```javascript
// Para múltiplos admins:
to: [formData.email, 'team@devtone.agency', 'outro@devtone.agency'],

// Para usar CC (com cópia):
to: [formData.email],
cc: ['team@devtone.agency'],

// Para usar BCC (cópia oculta):
to: [formData.email],
bcc: ['team@devtone.agency'],
```

## Variáveis de ambiente

Certifique-se que no Vercel está configurado:
```
ADMIN_EMAIL = team@devtone.agency
RESEND_API_KEY = re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR
```

## Troubleshooting

Se não estiver recebendo os emails:
1. Verifique spam/lixo eletrônico
2. Confirme que o domínio está verificado no Resend
3. Verifique os logs do Vercel
4. Teste com o endpoint: `https://devtone.agency/api/test-email`