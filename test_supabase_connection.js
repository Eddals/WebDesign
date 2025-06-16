// =====================================================
// TESTE DE CONEXÃO SUPABASE
// Execute no console do navegador (F12)
// =====================================================

// Configurações diretas
const SUPABASE_URL = 'https://csdejqgfzsxcldqqwfds.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ';

console.log('🔍 Testando conexão Supabase...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY.substring(0, 50) + '...');

// Teste 1: Verificar se as variáveis estão sendo lidas
console.log('\n📋 Variáveis de ambiente:');
console.log('VITE_SUPABASE_URL:', import.meta?.env?.VITE_SUPABASE_URL || 'UNDEFINED');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta?.env?.VITE_SUPABASE_ANON_KEY?.substring(0, 50) + '...' || 'UNDEFINED');

// Teste 2: Conexão direta via fetch
async function testDirectConnection() {
    console.log('\n🌐 Testando conexão direta...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        console.log('Status:', response.status);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            console.log('✅ Conexão direta OK!');
        } else {
            console.log('❌ Erro na conexão:', response.statusText);
        }
    } catch (error) {
        console.log('❌ Erro de rede:', error);
    }
}

// Teste 3: Testar auth endpoint
async function testAuthEndpoint() {
    console.log('\n🔐 Testando endpoint de auth...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY
            }
        });
        
        const data = await response.json();
        console.log('Auth settings:', data);
        
        if (response.ok) {
            console.log('✅ Auth endpoint OK!');
        } else {
            console.log('❌ Erro no auth:', data);
        }
    } catch (error) {
        console.log('❌ Erro no auth:', error);
    }
}

// Teste 4: Criar cliente Supabase manualmente
async function testSupabaseClient() {
    console.log('\n📦 Testando cliente Supabase...');
    
    try {
        // Importar Supabase se disponível
        if (typeof window !== 'undefined' && window.supabase) {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Cliente criado:', client);
            
            // Testar uma query simples
            const { data, error } = await client.from('users').select('count');
            console.log('Query result:', { data, error });
            
            if (!error) {
                console.log('✅ Cliente Supabase funcionando!');
            } else {
                console.log('❌ Erro na query:', error);
            }
        } else {
            console.log('❌ Supabase não disponível no window');
        }
    } catch (error) {
        console.log('❌ Erro no cliente:', error);
    }
}

// Teste 5: Verificar se o projeto está ativo
async function testProjectStatus() {
    console.log('\n🏗️ Verificando status do projeto...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=count`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
            }
        });
        
        console.log('Status da tabela users:', response.status);
        
        if (response.status === 200) {
            console.log('✅ Projeto ativo e tabela acessível!');
        } else if (response.status === 404) {
            console.log('❌ Tabela users não existe');
        } else if (response.status === 401) {
            console.log('❌ Não autorizado - verifique a API key');
        } else {
            console.log('❌ Status inesperado:', response.status);
        }
        
        const responseText = await response.text();
        console.log('Response:', responseText);
        
    } catch (error) {
        console.log('❌ Erro na verificação:', error);
    }
}

// Executar todos os testes
async function runAllTests() {
    console.log('🚀 Iniciando testes de conexão Supabase...\n');
    
    await testDirectConnection();
    await testAuthEndpoint();
    await testSupabaseClient();
    await testProjectStatus();
    
    console.log('\n✅ Testes concluídos!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Se todos os testes passaram, o problema pode ser nas variáveis de ambiente');
    console.log('2. Se algum teste falhou, verifique as configurações do Supabase');
    console.log('3. Certifique-se de que o projeto Supabase está ativo');
}

// Disponibilizar funções no console
window.testSupabaseConnection = runAllTests;
window.testDirectConnection = testDirectConnection;
window.testAuthEndpoint = testAuthEndpoint;
window.testSupabaseClient = testSupabaseClient;
window.testProjectStatus = testProjectStatus;

console.log('🔧 Funções disponíveis:');
console.log('- testSupabaseConnection() // executa todos os testes');
console.log('- testDirectConnection()');
console.log('- testAuthEndpoint()');
console.log('- testSupabaseClient()');
console.log('- testProjectStatus()');
console.log('\n▶️ Execute: testSupabaseConnection()');

// Auto-executar se chamado diretamente
if (typeof window !== 'undefined') {
    runAllTests();
}