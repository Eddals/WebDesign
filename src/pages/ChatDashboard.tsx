import { useState, useEffect, useRef } from 'react'
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

  // Real-time connection management
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected')
  const [usePolling, setUsePolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const subscriptionsRef = useRef<any[]>([])
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
  const fetchSessions = async (includeClosedSessions = false) => {
    try {
      setLoading(true)

      // Build query
      let query = supabase
        .from('chat_sessions')
        .select(`
          *,
          chat_messages(count)
        `)

      // Exclude closed sessions by default unless specifically requested
      if (!includeClosedSessions && statusFilter !== 'closed') {
        query = query.neq('status', 'closed')
      } else if (statusFilter === 'closed') {
        query = query.eq('status', 'closed')
      }

      const { data: sessionsData, error: sessionsError } = await query
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

  // Start polling fallback
  const startPolling = () => {
    if (pollingIntervalRef.current) return

    console.log('Dashboard: Starting polling fallback...')
    setUsePolling(true)
    setConnectionStatus('connected')

    pollingIntervalRef.current = setInterval(() => {
      fetchSessions()
      fetchStats()
    }, 30000) // 30 seconds
  }

  // Stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      setUsePolling(false)
    }
  }

  // Setup enhanced real-time subscriptions with fallback
  const setupRealTimeSubscriptions = () => {
    // Clean up existing subscriptions
    subscriptionsRef.current.forEach(sub => sub.unsubscribe())
    subscriptionsRef.current = []
    stopPolling()

    try {
      setConnectionStatus('connected')

      // Subscribe to session changes
      const sessionsSubscription = supabase
        .channel('dashboard_sessions_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'chat_sessions'
        }, () => {
          fetchSessions()
          fetchStats()
        })
        .subscribe((status) => {
          console.log('Sessions subscription status:', status)
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected')
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setConnectionStatus('error')
            startPolling()
          }
        })

      // Subscribe to message changes
      const messagesSubscription = supabase
        .channel('dashboard_messages_changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        }, () => {
          fetchSessions() // Update unread counts
        })
        .subscribe((status) => {
          console.log('Messages subscription status:', status)
          if (status !== 'SUBSCRIBED' && status === 'CHANNEL_ERROR') {
            if (!usePolling) startPolling()
          }
        })

      subscriptionsRef.current = [sessionsSubscription, messagesSubscription]

      // Fallback to polling if real-time doesn't work within 10 seconds
      setTimeout(() => {
        if (connectionStatus !== 'connected') {
          console.log('Dashboard: Real-time timeout, starting polling')
          startPolling()
        }
      }, 10000)

    } catch (error) {
      console.error('Error setting up real-time subscriptions:', error)
      setConnectionStatus('error')
      startPolling()
    }
  }

  // Set up simple and fast real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated) return

    fetchSessions()
    fetchStats()

    // 🚀 SIMPLE AND FAST REAL-TIME - Like your example
    const sessionsChannel = supabase
      .channel('dashboard-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        () => {
          fetchSessions()
          fetchStats()
        }
      )
      .subscribe()

    const messagesChannel = supabase
      .channel('dashboard-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => {
          fetchSessions() // Update unread counts
        }
      )
      .subscribe()

    return () => {
      // 🚀 SIMPLE CLEANUP - Like your example
      supabase.removeChannel(sessionsChannel)
      supabase.removeChannel(messagesChannel)
    }
  }, [isAuthenticated])

  // Refetch sessions when status filter changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions()
    }
  }, [statusFilter])

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
      {/* Header - Mobile Responsive */}
      <div className="bg-gray-800 border-b border-gray-700 px-3 sm:px-6 py-3 sm:py-4 h-16 sm:h-20">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center min-w-0 flex-1">
            <MessageSquare className="text-purple-500 mr-2 sm:mr-3 flex-shrink-0" size={24} />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">DevTone Chat Dashboard</h1>
              <div className="flex items-center gap-2 sm:gap-3">
                <p className="text-gray-400 text-xs sm:text-sm truncate">Manage customer support conversations</p>
                {/* Connection Status Indicator */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-400' :
                    connectionStatus === 'error' ? 'bg-orange-400' :
                    'bg-red-400'
                  }`}></div>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    {usePolling ? 'Polling Mode' : 'Real-time'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => {
                fetchSessions()
                fetchStats()
              }}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm"
            >
              <RefreshCw size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('chat_dashboard_auth')
                setIsAuthenticated(false)
                window.location.href = '/' // Redirect to home instead of reload
              }}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
            >
              <Users size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats - Mobile Responsive */}
      <div className="h-20 sm:h-24">
        <ChatStats stats={stats} />
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row h-[calc(100vh-144px)] sm:h-[calc(100vh-176px)]">
        {/* Sessions List */}
        <div className="w-full sm:w-1/3 bg-gray-800 border-b sm:border-b-0 sm:border-r border-gray-700 flex flex-col h-1/2 sm:h-full">
          {/* Search and Filter */}
          <div className="p-2 sm:p-4 border-b border-gray-700 flex-shrink-0">
            <div className="relative mb-2 sm:mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 sm:pl-10 sm:pr-4 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
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
        <div className="flex-1 flex flex-col h-1/2 sm:h-full">
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
