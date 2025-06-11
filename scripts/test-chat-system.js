#!/usr/bin/env node

/**
 * Script de teste para o Sistema de Chat de Suporte DevTone
 * 
 * Este script testa:
 * 1. Conexão com Supabase
 * 2. Criação de tabelas de chat
 * 3. Inserção de dados de teste
 * 4. Consultas básicas
 * 
 * Execute: node scripts/test-chat-system.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Iniciando testes do Sistema de Chat de Suporte...\n')

/**
 * Teste 1: Verificar conexão com Supabase
 */
async function testConnection() {
  console.log('📡 Teste 1: Verificando conexão com Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message)
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    return true
  } catch (error) {
    console.log('❌ Erro na conexão:', error.message)
    return false
  }
}

/**
 * Teste 2: Verificar se as tabelas existem
 */
async function testTables() {
  console.log('\n📋 Teste 2: Verificando se as tabelas existem...')
  
  const tables = ['chat_sessions', 'chat_messages', 'chat_agents', 'chat_assignments']
  let allTablesExist = true
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(1)
      
      if (error) {
        console.log(`❌ Tabela '${table}' não encontrada:`, error.message)
        allTablesExist = false
      } else {
        console.log(`✅ Tabela '${table}' existe`)
      }
    } catch (error) {
      console.log(`❌ Erro ao verificar tabela '${table}':`, error.message)
      allTablesExist = false
    }
  }
  
  return allTablesExist
}

/**
 * Teste 3: Criar sessão de chat de teste
 */
async function testCreateSession() {
  console.log('\n💬 Teste 3: Criando sessão de chat de teste...')
  
  try {
    const testSession = {
      user_name: 'João Silva (Teste)',
      user_email: 'joao.teste@email.com',
      user_phone: '(11) 99999-9999',
      user_company: 'Empresa Teste Ltda',
      inquiry_type: 'website',
      status: 'pending',
      metadata: {
        test: true,
        created_by: 'test-script',
        timestamp: new Date().toISOString()
      }
    }
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(testSession)
      .select()
      .single()
    
    if (error) {
      console.log('❌ Erro ao criar sessão:', error.message)
      return null
    }
    
    console.log('✅ Sessão de teste criada com sucesso!')
    console.log('📄 ID da sessão:', data.id)
    return data
  } catch (error) {
    console.log('❌ Erro ao criar sessão:', error.message)
    return null
  }
}

/**
 * Teste 4: Criar mensagens de teste
 */
async function testCreateMessages(sessionId) {
  console.log('\n💌 Teste 4: Criando mensagens de teste...')
  
  if (!sessionId) {
    console.log('❌ Sessão não disponível para teste de mensagens')
    return false
  }
  
  const testMessages = [
    {
      session_id: sessionId,
      user_name: 'João Silva (Teste)',
      user_email: 'joao.teste@email.com',
      message: 'Olá! Gostaria de saber mais sobre desenvolvimento de websites.',
      is_user: true,
      is_read: false
    },
    {
      session_id: sessionId,
      user_name: 'DevTone Support',
      user_email: 'support@devtone.agency',
      message: 'Olá João! Ficamos felizes em ajudar. Que tipo de website você tem em mente?',
      is_user: false,
      is_read: true
    },
    {
      session_id: sessionId,
      user_name: 'João Silva (Teste)',
      user_email: 'joao.teste@email.com',
      message: 'Preciso de um site institucional para minha empresa, com cerca de 5 páginas.',
      is_user: true,
      is_read: false
    }
  ]
  
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(testMessages)
      .select()
    
    if (error) {
      console.log('❌ Erro ao criar mensagens:', error.message)
      return false
    }
    
    console.log('✅ Mensagens de teste criadas com sucesso!')
    console.log('📊 Total de mensagens:', data.length)
    return true
  } catch (error) {
    console.log('❌ Erro ao criar mensagens:', error.message)
    return false
  }
}

/**
 * Teste 5: Consultar dados criados
 */
async function testQueries() {
  console.log('\n🔍 Teste 5: Consultando dados criados...')
  
  try {
    // Consultar sessões de teste
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_email', 'joao.teste@email.com')
    
    if (sessionsError) {
      console.log('❌ Erro ao consultar sessões:', sessionsError.message)
      return false
    }
    
    console.log('✅ Sessões encontradas:', sessions.length)
    
    if (sessions.length > 0) {
      const sessionId = sessions[0].id
      
      // Consultar mensagens da sessão
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
      
      if (messagesError) {
        console.log('❌ Erro ao consultar mensagens:', messagesError.message)
        return false
      }
      
      console.log('✅ Mensagens encontradas:', messages.length)
      
      // Mostrar conversa
      console.log('\n💬 Conversa de teste:')
      messages.forEach((msg, index) => {
        const sender = msg.is_user ? '👤 Cliente' : '🎧 Suporte'
        console.log(`${index + 1}. ${sender}: ${msg.message}`)
      })
    }
    
    return true
  } catch (error) {
    console.log('❌ Erro ao consultar dados:', error.message)
    return false
  }
}

/**
 * Teste 6: Limpeza dos dados de teste
 */
async function cleanupTestData() {
  console.log('\n🧹 Teste 6: Limpando dados de teste...')
  
  try {
    // Deletar mensagens de teste
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_email', 'joao.teste@email.com')
    
    if (messagesError) {
      console.log('⚠️ Aviso ao deletar mensagens:', messagesError.message)
    } else {
      console.log('✅ Mensagens de teste removidas')
    }
    
    // Deletar sessões de teste
    const { error: sessionsError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('user_email', 'joao.teste@email.com')
    
    if (sessionsError) {
      console.log('⚠️ Aviso ao deletar sessões:', sessionsError.message)
    } else {
      console.log('✅ Sessões de teste removidas')
    }
    
    return true
  } catch (error) {
    console.log('❌ Erro na limpeza:', error.message)
    return false
  }
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  let testsPassed = 0
  const totalTests = 6
  
  // Teste 1: Conexão
  if (await testConnection()) testsPassed++
  
  // Teste 2: Tabelas
  if (await testTables()) testsPassed++
  
  // Teste 3: Criar sessão
  const session = await testCreateSession()
  if (session) testsPassed++
  
  // Teste 4: Criar mensagens
  if (await testCreateMessages(session?.id)) testsPassed++
  
  // Teste 5: Consultas
  if (await testQueries()) testsPassed++
  
  // Teste 6: Limpeza
  if (await cleanupTestData()) testsPassed++
  
  // Resultado final
  console.log('\n' + '='.repeat(50))
  console.log('📊 RESULTADO DOS TESTES')
  console.log('='.repeat(50))
  console.log(`✅ Testes aprovados: ${testsPassed}/${totalTests}`)
  console.log(`❌ Testes falharam: ${totalTests - testsPassed}/${totalTests}`)
  
  if (testsPassed === totalTests) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!')
    console.log('✅ Sistema de Chat de Suporte está funcionando corretamente!')
    console.log('\n📋 Próximos passos:')
    console.log('1. Execute o script SQL: chat-support-database.sql')
    console.log('2. Acesse o site e teste o chat widget')
    console.log('3. Acesse /chat-dashboard para testar o painel')
    console.log('4. Senha do dashboard: devtone2024')
  } else {
    console.log('\n⚠️ ALGUNS TESTES FALHARAM')
    console.log('🔧 Verifique:')
    console.log('1. Variáveis de ambiente configuradas')
    console.log('2. Script SQL executado no Supabase')
    console.log('3. Permissões do banco de dados')
  }
  
  console.log('\n' + '='.repeat(50))
}

// Executar testes
runAllTests().catch(console.error)
