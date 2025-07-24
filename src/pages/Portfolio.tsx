"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ExternalLink, Eye, Code, Palette, Smartphone, Globe, Star, ArrowRight, Building, Scissors, Sparkles, Phone, Camera } from "lucide-react"
import SEO from '@/components/SEO'

const portfolioProjects = [
  {
    id: 1,
    title: "Gold Estate",
    description: "Elegant and sophisticated website for a luxury real estate company. Modern design focused on presenting exclusive properties in an impactful way.",
    image: "https://i.postimg.cc/9M0ZYQ7x/1.png",
    icon: <Building className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Naisha Beauty Salon",
    description: "Modern and elegant website for a premium beauty salon. Focus on user experience with sophisticated design and harmonious colors.",
    image: "https://i.postimg.cc/zBQWtYwq/2.png",
    icon: <Scissors className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 3,
    title: "SweepEase LLC",
    description: "Professional website for residential and commercial cleaning company. Clean and reliable design that conveys professionalism and efficiency.",
    image: "https://i.ibb.co/ks8f7p9v/C-pia-de-C-pia-de-C-pia-de-Black-and-Yellow-Photo-Modern-Business-Instagram-Post.png",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "JmStudio",
    description: "Professional photography agency website showcasing stunning visual content. Modern design that highlights artistic excellence and creative vision.",
    image: "https://i.postimg.cc/WpyY0ZgJ/C-pia-de-C-pia-de-C-pia-de-Black-and-Yellow-Photo-Modern-Business-Instagram-Post-1.png",
    icon: <Camera className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 5,
    title: "StrategyPro",
    description: "Professional consulting agency website for the Brazilian market. Modern design focused on business strategy and corporate consulting services with a sophisticated and trustworthy presentation.",
    image: "https://i.postimg.cc/7ZCMnt13/C-pia-de-C-pia-de-C-pia-de-Black-and-Yellow-Photo-Modern-Business-Instagram-Post-2.png",
    icon: <Palette className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 6,
    title: "Build with John",
    description: "Professional construction and building services website. Modern design showcasing construction projects and building expertise with a reliable and professional presentation.",
    image: "https://i.postimg.cc/KYGwdR3m/C-pia-de-C-pia-de-C-pia-de-Black-and-Yellow-Photo-Modern-Business-Instagram-Post-3.png",
    icon: <Building className="w-6 h-6" />,
    color: "from-orange-500 to-red-500"
  }
]

const Portfolio = () => {
  const [isMobile, setIsMobile] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  // Detect mobile devices to optimize animations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Custom styles
  const customStyles = `
    .animate-gradient-text {
      background-image: linear-gradient(to right, #a855f7, #ec4899, #a855f7);
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: gradientText 3s linear infinite;
    }
    
    @keyframes gradientText {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    
    .card-hover-effect {
      transition: all 0.3s ease;
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
      <style>{customStyles}</style>
      <SEO 
        title="Portfolio - Our Latest Projects | DevTone"
        description="Explore our portfolio of creative and professional web projects. Modern websites for various industries and businesses."
        keywords={["portfolio", "web design", "websites", "latest projects", "web development"]}
      />
      
      <div className="min-h-screen pt-24 bg-[#030718] overflow-hidden">
        {/* Add the custom styles */}
        <style>{customStyles}</style>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative pt-12 pb-16 overflow-hidden"
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
                className="inline-block px-6 py-2 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Our Portfolio</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Latest{" "}
                <span className="text-white">Projects</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Explore our collection of creative and professional projects. Each website is a unique experience that combines modern design with exceptional functionality.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* Portfolio Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {portfolioProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 card-hover-effect"
                >
                  {/* Project Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-900/20 via-[#030718] to-purple-900/20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">Ready to Start?</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Ready to Transform Your Vision?
              </motion.h2>
              
              <motion.p 
                className="text-white/80 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Let's work together to create something amazing. Get started with a free consultation and see how we can bring your ideas to life.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.a
                  href="/services"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 
                    hover:from-purple-700 hover:to-purple-900 rounded-full font-semibold 
                    text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 
                    transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    View Our Services
                    <ArrowRight className="w-5 h-5" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
                
                <motion.a
                  href="/about"
                  className="px-8 py-3 border border-white/20 hover:border-white/40 
                    rounded-full font-semibold text-white hover:bg-white/5 
                    transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">Learn About Us</span>
                  <motion.div 
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Portfolio 