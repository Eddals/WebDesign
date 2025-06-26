import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface CircularNotificationProps {
  type: 'success' | 'error' | 'warning' | null;
  message: string;
  onClose?: () => void;
  duration?: number;
}

const CircularNotification: React.FC<CircularNotificationProps> = ({ 
  type, 
  message, 
  onClose,
  duration = 5000 
}) => {
  useEffect(() => {
    if (type && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6" />;
      case 'error':
        return <XCircle className="w-6 h-6" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-green-500/20 to-green-600/20',
          border: 'border-green-500/30',
          text: 'text-green-300',
          iconBg: 'bg-green-500/30',
          progressBg: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
          border: 'border-red-500/30',
          text: 'text-red-300',
          iconBg: 'bg-red-500/30',
          progressBg: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20',
          border: 'border-yellow-500/30',
          text: 'text-yellow-300',
          iconBg: 'bg-yellow-500/30',
          progressBg: 'bg-yellow-500'
        };
      default:
        return {
          bg: '',
          border: '',
          text: '',
          iconBg: '',
          progressBg: ''
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`
            relative overflow-hidden
            rounded-full
            ${colors.bg} ${colors.border} border-2
            backdrop-blur-md
            shadow-2xl
            min-w-[320px] max-w-[400px]
          `}>
            <div className="flex items-center gap-3 p-4">
              {/* Circular Icon Container */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className={`
                  flex-shrink-0 w-12 h-12 rounded-full
                  ${colors.iconBg}
                  flex items-center justify-center
                  ${colors.text}
                `}
              >
                {getIcon()}
              </motion.div>

              {/* Message */}
              <div className={`flex-1 ${colors.text} text-sm font-medium pr-2`}>
                {message}
              </div>

              {/* Close Button */}
              {onClose && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full
                    ${colors.iconBg}
                    flex items-center justify-center
                    ${colors.text}
                    hover:opacity-80 transition-opacity
                  `}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Progress Bar */}
            {duration > 0 && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={`
                  absolute bottom-0 left-0 h-1
                  ${colors.progressBg}
                  origin-left w-full
                `}
                style={{ transformOrigin: 'left' }}
              />
            )}

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/5 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CircularNotification;