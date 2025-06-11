import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react'

interface ChatStatsData {
  total_sessions: number
  active_sessions: number
  pending_sessions: number
  resolved_sessions: number
  avg_response_time: number
}

interface ChatStatsProps {
  stats: ChatStatsData
}

const ChatStats = ({ stats }: ChatStatsProps) => {
  const statCards = [
    {
      title: 'Total Conversations',
      value: stats.total_sessions,
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Active Chats',
      value: stats.active_sessions,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Pending Response',
      value: stats.pending_sessions,
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Resolved Today',
      value: stats.resolved_sessions,
      icon: CheckCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avg_response_time}m`,
      icon: Clock,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    }
  ]

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-3xl p-4 hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`${stat.color} ${stat.bgColor} p-3 rounded-full`}>
                <stat.icon size={24} />
              </div>
            </div>
            
            {/* Optional trend indicator */}
            {stat.title === 'Total Conversations' && (
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <TrendingUp size={14} className="mr-1" />
                <span>+12% from last week</span>
              </div>
            )}
            
            {stat.title === 'Avg Response Time' && (
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <TrendingUp size={14} className="mr-1" />
                <span>-15% faster</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ChatStats
