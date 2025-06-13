import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Target,
  CheckSquare,
  MessageSquare,
  Upload,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { projectsService, milestonesService } from '../../lib/client-dashboard-api';
import type { DashboardStats, AuthSession, Project, ProjectMilestone } from '../../types/client-dashboard';

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  clientId: string;
  session: AuthSession;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, clientId, session }) => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, [clientId]);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      
      // Load recent projects
      const projectsResponse = await projectsService.getProjects(clientId, undefined, undefined, 1, 5);
      if (projectsResponse.success && projectsResponse.data) {
        setRecentProjects(projectsResponse.data.data);
      }

      // Load upcoming milestones from all projects
      if (projectsResponse.success && projectsResponse.data) {
        const allMilestones: ProjectMilestone[] = [];
        for (const project of projectsResponse.data.data) {
          const milestonesResponse = await milestonesService.getMilestones(project.id);
          if (milestonesResponse.success && milestonesResponse.data) {
            const upcoming = milestonesResponse.data.filter(m => 
              m.status === 'pending' && m.due_date && new Date(m.due_date) >= new Date()
            );
            allMilestones.push(...upcoming);
          }
        }
        
        // Sort by due date and take first 5
        allMilestones.sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());
        setUpcomingMilestones(allMilestones.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.total_projects || 0,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Projects',
      value: stats?.active_projects || 0,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Completed Projects',
      value: stats?.completed_projects || 0,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Overall Progress',
      value: `${stats?.overall_progress || 0}%`,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      change: '+5%',
      changeType: 'positive' as const
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-4"></div>
              <div className="h-8 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, {session.user.full_name}! 👋
        </h2>
        <p className="text-purple-200">
          Here's an overview of your projects and recent activity with DevTone Agency.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-white/70 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              Recent Projects
            </h3>
            <button className="text-purple-300 hover:text-white text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div key={project.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{project.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-purple-200 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                      <span className="text-purple-300 text-xs">{project.project_type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-white/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${project.progress_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-xs">{project.progress_percentage}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                <p className="text-purple-200">No projects found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Milestones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Upcoming Milestones
            </h3>
            <button className="text-purple-300 hover:text-white text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            {upcomingMilestones.length > 0 ? (
              upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{milestone.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-purple-200 text-sm mb-3">{milestone.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-300 text-xs">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {new Date(milestone.due_date!).toLocaleDateString()}</span>
                    </div>
                    {milestone.is_billable && milestone.amount && (
                      <span className="text-green-300 text-xs font-medium">
                        ${milestone.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                <p className="text-purple-200">No upcoming milestones</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl hover:shadow-lg transition-all flex items-center space-x-3">
            <MessageSquare className="w-5 h-5" />
            <span>Send Feedback</span>
          </button>
          <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl hover:shadow-lg transition-all flex items-center space-x-3">
            <Upload className="w-5 h-5" />
            <span>Upload Files</span>
          </button>
          <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-xl hover:shadow-lg transition-all flex items-center space-x-3">
            <Clock className="w-5 h-5" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
