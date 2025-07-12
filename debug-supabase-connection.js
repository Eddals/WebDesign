// Script para diagnosticar problemas de conexão com o Supabase
// Execute: node debug-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = 'https://olblavscnardvgpgeqdk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYmxhdnNjbmFyZHZncGdlcWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTA2NTYsImV4cCI6MjA2Nzg2NjY1Nn0.PG3aZtT4y5AQcZ4HNt6cbeibyQW26gvYC674-wVGPds';

async function testNetworkConnectivity() {
  console.log('🌐 Testando conectividade de rede...');
  
  try {
    // Teste 1: DNS Resolution
    console.log('1. Testando resolução DNS...');
    const dns = require('dns').promises;
    const hostname = 'olblavscnardvgpgeqdk.supabase.co';
    
    try {
      const addresses = await dns.resolve4(hostname);
      console.log(`✅ DNS resolvido: ${hostname} → ${addresses.join(', ')}`);
    } catch (dnsError) {
      console.error(`❌ Erro DNS: ${dnsError.message}`);
      return false;
    }
    
    // Teste 2: HTTP Connectivity
    console.log('2. Testando conectividade HTTP...');
    const https = require('https');
    
    const testHttp = () => {
      return new Promise((resolve, reject) => {
        const req = https.get(SUPABASE_URL, (res) => {
          console.log(`✅ HTTP Status: ${res.statusCode}`);
          resolve(true);
        });
        
        req.on('error', (error) => {
          console.error(`❌ HTTP Error: ${error.message}`);
          reject(error);
        });
        
        req.setTimeout(10000, () => {
          console.error('❌ HTTP Timeout');
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
    };
    
    await testHttp();
    return true;
    
  } catch (error) {
    console.error('❌ Erro na conectividade:', error.message);
    return false;
  }
}

async function testSupabaseClient() {
  console.log('\n🔧 Testando cliente Supabase...');
  
  try {
    // Criar cliente
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Cliente Supabase criado');
    
    // Teste 1: Verificar se a tabela existe
    console.log('1. Verificando se a tabela contacts existe...');
    const { data: tableTest, error: tableError } = await supabase
      .from('contacts')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao acessar tabela contacts:', tableError.message);
      
      if (tableError.message.includes('does not exist')) {
        console.log('🔧 SOLUÇÃO: Execute o SQL para criar a tabela:');
        console.log('   - Vá para o Supabase Dashboard');
        console.log('   - Abra o SQL Editor');
        console.log('   - Execute o conteúdo de contacts-table-supabase.sql');
      }
      
      return false;
    }
    
    console.log('✅ Tabela contacts acessível');
    
    // Teste 2: Tentar inserção
    console.log('2. Testando inserção...');
    const testData = {
      full_name: 'Test Connection',
      email: 'test@connection.com',
      subject: 'Connection Test',
      message: 'Testing connection',
      source: 'debug_script'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('contacts')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('❌ Erro na inserção:', insertError.message);
      
      if (insertError.message.includes('row-level security policy')) {
        console.log('🔧 SOLUÇÃO: Desabilite RLS temporariamente:');
        console.log('   - Execute: ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;');
      }
      
      return false;
    }
    
    console.log('✅ Inserção bem-sucedida:', insertData[0].id);
    
    // Limpar dados de teste
    await supabase
      .from('contacts')
      .delete()
      .eq('email', 'test@connection.com');
    
    console.log('✅ Dados de teste removidos');
    return true;
    
  } catch (error) {
    console.error('❌ Erro no cliente Supabase:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔍 Verificando variáveis de ambiente...');
  
  // Simular verificação de variáveis de ambiente
  const envVars = {
    'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL || 'Não definida',
    'VITE_SUPABASE_ANON_KEY': process.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida'
  };
  
  console.log('Variáveis de ambiente:');
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  if (envVars['VITE_SUPABASE_URL'] === 'Não definida') {
    console.log('⚠️ VITE_SUPABASE_URL não definida, usando valor padrão');
  }
  
  if (envVars['VITE_SUPABASE_ANON_KEY'] === 'Não definida') {
    console.log('⚠️ VITE_SUPABASE_ANON_KEY não definida, usando valor padrão');
  }
  
  return true;
}

async function runDiagnostics() {
  console.log('🔍 Iniciando diagnóstico do Supabase...\n');
  
  // Teste 1: Conectividade de rede
  const networkOk = await testNetworkConnectivity();
  if (!networkOk) {
    console.log('\n❌ Problema de conectividade detectado.');
    console.log('🔧 Verifique:');
    console.log('   - Sua conexão com a internet');
    console.log('   - Firewall/antivírus');
    console.log('   - Proxy/VPN');
    return;
  }
  
  // Teste 2: Variáveis de ambiente
  await testEnvironmentVariables();
  
  // Teste 3: Cliente Supabase
  const clientOk = await testSupabaseClient();
  if (!clientOk) {
    console.log('\n❌ Problema com o cliente Supabase detectado.');
    console.log('🔧 Verifique:');
    console.log('   - Configuração do projeto no Supabase');
    console.log('   - Chaves de API');
    console.log('   - Políticas RLS');
    return;
  }
  
  console.log('\n✅ Todos os testes passaram!');
  console.log('🎉 O Supabase está funcionando corretamente.');
  console.log('\n📋 Se ainda houver problemas no frontend:');
  console.log('1. Verifique o console do navegador');
  console.log('2. Verifique se não há bloqueadores de CORS');
  console.log('3. Verifique se o domínio está autorizado no Supabase');
}

// Executar diagnóstico se o script for chamado diretamente
if (require.main === module) {
  runDiagnostics().catch(console.error);
}

module.exports = {
  testNetworkConnectivity,
  testSupabaseClient,
  testEnvironmentVariables,
  runDiagnostics
}; 