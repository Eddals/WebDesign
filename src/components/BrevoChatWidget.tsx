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
    if (window.BrevoConversationsID) {
      return;
    }

    // Execute the Brevo script exactly as provided
    (function(d: Document, w: Window, c: string) {
      w.BrevoConversationsID = '68695c9f874a50a48c007a4a';
      (w as any)[c] = (w as any)[c] || function() {
        ((w as any)[c].q = (w as any)[c].q || []).push(arguments);
      };
      var s = d.createElement('script');
      s.async = true;
      s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
      if (d.head) d.head.appendChild(s);
    })(document, window, 'BrevoConversations');

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