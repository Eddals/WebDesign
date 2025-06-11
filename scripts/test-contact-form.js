import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xurhlxnscjjkryrmmubc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmhseG5zY2pqa3J5cm1tdWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTcwMDMsImV4cCI6MjA2NDgzMzAwM30.2zpHBI6CDrpHVQEYH6JQtiUyhJALVUHFEBo1lRt2R3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testContactForm() {
  console.log('🔍 Testando integração do formulário de contato...\n');

  try {
    // 1. Verificar se a tabela contacts existe
    console.log('1. Verificando se a tabela contacts existe...');
    
    const { data: tableCheck, error: tableError } = await supabase
      .from('contacts')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('❌ Tabela contacts não existe ou há erro:', tableError.message);
      console.log('\n💡 SOLUÇÃO:');
      console.log('Execute o arquivo criar-tabela-contacts.sql no Supabase SQL Editor');
      return;
    }

    console.log('✅ Tabela contacts existe');

    // 2. Verificar colunas específicas do formulário de contato
    console.log('\n2. Testando colunas do formulário de contato...');
    
    const contactColumns = ['id', 'full_name', 'email', 'phone', 'company', 'subject', 'message', 'preferred_contact', 'created_at'];
    
    for (const column of contactColumns) {
      try {
        const { data, error } = await supabase
          .from('contacts')
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

    // 3. Testar inserção de contato (simulando formulário)
    console.log('\n3. Testando inserção de contato...');
    
    const testContactData = {
      full_name: 'Teste Contato',
      email: 'teste-contato@exemplo.com',
      phone: '+55-11-99999-9999',
      company: 'Empresa Teste',
      subject: 'general-inquiry',
      message: 'Esta é uma mensagem de teste para verificar se o formulário de contato está funcionando corretamente.',
      preferred_contact: 'email',
      status: 'new'
    };

    console.log('Dados a serem inseridos:', JSON.stringify(testContactData, null, 2));

    const { data: insertData, error: insertError } = await supabase
      .from('contacts')
      .insert([testContactData])
      .select();

    if (insertError) {
      console.error('❌ Erro na inserção do contato:', insertError);
      console.log('- Código:', insertError.code);
      console.log('- Mensagem:', insertError.message);
      
      if (insertError.code === '42P01') {
        console.log('\n💡 SOLUÇÃO: Tabela não existe');
        console.log('Execute: criar-tabela-contacts.sql');
      } else if (insertError.code === '42703') {
        console.log('\n💡 SOLUÇÃO: Coluna não existe');
        console.log('Execute: criar-tabela-contacts.sql');
      }
      
      return;
    }

    console.log('✅ Contato inserido com sucesso!');
    console.log('ID:', insertData[0].id);
    console.log('Nome:', insertData[0].full_name);
    console.log('Email:', insertData[0].email);
    console.log('Assunto:', insertData[0].subject);

    // 4. Verificar se os dados foram salvos corretamente
    console.log('\n4. Verificando dados salvos...');
    const { data: savedData, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', 'teste-contato@exemplo.com')
      .single();

    if (fetchError) {
      console.error('❌ Erro ao buscar dados salvos:', fetchError);
    } else {
      console.log('✅ Dados encontrados na tabela:');
      console.log('- Nome:', savedData.full_name);
      console.log('- Email:', savedData.email);
      console.log('- Empresa:', savedData.company);
      console.log('- Assunto:', savedData.subject);
      console.log('- Mensagem:', savedData.message.substring(0, 50) + '...');
      console.log('- Contato preferido:', savedData.preferred_contact);
      console.log('- Status:', savedData.status);
    }

    // 5. Testar busca de contatos por status
    console.log('\n5. Testando busca por status...');
    const { data: statusData, error: statusError } = await supabase
      .from('contacts')
      .select('id, full_name, email, subject, status, created_at')
      .eq('status', 'new')
      .order('created_at', { ascending: false })
      .limit(5);

    if (statusError) {
      console.error('❌ Erro na busca por status:', statusError);
    } else {
      console.log('✅ Contatos com status "new":');
      statusData.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.full_name} - ${contact.subject} - ${contact.email}`);
      });
    }

    // 6. Testar diferentes tipos de assunto
    console.log('\n6. Testando diferentes assuntos...');
    
    const testSubjects = [
      {
        full_name: 'João Teste',
        email: 'joao-teste@exemplo.com',
        subject: 'technical-support',
        message: 'Preciso de suporte técnico',
        preferred_contact: 'phone'
      },
      {
        full_name: 'Maria Teste',
        email: 'maria-teste@exemplo.com',
        subject: 'billing-question',
        message: 'Tenho dúvidas sobre preços',
        preferred_contact: 'email'
      }
    ];

    for (const [index, testSubject] of testSubjects.entries()) {
      const { data: subjectData, error: subjectError } = await supabase
        .from('contacts')
        .insert([{ ...testSubject, status: 'new' }])
        .select('id, full_name, subject');

      if (subjectError) {
        console.error(`❌ Teste ${index + 1} falhou:`, subjectError.message);
      } else {
        console.log(`✅ Teste ${index + 1}: ${subjectData[0].full_name} - ${subjectData[0].subject}`);
      }
    }

    // 7. Limpeza dos dados de teste
    console.log('\n7. Limpando dados de teste...');
    
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .in('email', ['teste-contato@exemplo.com', 'joao-teste@exemplo.com', 'maria-teste@exemplo.com']);

    if (deleteError) {
      console.error('❌ Erro ao limpar dados de teste:', deleteError);
    } else {
      console.log('✅ Dados de teste removidos');
    }

    console.log('\n🎉 TESTE DO FORMULÁRIO DE CONTATO COMPLETO!');
    console.log('\n✅ Formulário de contato está pronto para:');
    console.log('   📝 Receber mensagens de contato');
    console.log('   💾 Salvar dados no banco');
    console.log('   📊 Gerenciar status dos contatos');
    console.log('   🔍 Buscar e filtrar mensagens');
    console.log('\n🚀 Teste o formulário em /contact');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
    console.log('\n💡 Soluções:');
    console.log('1. Execute criar-tabela-contacts.sql no Supabase');
    console.log('2. Verifique se o projeto Supabase está ativo');
    console.log('3. Confirme as credenciais no arquivo .env');
  }
}

// Executar teste
testContactForm();
