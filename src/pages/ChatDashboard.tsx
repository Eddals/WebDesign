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
  // Remove unused subscriptionsRef and retryTimeoutRef for clarity

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
        (sessionsData || []).map(async (session: any) => {
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
        const active = allSessions.filter((s: any) => s.status === 'active').length
        const pending = allSessions.filter((s: any) => s.status === 'pending').length
        const resolved = allSessions.filter((s: any) => s.status === 'resolved').length

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

  // Removed unused setupRealTimeSubscriptions and related fallback logic for clarity

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
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col h-screen overflow-hidden">

      {/* Compact Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 h-14 flex-shrink-0">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-full">
              <MessageSquare className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">DevTone Chat Dashboard</h1>
              <p className="text-gray-400 text-xs">Manage customer support conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-full">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' :
                connectionStatus === 'error' ? 'bg-orange-400' :
                'bg-red-400'
              }`}></div>
              <span className="text-xs text-gray-400">
                {usePolling ? 'Polling' : 'Live'}
              </span>
            </div>
            <button
              onClick={() => {
                fetchSessions()
                fetchStats()
              }}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-xs"
            >
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('chat_dashboard_auth')
                setIsAuthenticated(false)
                window.location.href = '/'
              }}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-xs"
            >
              <Users size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Stats Section */}
      <div className="h-16 flex-shrink-0">
        <ChatStats stats={stats} />
      </div>

      {/* Fixed Layout - No Scroll */}
      <div className="flex-1 flex h-[calc(100vh-112px)] overflow-hidden">
        {/* Sessions List - Fixed Width */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Compact Search and Filter */}
          <div className="p-2 border-b border-gray-700 flex-shrink-0 bg-gray-800">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Sessions List - Fixed Height with Scroll */}
          <div className="flex-1 overflow-y-auto">
            <ChatSessionList
              sessions={filteredSessions}
              selectedSession={selectedSession}
              onSelectSession={setSelectedSession}
              loading={loading}
            />
          </div>
        </div>

        {/* Chat Window - Fixed Layout */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
