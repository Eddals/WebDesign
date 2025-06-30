import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X, ChevronDown, ChevronUp, Loader2, Phone, Mail, Calendar } from 'lucide-react'
import { queryGemini } from '@/lib/gemini-service'

// Define types for our chat
interface ChatMessage {
  id: string
  message: string
  isUser: boolean
  timestamp: Date
}

// FAQ data from the FAQ page
const faqData = [
  {
    question: "Do you offer a money-back guarantee?",
    answer: "Yes, we offer a 100% Money-Back Guarantee within the first 48 hours if you're not satisfied with our initial design concepts, and a Partial Refund if we can't deliver on agreed-upon requirements after multiple revision attempts."
  },
  {
    question: "What is your development process?",
    answer: "Our development process includes: 1) Discovery & Planning, 2) Design, 3) Development, 4) Testing, 5) Launch, and 6) Support & Maintenance. We focus on quality, efficiency, and client satisfaction throughout."
  },
  {
    question: "What information do you need to get started?",
    answer: "To get started, we need your business information (name, industry, target audience), project goals, design preferences, content (website copy, images), and functionality requirements. Don't worry if you don't have everything ready - we can guide you through the process."
  },
  {
    question: "What support options do you provide?",
    answer: "We offer email support (24/7 access with responses within 24 hours), phone support (Mon-Fri, 12am-6pm EST), technical support, and content updates. Support packages start at $50/month and can be customized to your needs."
  }
]

// Contact information
const contactInfo = {
  email: "support@devtone.agency",
  phone: "+1 (718) 419-3863",
  schedule: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ090688oDQPcvG5Wxi-vZugSIP1LGHQrZxgk5fB5rM46mgFZP1fVoq8xT70bguxDkjBy09qswqj"
}

const FAQChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Use a small timeout to ensure DOM is updated before scrolling
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) setIsMinimized(false)
    
    // Add welcome message if opening chat for the first time
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Hi there! I'm DevTone's AI assistant. I can answer questions about our services, pricing, and more. How can I help you today?")
      }, 500)
    }
  }

  // Toggle chat minimized/maximized
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(!isMinimized)
  }

  // Add a bot message - simplified for direct API responses
  const addBotMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        message: text,
        isUser: false,
        timestamp: new Date()
      }
    ]);
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

  // Get answer using Gemini API
  const getGeminiAnswer = async (query: string): Promise<string> => {
    try {
      const response = await queryGemini(query)
      return response.text
    } catch (error) {
      console.error('Error getting answer from Gemini:', error)
      return "I'm sorry, I encountered an error. Please try again or contact us directly at support@devtone.agency."
    }
  }

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return
    
    const userMessage = inputMessage.trim()
    addUserMessage(userMessage)
    setInputMessage('')
    
    // Show AI thinking
    setIsTyping(true)
    
    try {
      // Get response from Gemini API
      const response = await getGeminiAnswer(userMessage)
      addBotMessage(response)
    } catch (error) {
      console.error('Error getting answer:', error)
      addBotMessage("I'm sorry, I encountered an error. Please try again or contact us directly at support@devtone.agency.")
    } finally {
      setIsTyping(false)
    }
  }

  // Open WhatsApp chat
  const openWhatsApp = () => {
    const phoneNumber = contactInfo.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phoneNumber}`, '_blank')
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white flex items-center justify-center shadow-2xl z-50 border-2 sm:border-4 border-white/20"
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
            className="fixed inset-x-4 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto sm:w-80 md:w-96 bg-gray-900 rounded-3xl shadow-2xl z-50 border-2 border-purple-500/20 flex flex-col max-h-[80vh] overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(147, 51, 234, 0.1)'
            }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 sm:p-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <MessageSquare className="text-white" size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-sm sm:text-base truncate">DevTone FAQ Assistant</h3>
                  <p className="text-white/70 text-xs">
                    Ask me anything about our services
                  </p>
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
                  {/* Messages Area - Auto-scrolling container */}
                  <div className="p-3 sm:p-4 bg-gray-800 flex-1 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 sm:mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-2 sm:py-3 ${
                            msg.isUser
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                              : 'bg-gray-700 text-white shadow-md'
                          }`}
                        >
                          <p className="text-sm sm:text-base">{msg.message}</p>
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
                            <div className="flex space-x-1 mr-2">
                              <motion.div
                                className="w-2 h-2 bg-purple-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-purple-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-purple-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                            <span className="text-sm text-gray-300">Thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  <div className="p-3 bg-gray-900 border-t border-gray-700">
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                      <button 
                        onClick={async () => {
                          addUserMessage("What's your money-back guarantee?")
                          setIsTyping(true)
                          const response = await getGeminiAnswer("What's your money-back guarantee?")
                          addBotMessage(response)
                          setIsTyping(false)
                        }}
                        className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full whitespace-nowrap hover:bg-gray-700 transition-colors"
                      >
                        Money-back guarantee
                      </button>
                      <button 
                        onClick={async () => {
                          addUserMessage("What's your development process?")
                          setIsTyping(true)
                          const response = await getGeminiAnswer("What's your development process?")
                          addBotMessage(response)
                          setIsTyping(false)
                        }}
                        className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full whitespace-nowrap hover:bg-gray-700 transition-colors"
                      >
                        Development process
                      </button>
                      <button 
                        onClick={async () => {
                          addUserMessage("How can I contact you?")
                          setIsTyping(true)
                          const response = await getGeminiAnswer("How can I contact you?")
                          addBotMessage(response)
                          setIsTyping(false)
                        }}
                        className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full whitespace-nowrap hover:bg-gray-700 transition-colors"
                      >
                        Contact info
                      </button>
                    </div>
                    
                    {/* Contact Options - Removed schedule button */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <a 
                        href={`mailto:${contactInfo.email}`}
                        className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                      >
                        <Mail size={16} className="text-purple-400 mb-1" />
                        <span className="text-xs text-white">Email</span>
                      </a>
                      <button 
                        onClick={openWhatsApp}
                        className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          width="16" 
                          height="16" 
                          className="text-green-500 mb-1"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span className="text-xs text-white">WhatsApp</span>
                      </button>
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={isTyping}
                      />
                      <motion.button
                        type="submit"
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                        disabled={isTyping || !inputMessage.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Send size={16} className="sm:w-4.5 sm:h-4.5" />
                      </motion.button>
                    </form>
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

export default FAQChatbot