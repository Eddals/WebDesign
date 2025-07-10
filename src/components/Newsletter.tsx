import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

interface NewsletterData {
  firstName: string
  email: string
}

const Newsletter = () => {
  const [formData, setFormData] = useState<NewsletterData>({ firstName: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName.trim() || !formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // Log de depuração para verificar o corpo enviado
      console.log('Enviando dados para newsletter:', {
        firstName: formData.firstName,
        email: formData.email
      });

      // Abordagem direta: enviar para o Brevo diretamente do frontend
      // Isso evita problemas com o endpoint da API
      const brevoApiKey = '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';
      
      const payload = {
        email: formData.email,
        attributes: {
          FIRSTNAME: formData.firstName
        },
        listIds: [2],
        updateEnabled: true
      };

      // Usar o proxy para evitar problemas de CORS
      const response = await fetch('/api/brevo-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: 'contacts',
          data: payload,
          apiKey: brevoApiKey
        })
      });

      // Analisar a resposta do proxy
      const responseData = await response.json();
      
      // Verificar se a resposta é ok (status 2xx)
      if (response.ok && responseData.success) {
        // Sucesso - o usuário foi inscrito
        setMessage({ type: 'success', text: 'Thank you for subscribing! Check your email for confirmation.' });
        setFormData({ firstName: '', email: '' });
        
        // Opcional: enviar email de confirmação
        try {
          await fetch('/api/brevo-proxy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              endpoint: 'smtp/email',
              apiKey: brevoApiKey,
              data: {
                sender: {
                  name: 'Devtone Agency',
                  email: 'team@devtone.agency'
                },
                to: [
                  {
                    email: formData.email,
                    name: formData.firstName
                  }
                ],
                subject: 'Welcome to Devtone Newsletter!',
                htmlContent: `
                  <html>
                    <body>
                      <h1>Welcome to our Newsletter, ${formData.firstName}!</h1>
                      <p>Thank you for subscribing to the Devtone Agency newsletter.</p>
                      <p>You'll now receive our latest web development tips, industry insights, and exclusive offers.</p>
                      <p>Best regards,<br>The Devtone Team</p>
                    </body>
                  </html>
                `
              }
            })
          });
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Continue with success even if email fails
        }
      } else {
        // Tentar obter detalhes do erro da resposta do proxy
        let errorMessage = 'Something went wrong. Please try again.';
        
        console.error('Newsletter API error:', responseData);
        
        // Verificar se temos dados de erro do Brevo
        if (responseData.data && responseData.data.message) {
          // Verificar se é um erro de duplicação (email já existe)
          if (responseData.data.message.includes('already exists')) {
            setMessage({ type: 'success', text: 'You are already subscribed! We\'ll keep you updated.' });
            return;
          }
          
          errorMessage = responseData.data.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }
        
        setMessage({ type: 'error', text: errorMessage });
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-purple-900/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-white">
            Stay Updated with <span className="text-purple-400">DevTone</span>
          </h2>
          
          <p className="text-white/70 mb-8">
            Get the latest web development tips, industry insights, and exclusive offers delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                required
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
    </section>
  )
}

export default Newsletter