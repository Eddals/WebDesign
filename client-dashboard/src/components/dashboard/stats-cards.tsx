'use client'

import {
  FolderIcon,
  PlayIcon,
  CheckCircleIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import type { DashboardStats } from '@/types'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Projects',
      value: stats.activeProjects,
      icon: PlayIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Completed',
      value: stats.completedProjects,
      icon: CheckCircleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: CreditCardIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      name: 'Upcoming Deadlines',
      value: stats.upcomingDeadlines,
      icon: ClockIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <div
          key={stat.name}
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
