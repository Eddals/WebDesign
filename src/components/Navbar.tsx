"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, Briefcase, Settings, User, Phone, Pen, Calculator, ChevronDown, Globe, Share2, Palette, Target, Zap, DollarSign, FolderOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/about", label: "About Me", icon: <User size={20} /> },
  {
    href: "/services",
    label: "Services",
    icon: <Briefcase size={20} />,
    hasDropdown: true,
    dropdownItems: [
      { href: "/services/web-design", label: "Web Design", icon: <Palette size={16} /> },
      { href: "/services/landing-page", label: "Landing Page", icon: <Target size={16} /> },
      { href: "/services/social-media-marketing", label: "Social Media Marketing", icon: <Share2 size={16} /> },
      { href: "/services/digital-marketing", label: "Digital Marketing", icon: <Globe size={16} /> },
      { href: "/services/marketing-automation", label: "Marketing Automation", icon: <Zap size={16} /> },
      { href: "/seo", label: "SEO Services", icon: <Settings size={16} /> },
    ]
  },
  { href: "/portfolio", label: "Portfolio", icon: <FolderOpen size={20} /> },
  { href: "/pricing", label: "Pricing", icon: <DollarSign size={20} /> },
  { href: "/estimate", label: "Get Estimate", icon: <Calculator size={20} /> },
  { href: "/faq", label: "FAQ", icon: <Pen size={20} /> },
  { href: "/contact", label: "Contact", icon: <Phone size={20} /> },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container') && !target.closest('button')) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])
  
  // Close dropdown when route changes
  useEffect(() => {
    setActiveDropdown(null)
  }, [location.pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-white/10">
      <div className={`h-1 ${isScrolled ? "bg-purple-500" : "bg-transparent"} transition-all duration-300`} />

      {/* Animated background elements */}
      <nav className="container mx-auto px-4">
        
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center group"
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
                src="https://i.imgur.com/N2muQIS.png"
                alt="DevTone Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-contain filter drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -2, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
              <motion.div
                className="absolute inset-0 bg-purple-500/20 blur-md"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 0.3,
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
            </motion.div>

          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative dropdown-container"
                    onMouseEnter={() => setActiveDropdown(item.href)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                        ${location.pathname === item.href || location.pathname.startsWith(item.href + '/') 
                          ? "text-purple-400 bg-white/5" 
                          : "text-white/90 hover:text-purple-400 hover:bg-white/5"
                        }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${
                        activeDropdown === item.href ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl z-50"
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              to={dropdownItem.href}
                              className={`flex items-center gap-3 px-4 py-3 transition-colors first:rounded-t-xl last:rounded-b-xl
                                ${location.pathname === dropdownItem.href 
                                  ? "text-purple-400 bg-purple-500/10" 
                                  : "text-white/90 hover:text-purple-400 hover:bg-white/5"
                                }`}
                            >
                              {dropdownItem.icon}
                              <span>{dropdownItem.label}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                      ${location.pathname === item.href 
                        ? "text-purple-400 bg-white/5" 
                        : "text-white/90 hover:text-purple-400 hover:bg-white/5"
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4"
            >
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.hasDropdown ? (
                    <div className="mb-2 dropdown-container">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-full
                          ${location.pathname === item.href || location.pathname.startsWith(item.href + '/') 
                            ? "text-purple-400 bg-white/5" 
                            : "text-white/90 hover:text-purple-400 hover:bg-white/5"
                          }`}
                        aria-expanded={activeDropdown === item.href}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${
                            activeDropdown === item.href ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === item.href && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-4 mt-2 overflow-hidden"
                          >
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                to={dropdownItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-full mb-1
                                  ${location.pathname === dropdownItem.href 
                                    ? "text-purple-400 bg-purple-500/10" 
                                    : "text-white/70 hover:text-purple-400 hover:bg-white/5"
                                  }`}
                              >
                                {dropdownItem.icon}
                                <span className="text-sm">{dropdownItem.label}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-full mb-2
                        ${location.pathname === item.href 
                          ? "text-purple-400 bg-white/5" 
                          : "text-white/90 hover:text-purple-400 hover:bg-white/5"
                        }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
