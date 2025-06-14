#!/bin/bash

# =====================================================
# VERIFICAR SERVIDOR DE DESENVOLVIMENTO
# Execute este script para verificar se tudo está funcionando
# =====================================================

echo "🔍 Verificando configuração do projeto..."

# 1. Verificar se o arquivo .env existe
echo ""
echo "📁 Verificando arquivo .env..."
if [ -f ".env" ]; then
    echo "✅ Arquivo .env encontrado"
    echo "📋 Conteúdo do .env:"
    cat .env | grep -E "VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY"
else
    echo "❌ Arquivo .env não encontrado!"
    echo "Criando arquivo .env..."
    cat > .env << EOF
VITE_SUPABASE_URL=https://csdejqgfzsxcldqqwfds.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ
VITE_APP_URL=http://localhost:5173
EOF
    echo "✅ Arquivo .env criado"
fi

# 2. Verificar se as dependências estão instaladas
echo ""
echo "📦 Verificando dependências..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules encontrado"
else
    echo "❌ node_modules não encontrado!"
    echo "Execute: npm install"
fi

# 3. Verificar se o package.json tem as dependências do Supabase
echo ""
echo "🔧 Verificando dependências do Supabase..."
if grep -q "@supabase/supabase-js" package.json; then
    echo "✅ @supabase/supabase-js encontrado no package.json"
else
    echo "❌ @supabase/supabase-js não encontrado!"
    echo "Execute: npm install @supabase/supabase-js"
fi

# 4. Testar conexão com Supabase
echo ""
echo "🌐 Testando conexão com Supabase..."
curl -s -o /dev/null -w "%{http_code}" https://csdejqgfzsxcldqqwfds.supabase.co/rest/v1/ \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ" | {
  read status_code
  if [ "$status_code" = "200" ]; then
    echo "✅ Conexão com Supabase OK (Status: $status_code)"
  else
    echo "❌ Problema na conexão com Supabase (Status: $status_code)"
  fi
}

# 5. Verificar se o servidor está rodando
echo ""
echo "🚀 Verificando servidor de desenvolvimento..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Servidor rodando em http://localhost:5173"
else
    echo "❌ Servidor não está rodando!"
    echo "Execute: npm run dev"
fi

# 6. Instruções finais
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Se o servidor não estiver rodando: npm run dev"
echo "2. Se as dependências estiverem faltando: npm install"
echo "3. Acesse: http://localhost:5173/login"
echo "4. Use o painel de debug no canto superior direito"
echo "5. Credenciais de teste: admin@devtone.agency / admin123"

echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "npm run dev          # Iniciar servidor"
echo "npm install          # Instalar dependências"
echo "npm run build        # Build para produção"

echo ""
echo "✅ Verificação concluída!"