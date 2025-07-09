// src/pages/EmailTest.tsx
import React from 'react'
import { motion } from 'framer-motion'
import EmailForm from '@/components/EmailForm'
import SEO from '@/components/SEO'

const EmailTest = () => {
  return (
    <>
      <SEO
        title="Teste de Email - Devtone Agency"
        description="Teste a funcionalidade de envio de emails da Devtone Agency"
        keywords={['email test', 'newsletter', 'Devtone Agency']}
        ogUrl="https://devtone.agency/email-test"
      />

      <div className="min-h-screen bg-[#030718] pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Teste de Integração Email
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Teste nossa integração com o Brevo para envio de emails automatizados
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Formulário Principal */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EmailForm />
              </motion.div>

              {/* Formulário Customizado */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <EmailForm
                  title="Newsletter Personalizada"
                  subtitle="Versão customizada do formulário de email"
                  placeholder="seu-email@exemplo.com"
                  buttonText="Inscrever-se"
                  successMessage="Inscrição realizada com sucesso!"
                />
              </motion.div>

            </div>

            {/* Informações Técnicas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                🔧 Informações Técnicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Endpoint</h3>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400 text-sm">
                      POST /api/send-email
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Payload</h3>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-blue-400 text-sm">
                      {`{
  "to": "email@exemplo.com",
  "name": "Nome (opcional)",
  "subject": "Assunto",
  "htmlContent": "HTML..."
}`}
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Resposta Sucesso</h3>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-green-400 text-sm">
                      {`{
  "message": "E-mail enviado com sucesso!",
  "data": {...}
}`}
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Resposta Erro</h3>
                  <div className="bg-black/30 rounded-lg p-4">
                    <code className="text-red-400 text-sm">
                      {`{
  "message": "Erro ao enviar e-mail",
  "error": {...}
}`}
                    </code>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Configuração Necessária</h4>
                <p className="text-yellow-300 text-sm">
                  Certifique-se de que a variável <code className="bg-black/30 px-2 py-1 rounded">BREVO_API_KEY</code> 
                  está configurada no Vercel em <strong>Project Settings → Environment Variables</strong>
                </p>
              </div>
            </motion.div>

            {/* Botões de Teste Manual */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center space-y-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Testes Manuais</h3>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.open('/debug-brevo.html', '_blank')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  🔧 Debug Brevo
                </button>
                
                <button
                  onClick={() => window.open('/test-brevo-key.html', '_blank')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  🔑 Test API Key
                </button>
                
                <button
                  onClick={() => {
                    fetch('/api/test-env')
                      .then(res => res.json())
                      .then(data => alert(JSON.stringify(data, null, 2)))
                      .catch(err => alert('Erro: ' + err.message))
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  🌍 Check Env Vars
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  )
}

export default EmailTest