import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScrollNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show buttons after scrolling down a bit
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // Calculate scroll progress
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset
      const scrollableHeight = documentHeight - windowHeight
      
      const progress = scrollTop / scrollableHeight
      setScrollProgress(progress)
      
      // Check if we're at the bottom
      setIsAtBottom(Math.abs(progress - 1) < 0.02)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
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

  const scrollPageUp = () => {
    window.scrollBy({
      top: -window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  const scrollPageDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3"
        >
          {/* Progress indicator */}
          <div className="w-1 h-32 bg-gray-700/50 rounded-full mx-auto relative overflow-hidden">
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-purple-400"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          
          {/* Scroll to top button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="p-3 bg-gradient-to-r from-purple-600 to-purple-700 
              hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-xl 
              transition-all duration-300 backdrop-blur-sm border border-purple-500/30
              hover:shadow-purple-500/25 hover:shadow-lg"
            aria-label="Scroll to top"
            disabled={scrollProgress < 0.05}
          >
            <ArrowUp size={20} className={scrollProgress < 0.05 ? "opacity-50" : ""} />
          </motion.button>
          
          {/* Scroll up one page */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollPageUp}
            className="p-3 bg-gradient-to-r from-purple-600/80 to-purple-700/80
              hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-xl 
              transition-all duration-300 backdrop-blur-sm border border-purple-500/30
              hover:shadow-purple-500/25 hover:shadow-lg"
            aria-label="Scroll page up"
            disabled={scrollProgress < 0.05}
          >
            <ChevronUp size={20} className={scrollProgress < 0.05 ? "opacity-50" : ""} />
          </motion.button>
          
          {/* Scroll down one page */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollPageDown}
            className="p-3 bg-gradient-to-r from-purple-600/80 to-purple-700/80
              hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-xl 
              transition-all duration-300 backdrop-blur-sm border border-purple-500/30
              hover:shadow-purple-500/25 hover:shadow-lg"
            aria-label="Scroll page down"
            disabled={isAtBottom}
          >
            <ChevronDown size={20} className={isAtBottom ? "opacity-50" : ""} />
          </motion.button>
          
          {/* Scroll to bottom button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToBottom}
            className="p-3 bg-gradient-to-r from-purple-600 to-purple-700 
              hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-xl 
              transition-all duration-300 backdrop-blur-sm border border-purple-500/30
              hover:shadow-purple-500/25 hover:shadow-lg"
            aria-label="Scroll to bottom"
            disabled={isAtBottom}
          >
            <ArrowDown size={20} className={isAtBottom ? "opacity-50" : ""} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}