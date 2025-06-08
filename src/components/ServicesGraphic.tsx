"use client"

import { motion } from "framer-motion"
import { 
  Globe, ShoppingBag, Code2, Paintbrush, Search, 
  Zap, Layers, Database, Smartphone, Monitor, 
  Rocket, Crown, Briefcase, Target, TrendingUp,
  Settings, Cpu, Cloud, Shield
} from "lucide-react"

const ServicesGraphic = () => {
  return (
    <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
      {/* Central Services Hub */}
      <motion.div 
        className="relative z-10 w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Settings className="text-white" size={36} />
        </motion.div>
      </motion.div>

      {/* Service Category Orbits */}
      {/* Inner Ring - Core Services */}
      {[
        { icon: <Globe size={24} />, radius: 90, duration: 12, delay: 0, color: "from-blue-500 to-blue-600", label: "Websites" },
        { icon: <ShoppingBag size={24} />, radius: 90, duration: 12, delay: 3, color: "from-green-500 to-green-600", label: "E-commerce" },
        { icon: <Code2 size={24} />, radius: 90, duration: 12, delay: 6, color: "from-purple-500 to-purple-600", label: "Development" },
        { icon: <Search size={24} />, radius: 90, duration: 12, delay: 9, color: "from-orange-500 to-orange-600", label: "SEO" },
      ].map((item, index) => (
        <motion.div
          key={index}
          className={`absolute w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg border border-white/20`}
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
            className="text-white flex flex-col items-center"
          >
            {item.icon}
          </motion.div>
        </motion.div>
      ))}

      {/* Middle Ring - Technologies */}
      {[
        { icon: <Monitor size={20} />, radius: 130, duration: 16, delay: 0, color: "from-cyan-500 to-cyan-600" },
        { icon: <Smartphone size={20} />, radius: 130, duration: 16, delay: 2, color: "from-pink-500 to-pink-600" },
        { icon: <Database size={20} />, radius: 130, duration: 16, delay: 4, color: "from-indigo-500 to-indigo-600" },
        { icon: <Cloud size={20} />, radius: 130, duration: 16, delay: 6, color: "from-teal-500 to-teal-600" },
        { icon: <Shield size={20} />, radius: 130, duration: 16, delay: 8, color: "from-red-500 to-red-600" },
        { icon: <Cpu size={20} />, radius: 130, duration: 16, delay: 10, color: "from-yellow-500 to-yellow-600" },
      ].map((item, index) => (
        <motion.div
          key={`middle-${index}`}
          className={`absolute w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-md`}
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

      {/* Outer Ring - Features */}
      {[
        { icon: <Zap size={16} />, radius: 170, duration: 20, delay: 0, color: "from-yellow-400 to-yellow-500" },
        { icon: <Target size={16} />, radius: 170, duration: 20, delay: 4, color: "from-purple-400 to-purple-500" },
        { icon: <Rocket size={16} />, radius: 170, duration: 20, delay: 8, color: "from-red-400 to-red-500" },
        { icon: <TrendingUp size={16} />, radius: 170, duration: 20, delay: 12, color: "from-green-400 to-green-500" },
        { icon: <Layers size={16} />, radius: 170, duration: 20, delay: 16, color: "from-blue-400 to-blue-500" },
      ].map((item, index) => (
        <motion.div
          key={`outer-${index}`}
          className={`absolute w-10 h-10 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-sm`}
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

      {/* Floating Service Icons */}
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-40"
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(index) * 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
          style={{
            left: `${15 + (index * 6)}%`,
            top: `${25 + Math.sin(index) * 25}%`,
          }}
        />
      ))}

      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-green-500/5 rounded-2xl"></div>
      
      {/* Animated Connection Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
        <motion.circle
          cx="160"
          cy="160"
          r="70"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="1"
          strokeDasharray="8,4"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "160px 160px" }}
        />
        <motion.circle
          cx="160"
          cy="160"
          r="110"
          fill="none"
          stroke="rgba(59, 130, 246, 0.15)"
          strokeWidth="1"
          strokeDasharray="6,6"
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "160px 160px" }}
        />
        <motion.circle
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="rgba(34, 197, 94, 0.1)"
          strokeWidth="1"
          strokeDasharray="4,8"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "160px 160px" }}
        />
      </svg>

      {/* Service Quality Indicators */}
      <motion.div
        className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-white/80 text-xs font-medium">8+ Services</span>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <span className="text-white/80 text-xs font-medium">24/7 Support</span>
      </motion.div>
    </div>
  )
}

export default ServicesGraphic