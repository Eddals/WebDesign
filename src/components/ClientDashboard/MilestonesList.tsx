import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  FolderOpen,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { milestonesService, projectsService } from '../../lib/client-dashboard-api';
import type { ProjectMilestone, Project, AuthSession } from '../../types/client-dashboard';
import { STATUS_COLORS } from '../../types/client-dashboard';

interface MilestonesListProps {
  clientId: string;
  session: AuthSession;
}

const MilestonesList: React.FC<MilestonesListProps> = ({ clientId, session }) => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load projects first
      const projectsResponse = await projectsService.getProjects(clientId, undefined, undefined, 1, 50);
      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data.data);
        
        // Load milestones for all projects
        const allMilestones: ProjectMilestone[] = [];
        for (const project of projectsResponse.data.data) {
          const milestonesResponse = await milestonesService.getMilestones(project.id);
          if (milestonesResponse.success && milestonesResponse.data) {
            const milestonesWithProject = milestonesResponse.data.map(milestone => ({
              ...milestone,
              project
            }));
            allMilestones.push(...milestonesWithProject);
          }
        }
        
        // Sort by order_index and due_date
        allMilestones.sort((a, b) => {
          if (a.project_id !== b.project_id) {
            return a.project_id.localeCompare(b.project_id);
          }
          return a.order_index - b.order_index;
        });
        
        setMilestones(allMilestones);
      }
    } catch (error) {
      console.error('Failed to load milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Target className="w-5 h-5 text-yellow-500" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Target className="w-5 h-5 text-purple-500" />;
    }
  };

  const isOverdue = (milestone: ProjectMilestone) => {
    if (!milestone.due_date || milestone.status === 'completed') return false;
    return new Date(milestone.due_date) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredMilestones = milestones.filter(milestone => {
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter;
    const matchesProject = selectedProject === 'all' || milestone.project_id === selectedProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const groupedMilestones = filteredMilestones.reduce((groups, milestone) => {
    const projectTitle = milestone.project?.title || 'Unknown Project';
    if (!groups[projectTitle]) {
      groups[projectTitle] = [];
    }
    groups[projectTitle].push(milestone);
    return groups;
  }, {} as Record<string, ProjectMilestone[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-16 bg-white/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Milestones</h2>
          <p className="text-purple-200">Track project milestones and deliverables</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search milestones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
        </select>
        
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Milestones by Project */}
      {Object.keys(groupedMilestones).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedMilestones).map(([projectTitle, projectMilestones]) => (
            <motion.div
              key={projectTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <FolderOpen className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">{projectTitle}</h3>
                <span className="text-purple-300 text-sm">
                  {projectMilestones.length} milestone{projectMilestones.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-4">
                {projectMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white/5 rounded-xl p-4 border-l-4 hover:bg-white/10 transition-all ${
                      isOverdue(milestone) ? 'border-l-red-500' : 
                      milestone.status === 'completed' ? 'border-l-green-500' :
                      milestone.status === 'in_progress' ? 'border-l-blue-500' :
                      'border-l-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(milestone.status)}
                        <div>
                          <h4 className="text-white font-semibold text-lg">{milestone.title}</h4>
                          <p className="text-purple-200 text-sm">{milestone.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[milestone.status as keyof typeof STATUS_COLORS]}`}>
                          {milestone.status.replace('_', ' ')}
                        </span>
                        {isOverdue(milestone) && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {milestone.due_date && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-purple-300" />
                          <div>
                            <p className="text-purple-200">Due Date</p>
                            <p className={`font-medium ${isOverdue(milestone) ? 'text-red-300' : 'text-white'}`}>
                              {new Date(milestone.due_date).toLocaleDateString()}
                            </p>
                            {!isOverdue(milestone) && milestone.status !== 'completed' && (
                              <p className="text-xs text-purple-300">
                                {getDaysUntilDue(milestone.due_date)} days remaining
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {milestone.completion_date && (
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-purple-200">Completed</p>
                            <p className="text-white font-medium">
                              {new Date(milestone.completion_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {milestone.is_billable && milestone.amount && (
                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-purple-200">Amount</p>
                            <p className="text-green-300 font-medium">
                              ${milestone.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div>
                        <h5 className="text-white font-medium mb-2">Deliverables:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {milestone.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <ChevronRight className="w-3 h-3 text-purple-400" />
                              <span className="text-purple-200">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Target className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Milestones Found</h3>
          <p className="text-purple-200">
            {searchTerm || statusFilter !== 'all' || selectedProject !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Milestones will appear here as your projects progress'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MilestonesList;
