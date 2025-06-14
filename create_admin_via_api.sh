#!/bin/bash

# =====================================================
# CRIAR USUÁRIO ADMIN VIA API SUPABASE
# Execute este script no terminal
# =====================================================

echo "🚀 Criando usuário admin via API Supabase..."

# Configurações do projeto
SUPABASE_URL="https://csdejqgfzsxcldqqwfds.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ"

# Dados do admin
ADMIN_EMAIL="admin@devtone.agency"
ADMIN_PASSWORD="DevTone2024!"
ADMIN_NAME="DevTone Admin"

echo "📧 Email: $ADMIN_EMAIL"
echo "🔑 Password: $ADMIN_PASSWORD"
echo ""

# Criar usuário via API
echo "🔄 Criando usuário auth..."
RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"${ADMIN_PASSWORD}\",
    \"data\": {
      \"name\": \"${ADMIN_NAME}\",
      \"role\": \"admin\"
    }
  }")

echo "📋 Resposta da API:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Extrair UUID do usuário (se jq estiver disponível)
if command -v jq &> /dev/null; then
    USER_ID=$(echo "$RESPONSE" | jq -r '.user.id // empty')
    if [ ! -z "$USER_ID" ] && [ "$USER_ID" != "null" ]; then
        echo "✅ Usuário criado com sucesso!"
        echo "🆔 UUID: $USER_ID"
        echo ""
        echo "📝 Agora execute este SQL no Supabase para aprovar o admin:"
        echo ""
        echo "UPDATE users"
        echo "SET status = 'approved',"
        echo "    approved_by = '$USER_ID',"
        echo "    approved_at = NOW()"
        echo "WHERE id = '$USER_ID';"
        echo ""
        echo "OU execute este comando completo:"
        echo ""
        echo "INSERT INTO users (id, name, email, role, status, approved_by, approved_at)"
        echo "VALUES ('$USER_ID', '$ADMIN_NAME', '$ADMIN_EMAIL', 'admin', 'approved', '$USER_ID', NOW())"
        echo "ON CONFLICT (id) DO UPDATE SET"
        echo "    role = 'admin',"
        echo "    status = 'approved',"
        echo "    approved_by = '$USER_ID',"
        echo "    approved_at = NOW();"
    else
        echo "❌ Erro ao criar usuário. Verifique a resposta acima."
    fi
else
    echo "⚠️  jq não encontrado. Verifique a resposta manualmente para obter o UUID."
fi

echo ""
echo "🔧 Próximos passos:"
echo "1. Execute o SQL mostrado acima no Supabase SQL Editor"
echo "2. Desabilite confirmação de email no dashboard Supabase"
echo "3. Teste o login com as credenciais:"
echo "   Email: $ADMIN_EMAIL"
echo "   Password: $ADMIN_PASSWORD"