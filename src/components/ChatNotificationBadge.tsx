import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Bell } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ChatNotificationBadgeProps {
  className?: string
}

const ChatNotificationBadge = ({ className = '' }: ChatNotificationBadgeProps) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fetch initial unread count
    fetchUnreadCount()

    // Subscribe to new messages
    const subscription = supabase
      .channel('chat_messages_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, (payload) => {
        // Only count user messages (not agent responses)
        if (payload.new.is_user) {
          fetchUnreadCount()
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages'
      }, () => {
        // Refetch when messages are marked as read
        fetchUnreadCount()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_user', true)
        .eq('is_read', false)

      if (error) {
        console.error('Error fetching unread count:', error)
        return
      }

      setUnreadCount(count || 0)
      setIsVisible((count || 0) > 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  if (!isVisible || unreadCount === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`relative ${className}`}
      >
        {/* Notification Badge */}
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium shadow-lg z-10"
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.7)',
              '0 0 0 10px rgba(239, 68, 68, 0)',
              '0 0 0 0 rgba(239, 68, 68, 0)'
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.div>

        {/* Pulsing Ring Effect */}
        <motion.div
          className="absolute -top-3 -right-3 w-7 h-7 border-2 border-red-400 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Bell Icon for Additional Visual Cue */}
        <motion.div
          className="absolute -top-1 -left-1 text-yellow-400"
          animate={{ 
            rotate: [0, 15, -15, 0],
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        >
          <Bell size={12} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ChatNotificationBadge
