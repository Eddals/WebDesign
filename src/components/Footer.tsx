import { Link } from "react-router-dom"
import { Instagram, Linkedin, Github, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useNewsletterForm } from "../hooks/useNewsletterForm"

const Footer = () => {
  const { name, setName, email, setEmail, isSubmitting, subscribeStatus, handleSubmit } = useNewsletterForm();
  return (
    <footer className="w-full bg-background/80 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                animate={{
                  y: [0, -2, 0],
                }}
              >
                <motion.img
                  src="https://i.imgur.com/roZSSf4.png"
                  alt="DevTone Logo"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    scale: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  viewport={{ once: true }}
                />
              </motion.div>
            </motion.div>
            <motion.p
              className="text-white/70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Professional web development agency delivering exceptional digital solutions that drive business growth and success.
            </motion.p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-white/70 hover:text-purple-400 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-white/70 hover:text-purple-400 transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Services</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/services/business-websites" className="text-white/70 hover:text-purple-400 transition-colors">
                Business Websites
              </Link>
              <Link to="/services/landing-pages" className="text-white/70 hover:text-purple-400 transition-colors">
                Landing Pages
              </Link>
              <Link to="/services/e-commerce-stores" className="text-white/70 hover:text-purple-400 transition-colors">
                E-Commerce Stores
              </Link>
              <Link to="/services/website-redesign" className="text-white/70 hover:text-purple-400 transition-colors">
                Website Redesign
              </Link>
              <Link to="/services/seo-optimization" className="text-white/70 hover:text-purple-400 transition-colors">
                SEO Optimization
              </Link>
              <Link to="/services/mobile-applications" className="text-white/70 hover:text-purple-400 transition-colors">
                Mobile Applications
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/devtone-agency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-purple-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/company/devtone-agency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-purple-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://instagram.com/devtone.agency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-purple-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
            <div className="mt-4">
              <Link to="/contact" className="text-white/70 hover:text-purple-400 transition-colors text-sm">
                hello@devtone.agency
              </Link>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section - Now as a separate row */}
        <motion.div 
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-white/10 to-purple-900/10 rounded-xl p-4 md:p-6 shadow-lg border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
                <h4 className="text-white font-semibold text-lg mb-2">Newsletter</h4>
                <p className="text-white/60 text-sm">Stay updated with our latest news and offers!</p>
              </div>
              
              <div className="md:w-2/3">
                {subscribeStatus.type && (
                  <div className={`w-full mb-3 p-2 rounded-lg text-sm ${
                    subscribeStatus.type === "success" 
                      ? "bg-green-500/20 text-green-200 border border-green-500/30" 
                      : "bg-red-500/20 text-red-200 border border-red-500/30"
                  }`}>
                    {subscribeStatus.message}
                  </div>
                )}
                
                <form
                  className="w-full flex flex-col sm:flex-row gap-3 items-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                    disabled={isSubmitting}
                    className="rounded-full px-4 py-2 bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition w-full sm:flex-1 text-sm border border-white/10 disabled:opacity-50"
                  />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your Email"
                    disabled={isSubmitting}
                    className="rounded-full px-4 py-2 bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition w-full sm:flex-1 text-sm border border-white/10 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium py-2 px-6 shadow-md hover:from-purple-600 hover:to-indigo-600 transition text-sm whitespace-nowrap w-full sm:w-auto"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.img
                src="https://i.imgur.com/qZ9tgbe.png"
                alt="DevTone Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain filter drop-shadow-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <p className="text-white/50 text-sm">
                © 2025 DevTone. All rights reserved.
              </p>
            </motion.div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-white/50 hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/50 hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link
                to="/chat-dashboard"
                className="text-white/30 hover:text-purple-400 transition-colors flex items-center gap-1"
                title="Support Dashboard"
              >
                <Shield size={14} />
                Support
              </Link>
              <a
                href="https://dashboard.devtone.agency"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-purple-400 transition-colors flex items-center gap-1"
                title="Client Dashboard"
              >
                <Shield size={14} />
                Dashboard
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer