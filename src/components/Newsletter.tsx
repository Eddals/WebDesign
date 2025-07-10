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
      const response = await fetch('/api/send-brevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      let responseData;
      try {
        // Tenta analisar a resposta como JSON
        responseData = await response.json();
      } catch (jsonError) {
        // Se falhar ao analisar JSON, registra o erro e usa um objeto vazio
        console.error('Failed to parse JSON response:', jsonError);
        responseData = {};
      }
      
      if (response.ok && responseData && responseData.success) {
        setMessage({ type: 'success', text: 'Thank you for subscribing! Check your email for confirmation.' })
        setFormData({ firstName: '', email: '' })
      } else {
        // Se a resposta não for ok, tenta obter o texto da resposta
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (responseData && responseData.error) {
          console.error('Newsletter API error:', responseData);
          errorMessage = responseData.error;
          
          // Handle specific error cases
          if (errorMessage.includes('duplicate')) {
            setMessage({ type: 'success', text: 'You are already subscribed! We\'ll keep you updated.' })
            return;
          }
        }
        
        setMessage({ type: 'error', text: errorMessage })
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