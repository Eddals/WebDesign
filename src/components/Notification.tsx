import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Clock } from "lucide-react";
import { getRecentEstimates, EstimateNotification } from "@/lib/notifications";

/**
 * Notification
 *
 * Displays a notification when someone submits an estimate request.
 * The notification appears randomly throughout the website.
 * Each notification is visible for 7 seconds before disappearing.
 *
 * @returns {JSX.Element} The notification component.
 */
const Notification = () => {
  const [notification, setNotification] = useState<EstimateNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [estimateRequests, setEstimateRequests] = useState<EstimateNotification[]>([]);

  // Load estimates from database on component mount
  useEffect(() => {
    const loadEstimates = async () => {
      const estimates = await getRecentEstimates();
      setEstimateRequests(estimates);
    };
    loadEstimates();
  }, []);

  // No fallback data - only show real database submissions

  useEffect(() => {
    // Only show real database data - no fallback for authentic notifications
    if (estimateRequests.length === 0) return;

    // Show first notification after a random time between 5-15 seconds
    const initialDelay = Math.floor(Math.random() * 10000) + 5000;
    const initialTimer = setTimeout(() => {
      const randomEstimate = estimateRequests[Math.floor(Math.random() * estimateRequests.length)];
      setNotification(randomEstimate);
      setIsVisible(true);

      // Hide after 7 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    }, initialDelay);

    // Set up interval for subsequent notifications with random timing
    const interval = setInterval(() => {
      // Only show if not currently visible
      if (!isVisible) {
        const randomEstimate = estimateRequests[Math.floor(Math.random() * estimateRequests.length)];
        setNotification(randomEstimate);
        setIsVisible(true);

        // Hide after 7 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 7000);
      }
    }, Math.floor(Math.random() * 20000) + 15000); // Random interval between 15-35 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isVisible, estimateRequests]);

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 border border-purple-500/50 shadow-xl rounded-xl p-4 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-t-xl">
              <motion.div 
                className="h-full bg-white/30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 7, ease: "linear" }}
              />
            </div>
            
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-600/50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5">
                  <FileText className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-white">{notification.name}</p>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="Close notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-purple-200 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>{notification.timeAgo}</span>
                </div>
                
                <p className="text-sm text-white/90">
                  from <span className="font-medium">{notification.country}</span> just requested an{" "}
                  <span className="text-purple-300 font-semibold">estimate</span>
                </p>

                <p className="text-xs text-purple-200 mt-1">
                  for their <span className="font-medium text-purple-300">{notification.industry}</span> business
                </p>

                <div className="mt-2 pt-2 border-t border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-purple-300">
                    <FileText className="w-3 h-3" />
                    <span>Estimate Request</span>
                  </div>
                  
                  <div className="text-xs text-purple-300">
                    <span className="animate-pulse">● Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;