import { useEffect } from 'react';

const BrevoTracker = () => {
  useEffect(() => {
    // Create script element for Brevo SDK loader
    const sdkScript = document.createElement('script');
    sdkScript.src = 'https://cdn.brevo.com/js/sdk-loader.js';
    sdkScript.async = true;
    document.head.appendChild(sdkScript);

    // Initialize Brevo tracking
    window.Brevo = window.Brevo || [];
    window.Brevo.push([
      "init",
      {
        client_key: "uot39zape5qjw7fphjiict4x",
        // Optional: Add other initialization options as needed
      }
    ]);

    // Cleanup function
    return () => {
      document.head.removeChild(sdkScript);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default BrevoTracker;