import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, Phone } from 'lucide-react'
import PhoneInput from './PhoneInput'

interface NewsletterDirectFormProps {
  onClose?: () => void;
  isPopup?: boolean;
}

const NewsletterDirectForm = ({ onClose, isPopup = false }: NewsletterDirectFormProps) => {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Função para validar email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
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
      // Log de depuração para verificar os dados enviados
      console.log('Enviando dados para newsletter:', {
        firstName,
        email,
        phone: phone ? phone : 'não fornecido'
      })
      
      // First try the test endpoint to verify API is working
      console.log('Testing API connectivity...');
      const testRes = await fetch('/api/test-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      });
      
      console.log('Test endpoint status:', testRes.status);
      const testText = await testRes.text();
      console.log('Test endpoint response:', testText);
      
      // Now try the actual newsletter endpoint
      console.log('Calling newsletter endpoint...');
      const res = await fetch('/api/newsletter-brevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          firstName,
          phone: phone || 'não fornecido'
        })
      })

      console.log('Newsletter response status:', res.status);
      console.log('Newsletter response headers:', Object.fromEntries(res.headers.entries()));

      // Check if response has content before trying to parse JSON
      const responseText = await res.text();
      console.log('Newsletter response text:', responseText);
      console.log('Newsletter response text length:', responseText.length);

      // Handle completely empty responses
      if (!responseText || responseText.trim() === '') {
        console.error('Received completely empty response from newsletter API');
        throw new Error('Server returned empty response. The newsletter API endpoint may not be working correctly.');
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse newsletter response as JSON:', parseError);
        console.error('Raw response text:', responseText);
        throw new Error(`Newsletter API returned invalid JSON. Raw response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
      }

      if (!res.ok) {
        console.error('Newsletter API error:', result);
        throw new Error(result.error || result.message || `Newsletter API error: HTTP ${res.status}: ${res.statusText}`);
      }
      
      console.log('Newsletter subscription successful:', result);
      
      // Mostrar mensagem de sucesso
      setMessage({ 
        type: 'success', 
        text: 'Thank you for subscribing! Check your email for confirmation.' 
      })
      
      // Limpar campos
      setFirstName('')
      setEmail('')
      setPhone('')
      
      // Se for popup, salvar no localStorage e fechar
      if (isPopup) {
        localStorage.setItem('newsletter_subscribed', 'true')
        setTimeout(() => onClose && onClose(), 3000)
      }
    } catch (error) {
      console.error('Newsletter error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessage({ 
        type: 'error', 
        text: errorMessage
      })
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
            
            <PhoneInput
              value={phone}
              onChange={setPhone}
              placeholder="Phone Number (Optional)"
              disabled={isSubmitting}
            />
            
            {/* Additional space above subscribe button */}
            <div className="h-6"></div>
            
            {/* Extra space for popup */}
            {isPopup && <div className="h-4"></div>}
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Subscribe Now
                  </>
                )}
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-700/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </form>

          {/* Additional space below subscribe button */}
          <div className="h-8"></div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`mt-4 p-4 rounded-xl flex items-center gap-3 border-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-lg shadow-green-500/10' 
                  : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-lg shadow-red-500/10'
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.type === 'success' 
                  ? 'bg-green-500/20' 
                  : 'bg-red-500/20'
              }`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              </div>
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}

          {/* Additional bottom spacing for popup */}
          {isPopup && <div className="h-6"></div>}
        </motion.div>
      </div>
    </div>
  )
}

export default NewsletterDirectForm