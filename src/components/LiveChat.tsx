import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X, User, Loader2, ChevronDown, ChevronUp, Mail, Phone, Building, Download, Image, FileText, Paperclip } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Define types for our chat
interface ChatMessage {
  id: string
  message: string
  is_user: boolean
  created_at: string
  agent_name?: string
  metadata?: any
}

interface ChatSession {
  id: string
  user_name: string
  user_email: string
  user_phone?: string
  user_company?: string
  status: string
}

interface UserInfo {
  name: string
  email: string
  phone: string
  company: string
  inquiry_type: string
}

interface LiveChatProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const LiveChat = ({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }: LiveChatProps = {}) => {
  // Chat state
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // Use either external or internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalSetIsOpen || setInternalIsOpen
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiry_type: ''
  })
  const [isUserInfoSubmitted, setIsUserInfoSubmitted] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Save session to localStorage
  const saveSessionToStorage = (session: ChatSession, userInfo: UserInfo) => {
    const sessionData = {
      session,
      userInfo,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('devtone_chat_session', JSON.stringify(sessionData))
  }

  // Load session from localStorage
  const loadSessionFromStorage = () => {
    try {
      const savedData = localStorage.getItem('devtone_chat_session')
      if (savedData) {
        const { session, userInfo: savedUserInfo, timestamp } = JSON.parse(savedData)

        // Check if session is less than 24 hours old
        const sessionAge = new Date().getTime() - new Date(timestamp).getTime()
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

        if (sessionAge < maxAge) {
          return { session, userInfo: savedUserInfo }
        } else {
          // Session expired, remove it
          localStorage.removeItem('devtone_chat_session')
        }
      }
    } catch (error) {
      console.error('Error loading session from storage:', error)
      localStorage.removeItem('devtone_chat_session')
    }
    return null
  }

  // Clear session from localStorage
  const clearSessionFromStorage = () => {
    localStorage.removeItem('devtone_chat_session')
  }

  // Check if support is available (12pm to 6pm, Monday to Friday)
  const isSupportAvailable = () => {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours()

    // Monday to Friday (1-5) and between 12pm (12) and 6pm (18)
    return day >= 1 && day <= 5 && hour >= 12 && hour < 18
  }

  // Get support availability message
  const getSupportAvailabilityMessage = () => {
    if (isSupportAvailable()) {
      return "🟢 We're online! Our team is available to help you."
    } else {
      return "🔴 We're currently offline. Our support hours are Monday to Friday, 12pm to 6pm. Leave a message and we'll get back to you!"
    }
  }

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image size={16} className="text-blue-400" />
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return <FileText size={16} className="text-red-400" />
    } else {
      return <Paperclip size={16} className="text-gray-400" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Load messages for a specific session
  const loadMessagesForSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          message: msg.message,
          is_user: msg.is_user,
          created_at: msg.created_at,
          agent_name: msg.is_user ? undefined : msg.user_name
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Error loading messages for session:', error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load saved session on component mount
  useEffect(() => {
    const savedSession = loadSessionFromStorage()
    if (savedSession) {
      setChatSession(savedSession.session)
      setUserInfo(savedSession.userInfo)
      setIsUserInfoSubmitted(true)

      // Load messages for the saved session
      loadMessagesForSession(savedSession.session.id)
    }
    setIsLoadingSession(false)
  }, [])

  // No automatic welcome messages - clean chat interface

  // Set up real-time subscription when chat session is created
  useEffect(() => {
    if (chatSession?.id && isUserInfoSubmitted) {
      // Subscribe to new messages for this session
      const subscription = supabase
        .channel(`chat_messages:session_id=eq.${chatSession.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${chatSession.id}`
        }, (payload: any) => {
          // Only add messages from the agent (not the user's own messages)
          if (!payload.new.is_user) {
            const newMsg = {
              id: payload.new.id,
              message: payload.new.message,
              is_user: payload.new.is_user,
              created_at: payload.new.created_at,
              metadata: payload.new.metadata
            }
            setMessages(prev => [...prev, newMsg])
            // Hide typing indicator when message arrives
            setIsAgentTyping(false)

            // If this is a close message, disable the chat input
            if (payload.new.metadata?.message_type === 'system_close') {
              // Update session status locally
              setChatSession(prev => prev ? { ...prev, status: 'resolved' } : null)
            }
          }
        })
        .subscribe()

      // Subscribe to typing indicators via broadcast
      const typingChannel = supabase
        .channel(`typing:${chatSession.id}`)
        .on('broadcast', { event: 'typing' }, (payload: any) => {
          if (payload.payload.session_id === chatSession.id && !payload.payload.is_user) {
            setIsAgentTyping(payload.payload.is_typing)

            // Auto-hide typing indicator after 3 seconds
            if (payload.payload.is_typing) {
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
              typingTimeoutRef.current = setTimeout(() => {
                setIsAgentTyping(false)
              }, 3000)
            }
          }
        })
        .subscribe()

      // Subscribe to conversation closure events
      const closeChannel = supabase
        .channel(`session_close:${chatSession.id}`)
        .on('broadcast', { event: 'conversation_closed' }, (payload: any) => {
          if (payload.payload.session_id === chatSession.id) {
            // Show closure message
            setMessages([{
              id: 'closure-message',
              message: payload.payload.message,
              is_user: false,
              created_at: new Date().toISOString(),
              metadata: { message_type: 'system_close' }
            }])

            // Keep session open - client can continue if needed
          }
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `id=eq.${chatSession.id}`
        }, (payload: any) => {
          // Update session status in real-time
          setChatSession(prev => prev ? { ...prev, ...payload.new } : null)
        })
        .subscribe()

      setSubscription(subscription)

      return () => {
        subscription.unsubscribe()
        typingChannel.unsubscribe()
        closeChannel.unsubscribe()
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [chatSession, isUserInfoSubmitted])

  // Create a new chat session
  const createChatSession = async () => {
    if (!userInfo.name || !userInfo.email) return

    try {
      const sessionId = uuidv4()

      // Create a new chat session with enhanced user information
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          id: sessionId,
          user_name: userInfo.name,
          user_email: userInfo.email,
          user_phone: userInfo.phone || null,
          user_company: userInfo.company || null,
          inquiry_type: userInfo.inquiry_type || 'general',
          status: 'active',
          is_active: true,
          metadata: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            page_url: window.location.href
          }
        })
        .select()

      if (error) throw error

      // Set the chat session
      const newSession = {
        id: sessionId,
        user_name: userInfo.name,
        user_email: userInfo.email,
        user_phone: userInfo.phone,
        user_company: userInfo.company,
        status: 'active'
      }

      setChatSession(newSession)
      setIsUserInfoSubmitted(true)

      // Save session to localStorage
      saveSessionToStorage(newSession, userInfo)

      // Session created successfully - no automatic welcome message
      // Real agents will respond when available

    } catch (error) {
      console.error('Error creating chat session:', error)
    }
  }

  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !chatSession) return
    
    const messageContent = newMessage.trim()
    setNewMessage('')
    setIsLoading(true)

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: uuidv4(),
      message: messageContent,
      is_user: true,
      created_at: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])

    try {
      // Save user message to Supabase
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: chatSession.id,
          user_name: userInfo.name,
          user_email: userInfo.email,
          message: messageContent,
          is_user: true,
          is_read: false
        })

      if (error) throw error

      // In a real application, you would have a backend service that would:
      // 1. Process the message
      // 2. Generate a response
      // 3. Insert the response into the database
      // 4. The subscription would then pick up the new message
      
      // Message sent successfully - no automatic responses
      setIsLoading(false)
      
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }



  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) setIsMinimized(false)
  }

  // End chat session
  const endChatSession = () => {
    clearSessionFromStorage()
    setChatSession(null)
    setUserInfo({
      name: '',
      email: '',
      phone: '',
      company: '',
      inquiry_type: ''
    })
    setIsUserInfoSubmitted(false)
    setMessages([])
    if (subscription) {
      subscription.unsubscribe()
      setSubscription(null)
    }
  }

  // Toggle chat minimized/maximized
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(!isMinimized)
  }

  // Handle user info submission
  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInfo.name && userInfo.email) {
      createChatSession()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white flex items-center justify-center shadow-2xl z-50 border-4 border-white/20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        style={{
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-gray-900 rounded-3xl shadow-2xl overflow-hidden z-50 border-2 border-purple-500/20"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(147, 51, 234, 0.1)'
            }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <MessageSquare className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">DevTone Support</h3>
                  {isUserInfoSubmitted ? (
                    <p className="text-white/70 text-xs">
                      Connected as {userInfo.name}
                    </p>
                  ) : (
                    <p className="text-white/70 text-xs">
                      {isSupportAvailable() ? "🟢 Online" : "🔴 Offline"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isUserInfoSubmitted && (
                  <motion.button
                    onClick={endChatSession}
                    className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-200 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="End Chat Session"
                  >
                    <X size={14} />
                  </motion.button>
                )}
                <motion.button
                  onClick={toggleMinimize}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </motion.button>
                <motion.button
                  onClick={toggleChat}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
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
                >
                  {isLoadingSession ? (
                    // Loading Session
                    <div className="p-8 bg-gray-800 flex items-center justify-center">
                      <div className="flex items-center gap-3 text-white">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Restoring your chat session...</span>
                      </div>
                    </div>
                  ) : !isUserInfoSubmitted ? (
                    // User Info Form
                    <div className="p-4 bg-gray-800">
                      <div className="text-center mb-4">
                        <h3 className="text-white text-lg font-semibold mb-2">Welcome to DevTone Support!</h3>
                        <p className="text-gray-300 text-sm mb-3">
                          Please provide your information so we can assist you better:
                        </p>

                        {/* Support Availability Notice */}
                        <div className={`text-xs p-3 rounded-2xl mb-3 ${
                          isSupportAvailable()
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        }`}>
                          <div className="flex items-center justify-center gap-2">
                            <span>{isSupportAvailable() ? '🟢' : '🔴'}</span>
                            <span className="font-medium">
                              {isSupportAvailable() ? 'We\'re Online!' : 'Currently Offline'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs opacity-90">
                            {isSupportAvailable()
                              ? 'Our team is available to help you right now.'
                              : 'Support hours: Monday-Friday, 12pm-6pm. Leave a message and we\'ll respond during business hours!'
                            }
                          </p>
                        </div>
                      </div>
                      <form onSubmit={handleUserInfoSubmit} className="space-y-3">
                        <div>
                          <label className="block text-white text-sm font-medium mb-1">
                            Full Name *
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-purple-400" />
                            </div>
                            <input
                              type="text"
                              value={userInfo.name}
                              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Your full name"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <Mail className="w-3 h-3 text-purple-400" />
                            </div>
                            <input
                              type="email"
                              value={userInfo.email}
                              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <Phone className="w-3 h-3 text-purple-400" />
                            </div>
                            <input
                              type="tel"
                              value={userInfo.phone}
                              onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1">
                            Company/Organization
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <Building className="w-3 h-3 text-purple-400" />
                            </div>
                            <input
                              type="text"
                              value={userInfo.company}
                              onChange={(e) => setUserInfo(prev => ({ ...prev, company: e.target.value }))}
                              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Your company name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-1">
                            How can we help you?
                          </label>
                          <select
                            value={userInfo.inquiry_type}
                            onChange={(e) => setUserInfo(prev => ({ ...prev, inquiry_type: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="">Select an option</option>
                            <option value="general">General Inquiry</option>
                            <option value="website">Website Development</option>
                            <option value="seo">SEO Services</option>
                            <option value="support">Technical Support</option>
                            <option value="pricing">Pricing Information</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <motion.button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-medium hover:from-purple-600 hover:to-purple-800 transition-colors shadow-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Start Chat
                        </motion.button>
                      </form>
                    </div>
                  ) : (
                    // Chat Messages
                    <>
                      <div className="h-80 overflow-y-auto p-4 bg-gray-800">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`mb-4 flex ${msg.is_user ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-3xl px-4 py-3 ${
                                msg.metadata?.message_type === 'system_close'
                                  ? 'bg-green-600 text-white shadow-lg border-2 border-green-400'
                                  : msg.metadata?.message_type === 'system_resolved'
                                  ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-400'
                                  : msg.metadata?.message_type === 'system_reopened'
                                  ? 'bg-orange-600 text-white shadow-lg border-2 border-orange-400'
                                  : msg.is_user
                                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                  : 'bg-gray-700 text-white shadow-md'
                              }`}
                            >
                              {/* Message content */}
                              <p>{msg.message}</p>

                              {/* File attachment */}
                              {msg.metadata?.message_type === 'file' && (
                                <div className="mt-3 p-3 bg-black/20 rounded-2xl border border-white/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getFileIcon(msg.metadata.file_type)}
                                    <span className="text-sm font-medium">{msg.metadata.file_name}</span>
                                  </div>
                                  <div className="text-xs text-gray-300 mb-2">
                                    {formatFileSize(msg.metadata.file_size)}
                                  </div>
                                  {msg.metadata.file_type.startsWith('image/') && (
                                    <div className="mb-2">
                                      <img
                                        src={msg.metadata.file_data}
                                        alt={msg.metadata.file_name}
                                        className="max-w-full max-h-48 rounded border"
                                      />
                                    </div>
                                  )}
                                  <a
                                    href={msg.metadata.file_data}
                                    download={msg.metadata.file_name}
                                    className="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition-colors"
                                  >
                                    <Download size={12} />
                                    Download
                                  </a>
                                </div>
                              )}

                              <div
                                className={`text-xs mt-1 ${
                                  msg.is_user ? 'text-purple-200' : 'text-gray-400'
                                }`}
                              >
                                {new Date(msg.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start mb-4">
                            <div className="bg-gray-700 text-white rounded-3xl px-4 py-3 shadow-md">
                              <div className="flex items-center">
                                <Loader2 className="animate-spin mr-2" size={16} />
                                <span>Typing...</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Agent Typing Indicator */}
                        {isAgentTyping && (
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
                                <span className="text-sm text-gray-300">Support is typing...</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Chat Input - Always available */}
                      {chatSession?.status === 'resolved' ? (
                        <div className="p-4 bg-gray-900 border-t border-gray-700">
                          <div className="text-center text-gray-400 text-sm mb-3">
                            <p>✅ This conversation has been marked as resolved by our support team.</p>
                            <p className="text-xs mt-1">You can still continue the conversation if needed.</p>
                          </div>
                          <form onSubmit={sendMessage} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Continue conversation..."
                              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              disabled={isLoading}
                            />
                            <motion.button
                              type="submit"
                              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                              disabled={isLoading || !newMessage.trim()}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Send size={18} />
                            </motion.button>
                          </form>
                        </div>
                      ) : (
                        <form onSubmit={sendMessage} className="p-4 bg-gray-900 border-t border-gray-700">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message..."
                              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              disabled={isLoading}
                            />
                            <motion.button
                              type="submit"
                              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                              disabled={isLoading || !newMessage.trim()}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Send size={18} />
                            </motion.button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LiveChat