import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, Presentation, BookOpen, Headphones, LifeBuoy } from 'lucide-react';
import { meetingService, ScheduleMeetingForm } from '../../lib/client-quick-actions';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  projects: any[];
  onMeetingScheduled?: (meeting: any) => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  clientId,
  projects,
  onMeetingScheduled
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<ScheduleMeetingForm>({
    project_id: '',
    title: '',
    description: '',
    meeting_type: 'consultation',
    scheduled_date: '',
    duration_minutes: 60,
    client_notes: ''
  });

  const meetingTypes = [
    { value: 'consultation', label: 'Consultation', icon: Users, color: 'blue', description: 'Initial discussion and planning' },
    { value: 'review', label: 'Review', icon: BookOpen, color: 'green', description: 'Progress review and feedback' },
    { value: 'planning', label: 'Planning', icon: Calendar, color: 'purple', description: 'Project planning session' },
    { value: 'presentation', label: 'Presentation', icon: Presentation, color: 'orange', description: 'Project presentation' },
    { value: 'training', label: 'Training', icon: Headphones, color: 'yellow', description: 'Training and onboarding' },
    { value: 'support', label: 'Support', icon: LifeBuoy, color: 'red', description: 'Technical support' }
  ];

  const durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await meetingService.scheduleMeeting(clientId, form);

      if (response.success && response.data) {
        setSuccess('Meeting scheduled successfully! We will send you a confirmation email.');
        onMeetingScheduled?.(response.data);
        
        // Reset form
        setForm({
          project_id: '',
          title: '',
          description: '',
          meeting_type: 'consultation',
          scheduled_date: '',
          duration_minutes: 60,
          client_notes: ''
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      } else {
        setError(response.error || 'Failed to schedule meeting');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 16);
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().slice(0, 16);
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
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Schedule Meeting</h2>
                    <p className="text-purple-200 text-sm">Book a meeting with our team</p>
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
                {/* Meeting Type */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Meeting Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {meetingTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = form.meeting_type === type.value;
                      return (
                        <motion.button
                          key={type.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm({ ...form, meeting_type: type.value as any })}
                          className={`p-4 rounded-xl border transition-all text-left ${
                            isSelected
                              ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                              : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="text-sm opacity-80">{type.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

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
                    <option value="" className="bg-purple-900">General Meeting</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id} className="bg-purple-900">
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief title for the meeting"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={form.scheduled_date}
                      onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Duration
                    </label>
                    <select
                      value={form.duration_minutes}
                      onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {durations.map((duration) => (
                        <option key={duration.value} value={duration.value} className="bg-purple-900">
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="What would you like to discuss?"
                  />
                </div>

                {/* Client Notes */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.client_notes}
                    onChange={(e) => setForm({ ...form, client_notes: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Any special requirements or preparation needed?"
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
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Scheduling...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Meeting</span>
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

export default ScheduleMeetingModal;
