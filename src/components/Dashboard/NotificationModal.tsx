import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import { AdminNotification } from '../../lib/admin-notifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const unreadNotifications = notifications.filter(n => !n.is_read);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_client_registration':
        return <User className="w-4 h-4" />;
      case 'project_update':
        return <CheckCircle className="w-4 h-4" />;
      case 'client_message':
        return <Bell className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                    <p className="text-purple-200 text-sm">
                      {unreadNotifications.length} unread of {notifications.length} total
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {unreadNotifications.length > 0 && onMarkAllAsRead && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onMarkAllAsRead}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                    >
                      Mark All Read
                    </motion.button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-purple-200 text-lg font-semibold">No notifications</p>
                  <p className="text-purple-300 text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-white/5 transition-all cursor-pointer ${
                        !notification.is_read ? 'bg-blue-500/10' : ''
                      }`}
                      onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-semibold truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <span className="text-purple-300 text-xs">
                                {new Date(notification.created_at).toLocaleDateString('en-US')}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-purple-100 text-sm mb-2">{notification.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            
                            {notification.action_required && (
                              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs border border-orange-500/30">
                                Action Required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-purple-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Unread</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Real-time updates</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
