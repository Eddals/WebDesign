import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugFormSubmission() {
  console.log('🔍 Diagnosticando problema de submissão do formulário...\n');

  try {
    // 1. Testar conexão básica
    console.log('1. Testando conexão com Supabase...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('quotes')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Erro de conexão:', connectionError.message);
      if (connectionError.code === '42P01') {
        console.log('💡 Tabela "quotes" não existe! Execute o SQL primeiro.');
        return;
      }
    } else {
      console.log('✅ Conexão com Supabase funcionando');
    }

    // 2. Verificar estrutura da tabela
    console.log('\n2. Verificando estrutura da tabela quotes...');
    const { data: tableStructure, error: structureError } = await supabase
      .rpc('get_table_columns', { table_name: 'quotes' })
      .catch(() => null);

    // Método alternativo para verificar colunas
    const { data: sampleData, error: sampleError } = await supabase
      .from('quotes')
      .select('*')
      .limit(1);

    if (sampleError && sampleError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar tabela:', sampleError.message);
    } else {
      console.log('✅ Tabela quotes acessível');
    }

    // 3. Testar inserção com dados exatos do formulário
    console.log('\n3. Testando inserção com dados do formulário...');
    
    const testFormData = {
      full_name: 'Teste Usuario',
      email: 'teste@exemplo.com',
      phone: '+55-11-99999-9999',
      company: 'Empresa Teste',
      country: 'Brazil',
      industry: 'Technology & Software',
      project_type: 'business',
      description: 'Projeto de teste para verificar integração',
      budget_range: 'professional',
      timeline: '1month',
      features: ['seo', 'analytics'],
      status: 'pending'
    };

    console.log('Dados a serem inseridos:', JSON.stringify(testFormData, null, 2));

    const { data: insertData, error: insertError } = await supabase
      .from('quotes')
      .insert([testFormData])
      .select();

    if (insertError) {
      console.error('❌ Erro na inserção:', insertError);
      console.log('\n🔍 Detalhes do erro:');
      console.log('- Código:', insertError.code);
      console.log('- Mensagem:', insertError.message);
      console.log('- Detalhes:', insertError.details);
      
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n💡 Solução: Execute este SQL no Supabase SQL Editor:');
        console.log('ALTER TABLE quotes ADD COLUMN industry TEXT;');
      }
      
      if (insertError.message.includes('permission denied')) {
        console.log('\n💡 Problema de permissão. Verifique:');
        console.log('1. RLS (Row Level Security) está desabilitado para testes');
        console.log('2. Políticas de acesso estão configuradas corretamente');
      }
      
      return;
    }

    console.log('✅ Inserção bem-sucedida!');
    console.log('ID inserido:', insertData[0].id);

    // 4. Verificar se os dados foram salvos corretamente
    console.log('\n4. Verificando dados salvos...');
    const { data: savedData, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .eq('email', 'teste@exemplo.com')
      .single();

    if (fetchError) {
      console.error('❌ Erro ao buscar dados salvos:', fetchError);
    } else {
      console.log('✅ Dados encontrados na tabela:');
      console.log('- Nome:', savedData.full_name);
      console.log('- Email:', savedData.email);
      console.log('- País:', savedData.country);
      console.log('- Indústria:', savedData.industry);
      console.log('- Tipo de projeto:', savedData.project_type);
      console.log('- Features:', savedData.features);
    }

    // 5. Testar busca para notificações
    console.log('\n5. Testando busca para notificações...');
    const { data: notificationData, error: notificationError } = await supabase
      .from('quotes')
      .select('id, full_name, country, industry, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (notificationError) {
      console.error('❌ Erro na busca para notificações:', notificationError);
    } else {
      console.log('✅ Dados para notificações:');
      notificationData.forEach((item, index) => {
        console.log(`${index + 1}. ${item.full_name} - ${item.country} - ${item.industry}`);
      });
    }

    // 6. Limpeza dos dados de teste
    console.log('\n6. Limpando dados de teste...');
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .eq('email', 'teste@exemplo.com');

    if (deleteError) {
      console.error('❌ Erro ao limpar dados de teste:', deleteError);
    } else {
      console.log('✅ Dados de teste removidos');
    }

    console.log('\n🎉 DIAGNÓSTICO COMPLETO!');
    console.log('\nSe todos os testes passaram, o formulário deveria estar funcionando.');
    console.log('Se houver erros, siga as soluções sugeridas acima.');

  } catch (error) {
    console.error('❌ Erro geral no diagnóstico:', error);
    console.log('\n💡 Verificações básicas:');
    console.log('1. Arquivo .env existe e tem as credenciais corretas?');
    console.log('2. Tabela quotes foi criada no Supabase?');
    console.log('3. Projeto Supabase está ativo?');
    console.log('4. Conexão com internet está funcionando?');
  }
}

// Executar diagnóstico
debugFormSubmission();
