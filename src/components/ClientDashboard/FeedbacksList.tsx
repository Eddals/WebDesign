import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
  Eye,
  Send,
  X
} from 'lucide-react';
import { feedbacksService, projectsService } from '../../lib/client-dashboard-api';
import type { ClientFeedback, Project, AuthSession, CreateFeedbackForm } from '../../types/client-dashboard';
import { STATUS_COLORS } from '../../types/client-dashboard';

interface FeedbacksListProps {
  clientId: string;
  session: AuthSession;
}

const FeedbacksList: React.FC<FeedbacksListProps> = ({ clientId, session }) => {
  const [feedbacks, setFeedbacks] = useState<ClientFeedback[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<ClientFeedback | null>(null);

  const [createForm, setCreateForm] = useState<CreateFeedbackForm>({
    project_id: '',
    feedback_type: 'general',
    subject: '',
    message: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load projects
      const projectsResponse = await projectsService.getProjects(clientId, undefined, undefined, 1, 50);
      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data.data);
      }
      
      // Load feedbacks
      const feedbacksResponse = await feedbacksService.getFeedbacks(clientId);
      if (feedbacksResponse.success && feedbacksResponse.data) {
        setFeedbacks(feedbacksResponse.data);
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await feedbacksService.createFeedback({
        ...createForm,
        client_id: clientId
      } as any);
      
      if (response.success && response.data) {
        setFeedbacks([response.data, ...feedbacks]);
        setShowCreateForm(false);
        setCreateForm({
          project_id: '',
          feedback_type: 'general',
          subject: '',
          message: '',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Failed to create feedback:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <ThumbsUp className="w-5 h-5 text-green-500" />;
      case 'revision':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'concern':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reviewed':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'addressed':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesType = typeFilter === 'all' || feedback.feedback_type === typeFilter;
    const matchesProject = selectedProject === 'all' || feedback.project_id === selectedProject;
    
    return matchesSearch && matchesStatus && matchesType && matchesProject;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-16 bg-white/10 rounded"></div>
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
          <h2 className="text-2xl font-bold text-white">Feedback & Approvals</h2>
          <p className="text-purple-200">Submit feedback and track responses from our team</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Feedback</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search feedback..."
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
          <option value="reviewed">Reviewed</option>
          <option value="addressed">Addressed</option>
          <option value="resolved">Resolved</option>
        </select>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Types</option>
          <option value="general">General</option>
          <option value="approval">Approval</option>
          <option value="revision">Revision</option>
          <option value="concern">Concern</option>
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

      {/* Feedbacks List */}
      {filteredFeedbacks.length > 0 ? (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => setSelectedFeedback(feedback)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {getTypeIcon(feedback.feedback_type)}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{feedback.subject}</h3>
                    <p className="text-purple-200 text-sm">
                      {feedback.project?.title} • {new Date(feedback.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[feedback.priority as keyof typeof STATUS_COLORS]}`}>
                    {feedback.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[feedback.status as keyof typeof STATUS_COLORS]}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
              
              <p className="text-purple-200 mb-4 line-clamp-2">{feedback.message}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(feedback.status)}
                  <span className="text-purple-300 text-sm capitalize">
                    {feedback.feedback_type.replace('_', ' ')} feedback
                  </span>
                </div>
                
                {feedback.admin_response && (
                  <div className="flex items-center space-x-2 text-green-300 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <span>Response received</span>
                  </div>
                )}
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
          <MessageSquare className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Feedback Found</h3>
          <p className="text-purple-200">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || selectedProject !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Submit your first feedback to get started'}
          </p>
        </motion.div>
      )}

      {/* Create Feedback Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Submit Feedback</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-purple-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateFeedback} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Project
                  </label>
                  <select
                    required
                    value={createForm.project_id}
                    onChange={(e) => setCreateForm({ ...createForm, project_id: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Type
                  </label>
                  <select
                    value={createForm.feedback_type}
                    onChange={(e) => setCreateForm({ ...createForm, feedback_type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="general">General Feedback</option>
                    <option value="approval">Approval</option>
                    <option value="revision">Revision Request</option>
                    <option value="concern">Concern</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.subject}
                    onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief subject line"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={createForm.message}
                  onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe your feedback in detail..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 bg-white/10 text-purple-300 rounded-xl hover:bg-white/15 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{selectedFeedback.subject}</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-purple-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {getTypeIcon(selectedFeedback.feedback_type)}
                <div>
                  <p className="text-white font-semibold">{selectedFeedback.project?.title}</p>
                  <p className="text-purple-200 text-sm">
                    {new Date(selectedFeedback.created_at).toLocaleDateString()} • 
                    {selectedFeedback.feedback_type.replace('_', ' ')} feedback
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Your Message:</h4>
                <p className="text-purple-200 bg-white/5 rounded-xl p-4">{selectedFeedback.message}</p>
              </div>
              
              {selectedFeedback.admin_response && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Team Response:</h4>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-200">{selectedFeedback.admin_response}</p>
                    <p className="text-green-300 text-sm mt-2">
                      — {selectedFeedback.admin_responded_by} • 
                      {selectedFeedback.admin_responded_at && 
                        new Date(selectedFeedback.admin_responded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FeedbacksList;
