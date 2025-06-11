import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNotificationsQuery() {
  console.log('🔍 Testando query das notificações...\n');

  try {
    // 1. Verificar se a tabela existe
    console.log('1. Verificando se a tabela quotes existe...');
    
    const { data: tableCheck, error: tableError } = await supabase
      .from('quotes')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('❌ Tabela quotes não existe ou há erro:', tableError.message);
      console.log('\n💡 SOLUÇÃO:');
      console.log('Execute o arquivo criar-tabela-quotes.sql no Supabase SQL Editor');
      return;
    }

    console.log('✅ Tabela quotes existe');

    // 2. Verificar colunas específicas
    console.log('\n2. Testando colunas individuais...');
    
    const columns = ['id', 'full_name', 'country', 'industry', 'created_at'];
    
    for (const column of columns) {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select(column)
          .limit(1);
        
        if (error) {
          console.error(`❌ Coluna '${column}' não existe:`, error.message);
        } else {
          console.log(`✅ Coluna '${column}' existe`);
        }
      } catch (err) {
        console.error(`❌ Erro ao testar coluna '${column}':`, err.message);
      }
    }

    // 3. Testar query exata das notificações
    console.log('\n3. Testando query exata das notificações...');
    
    const { data: notificationData, error: notificationError } = await supabase
      .from('quotes')
      .select('id, full_name, country, industry, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (notificationError) {
      console.error('❌ Erro na query das notificações:', notificationError);
      console.log('- Código:', notificationError.code);
      console.log('- Mensagem:', notificationError.message);
      console.log('- Detalhes:', notificationError.details);
      
      if (notificationError.code === '42P01') {
        console.log('\n💡 SOLUÇÃO: Tabela não existe');
        console.log('Execute: criar-tabela-quotes.sql');
      } else if (notificationError.code === '42703') {
        console.log('\n💡 SOLUÇÃO: Coluna não existe');
        console.log('Execute: criar-tabela-quotes.sql');
      }
      
      return;
    }

    console.log('✅ Query das notificações funcionou!');
    console.log(`📊 Encontrados ${notificationData.length} registros`);

    if (notificationData.length > 0) {
      console.log('\n📋 Dados encontrados:');
      notificationData.forEach((item, index) => {
        console.log(`${index + 1}. ${item.full_name} - ${item.country} - ${item.industry}`);
      });
    } else {
      console.log('\n⚠️ Nenhum dado encontrado na tabela');
      console.log('💡 Execute criar-tabela-quotes.sql para inserir dados de exemplo');
    }

    // 4. Testar query com filtros (como usado nas notificações)
    console.log('\n4. Testando query com filtros...');
    
    const { data: filteredData, error: filteredError } = await supabase
      .from('quotes')
      .select('id, full_name, country, industry, created_at')
      .not('country', 'is', null)
      .not('industry', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (filteredError) {
      console.error('❌ Erro na query filtrada:', filteredError);
    } else {
      console.log('✅ Query filtrada funcionou!');
      console.log(`📊 Registros com country e industry: ${filteredData.length}`);
    }

    // 5. Testar inserção de novo registro
    console.log('\n5. Testando inserção de novo registro...');
    
    const testRecord = {
      full_name: 'Teste Notificação',
      email: 'teste-notif@exemplo.com',
      country: 'Brazil',
      industry: 'Technology & Software',
      project_type: 'business',
      status: 'pending'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('quotes')
      .insert([testRecord])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir registro de teste:', insertError);
    } else {
      console.log('✅ Registro de teste inserido com sucesso');
      console.log('ID:', insertData[0].id);

      // Limpar registro de teste
      await supabase
        .from('quotes')
        .delete()
        .eq('email', 'teste-notif@exemplo.com');
      
      console.log('✅ Registro de teste removido');
    }

    console.log('\n🎉 TESTE DAS NOTIFICAÇÕES COMPLETO!');
    console.log('\nSe todos os testes passaram:');
    console.log('✅ A tabela está configurada corretamente');
    console.log('✅ As notificações devem funcionar');
    console.log('✅ O formulário deve salvar dados');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
    console.log('\n💡 Soluções:');
    console.log('1. Execute criar-tabela-quotes.sql no Supabase');
    console.log('2. Verifique se o projeto Supabase está ativo');
    console.log('3. Confirme as credenciais no arquivo .env');
  }
}

// Executar teste
testNotificationsQuery();
