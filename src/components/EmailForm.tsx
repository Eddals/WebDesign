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
      const res = await fetch('/api/newsletter-brevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          firstName: name,
          lastName: '',
        })
      })

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      // Check if response has content before trying to parse JSON
      const responseText = await res.text();
      console.log('Response text:', responseText);

      let result;
      try {
        result = responseText ? JSON.parse(responseText) : { error: 'Empty response' };
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid response: ${responseText || 'Empty response'}`);
      }

      if (!res.ok) {
        console.error('Newsletter error:', result);
        throw new Error(result.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      console.log('Newsletter subscription successful:', result);

      setStatus('success')
      setMessage(successMessage)
      setEmail('')
      setName('')
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
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