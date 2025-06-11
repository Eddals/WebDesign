import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ChatSessionList from '@/components/ChatDashboard/ChatSessionList'
import ChatWindow from '@/components/ChatDashboard/ChatWindow'
import ChatStats from '@/components/ChatDashboard/ChatStats'

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

interface ChatStats {
  total_sessions: number
  active_sessions: number
  pending_sessions: number
  resolved_sessions: number
  avg_response_time: number
}

const ChatDashboard = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [stats, setStats] = useState<ChatStats>({
    total_sessions: 0,
    active_sessions: 0,
    pending_sessions: 0,
    resolved_sessions: 0,
    avg_response_time: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authPassword, setAuthPassword] = useState('')

  // Simple authentication for demo purposes
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (authPassword === 'devtone2024') {
      setIsAuthenticated(true)
      localStorage.setItem('chat_dashboard_auth', 'true')
    } else {
      alert('Invalid password')
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem('chat_dashboard_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch chat sessions
  const fetchSessions = async () => {
    try {
      setLoading(true)
      
      // Get sessions with message counts
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          chat_messages(count)
        `)
        .order('updated_at', { ascending: false })

      if (sessionsError) throw sessionsError

      // Get unread message counts and last messages for each session
      const sessionsWithDetails = await Promise.all(
        (sessionsData || []).map(async (session) => {
          // Get unread count
          const { count: unreadCount } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id)
            .eq('is_user', true)
            .eq('is_read', false)

          // Get last message
          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select('message, created_at, is_user')
            .eq('session_id', session.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          return {
            ...session,
            unread_count: unreadCount || 0,
            last_message: lastMessage?.message || '',
            last_message_time: lastMessage?.created_at || session.created_at
          }
        })
      )

      setSessions(sessionsWithDetails)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const { data: allSessions } = await supabase
        .from('chat_sessions')
        .select('status, created_at')

      if (allSessions) {
        const total = allSessions.length
        const active = allSessions.filter(s => s.status === 'active').length
        const pending = allSessions.filter(s => s.status === 'pending').length
        const resolved = allSessions.filter(s => s.status === 'resolved').length

        setStats({
          total_sessions: total,
          active_sessions: active,
          pending_sessions: pending,
          resolved_sessions: resolved,
          avg_response_time: 2.5 // Mock data for now
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated) return

    fetchSessions()
    fetchStats()

    // Subscribe to new sessions
    const sessionsSubscription = supabase
      .channel('chat_sessions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_sessions'
      }, () => {
        fetchSessions()
        fetchStats()
      })
      .subscribe()

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, () => {
        fetchSessions()
      })
      .subscribe()

    return () => {
      sessionsSubscription.unsubscribe()
      messagesSubscription.unsubscribe()
    }
  }, [isAuthenticated])

  // Filter sessions based on search and status
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.user_company && session.user_company.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-purple-500/20"
        >
          <div className="text-center mb-6">
            <MessageSquare className="mx-auto text-purple-500 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-white mb-2">Chat Dashboard</h1>
            <p className="text-gray-400">Enter password to access support dashboard</p>
          </div>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 h-20">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <MessageSquare className="text-purple-500 mr-3" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">DevTone Chat Dashboard</h1>
              <p className="text-gray-400">Manage customer support conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                fetchSessions()
                fetchStats()
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('chat_dashboard_auth')
                setIsAuthenticated(false)
                window.location.href = '/' // Redirect to home instead of reload
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Users size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="h-24">
        <ChatStats stats={stats} />
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-176px)]">
        {/* Sessions List */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-700 flex-shrink-0">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-hidden">
            <ChatSessionList
              sessions={filteredSessions}
              selectedSession={selectedSession}
              onSelectSession={setSelectedSession}
              loading={loading}
            />
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <ChatWindow
            session={selectedSession}
            onSessionUpdate={fetchSessions}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatDashboard
