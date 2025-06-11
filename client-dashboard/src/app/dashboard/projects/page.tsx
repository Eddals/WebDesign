'use client'

import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import Link from 'next/link'
import clsx from 'clsx'
import type { Project } from '@/types'

export default function ProjectsPage() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const supabase = createClientSupabase()

  useEffect(() => {
    if (profile) {
      fetchProjects()
    }
  }, [profile])

  const fetchProjects = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles!projects_client_id_fkey(full_name, company_name),
          milestones(id, status),
          invoices(id, status, amount)
        `)
        .eq(profile?.role === 'admin' ? 'id' : 'client_id', profile?.role === 'admin' ? undefined : profile?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.status === filter
  })

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

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'planning', label: 'Planning' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your development projects
            </p>
          </div>
          {profile?.role === 'admin' && (
            <button className="btn-primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Project
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={clsx(
                  'px-3 py-1 text-sm font-medium rounded-full transition-colors',
                  filter === option.value
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={clsx('capitalize', getStatusColor(project.status))}>
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className={clsx('capitalize', getPriorityColor(project.priority))}>
                      {project.priority}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500">
                    {project.start_date && (
                      <div>
                        <span className="font-medium">Started:</span> {format(new Date(project.start_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    {project.due_date && (
                      <div>
                        <span className="font-medium">Due:</span> {format(new Date(project.due_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    {project.budget && (
                      <div>
                        <span className="font-medium">Budget:</span> ${project.budget.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Progress indicators */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {project.milestones?.filter((m: any) => m.status === 'completed').length || 0}/
                        {project.milestones?.length || 0} milestones
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            project.milestones?.length
                              ? (project.milestones.filter((m: any) => m.status === 'completed').length / project.milestones.length) * 100
                              : 0
                          }%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
