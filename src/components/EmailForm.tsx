// src/components/EmailForm.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface EmailFormProps {
  title?: string
  subtitle?: string
  placeholder?: string
  buttonText?: string
  successMessage?: string
  className?: string
}

export default function EmailForm({
  title = "Fique por dentro das novidades",
  subtitle = "Receba atualizações sobre nossos serviços e dicas de desenvolvimento",
  placeholder = "Digite seu e-mail",
  buttonText = "Enviar",
  successMessage = "E-mail enviado com sucesso!",
  className = ""
}: EmailFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Por favor, digite um e-mail válido')
      return
    }

    setStatus('loading')
    setMessage('Enviando...')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email,
          name: name,
          subject: 'Bem-vindo à Devtone Agency!',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #7c3aed; margin-bottom: 10px;">Devtone Agency</h1>
                <p style="color: #6b7280; font-size: 16px;">Desenvolvimento Web & Design</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h2 style="color: white; margin: 0 0 15px 0;">Olá${name ? `, ${name}` : ''}!</h2>
                <p style="color: white; margin: 0; font-size: 18px;">Obrigado por se inscrever em nossa newsletter!</p>
              </div>
              
              <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #374151; margin-top: 0;">O que você receberá:</h3>
                <ul style="color: #6b7280; line-height: 1.6;">
                  <li>🚀 Dicas de desenvolvimento web e design</li>
                  <li>📱 Novidades sobre tecnologias modernas</li>
                  <li>💡 Cases de sucesso e projetos inspiradores</li>
                  <li>🎯 Ofertas exclusivas para nossos assinantes</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-bottom: 25px;">
                <a href="https://devtone.agency" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visite nosso site</a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                  Devtone Agency - Transformando ideias em realidade digital<br>
                  <a href="https://devtone.agency" style="color: #7c3aed;">devtone.agency</a>
                </p>
              </div>
            </div>
          `
        })
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(successMessage)
        setEmail('')
        setName('')
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        setStatus('error')
        setMessage(data.message || 'Erro ao enviar e-mail')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
          <Mail className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 font-medium">Newsletter</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome (opcional)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === 'loading' || !email}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-semibold transition-all duration-300"
          whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
          whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </motion.button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              status === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : status === 'error'
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : status === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {message}
          </motion.div>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/50 text-xs">
          Ao se inscrever, você concorda em receber e-mails da Devtone Agency.
          <br />
          Você pode cancelar a inscrição a qualquer momento.
        </p>
      </div>
    </div>
  )
}