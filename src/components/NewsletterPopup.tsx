import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import NewsletterDirectForm from './NewsletterDirectForm'

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false)

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

              <div className="relative p-6 md:p-8 pb-10 md:pb-12">
                <div className="text-center">
                  {/* Logo */}
                  <motion.div
                    className="flex justify-center mb-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.img
                      src="https://i.imgur.com/qZ9tgbe.png"
                      alt="DevTone Logo"
                      className="w-16 h-16 md:w-20 md:h-20 object-contain filter drop-shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                  </motion.div>

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

                  <NewsletterDirectForm onClose={closePopup} isPopup={true} />
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
