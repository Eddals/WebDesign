"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, User, Phone, Pen, ChevronDown, Globe, Laptop, ShoppingBag, RefreshCw, Search, Smartphone, Star, Calculator } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const serviceItems = [
  { href: "/services/business-websites", label: "Business Websites", icon: <Globe size={16} /> },
  { href: "/services/landing-pages", label: "Landing Pages", icon: <Laptop size={16} /> },
  { href: "/services/e-commerce-stores", label: "E-Commerce Stores", icon: <ShoppingBag size={16} /> },
  { href: "/services/website-redesign", label: "Website Redesign", icon: <RefreshCw size={16} /> },
  { href: "/services/seo-optimization", label: "SEO Optimization", icon: <Search size={16} /> },
  { href: "/services/mobile-applications", label: "Mobile Applications", icon: <Smartphone size={16} /> },
]

const navItems = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { 
    href: "/services", 
    label: "Services", 
    icon: <Globe size={20} />,
    hasDropdown: true,
    dropdownItems: serviceItems
  },
  { href: "/about", label: "About Us", icon: <User size={20} /> },
  { href: "/faq", label: "FAQ", icon: <Pen size={20} /> },
  { href: "/estimate", label: "Get Estimate", icon: <Calculator size={20} /> },
  { href: "/contact", label: "Contact", icon: <Phone size={20} /> },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Floating Phone Number Button */}
      <a
        href="tel:2317077793"
        className="fixed top-4 right-2 z-[100] flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold text-base hover:scale-105 hover:from-purple-700 hover:to-purple-500 transition-all duration-300 ring-2 ring-white/30 backdrop-blur-md md:top-6 md:right-6 md:px-4 md:py-2 md:text-lg"
        style={{ boxShadow: '0 2px 12px 0 rgba(80,0,180,0.12)' }}
        title="Call us now!"
      >
        <span className="flex items-center">
          <Phone size={18} className="mr-1" />
        </span>
        <span className="font-bold tracking-wide">231-707-7793</span>
      </a>
      {/* Navbar Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-white/10">
        <div className={`h-1 ${isScrolled ? "bg-purple-500" : "bg-transparent"} transition-all duration-300`} />

        <nav className="container mx-auto px-4">
          <div className="flex items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center group"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                animate={{
                  y: [0, -2],
                }}
              >
                <motion.img
                  src="https://i.imgur.com/qZ9tgbe.png"
                  alt="DevTone Logo"
                  className="w-20 h-20 md:w-24 md:h-24 object-contain filter drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    y: [0, -2]
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
                    scale: [1, 1.1],
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

            {/* Menu Centralizado */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-center" ref={dropdownRef}>
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                          ${location.pathname.includes(item.href)
                            ? "text-purple-400 bg-white/5"
                            : "text-white/90 hover:text-purple-400 hover:bg-white/5"
                          }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                          >
                            <div className="py-2">
                              {item.dropdownItems?.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.href}
                                  to={dropdownItem.href}
                                  onClick={handleLinkClick}
                                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700 transition-colors text-white/80 hover:text-purple-400"
                                >
                                  <div className="bg-gray-700 p-1.5 rounded-full">
                                    {dropdownItem.icon}
                                  </div>
                                  <span>{dropdownItem.label}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
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

            {/* Botão Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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
                      <>
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-full mb-2
                            ${location.pathname.includes(item.href)
                              ? "text-purple-400 bg-white/5"
                              : "text-white/90 hover:text-purple-400 hover:bg-white/5"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        
                        <AnimatePresence>
                          {openDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mb-2 overflow-hidden"
                            >
                              {item.dropdownItems?.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.href}
                                  to={dropdownItem.href}
                                  onClick={handleLinkClick}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg mb-1 text-white/80 hover:text-purple-400 hover:bg-white/5"
                                >
                                  {dropdownItem.icon}
                                  <span>{dropdownItem.label}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={handleLinkClick}
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
    </>
  )
}