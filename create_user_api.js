// =====================================================
// CRIAR USUÁRIO VIA API SUPABASE
// Execute este script no console do navegador ou Node.js
// =====================================================

// Configurações do Supabase
const SUPABASE_URL = 'https://csdejqgfzsxcldqqwfds.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ';

// Função para criar usuário
async function createAdminUser() {
    console.log('🚀 Criando usuário admin...');
    
    try {
        // 1. Criar usuário via signup
        const signupResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@devtone.agency',
                password: 'admin123',
                data: {
                    name: 'DevTone Admin',
                    role: 'admin'
                }
            })
        });
        
        const signupData = await signupResponse.json();
        console.log('📋 Resposta do signup:', signupData);
        
        if (signupData.user) {
            console.log('✅ Usuário criado com sucesso!');
            console.log('🆔 UUID:', signupData.user.id);
            
            // 2. Confirmar email automaticamente
            if (signupData.user.id) {
                console.log('📧 Confirmando email...');
                
                // Usar service_role key se disponível (mais permissões)
                const confirmResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${signupData.user.id}`, {
                    method: 'PUT',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email_confirm: true
                    })
                });
                
                console.log('📧 Status confirmação:', confirmResponse.status);
            }
            
            return signupData.user;
        } else {
            console.error('❌ Erro no signup:', signupData);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
        return null;
    }
}

// Função para testar login
async function testLogin() {
    console.log('🔐 Testando login...');
    
    try {
        const loginResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@devtone.agency',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('📋 Resposta do login:', loginData);
        
        if (loginData.access_token) {
            console.log('✅ Login bem-sucedido!');
            console.log('🎫 Token:', loginData.access_token.substring(0, 50) + '...');
            return true;
        } else {
            console.error('❌ Erro no login:', loginData);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro no login:', error);
        return false;
    }
}

// Executar as funções
async function main() {
    console.log('🚀 Iniciando criação de usuário admin...');
    console.log('📧 Email: admin@devtone.agency');
    console.log('🔑 Senha: admin123');
    console.log('');
    
    // Criar usuário
    const user = await createAdminUser();
    
    if (user) {
        console.log('');
        console.log('⏳ Aguardando 2 segundos...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Testar login
        const loginSuccess = await testLogin();
        
        if (loginSuccess) {
            console.log('');
            console.log('🎉 SUCESSO! Usuário criado e login funcionando!');
            console.log('');
            console.log('📋 Credenciais:');
            console.log('   Email: admin@devtone.agency');
            console.log('   Senha: admin123');
            console.log('');
            console.log('🔧 Próximos passos:');
            console.log('1. Tente fazer login no seu app');
            console.log('2. Se não funcionar, execute o SQL para criar o perfil');
        }
    }
}

// Executar se estiver no Node.js
if (typeof window === 'undefined') {
    main();
} else {
    // Se estiver no navegador, disponibilizar as funções
    window.createAdminUser = createAdminUser;
    window.testLogin = testLogin;
    window.main = main;
    
    console.log('🌐 Funções disponíveis no console:');
    console.log('- createAdminUser()');
    console.log('- testLogin()');
    console.log('- main() // executa tudo');
    console.log('');
    console.log('Execute: main()');
}