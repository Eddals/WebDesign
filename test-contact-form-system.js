// Script de teste para o sistema Contact Form + Supabase + Brevo
// Execute: node test-contact-form-system.js

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = 'https://olblavscnardvgpgeqdk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYmxhdnNjbmFyZHZncGdlcWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTA2NTYsImV4cCI6MjA2Nzg2NjY1Nn0.PG3aZtT4y5AQcZ4HNt6cbeibyQW26gvYC674-wVGPds';

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dados de teste baseados no formulário Contact.tsx
const testContactForm = {
  name: 'João Silva Contact Form',
  email: 'joao.contactform@example.com',
  phone: '+55 11 99999-9999',
  company: 'Empresa Contact Form LTDA',
  subject: 'general-inquiry',
  message: 'Olá! Gostaria de saber mais sobre os serviços de desenvolvimento web da DevTone. Precisamos de um site moderno para nossa empresa.',
  preferred_contact: 'email',
  source: 'contact_page_form',
  status: 'new'
};

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Teste 1: Verificar se a tabela contact_form_messages existe
    const { data: tableInfo, error: tableError } = await supabase
      .from('contact_form_messages')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao acessar tabela contact_form_messages:', tableError.message);
      return false;
    }
    
    console.log('✅ Tabela contact_form_messages acessível');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão Supabase:', error.message);
    return false;
  }
}

async function testContactFormInsertion() {
  console.log('\n📝 Testando inserção de contato do formulário...');
  
  try {
    const { data, error } = await supabase
      .from('contact_form_messages')
      .insert([testContactForm])
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir contato:', error.message);
      
      if (error.message.includes('row-level security policy')) {
        console.log('\n🔧 SOLUÇÃO: Execute o SQL para desabilitar RLS temporariamente:');
        console.log('1. Vá para o Supabase Dashboard');
        console.log('2. Abra o SQL Editor');
        console.log('3. Execute: ALTER TABLE public.contact_form_messages DISABLE ROW LEVEL SECURITY;');
      }
      
      return null;
    }
    
    console.log('✅ Contato do formulário inserido com sucesso:', data[0].id);
    return data[0];
  } catch (error) {
    console.error('❌ Erro na inserção:', error.message);
    return null;
  }
}

async function testContactFormRetrieval() {
  console.log('\n📖 Testando recuperação de contatos do formulário...');
  
  try {
    const { data, error } = await supabase
      .from('contact_form_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Erro ao recuperar contatos:', error.message);
      return false;
    }
    
    console.log(`✅ ${data.length} contatos do formulário recuperados`);
    data.forEach((contact, index) => {
      console.log(`  ${index + 1}. ${contact.name} - ${contact.subject} - ${contact.status} - Prioridade: ${contact.priority}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro na recuperação:', error.message);
    return false;
  }
}

async function testPriorityDetection() {
  console.log('\n🎯 Testando detecção de prioridade...');
  
  const urgentContact = {
    ...testContactForm,
    email: 'urgente.contactform@example.com',
    subject: 'URGENTE - Problema crítico no website',
    message: 'Preciso de ajuda URGENTE! Meu website está fora do ar e preciso resolver isso ASAP!'
  };
  
  try {
    const { data, error } = await supabase
      .from('contact_form_messages')
      .insert([urgentContact])
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir contato urgente:', error.message);
      return false;
    }
    
    console.log('✅ Contato urgente inserido:', data[0].id);
    console.log(`   Prioridade: ${data[0].priority}/5`);
    console.log(`   Urgente: ${data[0].is_urgent ? 'Sim' : 'Não'}`);
    
    return data[0];
  } catch (error) {
    console.error('❌ Erro no teste de prioridade:', error.message);
    return false;
  }
}

async function testEdgeFunction() {
  console.log('\n⚡ Testando Edge Function...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-to-brevo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        record: testContactForm
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
      .from('contact_form_messages')
      .delete()
      .in('email', [testContactForm.email, 'urgente.contactform@example.com']);
    
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
  console.log('🚀 Iniciando testes do sistema Contact Form + Supabase + Brevo\n');
  
  // Teste 1: Conexão Supabase
  const connectionOk = await testSupabaseConnection();
  if (!connectionOk) {
    console.log('\n❌ Teste de conexão falhou. Verifique as configurações do Supabase.');
    return;
  }
  
  // Teste 2: Inserção de contato
  const insertedContact = await testContactFormInsertion();
  if (!insertedContact) {
    console.log('\n❌ Teste de inserção falhou. Verifique as políticas RLS.');
    return;
  }
  
  // Teste 3: Recuperação de contatos
  await testContactFormRetrieval();
  
  // Teste 4: Detecção de prioridade
  await testPriorityDetection();
  
  // Teste 5: Edge Function (opcional - pode falhar se não configurada)
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
  console.log('5. Configure os templates de email no Brevo');
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testSupabaseConnection,
  testContactFormInsertion,
  testContactFormRetrieval,
  testPriorityDetection,
  testEdgeFunction,
  cleanupTestData,
  runAllTests
}; 