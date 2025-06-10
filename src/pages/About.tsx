
import { useState, useEffect, useRef } from "react"
import {
  Palette,
  Globe,
  MessageCircle,
  Code,
  Lightbulb,
  Heart,
  Star,
  Award,
  Target,
  Rocket,
  ArrowRight,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Zap,
  Coffee,
  Music,
  Camera,
  Gamepad2,
  Book,
  Headphones,
  Monitor
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import SEO from '@/components/SEO'


const About = () => {
  // Interactive state management
  const [activeSkill, setActiveSkill] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [hoveredAchievement, setHoveredAchievement] = useState(null)
  const [personalityMode, setPersonalityMode] = useState('professional')
  const [interactionCount, setInteractionCount] = useState(0)

  // Animated counting effect for stats
  const [counts, setCounts] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
  })

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  // Interactive functions
  const handleInteraction = () => {
    setInteractionCount(prev => prev + 1)
    if (soundEnabled) {
      // Play interaction sound (you can add actual audio here)
      console.log('🎵 Interaction sound!')
    }
  }

  const togglePersonality = () => {
    setPersonalityMode(prev => prev === 'professional' ? 'fun' : 'professional')
    handleInteraction()
  }

  const playSound = () => {
    if (soundEnabled) {
      setIsPlaying(!isPlaying)
      handleInteraction()
    }
  }



  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        projects: prev.projects < 100 ? prev.projects + 2 : prev.projects,
        clients: prev.clients < 50 ? prev.clients + 1 : prev.clients,
        experience: prev.experience < 5 ? prev.experience + 1 : prev.experience,
      }))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Skills categories with interactive elements
  const skills = [
    {
      category: "Platforms",
      icon: <Globe size={24} />,
      items: ["WordPress", "Shopify", "Webflow", "Drupal"],
      color: "from-blue-500/20 to-blue-700/20",
      borderColor: "border-blue-500/30",
      description: "Building on powerful platforms"
    },
    {
      category: "Coding",
      icon: <Code size={24} />,
      items: ["React", "Next.js", "JavaScript", "HTML/CSS", "PHP"],
      color: "from-green-500/20 to-green-700/20",
      borderColor: "border-green-500/30",
      description: "Crafting clean, efficient code"
    },
    {
      category: "Design",
      icon: <Palette size={24} />,
      items: ["UI/UX Design", "Figma", "Responsive Design", "Branding"],
      color: "from-pink-500/20 to-pink-700/20",
      borderColor: "border-pink-500/30",
      description: "Creating beautiful experiences"
    },
    {
      category: "Marketing",
      icon: <TrendingUp size={24} />,
      items: ["SEO", "Analytics", "Content Strategy", "Social Media"],
      color: "from-purple-500/20 to-purple-700/20",
      borderColor: "border-purple-500/30",
      description: "Growing your digital presence"
    },
  ]

  // Personal interests for fun mode
  const personalInterests = [
    { icon: <Coffee size={20} />, name: "Coffee Enthusiast", fact: "I've tried 47 different coffee beans!" },
    { icon: <Music size={20} />, name: "Music Lover", fact: "I code better with lo-fi beats" },
    { icon: <Camera size={20} />, name: "Photography", fact: "I capture moments between coding sessions" },
    { icon: <Gamepad2 size={20} />, name: "Gaming", fact: "Strategy games help me think better" },
    { icon: <Book size={20} />, name: "Learning", fact: "Always reading about new tech trends" },
    { icon: <Headphones size={20} />, name: "Podcasts", fact: "Tech podcasts during morning walks" }
  ]



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  // Custom styles for animations
  const customStyles = `
    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); }
      100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .animate-gradient-text {
      background: linear-gradient(90deg, #a855f7, #6366f1, #a855f7);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradientFlow 6s linear infinite;
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-pulse-glow {
      animation: pulse 2s infinite;
    }
    
    .animate-shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
      background-size: 200% 100%;
      animation: shimmer 3s infinite;
    }
    
    .card-hover-effect {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card-hover-effect:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.3);
    }
    
    .text-glow {
      text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
    }
  `;

  return (
    <>
      <SEO
        title="About DevTone - Expert Web Development Team"
        description="Meet the DevTone team - experienced web developers and digital marketing experts dedicated to creating exceptional online experiences. Learn about our expertise, values, and commitment to client success."
        keywords={['about DevTone', 'web development team', 'digital marketing experts', 'professional experience', 'web design agency', 'development expertise']}
        ogUrl="https://devtone.com/about"
      />
      <div className="min-h-screen pt-24 bg-[#030718] overflow-hidden">
        {/* Add the custom styles */}
        <style>{customStyles}</style>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        {/* Floating tech icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-[15%] left-[10%] text-purple-400/30"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code size={32} />
          </motion.div>
          <motion.div 
            className="absolute top-[25%] right-[15%] text-purple-400/30"
            animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Lightbulb size={40} />
          </motion.div>
          <motion.div 
            className="absolute bottom-[30%] left-[20%] text-purple-400/30"
            animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Heart size={28} />
          </motion.div>
          <motion.div 
            className="absolute bottom-[20%] right-[25%] text-purple-400/30"
            animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <Rocket size={36} />
          </motion.div>
        </div>

        {/* Interactive Control Panel */}
        <motion.div
          className="fixed top-32 right-4 z-50 space-y-2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            onClick={togglePersonality}
            className="w-12 h-12 rounded-full bg-purple-500/20 backdrop-blur-lg border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`Switch to ${personalityMode === 'professional' ? 'fun' : 'professional'} mode`}
          >
            {personalityMode === 'professional' ? <Zap size={20} /> : <Monitor size={20} />}
          </motion.button>

          <motion.button
            onClick={() => {
              setSoundEnabled(!soundEnabled)
              handleInteraction()
            }}
            className="w-12 h-12 rounded-full bg-purple-500/20 backdrop-blur-lg border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`${soundEnabled ? 'Disable' : 'Enable'} sound effects`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </motion.button>

          <motion.button
            onClick={playSound}
            className="w-12 h-12 rounded-full bg-purple-500/20 backdrop-blur-lg border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Play interaction sound"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>

          {/* Interaction Counter */}
          <motion.div
            className="w-12 h-12 rounded-full bg-purple-500/20 backdrop-blur-lg border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold"
            animate={{ scale: interactionCount > 0 ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {interactionCount}
          </motion.div>
        </motion.div>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative pt-12 pb-24 overflow-hidden"
          style={{ opacity, scale }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={handleInteraction}
              >
                <span className="relative z-10">
                  {personalityMode === 'professional' ? 'About Me' : '🚀 Fun Mode Active!'}
                </span>
                <motion.div
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                onClick={handleInteraction}
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                  Meet the <span className="animate-gradient-text">
                    {personalityMode === 'professional' ? 'Developer' : 'Creative Wizard'}
                  </span>
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-white/80 max-w-2xl mx-auto cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onClick={handleInteraction}
                whileHover={{ scale: 1.01 }}
              >
                {personalityMode === 'professional'
                  ? "I love building intelligent, creative, and well-developed websites. I believe in delivering digital experiences that truly make a difference."
                  : "I'm a digital alchemist who transforms caffeine into code and ideas into interactive experiences! ✨ Let's create some magic together!"
                }
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4">

          {/* About Content */}
          <motion.div 
            className="grid grid-cols-1 gap-12 items-center mb-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-3xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="relative">
                  Matheus Silva
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-1 bg-purple-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "33%" }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                  ></motion.span>
                </span>
              </motion.h2>
              
              <motion.div 
                className="space-y-4 text-white/80"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.p variants={itemVariants}>
                  I'm a versatile digital craftsman with 5+ years of experience turning ideas into online realities. My
                  journey has taken me through the worlds of WordPress, Drupal, and Webflow, where I've mastered the art
                  of creating websites that don't just look pretty—they actually work for your business.
                </motion.p>
                <motion.p variants={itemVariants}>
                  Beyond just building websites, I bring a holistic skill set that includes digital marketing wizardry,
                  eye-catching graphic design, and cutting-edge SEO strategies that get you found. I've helped businesses
                  of all sizes break through the digital noise and make meaningful connections with their audience.
                </motion.p>
                <motion.p variants={itemVariants}>
                  As an AI prompt engineering expert, I bridge the gap between human creativity and artificial
                  intelligence, crafting conversations that feel natural and productive. This unique blend of technical
                  expertise and creative insight allows me to solve digital problems that others can't even see.
                </motion.p>
                <motion.p variants={itemVariants}>
                  I don't just deliver projects—I deliver peace of mind. When we work together, you're getting someone who
                  genuinely cares about your success and will go the extra mile to make sure your digital presence isn't
                  just good—it's remarkable.
                </motion.p>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                viewport={{ once: true }}
              >
                {[
                  { value: counts.projects, label: "Projects", suffix: "+" },
                  { value: counts.clients, label: "Happy Clients", suffix: "+" },
                  { value: counts.experience, label: "Years Experience", suffix: "+" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center p-4 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl card-hover-effect relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-3xl font-bold text-purple-400">{stat.value}{stat.suffix}</div>
                      <div className="text-white/60">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Skills Section */}
          <motion.section 
            className="mb-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Expertise</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                My <span className="animate-gradient-text">Skills</span>
              </motion.h2>
              
              <motion.p 
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                A comprehensive toolkit that allows me to tackle any web development challenge
              </motion.p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 card-hover-effect relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-purple-400">{skill.icon}</div>
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white">{skill.category}</h3>
                    </div>
                    
                    <ul className="space-y-2">
                      {skill.items.map((item, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-center gap-2 text-white/80"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <motion.div 
                            className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                            whileHover={{ scale: 1.5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Achievements Section */}
          <motion.section 
            className="mb-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Achievements</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                What I've <span className="animate-gradient-text">Accomplished</span>
              </motion.h2>
              
              <motion.p 
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Milestones and recognitions that showcase my commitment to excellence
              </motion.p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <Award size={32} />,
                  title: "Top Rated",
                  description: "Freelancer on multiple platforms",
                  color: "from-yellow-500/20 to-yellow-700/20",
                  borderColor: "border-yellow-500/30"
                },
                {
                  icon: <Star size={32} />,
                  title: "5-Star Reviews",
                  description: "Consistent client satisfaction",
                  color: "from-green-500/20 to-green-700/20",
                  borderColor: "border-green-500/30"
                },
                {
                  icon: <Target size={32} />,
                  title: "100% Success",
                  description: "Project completion rate",
                  color: "from-blue-500/20 to-blue-700/20",
                  borderColor: "border-blue-500/30"
                },
                {
                  icon: <TrendingUp size={32} />,
                  title: "Growth Expert",
                  description: "Helping businesses scale online",
                  color: "from-purple-500/20 to-purple-700/20",
                  borderColor: "border-purple-500/30"
                }
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`backdrop-blur-lg bg-gradient-to-br ${achievement.color} border ${achievement.borderColor} rounded-2xl p-6 text-center card-hover-effect relative overflow-hidden group`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {achievement.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                    <p className="text-white/70">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>



          {/* CTA Section */}
          <motion.section 
            className="mb-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-purple-700/20 border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Let's Work <span className="animate-gradient-text">Together</span>
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Ready to transform your digital presence? Let's create something amazing together.
                </motion.p>
                
                <motion.a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full font-semibold text-white card-hover-effect relative overflow-hidden group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Get In Touch
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  )
}

export default About
