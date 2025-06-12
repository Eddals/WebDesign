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
  Loader2,
  Paperclip,
  Image,
  FileText,
  Download,
  X,
  XCircle,
  Check
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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

    // 🚀 SIMPLE AND FAST REAL-TIME - Like your example
    const channel = supabase
      .channel('chat-window-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage

          // 🚀 INSTANT ADD - Exactly like your pattern
          setMessages((prev) => {
            // Avoid duplicates
            const exists = prev.find(msg => msg.id === newMsg.id)
            if (exists) return prev
            return [...prev, newMsg]
          })

          // Mark user messages as read automatically
          if (newMsg.is_user) {
            markMessageAsRead(newMsg.id)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          // Update message in real-time (for read status, etc.)
          setMessages((prev) => prev.map(msg =>
            msg.id === payload.new.id
              ? { ...msg, ...payload.new }
              : msg
          ))
        }
      )
      .subscribe()

    return () => {
      // 🚀 SIMPLE CLEANUP - Like your example
      supabase.removeChannel(channel)
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
    const tempMessageId = `agent-temp-${Date.now()}-${Math.random()}`

    // 🚀 INSTANT UI UPDATE - Add message immediately to dashboard
    const instantMessage = {
      id: tempMessageId,
      message: messageContent,
      is_user: false,
      user_name: agentName,
      created_at: new Date().toISOString(),
      is_read: true,
      metadata: {
        agent_name: agentName,
        sending: true,
        temp: true
      }
    }

    setMessages(prev => [...prev, instantMessage])
    setNewMessage('')
    setSendingMessage(true)

    // Stop typing indicator
    sendTypingIndicator(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    try {
      const { data, error } = await supabase
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
        .select()
        .single()

      if (error) throw error

      // ✅ Replace temp message with real message from database
      setMessages(prev => prev.map(msg =>
        msg.id === tempMessageId
          ? {
              ...msg,
              id: data.id,
              created_at: data.created_at,
              metadata: { ...msg.metadata, sent: true, temp: false }
            }
          : msg
      ))

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

      // ❌ Mark message as failed in UI
      setMessages(prev => prev.map(msg =>
        msg.id === tempMessageId
          ? { ...msg, metadata: { ...msg.metadata, failed: true } }
          : msg
      ))
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

  // Mark conversation as resolved
  const markAsResolved = async () => {
    if (!session || actionLoading) return

    setActionLoading('resolved')
    try {
      // Send resolution message to client
      await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          user_name: agentName,
          user_email: 'support@devtone.agency',
          message: '✅ This conversation has been marked as resolved by our support team. Thank you for contacting DevTone! If you need further assistance, please feel free to continue the conversation.',
          is_user: false,
          is_read: true,
          metadata: {
            agent_name: agentName,
            message_type: 'system_resolved',
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
      alert('Conversation marked as resolved successfully!')
    } catch (error) {
      console.error('Error marking as resolved:', error)
      alert('Error updating conversation status.')
    } finally {
      setActionLoading(null)
    }
  }

  // Mark conversation as not resolved (reopen)
  const markAsNotResolved = async () => {
    if (!session || actionLoading) return

    setActionLoading('not_resolved')
    try {
      // Send reopening message to client
      await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          user_name: agentName,
          user_email: 'support@devtone.agency',
          message: '🔄 This conversation has been reopened by our support team. We\'re here to help you further. Please let us know how we can assist you.',
          is_user: false,
          is_read: true,
          metadata: {
            agent_name: agentName,
            message_type: 'system_reopened',
            timestamp: new Date().toISOString()
          }
        })

      // Update session status to active
      await supabase
        .from('chat_sessions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id)

      onSessionUpdate()
      alert('Conversation reopened successfully!')
    } catch (error) {
      console.error('Error marking as not resolved:', error)
      alert('Error updating conversation status.')
    } finally {
      setActionLoading(null)
    }
  }

  // Close conversation completely - close chat on both sides
  const closeConversation = async () => {
    if (!session || actionLoading) return

    const confirmClose = window.confirm(
      'Are you sure you want to close this conversation?\n\n' +
      'This will:\n' +
      '• Close the chat on both agent and client side\n' +
      '• Send a closure message to the client\n' +
      '• Hide the conversation from the dashboard\n' +
      '• Preserve all conversation data\n\n' +
      'The client will be notified that the conversation is closed.'
    )

    if (!confirmClose) return

    setActionLoading('close')
    try {
      // Send closure message to client
      await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          user_name: agentName,
          user_email: 'support@devtone.agency',
          message: '🔒 This conversation has been closed by our support team. Thank you for contacting DevTone! If you need further assistance, please start a new chat.',
          is_user: false,
          is_read: true,
          metadata: {
            agent_name: agentName,
            message_type: 'system_closed',
            timestamp: new Date().toISOString()
          }
        })

      // Send broadcast to close client chat immediately
      const channel = supabase.channel(`session_close:${session.id}`)
      await channel.send({
        type: 'broadcast',
        event: 'conversation_closed',
        payload: {
          session_id: session.id,
          message: '🔒 This conversation has been closed by our support team.\n\nThank you for contacting DevTone!\n\nIf you need further assistance, please start a new chat.',
          closed_by: agentName,
          timestamp: new Date().toISOString()
        }
      })

      // Wait a moment for the broadcast to be delivered
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update session status to closed
      await supabase
        .from('chat_sessions')
        .update({
          status: 'closed',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id)

      // Update dashboard and show success
      onSessionUpdate()
      alert('Conversation closed successfully. The client has been notified and their chat will close automatically.')

    } catch (error) {
      console.error('Error closing conversation:', error)
      alert('Error closing conversation. Please try again.')
    } finally {
      setActionLoading(null)
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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB for base64 storage)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setSelectedFile(file)
    }
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Send file message
  const sendFileMessage = async () => {
    if (!selectedFile || !session || uploadingFile) return

    setUploadingFile(true)

    try {
      // Convert file to base64
      const fileBase64 = await fileToBase64(selectedFile)

      // Send message with file
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          user_name: agentName,
          user_email: 'support@devtone.agency',
          message: `📎 File shared: ${selectedFile.name}`,
          is_user: false,
          is_read: true,
          metadata: {
            agent_name: agentName,
            message_type: 'file',
            file_name: selectedFile.name,
            file_data: fileBase64,
            file_size: selectedFile.size,
            file_type: selectedFile.type,
            timestamp: new Date().toISOString()
          }
        })

      if (error) throw error

      // Clear selected file
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Error sending file:', error)
      alert('Failed to send file')
    } finally {
      setUploadingFile(false)
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
            {/* Status Display */}
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
              session.status === 'active' ? 'bg-green-500/20 text-green-400' :
              session.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
              session.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>

            {/* Action Buttons */}
            <button
              onClick={markAsResolved}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Mark as Resolved"
              disabled={session.status === 'resolved' || actionLoading !== null}
            >
              {actionLoading === 'resolved' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCircle size={14} />
              )}
              Resolved
            </button>

            <button
              onClick={markAsNotResolved}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Mark as Not Resolved (Reopen)"
              disabled={session.status === 'active' || actionLoading !== null}
            >
              {actionLoading === 'not_resolved' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <AlertCircle size={14} />
              )}
              Not Resolved
            </button>

            <button
              onClick={closeConversation}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Close Conversation (Close on Both Sides)"
              disabled={actionLoading !== null}
            >
              {actionLoading === 'close' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <XCircle size={14} />
              )}
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

                  {/* Message content */}
                  <p className="whitespace-pre-wrap">{message.message}</p>

                  {/* File attachment */}
                  {message.metadata?.message_type === 'file' && (
                    <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        {getFileIcon(message.metadata.file_type)}
                        <span className="text-sm font-medium">{message.metadata.file_name}</span>
                      </div>
                      <div className="text-xs text-gray-300 mb-2">
                        {formatFileSize(message.metadata.file_size)}
                      </div>
                      {message.metadata.file_type.startsWith('image/') ? (
                        <div className="mb-2">
                          <img
                            src={message.metadata.file_data}
                            alt={message.metadata.file_name}
                            className="max-w-full max-h-48 rounded border"
                          />
                        </div>
                      ) : null}
                      <a
                        href={message.metadata.file_data}
                        download={message.metadata.file_name}
                        className="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                      >
                        <Download size={12} />
                        Download
                      </a>
                    </div>
                  )}

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
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile.type)}
                <div>
                  <p className="text-white text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-xs">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={sendFileMessage}
                  disabled={uploadingFile}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                >
                  {uploadingFile ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    'Send File'
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={sendMessage} className="flex items-center gap-2">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            className="hidden"
          />

          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg p-2 transition-colors"
            title="Attach File"
          >
            <Paperclip size={18} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your response..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={sendingMessage || uploadingFile}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!newMessage.trim() || sendingMessage || uploadingFile}
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
