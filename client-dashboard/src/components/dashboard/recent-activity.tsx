'use client'

import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers'
import { format } from 'date-fns'
import {
  ChatBubbleLeftRightIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'

interface ActivityItem {
  id: string
  type: 'message' | 'file' | 'milestone' | 'invoice'
  title: string
  description: string
  project_title?: string
  created_at: string
}

export default function RecentActivity() {
  const { profile } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabase()

  useEffect(() => {
    if (profile) {
      fetchRecentActivity()
    }
  }, [profile])

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      const activities: ActivityItem[] = []

      // Fetch recent messages
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          projects(title)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      messages?.forEach(message => {
        activities.push({
          id: `message-${message.id}`,
          type: 'message',
          title: 'New message',
          description: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
          project_title: message.projects?.title,
          created_at: message.created_at,
        })
      })

      // Fetch recent files
      const { data: files } = await supabase
        .from('files')
        .select(`
          id,
          filename,
          created_at,
          projects(title)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      files?.forEach(file => {
        activities.push({
          id: `file-${file.id}`,
          type: 'file',
          title: 'File uploaded',
          description: file.filename,
          project_title: file.projects?.title,
          created_at: file.created_at,
        })
      })

      // Fetch recent milestone updates
      const { data: milestones } = await supabase
        .from('milestones')
        .select(`
          id,
          title,
          status,
          updated_at,
          projects(title)
        `)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(5)

      milestones?.forEach(milestone => {
        activities.push({
          id: `milestone-${milestone.id}`,
          type: 'milestone',
          title: 'Milestone completed',
          description: milestone.title,
          project_title: milestone.projects?.title,
          created_at: milestone.updated_at,
        })
      })

      // Sort all activities by date
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setActivities(activities.slice(0, 10))
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return ChatBubbleLeftRightIcon
      case 'file':
        return DocumentArrowUpIcon
      case 'milestone':
        return CheckCircleIcon
      case 'invoice':
        return CreditCardIcon
      default:
        return ChatBubbleLeftRightIcon
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'text-blue-600 bg-blue-100'
      case 'file':
        return 'text-green-600 bg-green-100'
      case 'milestone':
        return 'text-purple-600 bg-purple-100'
      case 'invoice':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="card-body p-0">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3 px-6 py-4">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityColor(activity.type)}`}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">{activity.title}</span>
                              {activity.project_title && (
                                <span className="text-gray-500"> in {activity.project_title}</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {format(new Date(activity.created_at), 'MMM d, yyyy at h:mm a')}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
