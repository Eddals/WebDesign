import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, AlertCircle } from 'lucide-react';
import { dashboardService, Message } from '../../lib/dashboard-api';
import { ClientRegistration } from '../../lib/simple-client-api';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: (message: Message) => void;
  clients: ClientRegistration[];
  replyTo?: Message;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  onMessageSent,
  clients,
  replyTo
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    to_user_id: replyTo?.from_user_id || '',
    subject: replyTo ? `Re: ${replyTo.subject}` : '',
    message: '',
    message_type: 'general',
    priority: 'medium',
    project_id: replyTo?.project_id || ''
  });

  const messageTypes = [
    { value: 'general', label: 'General' },
    { value: 'project_update', label: 'Project Update' },
    { value: 'support', label: 'Support' },
    { value: 'billing', label: 'Billing' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400' }
  ];

  // Simple UUID v4 validation regex
  const isValidUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate to_user_id
    if (!isValidUUID(formData.to_user_id)) {
      setLoading(false);
      setError('Recipient (To) must be a valid UUID.');
      return;
    }
    // Validate project_id if provided
    if (formData.project_id && !isValidUUID(formData.project_id)) {
      setLoading(false);
      setError('Project ID must be a valid UUID or left blank.');
      return;
    }

    try {
      // For demo purposes, we'll use a fixed admin user ID
      // In production, this would come from authentication
      const adminUserId = '00000000-0000-0000-0000-000000000001';

      const messageData = {
        from_user_id: adminUserId,
        to_user_id: formData.to_user_id,
        project_id: formData.project_id || undefined,
        subject: formData.subject,
        message: formData.message,
        message_type: formData.message_type,
        priority: formData.priority,
        reply_to: replyTo?.id,
        thread_id: replyTo?.thread_id || replyTo?.id
      };

      const response = await dashboardService.sendMessage(messageData);

      if (response.success && response.data) {
        onMessageSent(response.data);
        onClose();
        // Reset form
        setFormData({
          to_user_id: '',
          subject: '',
          message: '',
          message_type: 'general',
          priority: 'medium',
          project_id: ''
        });
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {replyTo ? 'Reply to Message' : 'Send New Message'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {replyTo && (
                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">Original Message:</h4>
                  <p className="text-purple-200 text-sm mb-1">{replyTo.subject}</p>
                  <p className="text-purple-100 text-sm line-clamp-3">{replyTo.message}</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      To *
                    </label>
                    <select
                      required
                      value={formData.to_user_id}
                      onChange={(e) => setFormData({ ...formData, to_user_id: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={!!replyTo}
                    >
                      <option value="">Select recipient</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id} className="bg-gray-800">
                          {client.full_name} {client.company_name && `(${client.company_name})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Message Type
                    </label>
                    <select
                      value={formData.message_type}
                      onChange={(e) => setFormData({ ...formData, message_type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {messageTypes.map((type) => (
                        <option key={type.value} value={type.value} className="bg-gray-800">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value} className="bg-gray-800">
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Related Project (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.project_id}
                      onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Project ID (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter message subject"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-purple-300 rounded-lg hover:bg-white/20 transition-all"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>Attach File</span>
                    </button>
                    
                    {formData.priority === 'urgent' && (
                      <div className="flex items-center space-x-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Urgent message</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MessageModal;
