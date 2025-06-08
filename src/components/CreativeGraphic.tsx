"use client"

import { motion } from "framer-motion"
import { Code, Palette, Globe, Zap, Sparkles, Monitor, Smartphone, Rocket } from "lucide-react"

const CreativeGraphic = () => {
  return (
    <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
      {/* Central Hub */}
      <motion.div 
        className="relative z-10 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-2xl"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Code className="text-white" size={32} />
        </motion.div>
      </motion.div>

      {/* Orbiting Elements */}
      {[
        { icon: <Globe size={20} />, radius: 80, duration: 8, delay: 0, color: "from-blue-500 to-blue-600" },
        { icon: <Palette size={20} />, radius: 80, duration: 8, delay: 2, color: "from-pink-500 to-pink-600" },
        { icon: <Monitor size={20} />, radius: 80, duration: 8, delay: 4, color: "from-green-500 to-green-600" },
        { icon: <Smartphone size={20} />, radius: 80, duration: 8, delay: 6, color: "from-orange-500 to-orange-600" },
      ].map((item, index) => (
        <motion.div
          key={index}
          className={`absolute w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg`}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay,
          }}
          style={{
            transformOrigin: `${item.radius}px 0px`,
          }}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "linear",
              delay: item.delay,
            }}
            className="text-white"
          >
            {item.icon}
          </motion.div>
        </motion.div>
      ))}

      {/* Outer Ring Elements */}
      {[
        { icon: <Zap size={16} />, radius: 120, duration: 12, delay: 0, color: "from-yellow-500 to-yellow-600" },
        { icon: <Sparkles size={16} />, radius: 120, duration: 12, delay: 3, color: "from-purple-400 to-purple-500" },
        { icon: <Rocket size={16} />, radius: 120, duration: 12, delay: 6, color: "from-red-500 to-red-600" },
      ].map((item, index) => (
        <motion.div
          key={`outer-${index}`}
          className={`absolute w-8 h-8 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-md`}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay,
          }}
          style={{
            transformOrigin: `${item.radius}px 0px`,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "linear",
              delay: item.delay,
            }}
            className="text-white"
          >
            {item.icon}
          </motion.div>
        </motion.div>
      ))}

      {/* Floating Particles */}
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(index) * 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
          style={{
            left: `${20 + (index * 8)}%`,
            top: `${30 + Math.sin(index) * 20}%`,
          }}
        />
      ))}

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl"></div>
      
      {/* Animated Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
        <motion.circle
          cx="160"
          cy="160"
          r="60"
          fill="none"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
          strokeDasharray="5,5"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "160px 160px" }}
        />
        <motion.circle
          cx="160"
          cy="160"
          r="100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="1"
          strokeDasharray="3,7"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "160px 160px" }}
        />
      </svg>
    </div>
  )
}

export default CreativeGraphic