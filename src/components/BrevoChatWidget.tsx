import { useEffect } from 'react';

// Declare BrevoConversations on window object
declare global {
  interface Window {
    BrevoConversations?: any;
    BrevoConversationsID?: string;
  }
}

// Brevo Chat Widget Component
const BrevoChatWidget = () => {
  useEffect(() => {
    // Check if widget is already loaded
    if (window.BrevoConversations) {
      return;
    }

    // Load Brevo Conversations widget
    const script = document.createElement('script');
    script.innerHTML = `
      (function(d, w, c) {
        w.BrevoConversationsID = '68695c9f874a50a48c007a4a';
        w[c] = w[c] || function() {
          (w[c].q = w[c].q || []).push(arguments);
        };
        var s = d.createElement('script');
        s.async = true;
        s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
        if (d.head) d.head.appendChild(s);
      })(document, window, 'BrevoConversations');
    `;
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src*="brevo-conversations.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default BrevoChatWidget; 