import { useState, useRef, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, Phone } from 'lucide-react'

interface NewsletterFormProps {
  onClose?: () => void;
  isPopup?: boolean;
}

const NewsletterForm = ({ onClose, isPopup = false }: NewsletterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Usar refs em vez de estado para evitar re-renders desnecessários
  const firstNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  
  // Função para validar email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Obter valores dos campos
    const firstName = firstNameRef.current?.value || ''
    const email = emailRef.current?.value || ''
    let phone = phoneRef.current?.value || ''
    
    // Auto-format phone number for US if it's 10 digits
    if (phone) {
      const digitsOnly = phone.replace(/[^\d]/g, '')
      if (digitsOnly.length === 10 && !phone.startsWith('+') && !phone.startsWith('1')) {
        phone = `+1 ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`
      }
    }
    
    // Validar campos
    if (!firstName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your first name.' })
      return
    }
    
    if (!email.trim() || !isValidEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }
    
    setIsSubmitting(true)
    setMessage(null)
    
    try {
      // Criar um iframe oculto para fazer a submissão
      const iframe = document.createElement('iframe')
      iframe.name = 'newsletter-submit-frame'
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      
      // Criar um formulário para submissão direta
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://api.brevo.com/v3/contacts'
      form.target = 'newsletter-submit-frame'
      form.style.display = 'none'
      
      // Adicionar campos ao formulário
      const apiKeyField = document.createElement('input')
      apiKeyField.name = 'api-key'
      apiKeyField.value = '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'
      form.appendChild(apiKeyField)
      
      const dataField = document.createElement('input')
      dataField.name = 'data'
      dataField.value = JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName,
          SMS: phone
        },
        listIds: [2],
        updateEnabled: true
      })
      form.appendChild(dataField)
      
      document.body.appendChild(form)
      
      // Submeter o formulário
      form.submit()
      
      // Limpar formulário após submissão
      setTimeout(() => {
        document.body.removeChild(form)
        document.body.removeChild(iframe)
      }, 1000)
      
      // Mostrar mensagem de sucesso
      setMessage({ 
        type: 'success', 
        text: 'Thank you for subscribing! Check your email for confirmation.' 
      })
      
      // Limpar campos
      if (firstNameRef.current) firstNameRef.current.value = ''
      if (emailRef.current) emailRef.current.value = ''
      if (phoneRef.current) phoneRef.current.value = ''
      
      // Se for popup, salvar no localStorage e fechar
      if (isPopup) {
        localStorage.setItem('newsletter_subscribed', 'true')
        setTimeout(() => onClose && onClose(), 3000)
      }
      
      // Enviar email de confirmação via fetch
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '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'
        },
        body: JSON.stringify({
          sender: {
            name: 'Devtone Agency',
            email: 'team@devtone.agency'
          },
          to: [
            {
              email,
              name: firstName
            }
          ],
          subject: 'Welcome to Devtone Newsletter!',
          htmlContent: `
            <html>
              <body>
                <h1>Welcome to our Newsletter, ${firstName}!</h1>
                <p>Thank you for subscribing to the Devtone Agency newsletter.</p>
                <p>You'll now receive our latest web development tips, industry insights, and exclusive offers.</p>
                ${phone ? `<p>We've also registered your phone number: ${phone} for important updates.</p>` : ''}
                <p>Best regards,<br>The Devtone Team</p>
              </body>
            </html>
          `
        })
      }).catch(err => {
        console.log('Email confirmation error (non-critical):', err)
      })
      
    } catch (error) {
      console.error('Newsletter error:', error)
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={isPopup ? "" : "py-16 relative overflow-hidden"}>
      {!isPopup && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-purple-900/20"></div>
      )}
      
      <div className={isPopup ? "" : "container mx-auto px-4 relative z-10"}>
        <motion.div
          className={isPopup ? "" : "max-w-2xl mx-auto text-center"}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {!isPopup && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-white">
                Stay Updated with <span className="text-purple-400">DevTone</span>
              </h2>
              
              <p className="text-white/70 mb-8">
                Get the latest web development tips, industry insights, and exclusive offers delivered to your inbox.
              </p>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                ref={firstNameRef}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                ref={emailRef}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-3">
              <Phone className="w-4 h-4 text-white/50" />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                ref={phoneRef}
                className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default NewsletterForm