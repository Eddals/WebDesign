import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'

const ScrollNavigation = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollDown, setShowScrollDown] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show scroll to top button when user scrolls down 200px
      setShowScrollTop(scrollTop > 200)

      // Check if user is at the bottom of the page
      const atBottom = scrollTop + windowHeight >= documentHeight - 50
      setIsAtBottom(atBottom)
      setShowScrollDown(!atBottom && scrollTop < documentHeight - windowHeight - 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }

  const scrollDown = () => {
    const currentPosition = window.pageYOffset
    const windowHeight = window.innerHeight
    const nextPosition = currentPosition + windowHeight

    window.scrollTo({
      top: nextPosition,
      behavior: 'smooth'
    })
  }

  return (
    <div className="fixed left-3 bottom-4 sm:left-4 sm:bottom-6 z-50 flex flex-col gap-2">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-purple-500/20 group"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            title="Go to Top"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="group-hover:scale-110 transition-transform duration-200"
            >
              <ChevronUp size={20} className="sm:w-6 sm:h-6" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Down Button */}
      <AnimatePresence>
        {showScrollDown && (
          <motion.button
            onClick={scrollDown}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-purple-500/20 group"
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            title="Scroll Down"
          >
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="group-hover:scale-110 transition-transform duration-200"
            >
              <ChevronDown size={20} className="sm:w-6 sm:h-6" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile-specific: Scroll to Bottom Button (when at top) */}
      <AnimatePresence>
        {!showScrollTop && !isAtBottom && (
          <motion.button
            onClick={scrollToBottom}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-purple-500/20 md:hidden"
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            title="Scroll to Bottom"
          >
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={20} className="opacity-75" />
              <ChevronDown size={20} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <motion.div
        className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
          style={{
            width: `${Math.min(100, (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`
          }}
          animate={{
            width: `${Math.min(100, (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </div>
  )
}

export default ScrollNavigation
