# 🚀 Guia de Configuração Supabase - DevTone

## 📋 **Passos para Configurar o Sistema de Autenticação**

### 🔧 **Passo 1: Configurar Supabase Dashboard**

1. **Acesse seu projeto Supabase**: https://csdejqgfzsxcldqqwfds.supabase.co
2. **Vá para Authentication > Settings**
3. **Desabilite "Enable email confirmations"**
4. **Salve as configurações**

### 🔧 **Passo 2: Executar Script de Configuração**

No **SQL Editor** do Supabase, execute o arquivo:
```sql
-- Execute: setup_supabase_devtone.sql
```

Este script irá:
- ✅ Criar tabela `users` com campos de aprovação
- ✅ Configurar políticas RLS (Row Level Security)
- ✅ Criar funções para aprovar/rejeitar usuários
- ✅ Configurar trigger para novos usuários

### 🔧 **Passo 3: Criar Usuário Admin**

**Opção A: Via Formulário de Signup (Recomendado)**
1. Acesse `/signup` no seu app
2. Preencha:
   - **Nome**: DevTone Admin
   - **Email**: admin@devtone.agency
   - **Senha**: DevTone2024!
   - **Tipo de Conta**: Admin Account
   - **Chave Admin**: devtone-admin-2024
3. Submeta o formulário

**Opção B: Via API (Terminal)**
```bash
# Torne o script executável
chmod +x create_admin_via_api.sh

# Execute o script
./create_admin_via_api.sh
```

### 🔧 **Passo 4: Aprovar o Usuário Admin**

Após criar o usuário, execute no SQL Editor:
```sql
-- Substitua 'UUID_AQUI' pelo UUID real do usuário
UPDATE users 
SET status = 'approved', 
    approved_by = 'UUID_AQUI', 
    approved_at = NOW()
WHERE email = 'admin@devtone.agency';
```

### 🔧 **Passo 5: Testar o Login**

1. Acesse `/login`
2. **Email**: admin@devtone.agency
3. **Senha**: DevTone2024!
4. Deve redirecionar para o dashboard admin

## 🔍 **Comandos Úteis para Debugging**

### Ver usuários auth:
```sql
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;
```

### Ver perfis de usuários:
```sql
SELECT id, name, email, role, status, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Confirmar email manualmente:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@devtone.agency';
```

### Aprovar usuário manualmente:
```sql
UPDATE users 
SET status = 'approved', approved_at = NOW() 
WHERE email = 'admin@devtone.agency';
```

## 🚨 **Solução de Problemas**

### Erro 400 (Bad Request)
- ✅ Confirme que email confirmation está desabilitado
- �� Verifique se o usuário existe em auth.users
- ✅ Confirme o email manualmente se necessário

### Usuário não encontrado
- ✅ Execute o script de criação via API
- ✅ Verifique se o trigger está funcionando
- ✅ Crie o perfil manualmente se necessário

### Acesso negado
- ✅ Verifique se o status é 'approved'
- ✅ Confirme se o role é 'admin'
- ✅ Execute o comando de aprovação

## 📁 **Arquivos Criados**

1. **`.env`** - Variáveis de ambiente configuradas
2. **`setup_supabase_devtone.sql`** - Script de configuração completa
3. **`create_admin_via_api.sh`** - Script para criar admin via API
4. **`GUIA_CONFIGURACAO_SUPABASE.md`** - Este guia

## 🎯 **Credenciais do Admin**

- **Email**: admin@devtone.agency
- **Senha**: DevTone2024!
- **Chave Admin**: devtone-admin-2024

## ✅ **Checklist de Verificação**

- [ ] Email confirmation desabilitado no Supabase
- [ ] Script SQL executado com sucesso
- [ ] Usuário admin criado
- [ ] Status do usuário = 'approved'
- [ ] Role do usuário = 'admin'
- [ ] Login funcionando
- [ ] Redirecionamento para dashboard admin

Siga estes passos em ordem e seu sistema de autenticação estará funcionando perfeitamente!