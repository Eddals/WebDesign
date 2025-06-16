import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '@/components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found - DevTone"
        description="The page you're looking for doesn't exist. Return to DevTone's homepage to explore our web development and digital marketing services."
        keywords={['404', 'page not found', 'error', 'DevTone']}
        noIndex={true}
      />
      
      <div className="min-h-screen bg-[#030718] flex items-center justify-center px-4">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="text-center relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Number */}
            <motion.h1 
              className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              404
            </motion.h1>

            {/* Error Message */}
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Oops! Page Not Found
            </motion.h2>

            <motion.p 
              className="text-white/70 text-lg mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link
                to="/"
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                  hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold 
                  transition-all duration-300 transform hover:scale-105"
              >
                <Home size={20} />
                <span>Go Home</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="group flex items-center gap-2 px-6 py-3 border border-purple-500/30 
                  hover:border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 
                  text-white rounded-lg font-semibold transition-all duration-300"
              >
                <ArrowLeft size={20} />
                <span>Go Back</span>
              </button>
            </motion.div>

            {/* Search Suggestion */}
            <motion.div 
              className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Search className="text-purple-400" size={20} />
                <h3 className="text-white font-semibold">Looking for something specific?</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: 'Web Design', href: '/services/web-design' },
                  { label: 'SEO Services', href: '/seo' },
                  { label: 'Get Estimate', href: '/estimate' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'About Us', href: '/about' }
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-3 py-1 text-sm bg-purple-500/20 hover:bg-purple-500/30 
                      text-purple-300 hover:text-purple-200 rounded-full transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}