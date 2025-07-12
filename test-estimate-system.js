// Script de teste para o sistema Estimate + Supabase + Brevo
// Execute: node test-estimate-system.js

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = 'https://olblavscnardvgpgeqdk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYmxhdnNjbmFyZHZncGdlcWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTA2NTYsImV4cCI6MjA2Nzg2NjY1Nn0.PG3aZtT4y5AQcZ4HNt6cbeibyQW26gvYC674-wVGPds';

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dados de teste
const testEstimate = {
  name: 'João Silva Teste',
  email: 'joao.teste@example.com',
  company: 'Empresa Teste LTDA',
  industry: 'Tecnologia',
  project_type: 'landing',
  budget: '$500 - $1,500',
  timeline: '1 Month',
  description: 'Projeto de teste para verificar o sistema',
  features: ['contact_form', 'blog', 'seo'],
  retainer: 'basic',
  source: 'test_script',
  status: 'pending'
};

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Teste 1: Verificar se a tabela estimates existe
    const { data: tableInfo, error: tableError } = await supabase
      .from('estimates')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao acessar tabela estimates:', tableError.message);
      return false;
    }
    
    console.log('✅ Tabela estimates acessível');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão Supabase:', error.message);
    return false;
  }
}

async function testEstimateInsertion() {
  console.log('\n📝 Testando inserção de estimate...');
  
  try {
    const { data, error } = await supabase
      .from('estimates')
      .insert([testEstimate])
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir estimate:', error.message);
      return null;
    }
    
    console.log('✅ Estimate inserido com sucesso:', data[0].id);
    return data[0];
  } catch (error) {
    console.error('❌ Erro na inserção:', error.message);
    return null;
  }
}

async function testEstimateRetrieval() {
  console.log('\n📖 Testando recuperação de estimates...');
  
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Erro ao recuperar estimates:', error.message);
      return false;
    }
    
    console.log(`✅ ${data.length} estimates recuperados`);
    data.forEach((estimate, index) => {
      console.log(`  ${index + 1}. ${estimate.name} - ${estimate.project_type} - ${estimate.status}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro na recuperação:', error.message);
    return false;
  }
}

async function testEdgeFunction() {
  console.log('\n⚡ Testando Edge Function...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-estimate-to-brevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        record: testEstimate
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Edge Function error:', response.status, errorText);
      return false;
    }
    
    const result = await response.json();
    console.log('✅ Edge Function executada com sucesso:', result.message);
    return true;
  } catch (error) {
    console.error('❌ Erro na Edge Function:', error.message);
    return false;
  }
}

async function cleanupTestData() {
  console.log('\n🧹 Limpando dados de teste...');
  
  try {
    const { error } = await supabase
      .from('estimates')
      .delete()
      .eq('email', testEstimate.email);
    
    if (error) {
      console.error('❌ Erro ao limpar dados:', error.message);
      return false;
    }
    
    console.log('✅ Dados de teste removidos');
    return true;
  } catch (error) {
    console.error('❌ Erro na limpeza:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes do sistema Estimate + Supabase + Brevo\n');
  
  // Teste 1: Conexão Supabase
  const connectionOk = await testSupabaseConnection();
  if (!connectionOk) {
    console.log('\n❌ Teste de conexão falhou. Verifique as configurações do Supabase.');
    return;
  }
  
  // Teste 2: Inserção de estimate
  const insertedEstimate = await testEstimateInsertion();
  if (!insertedEstimate) {
    console.log('\n❌ Teste de inserção falhou. Verifique as políticas RLS.');
    return;
  }
  
  // Teste 3: Recuperação de estimates
  await testEstimateRetrieval();
  
  // Teste 4: Edge Function (opcional - pode falhar se não configurada)
  try {
    await testEdgeFunction();
  } catch (error) {
    console.log('⚠️ Edge Function não testada (pode não estar configurada)');
  }
  
  // Limpeza
  await cleanupTestData();
  
  console.log('\n✅ Todos os testes concluídos!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure a Edge Function no Supabase Dashboard');
  console.log('2. Configure as variáveis de ambiente (BREVO_API_KEY)');
  console.log('3. Teste o formulário no frontend');
  console.log('4. Verifique se os dados chegam ao Brevo');
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testSupabaseConnection,
  testEstimateInsertion,
  testEstimateRetrieval,
  testEdgeFunction,
  cleanupTestData,
  runAllTests
}; 