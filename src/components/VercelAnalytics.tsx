import React from 'react';

// Custom Analytics component that handles Vercel Analytics safely
const VercelAnalytics: React.FC = () => {
  React.useEffect(() => {
    // Only load Vercel Analytics in production and when deployed on Vercel
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Check if we're on Vercel by looking for Vercel-specific environment variables
      const isVercel = process.env.VERCEL || window.location.hostname.includes('vercel.app');
      
      if (isVercel) {
        // Dynamically import and initialize Vercel Analytics
        import('@vercel/analytics/react')
          .then(({ Analytics }) => {
            // Create Analytics component and append to body
            const analyticsScript = document.createElement('script');
            analyticsScript.innerHTML = `
              (function() {
                if (window.va) return;
                window.va = function() {
                  (window.vaq = window.vaq || []).push(arguments);
                };
                var script = document.createElement('script');
                script.defer = true;
                script.src = '/_vercel/insights/script.js';
                document.head.appendChild(script);
              })();
            `;
            document.head.appendChild(analyticsScript);
          })
          .catch((error) => {
            console.warn('Failed to load Vercel Analytics:', error);
          });
      }
    }
  }, []);

  return null;
};

export default VercelAnalytics;