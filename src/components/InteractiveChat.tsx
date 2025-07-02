import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X, ChevronDown, ChevronUp, Loader2, Facebook, Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../styles/chat-animations.css'

// Define types for our chat
interface ChatMessage {
  id: string
  message: string
  isUser: boolean
  timestamp: Date
  links?: JSX.Element[]
}

// Website information
const websiteInfo = {
  services: [
    { name: "Business Websites", path: "/services/business-websites" },
    { name: "Landing Pages", path: "/services/landing-pages" },
    { name: "E-Commerce Stores", path: "/services/e-commerce-stores" },
    { name: "Website Redesign", path: "/services/website-redesign" },
    { name: "SEO Optimization", path: "/services/seo-optimization" },
    { name: "Mobile Applications", path: "/services/mobile-applications" }
  ],
  social: [
    { 
      name: "Facebook", 
      icon: <Facebook size={20} className="text-blue-400" />, 
      url: "https://www.facebook.com/profile.php?id=61577835353545",
      color: "bg-blue-500/20 hover:bg-blue-500/30"
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin size={20} className="text-blue-600" />, 
      url: "https://www.linkedin.com/in/devtone-agency-6a055b371/",
      color: "bg-blue-600/20 hover:bg-blue-600/30"
    },
    { 
      name: "Instagram", 
      icon: <Instagram size={20} className="text-pink-500" />, 
      url: "https://www.instagram.com/devtone_agency/",
      color: "bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 hover:from-purple-500/30 hover:via-pink-500/30 hover:to-orange-500/30"
    }
  ],
  contact: {
    email: "hello@devtone.agency",
    contactPage: "/contact"
  }
}

const InteractiveChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) setIsMinimized(false)
    
    // Add welcome message if opening chat for the first time
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "👋 Hi there! I'm your friendly assistant from DevTone. You can click on any of the question buttons below to learn more about our services, pricing, or how to get started. You can also connect with us through our social media channels at the bottom."
        )
      }, 500)
    }
  }

  // Toggle chat minimized/maximized
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(!isMinimized)
  }

  // Add a bot message
  const addBotMessage = (text: string, links?: JSX.Element[]) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        message: text,
        isUser: false,
        timestamp: new Date(),
        links
      }
    ])
  }

  // Add a user message
  const addUserMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        message: text,
        isUser: true,
        timestamp: new Date()
      }
    ])
  }

  // Process user message and generate response
  const processMessage = (message: string) => {
    const lowerMsg = message.toLowerCase()
    
    // Check for services related queries
    if (lowerMsg.includes('service') || lowerMsg.includes('offer') || lowerMsg.includes('provide') || lowerMsg.includes('do you do')) {
      const serviceLinks = websiteInfo.services.map((service, index) => (
        <Link 
          key={index} 
          to={service.path}
          className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
        >
          {service.name}
        </Link>
      ))
      
      addBotMessage(
        "We offer a variety of web development and design services. Here are our main services:",
        serviceLinks
      )
      return
    }
    
    // Check for contact related queries
    if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone') || lowerMsg.includes('reach')) {
      addBotMessage(
        `You can contact us through our contact page or directly via email at ${websiteInfo.contact.email}.`,
        [
          <Link 
            key="contact" 
            to={websiteInfo.contact.contactPage}
            className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
          >
            Visit Contact Page
          </Link>
        ]
      )
      return
    }
    
    // Check for social media related queries
    if (lowerMsg.includes('social') || lowerMsg.includes('facebook') || lowerMsg.includes('instagram') || lowerMsg.includes('linkedin') || lowerMsg.includes('follow')) {
      const socialLinks = websiteInfo.social.map((platform, index) => (
        <a 
          key={index} 
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link flex items-center gap-2 px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
        >
          {platform.icon}
          <span>{platform.name}</span>
        </a>
      ))
      
      addBotMessage(
        "You can find us on the following social media platforms:",
        socialLinks
      )
      return
    }
    
    // Check for pricing related queries
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much') || lowerMsg.includes('pricing')) {
      addBotMessage(
        "Our pricing varies depending on the specific requirements of your project. We offer competitive rates and flexible packages to suit different budgets. For a detailed quote, please visit our contact page to request an estimate.",
        [
          <Link 
            key="estimate" 
            to="/estimate"
            className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
          >
            Get an Estimate
          </Link>
        ]
      )
      return
    }
    
    // Check for about related queries
    if (lowerMsg.includes('about') || lowerMsg.includes('who are you') || lowerMsg.includes('company')) {
      addBotMessage(
        "DevTone is a professional web development agency delivering exceptional digital solutions that drive business growth and success. We specialize in creating beautiful, functional websites and applications tailored to our clients' needs.",
        [
          <Link 
            key="about" 
            to="/about"
            className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
          >
            Learn More About Us
          </Link>
        ]
      )
      return
    }

    // Check for website redesign queries
    if (lowerMsg.includes('redesign') || lowerMsg.includes('rebuild') || lowerMsg.includes('revamp')) {
      addBotMessage(
        "We specialize in website redesign services to help modernize your online presence. Our team can transform your outdated website into a contemporary, user-friendly platform that better represents your brand and improves user experience.",
        [
          <Link 
            key="redesign" 
            to="/services/website-redesign"
            className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
          >
            Website Redesign Services
          </Link>
        ]
      )
      return
    }

    // Check for getting started queries
    if (lowerMsg.includes('get started') || lowerMsg.includes('begin') || lowerMsg.includes('start')) {
      addBotMessage(
        "Getting started with DevTone is easy! The first step is to request an estimate through our website. We'll then schedule a consultation to discuss your project requirements, goals, and timeline. From there, we'll create a customized proposal for your project.",
        [
          <Link 
            key="estimate" 
            to="/estimate"
            className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
          >
            Request an Estimate
          </Link>,
          <Link 
            key="contact" 
            to="/contact"
            className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
          >
            Contact Us
          </Link>
        ]
      )
      return
    }
    
    // Default response for other queries
    addBotMessage(
      "I'd be happy to help with that. For more specific information, you might want to check out these resources:",
      [
        <Link 
          key="services" 
          to="/services"
          className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
        >
          Our Services
        </Link>,
        <Link 
          key="contact" 
          to="/contact"
          className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
        >
          Contact Us
        </Link>,
        <Link 
          key="faq" 
          to="/faq"
          className="chat-link block px-3 py-2 mt-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-white transition-colors"
        >
          FAQ
        </Link>
      ]
    )
  }

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return
    
    const userMessage = inputMessage.trim()
    addUserMessage(userMessage)
    setInputMessage('')
    
    // Show AI thinking
    setIsTyping(true)
    
    // Simulate response delay for natural feel
    setTimeout(() => {
      processMessage(userMessage)
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="chat-button-pulse fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white flex items-center justify-center shadow-2xl z-50 border-2 sm:border-4 border-white/20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        style={{
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <MessageSquare size={20} className="sm:w-6 sm:h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="float-animation fixed inset-x-4 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto sm:w-80 md:w-96 bg-gray-900 rounded-3xl shadow-2xl z-50 border-2 border-purple-500/20 flex flex-col max-h-[80vh] overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(147, 51, 234, 0.1)'
            }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 sm:p-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 float-animation">
                  <MessageSquare className="text-white" size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-sm sm:text-base truncate">DevTone Assistant</h3>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                    <p className="text-white/70 text-xs">
                      Online | Quick Answers
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <motion.button
                  onClick={toggleMinimize}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? <ChevronUp size={14} className="sm:w-4 sm:h-4" /> : <ChevronDown size={14} className="sm:w-4 sm:h-4" />}
                </motion.button>
                <motion.button
                  onClick={toggleChat}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={14} className="sm:w-4 sm:h-4" />
                </motion.button>
              </div>
            </div>

            {/* Chat Body */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Messages Area */}
                  <div className="p-3 sm:p-4 bg-gray-800 flex-1 overflow-y-auto h-64 sm:h-80">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 sm:mb-4 flex ${msg.isUser ? 'justify-end user-message-animation' : 'justify-start bot-message-animation'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-2 sm:py-3 ${
                            msg.isUser
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                              : 'bg-gray-700 text-white shadow-md'
                          }`}
                        >
                          <p className="text-sm sm:text-base">{msg.message}</p>
                          
                          {/* Links if any */}
                          {msg.links && msg.links.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.links}
                            </div>
                          )}
                          
                          <div
                            className={`text-xs mt-1 ${
                              msg.isUser ? 'text-purple-200' : 'text-gray-400'
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        className="flex justify-start mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="bg-gray-700 text-white rounded-3xl px-4 py-3 shadow-md">
                          <div className="flex items-center">
                            <div className="typing-indicator flex space-x-1 mr-2">
                              <div className="typing-dot" />
                              <div className="typing-dot" />
                              <div className="typing-dot" />
                            </div>
                            <span className="text-sm text-gray-300">Typing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  <div className="p-3 bg-gray-900 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button 
                        onClick={() => {
                          addUserMessage("What services do you offer?")
                          setIsTyping(true)
                          setTimeout(() => {
                            processMessage("What services do you offer?")
                            setIsTyping(false)
                          }, 1000)
                        }}
                        className="chat-action-button px-3 py-2 bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-white text-xs rounded-lg whitespace-nowrap hover:from-purple-600/40 hover:to-purple-800/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="w-4 h-4 bg-purple-500/30 rounded-full flex items-center justify-center text-xs">?</span>
                        Our Services
                      </button>
                      <button 
                        onClick={() => {
                          addUserMessage("How can I contact you?")
                          setIsTyping(true)
                          setTimeout(() => {
                            processMessage("How can I contact you?")
                            setIsTyping(false)
                          }, 1000)
                        }}
                        className="chat-action-button px-3 py-2 bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-white text-xs rounded-lg whitespace-nowrap hover:from-purple-600/40 hover:to-purple-800/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="w-4 h-4 bg-purple-500/30 rounded-full flex items-center justify-center text-xs">?</span>
                        Contact Info
                      </button>
                      <button 
                        onClick={() => {
                          addUserMessage("What's your pricing?")
                          setIsTyping(true)
                          setTimeout(() => {
                            processMessage("What's your pricing?")
                            setIsTyping(false)
                          }, 1000)
                        }}
                        className="chat-action-button px-3 py-2 bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-white text-xs rounded-lg whitespace-nowrap hover:from-purple-600/40 hover:to-purple-800/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="w-4 h-4 bg-purple-500/30 rounded-full flex items-center justify-center text-xs">?</span>
                        Pricing
                      </button>
                      <button 
                        onClick={() => {
                          addUserMessage("Tell me about your company")
                          setIsTyping(true)
                          setTimeout(() => {
                            processMessage("Tell me about your company")
                            setIsTyping(false)
                          }, 1000)
                        }}
                        className="chat-action-button px-3 py-2 bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-white text-xs rounded-lg whitespace-nowrap hover:from-purple-600/40 hover:to-purple-800/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="w-4 h-4 bg-purple-500/30 rounded-full flex items-center justify-center text-xs">?</span>
                        About Us
                      </button>
                      <button 
                        onClick={() => {
                          addUserMessage("Do you offer website redesign?")
                          setIsTyping(true)
                          setTimeout(() => {
                            processMessage("Do you offer website redesign?")
                            setIsTyping(false)
                          }, 1000)
                        }}
                        className="chat-action-button px-3 py-2 bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-white text-xs rounded-lg whitespace-nowrap hover:from-purple-600/40 hover:to-purple-800/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="w-4 h-4 bg-purple-500/30 rounded-full flex items-center justify-center text-xs">?</span>
                        Website Redesign
                      </button>
                      <button 
                        onClick={() => {
                          addUserMessage("How do I get started?")
                          setIsTyping(true)
                          setTimeout(() => {
                            processMessage("How do I get started?")
                            setIsTyping(false)
                          }, 1000)
                        }}
                        className="chat-action-button px-3 py-2 bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-white text-xs rounded-lg whitespace-nowrap hover:from-purple-600/40 hover:to-purple-800/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="w-4 h-4 bg-purple-500/30 rounded-full flex items-center justify-center text-xs">?</span>
                        Get Started
                      </button>
                    </div>
                    
                    {/* Social Media Links */}
                    <div className="mt-4 border-t border-gray-700 pt-3">
                      <p className="text-xs text-gray-400 mb-2">Connect with us:</p>
                      <div className="flex justify-around">
                        {websiteInfo.social.map((platform, index) => (
                          <a 
                            key={index} 
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                            title={platform.name}
                          >
                            <div className={`w-10 h-10 ${platform.color} rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110`}>
                              {platform.icon}
                            </div>
                            <span className="text-xs text-gray-300">{platform.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default InteractiveChat