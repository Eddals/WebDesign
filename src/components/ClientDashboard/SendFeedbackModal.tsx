import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, AlertTriangle, Bug, Lightbulb, Palette, FileText } from 'lucide-react';
import { feedbackService, SendFeedbackForm } from '../../lib/client-quick-actions';

interface SendFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  projects: any[];
  onFeedbackSent?: (feedback: any) => void;
}

const SendFeedbackModal: React.FC<SendFeedbackModalProps> = ({
  isOpen,
  onClose,
  clientId,
  projects,
  onFeedbackSent
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<SendFeedbackForm>({
    project_id: '',
    milestone_id: '',
    subject: '',
    message: '',
    feedback_type: 'general',
    priority: 'medium'
  });

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'blue' },
    { value: 'bug_report', label: 'Bug Report', icon: Bug, color: 'red' },
    { value: 'feature_request', label: 'Feature Request', icon: Lightbulb, color: 'yellow' },
    { value: 'design_feedback', label: 'Design Feedback', icon: Palette, color: 'purple' },
    { value: 'content_feedback', label: 'Content Feedback', icon: FileText, color: 'green' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'gray' },
    { value: 'medium', label: 'Medium', color: 'blue' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await feedbackService.sendFeedback(clientId, form);

      if (response.success && response.data) {
        setSuccess('Feedback sent successfully! Our team will review it shortly.');
        onFeedbackSent?.(response.data);
        
        // Reset form
        setForm({
          project_id: '',
          milestone_id: '',
          subject: '',
          message: '',
          feedback_type: 'general',
          priority: 'medium'
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      } else {
        setError(response.error || 'Failed to send feedback');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const typeConfig = feedbackTypes.find(t => t.value === type);
    return typeConfig?.color || 'blue';
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return priorityConfig?.color || 'blue';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send Feedback</h2>
                    <p className="text-purple-200 text-sm">Share your thoughts with our team</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Selection */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Project (Optional)
                  </label>
                  <select
                    value={form.project_id}
                    onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="" className="bg-purple-900">General Feedback</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id} className="bg-purple-900">
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Feedback Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = form.feedback_type === type.value;
                      return (
                        <motion.button
                          key={type.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm({ ...form, feedback_type: type.value as any })}
                          className={`p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                              : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Priority
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {priorities.map((priority) => {
                      const isSelected = form.priority === priority.value;
                      return (
                        <motion.button
                          key={priority.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm({ ...form, priority: priority.value as any })}
                          className={`p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                              : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-sm font-medium">{priority.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief summary of your feedback"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Detailed description of your feedback..."
                  />
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm"
                  >
                    {success}
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Send Feedback</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SendFeedbackModal;
