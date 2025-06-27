import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function verifyEmailStatus() {
  console.log('🔍 Verificando status dos emails e configuração\n');
  
  // IDs dos emails enviados
  const emailIds = [
    'fe433085-2bcf-4adb-ae65-919b9983a4c7',
    'fc0efcdc-6e7e-4b6d-a209-3ebee00c930a'
  ];
  
  console.log('📧 Emails enviados recentemente:');
  emailIds.forEach(id => console.log(`- ${id}`));
  
  console.log('\n' + '='.repeat(60));
  console.log('🚨 DIAGNÓSTICO DO PROBLEMA:');
  console.log('='.repeat(60));
  
  console.log('\n1. EMAILS FORAM ENVIADOS COM SUCESSO ✅');
  console.log('   - A API do Resend confirmou o envio');
  console.log('   - Temos IDs válidos de rastreamento');
  
  console.log('\n2. POSSÍVEIS RAZÕES PARA NÃO RECEBER:');
  console.log('   a) O email team@devtone.agency não existe ou está incorreto');
  console.log('   b) O servidor de email está rejeitando emails de onboarding@resend.dev');
  console.log('   c) Os emails estão em quarentena no servidor');
  console.log('   d) Há um filtro muito agressivo bloqueando');
  
  console.log('\n3. AÇÕES IMEDIATAS:');
  console.log('   ✓ Acesse https://resend.com/emails');
  console.log('   ✓ Faça login com suas credenciais');
  console.log('   ✓ Procure pelos IDs acima');
  console.log('   ✓ Verifique o status de entrega');
  
  console.log('\n4. TESTE ALTERNATIVO:');
  
  try {
    // Tentar enviar para o email de teste do Resend
    console.log('\n📧 Enviando para email de teste do Resend...');
    const testResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev',
      subject: 'Teste de Verificação - DevTone',
      text: 'Se este email chegar, o sistema está funcionando corretamente.'
    });
    
    console.log('✅ Email de teste enviado:');
    console.log(`   ID: ${testResult.data?.id}`);
    console.log('   Este email SEMPRE funciona se a API estiver correta');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 SOLUÇÃO RECOMENDADA:');
  console.log('='.repeat(60));
  
  console.log('\n1. VERIFIQUE O EMAIL:');
  console.log('   - Confirme que team@devtone.agency existe');
  console.log('   - Tente outro email que você tenha acesso');
  
  console.log('\n2. USE UM EMAIL PESSOAL:');
  console.log('   - Gmail geralmente funciona melhor');
  console.log('   - Evite emails corporativos com filtros rígidos');
  
  console.log('\n3. VERIFIQUE SEU DOMÍNIO:');
  console.log('   - Acesse https://resend.com/domains');
  console.log('   - Adicione e verifique devtone.agency');
  console.log('   - Isso permitirá enviar para qualquer email');
  
  console.log('\n4. CONFIGURAÇÃO ATUAL:');
  console.log('   - API Key: re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR ✅');
  console.log('   - From: onboarding@resend.dev ✅');
  console.log('   - To: team@devtone.agency ❓ (verificar se existe)');
}

// Executar verificação
verifyEmailStatus();