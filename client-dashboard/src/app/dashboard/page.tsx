'use client'

import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers'
import DashboardLayout from '@/components/layout/dashboard-layout'
import StatsCards from '@/components/dashboard/stats-cards'
import ProjectsOverview from '@/components/dashboard/projects-overview'
import RecentActivity from '@/components/dashboard/recent-activity'
import UpcomingDeadlines from '@/components/dashboard/upcoming-deadlines'
import type { Project, DashboardStats } from '@/types'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabase()

  useEffect(() => {
    if (profile) {
      fetchDashboardData()
    }
  }, [profile])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          profiles!projects_client_id_fkey(full_name, company_name),
          milestones(id, status),
          invoices(id, status, amount)
        `)
        .eq(profile?.role === 'admin' ? 'id' : 'client_id', profile?.role === 'admin' ? undefined : profile?.id)
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      setProjects(projectsData || [])

      // Calculate stats
      const totalProjects = projectsData?.length || 0
      const activeProjects = projectsData?.filter(p => p.status === 'in_progress').length || 0
      const completedProjects = projectsData?.filter(p => p.status === 'completed').length || 0
      const pendingInvoices = projectsData?.reduce((acc, p) => {
        return acc + (p.invoices?.filter((i: any) => i.status === 'sent').length || 0)
      }, 0)
      const totalRevenue = projectsData?.reduce((acc, p) => {
        return acc + (p.invoices?.reduce((sum: number, i: any) => sum + (i.status === 'paid' ? i.amount : 0), 0) || 0)
      }, 0) || 0
      const upcomingDeadlines = projectsData?.filter(p => {
        if (!p.due_date) return false
        const dueDate = new Date(p.due_date)
        const now = new Date()
        const diffTime = dueDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 7 && diffDays >= 0
      }).length || 0

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        pendingInvoices,
        totalRevenue,
        upcomingDeadlines,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Overview */}
          <div className="lg:col-span-1">
            <ProjectsOverview projects={projects} />
          </div>

          {/* Upcoming Deadlines */}
          <div className="lg:col-span-1">
            <UpcomingDeadlines projects={projects} />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  )
}
