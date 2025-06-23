import { useEffect } from 'react';

// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function useGoogleAnalytics() {
  useEffect(() => {
    // Check if Google Analytics is already initialized
    if (typeof window.gtag === 'function') {
      return;
    }

    // Add Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3FWDB6VQNN';
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'G-3FWDB6VQNN');

    // Assign gtag to window
    window.gtag = gtag;

    // Cleanup function
    return () => {
      // Only remove the script if the component that initialized it is unmounted
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Return the gtag function for use in components
  const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  };

  return { trackEvent };
}