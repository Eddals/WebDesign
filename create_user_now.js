// =====================================================
// CRIAR USUÁRIO IMEDIATAMENTE
// Cole este código no console do navegador (F12)
// =====================================================

async function createUserNow() {
    console.log('🚀 Criando usuário admin...');
    
    const SUPABASE_URL = 'https://csdejqgfzsxcldqqwfds.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ';
    
    try {
        // 1. Criar usuário via signup
        console.log('📝 Fazendo signup...');
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
        console.log('📋 Signup response:', signupData);
        
        if (signupData.user) {
            console.log('✅ Usuário criado!');
            console.log('🆔 ID:', signupData.user.id);
            
            // 2. Testar login imediatamente
            console.log('🔐 Testando login...');
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
            console.log('🔑 Login response:', loginData);
            
            if (loginData.access_token) {
                console.log('✅ LOGIN FUNCIONANDO!');
                console.log('🎫 Token:', loginData.access_token.substring(0, 50) + '...');
                
                // 3. Criar perfil na tabela users
                console.log('👤 Criando perfil...');
                const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${loginData.access_token}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        id: signupData.user.id,
                        name: 'DevTone Admin',
                        email: 'admin@devtone.agency',
                        role: 'admin',
                        status: 'approved'
                    })
                });
                
                console.log('👤 Profile status:', profileResponse.status);
                
                if (profileResponse.ok) {
                    console.log('✅ Perfil criado!');
                } else {
                    const profileError = await profileResponse.text();
                    console.log('❌ Erro no perfil:', profileError);
                }
                
                console.log('');
                console.log('🎉 SUCESSO TOTAL!');
                console.log('📧 Email: admin@devtone.agency');
                console.log('🔑 Senha: admin123');
                console.log('');
                console.log('🔄 Recarregue a página e tente fazer login!');
                
                return true;
            } else {
                console.log('❌ Erro no login:', loginData);
                return false;
            }
        } else {
            console.log('❌ Erro no signup:', signupData);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erro geral:', error);
        return false;
    }
}

// Executar automaticamente
createUserNow();

// Disponibilizar função
window.createUserNow = createUserNow;