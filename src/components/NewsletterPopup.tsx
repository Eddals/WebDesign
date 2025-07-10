import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X, Phone } from 'lucide-react'

interface NewsletterData {
  firstName: string
  email: string
  phone: string
}

const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  
  let formattedDigits = digits
  if (!digits.startsWith('1') && digits.length > 0) {
    formattedDigits = '1' + digits
  }
  
  if (formattedDigits.length <= 1) {
    return formattedDigits ? '+1' : ''
  } else if (formattedDigits.length <= 4) {
    return `+1 ${formattedDigits.slice(1)}`
  } else if (formattedDigits.length <= 7) {
    return `+1 ${formattedDigits.slice(1, 4)}-${formattedDigits.slice(4)}`
  } else {
    return `+1 ${formattedDigits.slice(1, 4)}-${formattedDigits.slice(4, 7)}-${formattedDigits.slice(7, 11)}`
  }
}

const formatPhoneForBrevo = (formattedPhone: string): string => {
  const digits = formattedPhone.replace(/\D/g, '')
  if (digits.length >= 11 && digits.startsWith('1')) {
    return `+${digits}` // Return +15551234567
  } else if (digits.length >= 10) {
    return `+1${digits}` // Add +1 prefix, return +15551234567
  }
  return formattedPhone
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
      const payload: any = {
        email: formData.email,
        attributes: {
          FIRSTNAME: formData.firstName
        },
        listIds: [3],
        updateEnabled: true
      }
      
      if (formData.phone.trim()) {
        console.log('Phone number entered but not sent to Brevo:', formData.phone)
      }

      // Log de depuração para verificar o corpo enviado
      console.log('Payload enviado para newsletter API:', payload)

      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you for subscribing! Check your email for confirmation.' })
        setFormData({ firstName: '', email: '', phone: '' })
        localStorage.setItem('newsletter_subscribed', 'true')
        setTimeout(() => setIsOpen(false), 3000)
      } else {
        const errorData = await response.json()
        console.error('Brevo API error:', errorData)
        
        // Handle specific error cases
        if (errorData.code === 'duplicate_parameter') {
          setMessage({ type: 'error', text: 'This phone number is already registered. Please use a different one or leave it blank.' })
        } else if (errorData.message && errorData.message.includes('already exists')) {
          setMessage({ type: 'success', text: 'You are already subscribed! We\'ll keep you updated.' })
          localStorage.setItem('newsletter_subscribed', 'true')
          setTimeout(() => setIsOpen(false), 3000)
        } else {
          throw new Error('Subscription failed')
        }
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
                          placeholder="+1 000-000-0000"
                          value={formData.phone}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value)
                            setFormData({ ...formData, phone: formatted })
                          }}
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
