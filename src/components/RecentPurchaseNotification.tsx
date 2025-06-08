import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Package } from 'lucide-react';

interface Purchase {
  package: 'Basic' | 'Standard' | 'Premium';
  timeAgo: string;
  location: string;
}

const recentPurchases: Purchase[] = [
  { package: 'Premium', timeAgo: '2 minutes ago', location: 'New York, USA' },
  { package: 'Standard', timeAgo: '5 minutes ago', location: 'London, UK' },
  { package: 'Premium', timeAgo: '10 minutes ago', location: 'Toronto, Canada' },
  { package: 'Basic', timeAgo: '15 minutes ago', location: 'Sydney, Australia' },
];

const RecentPurchaseNotification = () => {
  const [currentNotification, setCurrentNotification] = useState<Purchase | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    // Show first notification after 3 seconds
    const initialTimer = setTimeout(() => {
      setCurrentNotification(recentPurchases[0]);
      setIsVisible(true);
    }, 3000);

    // Rotate through notifications
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % recentPurchases.length;
      setIsVisible(false);
      
      // Wait for exit animation, then show next
      setTimeout(() => {
        setCurrentNotification(recentPurchases[currentIndex]);
        setIsVisible(true);
      }, 500);
    }, 8000); // Show each notification for 8 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className="bg-[#0a0e24] border border-white/10 rounded-lg p-4 shadow-lg backdrop-blur-sm max-w-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <Package className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">
                  Someone from <span className="text-purple-400">{currentNotification.location}</span> just purchased
                </p>
                <p className="text-sm font-semibold text-white">
                  {currentNotification.package} Package
                </p>
                <p className="text-xs text-white/70 mt-1">
                  {currentNotification.timeAgo}
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentPurchaseNotification;