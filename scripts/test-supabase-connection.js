// Teste simples de conexão com Supabase
console.log('🔍 Testando conexão com Supabase...\n');

// Verificar variáveis de ambiente
console.log('1. Verificando variáveis de ambiente:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'NÃO DEFINIDA');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA');

// Teste direto com fetch
async function testDirectConnection() {
  console.log('\n2. Testando conexão direta...');
  
  const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';
  
  try {
    // Teste de conexão básica
    const response = await fetch(`${supabaseUrl}/rest/v1/quotes?select=count`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    });
    
    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Conexão com Supabase funcionando!');
      
      // Teste de inserção
      console.log('\n3. Testando inserção...');
      
      const testData = {
        full_name: 'Teste Direto',
        email: 'teste-direto@exemplo.com',
        country: 'Brazil',
        industry: 'Technology & Software',
        project_type: 'business',
        status: 'pending'
      };
      
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/quotes`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Status da inserção:', insertResponse.status);
      
      if (insertResponse.ok) {
        const insertedData = await insertResponse.json();
        console.log('✅ Inserção bem-sucedida!');
        console.log('Dados inseridos:', insertedData);
        
        // Limpar dados de teste
        const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/quotes?email=eq.teste-direto@exemplo.com`, {
          method: 'DELETE',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Dados de teste removidos');
        }
        
      } else {
        const errorText = await insertResponse.text();
        console.error('❌ Erro na inserção:', errorText);
      }
      
    } else {
      const errorText = await response.text();
      console.error('❌ Erro na conexão:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste
testDirectConnection();
