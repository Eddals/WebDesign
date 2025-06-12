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
    <div className="overflow-y-auto h-full bg-gray-800">
      {sessions.map((session) => (
        <motion.div
          key={session.id}
          onClick={() => onSelectSession(session)}
          className={`mx-1 my-1 p-2 rounded-lg cursor-pointer transition-colors border ${
            selectedSession?.id === session.id
              ? 'bg-purple-600 border-purple-500'
              : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
          }`}
        >
          {/* Compact Header with name and status */}
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="bg-gradient-to-r from-purple-500/15 to-purple-600/15 p-1.5 rounded-full flex-shrink-0">
                <User className="text-purple-300" size={12} />
              </div>
              <span className="text-white font-medium truncate text-sm">
                {session.user_name}
              </span>
              {session.unread_count && session.unread_count > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[16px] h-4 flex items-center justify-center text-xs flex-shrink-0">
                  {session.unread_count}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="text-gray-400">
                {getStatusIcon(session.status)}
              </div>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}
              />
            </div>
          </div>

          {/* Compact Contact info */}
          <div className="space-y-1 mb-2 relative z-10">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Mail size={8} className="text-blue-400 flex-shrink-0" />
              <span className="truncate">{session.user_email}</span>
            </div>
            {session.user_phone && (
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Phone size={8} className="text-green-400 flex-shrink-0" />
                <span>{session.user_phone}</span>
              </div>
            )}
            {session.user_company && (
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Building size={8} className="text-purple-400 flex-shrink-0" />
                <span className="truncate">{session.user_company}</span>
              </div>
            )}
          </div>

          {/* Compact Inquiry type and last message */}
          <div className="space-y-1 mb-2 relative z-10">
            {session.inquiry_type && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getInquiryTypeColor(session.inquiry_type)} font-medium`}>
                {session.inquiry_type.charAt(0).toUpperCase() + session.inquiry_type.slice(1)}
              </span>
            )}
            {session.last_message && (
              <div className="bg-gray-800/30 rounded-lg p-1.5">
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                  {session.last_message.length > 40
                    ? session.last_message.substring(0, 40) + '...'
                    : session.last_message
                  }
                </p>
              </div>
            )}
          </div>

          {/* Timestamp and Status */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Clock size={8} className="text-blue-400" />
                <span>{formatTime(session.last_message_time || session.created_at)}</span>
              </div>
              <span>{getConversationDuration(session.created_at)}</span>
            </div>
            <span className={`capitalize px-1.5 py-0.5 rounded text-xs font-medium ${
              session.status === 'active' ? 'bg-green-600 text-white' :
              session.status === 'pending' ? 'bg-yellow-600 text-white' :
              session.status === 'resolved' ? 'bg-gray-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {session.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ChatSessionList
