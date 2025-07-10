import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X, Phone } from 'lucide-react'

interface NewsletterData {
  firstName: string
  email: string
  phone: string
}

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<NewsletterData>({ firstName: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const hasSubscribed = localStorage.getItem('newsletter_subscribed')
    const hasSeenPopup = localStorage.getItem('newsletter_popup_seen')

    if (!hasSubscribed && !hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem('newsletter_popup_seen', 'true')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName.trim() || !formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const payload = {
        firstName: formData.firstName,
        email: formData.email,
        phone: formData.phone
      };

      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: result.message || 'Thank you for subscribing! Check your email for confirmation.' })
        setFormData({ firstName: '', email: '', phone: '' })
        localStorage.setItem('newsletter_subscribed', 'true')
        setTimeout(() => setIsOpen(false), 3000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      console.error('Newsletter error:', error)
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const closePopup = () => {
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
        >
          <motion.div
            className="relative w-full max-w-md bg-gradient-to-br from-purple-600 to-purple-900 p-0.5 rounded-xl shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#030718] rounded-xl overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full blur-3xl"></div>
              </div>

              <div className="relative p-6 md:p-8">
                <div className="text-center">
                  <motion.h2 
                    className="text-2xl font-bold mb-2 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Join Our <span className="text-purple-400">Newsletter</span>
                  </motion.h2>

                  <motion.p 
                    className="text-white/70 text-sm mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Get exclusive web development tips and special offers delivered to your inbox.
                  </motion.p>

                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                        required
                      />
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-white/50" />
                        </div>
                        <input
                          type="tel"
                          placeholder="Phone Number (Optional)"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full font-semibold text-white transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-900/20"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                  </motion.form>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3 rounded-full flex items-center gap-2 ${
                        message.type === 'success' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      {message.text}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={closePopup}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors z-20"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NewsletterPopup
