'use client'

import { format, differenceInDays } from 'date-fns'
import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { Project } from '@/types'
import clsx from 'clsx'

interface UpcomingDeadlinesProps {
  projects: Project[]
}

export default function UpcomingDeadlines({ projects }: UpcomingDeadlinesProps) {
  const upcomingProjects = projects
    .filter(project => {
      if (!project.due_date) return false
      const dueDate = new Date(project.due_date)
      const now = new Date()
      const diffDays = differenceInDays(dueDate, now)
      return diffDays <= 14 && diffDays >= 0 // Next 14 days
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)

  const getDaysUntilDue = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date())
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `${days} days left`
  }

  const getUrgencyColor = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date())
    if (days <= 1) return 'text-red-600 bg-red-100'
    if (days <= 3) return 'text-orange-600 bg-orange-100'
    if (days <= 7) return 'text-yellow-600 bg-yellow-100'
    return 'text-blue-600 bg-blue-100'
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h3>
        </div>
      </div>
      <div className="card-body p-0">
        {upcomingProjects.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No upcoming deadlines</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {upcomingProjects.map((project) => {
              const daysLeft = differenceInDays(new Date(project.due_date!), new Date())
              const isUrgent = daysLeft <= 3
              
              return (
                <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isUrgent && (
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                        )}
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {project.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        Due: {format(new Date(project.due_date!), 'MMM d, yyyy')}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          getUrgencyColor(project.due_date!)
                        )}>
                          {getDaysUntilDue(project.due_date!)}
                        </span>
                        <span className={clsx(
                          'capitalize',
                          project.status === 'in_progress' ? 'status-in-progress' : 'status-planning'
                        )}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
