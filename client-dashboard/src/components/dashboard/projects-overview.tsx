'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import type { Project } from '@/types'
import clsx from 'clsx'

interface ProjectsOverviewProps {
  projects: Project[]
}

export default function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  const recentProjects = projects.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'status-planning'
      case 'in_progress':
        return 'status-in-progress'
      case 'review':
        return 'status-review'
      case 'completed':
        return 'status-completed'
      case 'on_hold':
        return 'status-on-hold'
      default:
        return 'status-planning'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'priority-low'
      case 'medium':
        return 'priority-medium'
      case 'high':
        return 'priority-high'
      case 'urgent':
        return 'priority-urgent'
      default:
        return 'priority-medium'
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
          <Link
            href="/dashboard/projects"
            className="text-sm font-medium text-purple-600 hover:text-purple-500 flex items-center gap-1"
          >
            View all
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="card-body p-0">
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentProjects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {project.title}
                      </h4>
                      <span className={clsx('capitalize', getStatusColor(project.status))}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span className={clsx('capitalize', getPriorityColor(project.priority))}>
                        {project.priority}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-500 truncate mb-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {project.start_date && (
                        <span>Started: {format(new Date(project.start_date), 'MMM d, yyyy')}</span>
                      )}
                      {project.due_date && (
                        <span>Due: {format(new Date(project.due_date), 'MMM d, yyyy')}</span>
                      )}
                      {project.budget && (
                        <span>Budget: ${project.budget.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="btn-secondary text-xs"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
