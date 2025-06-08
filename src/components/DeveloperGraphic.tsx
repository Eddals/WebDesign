"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

const DeveloperGraphic: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    // Start animation after component mounts
    setIsAnimating(true)
    
    // Set up animation loop
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  // Colors matching the site's purple theme
  const colors = {
    background: "#030718",
    purple: {
      light: "#d8b4fe", // purple-300
      main: "#a855f7",  // purple-500
      dark: "#7e22ce",  // purple-700
    },
    text: "#f8fafc",    // slate-50
    code: {
      comment: "#94a3b8", // slate-400
      keyword: "#a855f7", // purple-500
      string: "#22c55e",  // green-500
      function: "#3b82f6", // blue-500
      variable: "#f97316", // orange-500
      tag: "#ec4899",     // pink-500
    }
  }

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#030718] border border-white/10 group">
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
      
      {/* Main container */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#030718] flex items-center justify-center p-4">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 400 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background elements */}
          <motion.circle 
            cx="200" 
            cy="200" 
            r="150" 
            fill={colors.purple.dark} 
            fillOpacity="0.05"
            initial={{ scale: 0.8 }}
            animate={{ scale: isAnimating ? 1.1 : 0.9 }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          
          <motion.circle 
            cx="200" 
            cy="200" 
            r="100" 
            fill={colors.purple.main} 
            fillOpacity="0.1"
            initial={{ scale: 0.9 }}
            animate={{ scale: isAnimating ? 0.9 : 1.1 }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Desk */}
          <rect x="100" y="280" width="200" height="10" rx="2" fill={colors.purple.dark} fillOpacity="0.6" />
          
          {/* Computer */}
          <rect x="140" y="180" width="120" height="90" rx="4" fill={colors.purple.dark} fillOpacity="0.8" />
          <rect x="145" y="185" width="110" height="80" rx="2" fill="#111827" />
          
          {/* Computer stand */}
          <rect x="185" y="270" width="30" height="10" rx="2" fill={colors.purple.dark} />
          <rect x="175" y="270" width="50" height="5" rx="2" fill={colors.purple.dark} fillOpacity="0.8" />
          
          {/* Code on screen */}
          <motion.g
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isAnimating ? 1 : 0.7 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            {/* Code lines */}
            <rect x="155" y="195" width="90" height="2" rx="1" fill={colors.code.comment} fillOpacity="0.6" />
            <rect x="155" y="205" width="40" height="2" rx="1" fill={colors.code.keyword} />
            <rect x="200" y="205" width="30" height="2" rx="1" fill={colors.code.variable} />
            <rect x="155" y="215" width="20" height="2" rx="1" fill={colors.code.keyword} />
            <rect x="180" y="215" width="50" height="2" rx="1" fill={colors.code.string} />
            <rect x="155" y="225" width="30" height="2" rx="1" fill={colors.code.function} />
            <rect x="190" y="225" width="45" height="2" rx="1" fill={colors.code.variable} />
            <rect x="155" y="235" width="25" height="2" rx="1" fill={colors.code.tag} />
            <rect x="185" y="235" width="50" height="2" rx="1" fill={colors.code.variable} />
            <rect x="155" y="245" width="80" height="2" rx="1" fill={colors.code.comment} fillOpacity="0.6" />
            <rect x="155" y="255" width="35" height="2" rx="1" fill={colors.code.keyword} />
            <rect x="195" y="255" width="40" height="2" rx="1" fill={colors.code.function} />
          </motion.g>
          
          {/* Developer */}
          <motion.g
            initial={{ y: 0 }}
            animate={{ y: isAnimating ? -3 : 3 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            {/* Head */}
            <circle cx="200" cy="150" r="25" fill={colors.purple.light} />
            
            {/* Face */}
            <circle cx="190" cy="145" r="3" fill="#111827" /> {/* Left eye */}
            <circle cx="210" cy="145" r="3" fill="#111827" /> {/* Right eye */}
            <path d="M195 160 Q200 165 205 160" stroke="#111827" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
            
            {/* Headphones */}
            <path d="M175 145 Q175 125 200 125 Q225 125 225 145" stroke={colors.purple.dark} strokeWidth="3" strokeLinecap="round" />
            <rect x="170" y="140" width="5" height="15" rx="2" fill={colors.purple.dark} />
            <rect x="225" y="140" width="5" height="15" rx="2" fill={colors.purple.dark} />
          </motion.g>
          
          {/* Body */}
          <rect x="185" y="175" width="30" height="40" rx="5" fill={colors.purple.main} />
          
          {/* Arms */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: isAnimating ? 5 : -5 }}
            transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            style={{ originX: 0.5, originY: 0 }}
          >
            <rect x="170" y="180" width="15" height="5" rx="2" fill={colors.purple.light} /> {/* Left arm */}
            <rect x="155" y="180" width="15" height="10" rx="2" fill={colors.text} /> {/* Left hand */}
          </motion.g>
          
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: isAnimating ? -5 : 5 }}
            transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            style={{ originX: 0.5, originY: 0 }}
          >
            <rect x="215" y="180" width="15" height="5" rx="2" fill={colors.purple.light} /> {/* Right arm */}
            <rect x="230" y="180" width="15" height="10" rx="2" fill={colors.text} /> {/* Right hand */}
          </motion.g>
          
          {/* Floating elements */}
          <motion.g
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: isAnimating ? 10 : -10, rotate: isAnimating ? 10 : -10 }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            <circle cx="120" cy="120" r="10" fill={colors.purple.main} fillOpacity="0.6" />
            <path d="M115 120 L125 120 M120 115 L120 125" stroke={colors.text} strokeWidth="2" strokeLinecap="round" />
          </motion.g>
          
          <motion.g
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: isAnimating ? -10 : 10, rotate: isAnimating ? -10 : 10 }}
            transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          >
            <rect x="270" y="130" width="20" height="20" rx="4" fill={colors.purple.light} fillOpacity="0.6" />
            <path d="M275 140 L285 140 M280 135 L280 145" stroke={colors.text} strokeWidth="2" strokeLinecap="round" />
          </motion.g>
          
          <motion.g
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: isAnimating ? 15 : -15, rotate: isAnimating ? 15 : -15 }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1 }}
          >
            <polygon points="290,200 300,220 280,220" fill={colors.purple.dark} fillOpacity="0.6" />
            <circle cx="290" cy="210" r="3" fill={colors.text} />
          </motion.g>
          
          {/* Coffee mug */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: isAnimating ? 5 : -5 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            style={{ originX: 0, originY: 1 }}
          >
            <rect x="260" y="270" width="20" height="25" rx="3" fill={colors.purple.light} />
            <rect x="280" y="275" width="5" height="15" rx="2" fill={colors.purple.light} />
            <motion.path 
              d="M265 260 Q270 255 275 260" 
              stroke={colors.text} 
              strokeWidth="2" 
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: isAnimating ? 0.8 : 0 }}
              transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.g>
        </svg>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-white text-2xl font-bold">Matheus Silva</h3>
        <p className="text-white/90">Web Developer & Designer</p>
      </div>
    </div>
  )
}

export default DeveloperGraphic