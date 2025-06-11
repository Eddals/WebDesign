import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Clock, 
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

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
  unread_count?: number
  last_message?: string
  last_message_time?: string
}

interface ChatSessionListProps {
  sessions: ChatSession[]
  selectedSession: ChatSession | null
  onSelectSession: (session: ChatSession) => void
  loading: boolean
}

const ChatSessionList = ({ sessions, selectedSession, onSelectSession, loading }: ChatSessionListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <MessageCircle className="text-green-500" size={16} />
      case 'pending':
        return <AlertCircle className="text-yellow-500" size={16} />
      case 'resolved':
        return <CheckCircle className="text-gray-500" size={16} />
      default:
        return <Clock className="text-gray-500" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'resolved':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getConversationDuration = (createdAt: string) => {
    const start = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - start.getTime()

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getInquiryTypeColor = (type?: string) => {
    switch (type) {
      case 'website':
        return 'bg-blue-500/20 text-blue-400'
      case 'seo':
        return 'bg-green-500/20 text-green-400'
      case 'support':
        return 'bg-red-500/20 text-red-400'
      case 'pricing':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-purple-500/20 text-purple-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading conversations...</span>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <MessageCircle size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No conversations found</p>
        <p className="text-sm text-center">
          Chat conversations will appear here when customers start chatting
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full">
      {sessions.map((session) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
          onClick={() => onSelectSession(session)}
          className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${
            selectedSession?.id === session.id ? 'bg-purple-600/20 border-purple-500' : ''
          }`}
        >
          {/* Header with name and status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <User className="text-gray-400" size={16} />
                <span className="text-white font-medium truncate max-w-[150px]">
                  {session.user_name}
                </span>
              </div>
              {session.unread_count && session.unread_count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {session.unread_count}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(session.status)}
              <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Mail size={12} />
              <span className="truncate">{session.user_email}</span>
            </div>
            {session.user_phone && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={12} />
                <span>{session.user_phone}</span>
              </div>
            )}
            {session.user_company && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Building size={12} />
                <span className="truncate">{session.user_company}</span>
              </div>
            )}
          </div>

          {/* Inquiry type */}
          {session.inquiry_type && (
            <div className="mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getInquiryTypeColor(session.inquiry_type)}`}>
                {session.inquiry_type.charAt(0).toUpperCase() + session.inquiry_type.slice(1)}
              </span>
            </div>
          )}

          {/* Last message preview */}
          {session.last_message && (
            <div className="mb-2">
              <p className="text-gray-300 text-sm line-clamp-2">
                {session.last_message.length > 60 
                  ? session.last_message.substring(0, 60) + '...'
                  : session.last_message
                }
              </p>
            </div>
          )}

          {/* Timestamp and Duration */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{formatTime(session.last_message_time || session.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Duration: {getConversationDuration(session.created_at)}</span>
              </div>
            </div>
            <span className="capitalize">{session.status}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ChatSessionList
