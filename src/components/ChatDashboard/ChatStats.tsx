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
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 h-16 flex items-center">
      <div className="grid grid-cols-5 gap-4 w-full">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-2 flex items-center gap-2`}
          >
            <div className={`${stat.color} ${stat.bgColor} p-1.5 rounded-full flex-shrink-0`}>
              <stat.icon size={12} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-300 text-xs font-medium truncate">
                {stat.title}
              </p>
              <p className={`text-sm font-bold ${stat.color}`}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatStats
