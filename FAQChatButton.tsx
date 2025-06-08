"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useLocation } from "wouter";

// A standalone chat button component that can be used on any page 
// to redirect users to the FAQ page and open the chat assistant

export default function FAQChatButton() {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Navigate to FAQ page
    setLocation("/faq");
    
    // Store in localStorage that we want the chat to be open
    if (typeof window !== 'undefined') {
      localStorage.setItem('open_chat_on_navigation', 'true');
    }
  };

  return (
    <button 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-full p-3 shadow-lg transition-all duration-300"
    >
      {/* Pulse Animation */}
      <span className="absolute w-full h-full rounded-full bg-purple-600 opacity-60 animate-pulse-slow"></span>
      
      <MessageSquare className="h-6 w-6 relative z-10" />
      
      <span 
        className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 relative z-10 ${
          isHovered ? "max-w-xs opacity-100 ml-0.5 mr-1" : "max-w-0 opacity-0"
        }`}
      >
        Need help? Chat with us!
      </span>
    </button>
  );
}