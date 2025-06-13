import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Calendar,
  DollarSign,
  ExternalLink,
  Filter,
  Search,
  Grid,
  List,
  Eye,
  BarChart3,
  Clock,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { projectsService } from '../../lib/client-dashboard-api';
import type { Project, AuthSession, ProjectFilters, SortOptions } from '../../types/client-dashboard';
import { STATUS_COLORS } from '../../types/client-dashboard';

interface ProjectsListProps {
  clientId: string;
  session: AuthSession;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ clientId, session }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [sortBy, setSortBy] = useState<SortOptions>({ field: 'created_at', direction: 'desc' });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, [clientId, filters, sortBy]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsService.getProjects(clientId, filters, sortBy, 1, 50);
      if (response.success && response.data) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'planning':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'on_hold':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <FolderOpen className="w-5 h-5 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer border-l-4 ${getPriorityColor(project.priority)}`}
      onClick={() => setSelectedProject(project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(project.status)}
          <div>
            <h3 className="text-white font-bold text-lg">{project.title}</h3>
            <p className="text-purple-200 text-sm">{project.project_type}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-purple-200 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-purple-200">Progress</span>
            <span className="text-white font-medium">{project.progress_percentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${project.progress_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {project.start_date && (
            <div className="flex items-center space-x-2 text-purple-200">
              <Calendar className="w-4 h-4" />
              <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
            </div>
          )}
          {project.budget && (
            <div className="flex items-center space-x-2 text-green-300">
              <DollarSign className="w-4 h-4" />
              <span>${project.budget.toLocaleString()}</span>
            </div>
          )}
          {project.estimated_completion_date && (
            <div className="flex items-center space-x-2 text-purple-200">
              <Target className="w-4 h-4" />
              <span>Due: {new Date(project.estimated_completion_date).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[project.priority as keyof typeof STATUS_COLORS]}`}>
              {project.priority} priority
            </span>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex space-x-2 pt-2">
          {project.staging_url && (
            <a
              href={project.staging_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-purple-300 hover:text-white text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              <span>Preview</span>
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-green-300 hover:text-white text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              <span>Live Site</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ProjectListItem = ({ project }: { project: Project }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all cursor-pointer border-l-4 ${getPriorityColor(project.priority)}`}
      onClick={() => setSelectedProject(project)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {getStatusIcon(project.status)}
          <div className="flex-1">
            <h3 className="text-white font-semibold">{project.title}</h3>
            <p className="text-purple-200 text-sm">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-xs text-purple-200">Progress</p>
            <p className="text-white font-medium">{project.progress_percentage}%</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-purple-200">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          
          {project.budget && (
            <div className="text-center">
              <p className="text-xs text-purple-200">Budget</p>
              <p className="text-green-300 font-medium">${project.budget.toLocaleString()}</p>
            </div>
          )}
          
          <button className="text-purple-300 hover:text-white">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-4"></div>
              <div className="h-6 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded mb-4"></div>
              <div className="h-2 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-purple-200">Manage and track your project progress</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-purple-300 hover:text-white hover:bg-white/15 transition-all">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FolderOpen className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
          <p className="text-purple-200">
            {searchTerm ? 'Try adjusting your search terms' : 'Your projects will appear here once they are created'}
          </p>
        </motion.div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-purple-200">{selectedProject.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-purple-200">Type: {selectedProject.project_type}</p>
                    <p className="text-purple-200">Priority: {selectedProject.priority}</p>
                    <p className="text-purple-200">Progress: {selectedProject.progress_percentage}%</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    {selectedProject.start_date && (
                      <p className="text-purple-200">Started: {new Date(selectedProject.start_date).toLocaleDateString()}</p>
                    )}
                    {selectedProject.estimated_completion_date && (
                      <p className="text-purple-200">Due: {new Date(selectedProject.estimated_completion_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
