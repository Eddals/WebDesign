import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Clock, 
  MessageSquare,
  Settings,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ChatSession {
  id: string
  user_name: string
  user_email: string
  user_phone?: string
  user_company?: string
  inquiry_type?: string
  status: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ChatMessage {
  id: string
  session_id: string
  user_name: string
  user_email: string
  message: string
  is_user: boolean
  is_read: boolean
  created_at: string
  metadata?: any
}

interface ChatWindowProps {
  session: ChatSession | null
  onSessionUpdate: () => void
}

const ChatWindow = ({ session, onSessionUpdate }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [agentName] = useState('Support Agent') // In real app, get from auth
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch messages for selected session
  useEffect(() => {
    if (!session) {
      setMessages([])
      return
    }

    fetchMessages()
    markMessagesAsRead()

    // Subscribe to new messages for this session
    const subscription = supabase
      .channel(`chat_messages:session_id=eq.${session.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${session.id}`
      }, (payload) => {
        const newMsg = payload.new as ChatMessage
        setMessages(prev => [...prev, newMsg])
        
        // Mark user messages as read
        if (newMsg.is_user) {
          markMessageAsRead(newMsg.id)
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [session])

  const fetchMessages = async () => {
    if (!session) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markMessagesAsRead = async () => {
    if (!session) return

    try {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('session_id', session.id)
        .eq('is_user', true)
        .eq('is_read', false)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('id', messageId)
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session || sendingMessage) return

    const messageContent = newMessage.trim()
    setNewMessage('')
    setSendingMessage(true)

    // Stop typing indicator
    sendTypingIndicator(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          user_name: agentName,
          user_email: 'support@devtone.agency',
          message: messageContent,
          is_user: false,
          is_read: true,
          metadata: {
            agent_name: agentName,
            timestamp: new Date().toISOString()
          }
        })

      if (error) throw error

      // Update session status to active if it was pending
      if (session.status === 'pending') {
        await supabase
          .from('chat_sessions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', session.id)

        onSessionUpdate()
      }

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const updateSessionStatus = async (newStatus: string) => {
    if (!session) return

    try {
      await supabase
        .from('chat_sessions')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id)

      onSessionUpdate()
    } catch (error) {
      console.error('Error updating session status:', error)
    }
  }

  // Close conversation and notify client
  const closeConversation = async () => {
    if (!session) return

    try {
      // Send closing message to client
      await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          user_name: agentName,
          user_email: 'support@devtone.agency',
          message: '✅ This conversation has been resolved and closed by our support team. Thank you for contacting DevTone! If you need further assistance, please start a new chat.',
          is_user: false,
          is_read: true,
          metadata: {
            agent_name: agentName,
            message_type: 'system_close',
            timestamp: new Date().toISOString()
          }
        })

      // Update session status to resolved
      await supabase
        .from('chat_sessions')
        .update({
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id)

      onSessionUpdate()
    } catch (error) {
      console.error('Error closing conversation:', error)
    }
  }

  // Format conversation duration
  const getConversationDuration = () => {
    if (!session) return ''

    const start = new Date(session.created_at)
    const end = new Date()
    const diffMs = end.getTime() - start.getTime()

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  // Send typing indicator
  const sendTypingIndicator = async (isTyping: boolean) => {
    if (!session) return

    try {
      await supabase
        .channel(`typing:${session.id}`)
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            session_id: session.id,
            is_user: false,
            is_typing: isTyping,
            agent_name: agentName
          }
        })
    } catch (error) {
      console.error('Error sending typing indicator:', error)
    }
  }

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)

    // Send typing indicator when user starts typing
    if (value.length > 0 && !typingTimeoutRef.current) {
      sendTypingIndicator(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false)
      typingTimeoutRef.current = null
    }, 1000) // Stop typing indicator after 1 second of inactivity
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center text-gray-400">
          <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
          <p>Select a conversation from the list to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 max-h-full overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">{session.user_name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail size={12} />
                  <span>{session.user_email}</span>
                </div>
                {session.user_phone && (
                  <div className="flex items-center gap-1">
                    <Phone size={12} />
                    <span>{session.user_phone}</span>
                  </div>
                )}
                {session.user_company && (
                  <div className="flex items-center gap-1">
                    <Building size={12} />
                    <span>{session.user_company}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>Duration: {getConversationDuration()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status buttons */}
            <select
              value={session.status}
              onChange={(e) => updateSessionStatus(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Close Conversation Button */}
            <button
              onClick={closeConversation}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center gap-1"
              title="Close & Resolve Conversation"
            >
              <CheckCircle size={14} />
              Close
            </button>

            <button className="p-2 text-gray-400 hover:text-white">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {session.inquiry_type && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              {session.inquiry_type.charAt(0).toUpperCase() + session.inquiry_type.slice(1)} Inquiry
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading messages...</span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.is_user
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {!message.is_user && (
                    <div className="text-xs text-gray-300 mb-1">
                      {message.user_name}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.message}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.is_user ? 'text-purple-200' : 'text-gray-400'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {message.is_user && (
                      <span className="ml-2">
                        {message.is_read ? (
                          <CheckCircle size={12} className="inline" />
                        ) : (
                          <Clock size={12} className="inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex-shrink-0">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your response..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={sendingMessage}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sendingMessage}
            className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingMessage ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
