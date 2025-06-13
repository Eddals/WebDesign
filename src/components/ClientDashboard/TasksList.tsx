import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Clock,
  User,
  Calendar,
  Tag,
  Search,
  Filter,
  FolderOpen,
  Target,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  Eye
} from 'lucide-react';
import { tasksService, projectsService } from '../../lib/client-dashboard-api';
import type { ProjectTask, Project, AuthSession } from '../../types/client-dashboard';
import { STATUS_COLORS } from '../../types/client-dashboard';

interface TasksListProps {
  clientId: string;
  session: AuthSession;
}

const TasksList: React.FC<TasksListProps> = ({ clientId, session }) => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
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
        
        // Load tasks for all projects
        const allTasks: ProjectTask[] = [];
        for (const project of projectsResponse.data.data) {
          const tasksResponse = await tasksService.getTasks(project.id);
          if (tasksResponse.success && tasksResponse.data) {
            const tasksWithProject = tasksResponse.data.map(task => ({
              ...task,
              project
            }));
            allTasks.push(...tasksWithProject);
          }
        }
        
        // Sort by due date and priority
        allTasks.sort((a, b) => {
          // First by status (in_progress, todo, review, completed)
          const statusOrder = { 'in_progress': 0, 'todo': 1, 'review': 2, 'completed': 3 };
          const statusDiff = (statusOrder[a.status as keyof typeof statusOrder] || 4) - 
                           (statusOrder[b.status as keyof typeof statusOrder] || 4);
          if (statusDiff !== 0) return statusDiff;
          
          // Then by priority
          const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
          const priorityDiff = (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) - 
                              (priorityOrder[b.priority as keyof typeof priorityOrder] || 4);
          if (priorityDiff !== 0) return priorityDiff;
          
          // Finally by due date
          if (a.due_date && b.due_date) {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          }
          return 0;
        });
        
        setTasks(allTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'review':
        return <Eye className="w-5 h-5 text-purple-500" />;
      case 'todo':
        return <CheckSquare className="w-5 h-5 text-gray-500" />;
      default:
        return <CheckSquare className="w-5 h-5 text-purple-500" />;
    }
  };

  const isOverdue = (task: ProjectTask) => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = selectedProject === 'all' || task.project_id === selectedProject;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const projectTitle = task.project?.title || 'Unknown Project';
    if (!groups[projectTitle]) {
      groups[projectTitle] = [];
    }
    groups[projectTitle].push(task);
    return groups;
  }, {} as Record<string, ProjectTask[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-20 bg-white/10 rounded-xl"></div>
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
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <p className="text-purple-200">Track individual tasks and their progress</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
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
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="completed">Completed</option>
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
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

      {/* Tasks by Project */}
      {Object.keys(groupedTasks).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([projectTitle, projectTasks]) => (
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
                  {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-3">
                {projectTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white/5 rounded-xl p-4 border-l-4 hover:bg-white/10 transition-all ${
                      isOverdue(task) ? 'border-l-red-500' : 
                      task.status === 'completed' ? 'border-l-green-500' :
                      task.status === 'in_progress' ? 'border-l-blue-500' :
                      task.status === 'review' ? 'border-l-purple-500' :
                      'border-l-gray-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{task.title}</h4>
                          {task.description && (
                            <p className="text-purple-200 text-sm mt-1">{task.description}</p>
                          )}
                          
                          {task.milestone && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Target className="w-3 h-3 text-purple-400" />
                              <span className="text-purple-300 text-xs">
                                Milestone: {task.milestone.title}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.priority as keyof typeof STATUS_COLORS]}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {isOverdue(task) && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      {task.assigned_to && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-purple-300" />
                          <div>
                            <p className="text-purple-200">Assigned to</p>
                            <p className="text-white font-medium">{task.assigned_to}</p>
                          </div>
                        </div>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-300" />
                          <div>
                            <p className="text-purple-200">Due Date</p>
                            <p className={`font-medium ${isOverdue(task) ? 'text-red-300' : 'text-white'}`}>
                              {new Date(task.due_date).toLocaleDateString()}
                            </p>
                            {!isOverdue(task) && task.status !== 'completed' && (
                              <p className="text-xs text-purple-300">
                                {getDaysUntilDue(task.due_date)} days remaining
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {task.estimated_hours && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-300" />
                          <div>
                            <p className="text-purple-200">Estimated</p>
                            <p className="text-white font-medium">{task.estimated_hours}h</p>
                            {task.actual_hours && (
                              <p className="text-xs text-purple-300">
                                Actual: {task.actual_hours}h
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {task.completion_date && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-purple-200">Completed</p>
                            <p className="text-white font-medium">
                              {new Date(task.completion_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Tag className="w-4 h-4 text-purple-300" />
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                            >
                              {tag}
                            </span>
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
          <CheckSquare className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Tasks Found</h3>
          <p className="text-purple-200">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || selectedProject !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Tasks will appear here as your projects progress'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TasksList;
