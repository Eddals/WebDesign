"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Globe, ShoppingBag, Code2, Paintbrush, Search, 
  Zap, Layers, Database, Smartphone, Palette, Gauge, 
  Heart, Monitor, FileText, Package, User, Mail, 
  Target, Loader, ArrowRight, CheckCircle, Star, 
  Briefcase, Rocket, Crown, Code, Laptop, Sparkles, 
  Lightbulb, Cpu, MessageSquare, Clock, Calendar, X,
  ChevronDown, TrendingUp, Award, Settings, Cloud, Shield
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import SEO from '@/components/SEO'
import ServicesGraphic from '@/components/ServicesGraphic'

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("websites")
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isInView, setIsInView] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInView(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const serviceCategories = [
    {
      id: "websites",
      title: "Website Development",
      icon: <Globe size={24} />,
      description: "Custom websites that represent your brand and drive business growth with modern design and functionality.",
      features: [
        "Custom responsive design",
        "Content management system",
        "SEO optimization",
        "Performance optimization",
        "Mobile-first approach",
        "Cross-browser compatibility",
        "Analytics integration",
        "Security implementation"
      ]
    },
    {
      id: "ecommerce",
      title: "E-Commerce Solutions",
      icon: <ShoppingBag size={24} />,
      description: "Complete online stores with secure payment processing, inventory management, and conversion optimization.",
      features: [
        "Product catalog management",
        "Secure payment gateways",
        "Inventory tracking",
        "Order management system",
        "Customer accounts",
        "Shopping cart optimization",
        "Multi-currency support",
        "Sales analytics"
      ]
    },
    {
      id: "apps",
      title: "Web Applications",
      icon: <Code2 size={24} />,
      description: "Custom web applications that solve complex business problems with scalable and secure solutions.",
      features: [
        "User authentication",
        "Database integration",
        "API development",
        "Real-time updates",
        "Cloud deployment",
        "Scalable architecture",
        "Security protocols",
        "Performance monitoring"
      ]
    },
    {
      id: "marketing",
      title: "Digital Marketing",
      icon: <Search size={24} />,
      description: "Comprehensive digital marketing strategies to increase visibility, drive traffic, and boost conversions.",
      features: [
        "SEO optimization",
        "Content strategy",
        "Social media integration",
        "Email marketing setup",
        "Analytics tracking",
        "Conversion optimization",
        "Local SEO",
        "Performance reporting"
      ]
    },
    {
      id: "optimization",
      title: "Performance & Optimization",
      icon: <Zap size={24} />,
      description: "Speed up your website and improve user experience with advanced optimization techniques.",
      features: [
        "Core Web Vitals optimization",
        "Image optimization",
        "Code splitting",
        "Caching strategies",
        "CDN implementation",
        "Database optimization",
        "Server-side optimization",
        "Mobile performance"
      ]
    },
    {
      id: "maintenance",
      title: "Maintenance & Support",
      icon: <Settings size={24} />,
      description: "Ongoing website maintenance, updates, and technical support to keep your site running smoothly.",
      features: [
        "Regular updates",
        "Security monitoring",
        "Backup management",
        "Bug fixes",
        "Performance monitoring",
        "Content updates",
        "Technical support",
        "Emergency assistance"
      ]
    }
  ]

  const services = [
    {
      icon: <Globe size={32} />,
      title: "Business Websites",
      description: "Professional websites that represent your brand and drive growth.",
      features: ["Custom Design", "Mobile Responsive", "SEO Optimization", "Content Management"],
      category: "websites",
      details: {
        description: "A professionally designed business website is the cornerstone of your online presence. I create custom websites that perfectly represent your brand, are optimized for all devices, and designed to convert visitors into customers.",
        process: [
          "Discovery and planning session to understand your business goals",
          "Custom design mockups tailored to your brand identity",
          "Responsive development for all devices and screen sizes",
          "SEO optimization to improve search engine visibility",
          "Content management system implementation for easy updates"
        ],
        technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Headless CMS"],
        timeline: "2-4 weeks",
        pricing: "Starting at $1,200 • Unlimited revisions included"
      }
    },
    {
      icon: <Code2 size={32} />,
      title: "Landing Pages",
      description: "High-converting landing pages that turn visitors into customers.",
      features: ["A/B Testing", "Lead Generation", "Analytics Integration", "Fast Loading"],
      category: "websites",
      details: {
        description: "Landing pages are focused on a single objective - converting visitors into leads or customers. I design and develop high-converting landing pages that are optimized for your specific marketing campaigns and business goals.",
        process: [
          "Analysis of your target audience and campaign objectives",
          "Conversion-focused design with clear call-to-actions",
          "A/B testing setup to optimize conversion rates",
          "Analytics integration to track performance",
          "Fast loading times for better user experience and SEO"
        ],
        technologies: ["React", "Next.js", "Tailwind CSS", "Google Analytics", "Hotjar"],
        timeline: "1-2 weeks",
        pricing: "Starting at $800 • Unlimited revisions included"
      }
    },
    {
      icon: <ShoppingBag size={32} />,
      title: "E-Commerce Stores",
      description: "Full-featured online stores that drive sales and growth.",
      features: ["Product Management", "Secure Checkout", "Inventory System", "Payment Integration"],
      category: "ecommerce",
      details: {
        description: "Transform your business with a custom e-commerce solution that provides a seamless shopping experience. I build online stores that are easy to manage, secure, and designed to maximize sales and customer satisfaction.",
        process: [
          "E-commerce strategy and planning session",
          "Custom store design aligned with your brand",
          "Product catalog and inventory management setup",
          "Secure payment gateway integration",
          "Order management and fulfillment system implementation"
        ],
        technologies: ["Next.js Commerce", "Shopify", "WooCommerce", "Stripe", "PayPal"],
        timeline: "4-8 weeks",
        pricing: "Starting at $2,500 • Unlimited revisions included"
      }
    },
    {
      icon: <Paintbrush size={32} />,
      title: "Website Redesign",
      description: "Transform your existing website into a modern masterpiece.",
      features: ["Modern Design", "Performance Boost", "UX Improvement", "Brand Alignment"],
      category: "websites",
      details: {
        description: "Breathe new life into your outdated website with a complete redesign. I'll transform your existing site into a modern, high-performing website that better represents your brand and improves user experience.",
        process: [
          "Audit of your current website to identify improvement areas",
          "New design concepts that align with current web standards",
          "Performance optimization for faster loading times",
          "User experience improvements for better engagement",
          "Content migration and restructuring for better organization"
        ],
        technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Performance Optimization Tools"],
        timeline: "3-6 weeks",
        pricing: "Starting at $1,800 • Unlimited revisions included"
      }
    },
    {
      icon: <Search size={32} />,
      title: "SEO Optimization",
      description: "Improve your search rankings and drive organic traffic.",
      features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Performance Optimization"],
      category: "marketing",
      details: {
        description: "Improve your website's visibility in search engines and drive more organic traffic. My comprehensive SEO services include technical optimization, content strategy, and ongoing performance monitoring.",
        process: [
          "Comprehensive SEO audit of your current website",
          "Keyword research and competitive analysis",
          "On-page SEO optimization for target keywords",
          "Technical SEO improvements for better crawlability",
          "Regular performance tracking and strategy adjustments"
        ],
        technologies: ["Google Search Console", "SEMrush", "Ahrefs", "Google Analytics", "Lighthouse"],
        timeline: "Ongoing (minimum 3 months recommended)",
        pricing: "Starting at $800/month • Unlimited revisions included"
      }
    },
    {
      icon: <Smartphone size={32} />,
      title: "Mobile Applications",
      description: "Native and cross-platform mobile apps for iOS and Android.",
      features: ["Cross-Platform", "Native Performance", "Offline Capability", "Push Notifications"],
      category: "apps",
      details: {
        description: "Extend your digital presence with custom mobile applications that provide a seamless experience on iOS and Android devices. I develop high-performance apps that engage users and drive business growth.",
        process: [
          "Mobile app strategy and requirements gathering",
          "UI/UX design tailored for mobile interfaces",
          "Development using cross-platform or native technologies",
          "Integration with device features (camera, GPS, etc.)",
          "Testing across multiple devices and app store submission"
        ],
        technologies: ["React Native", "Flutter", "Firebase", "Native APIs", "App Store Optimization"],
        timeline: "8-12 weeks",
        pricing: "Starting at $5,000 • Unlimited revisions included"
      }
    },
    {
      icon: <Database size={32} />,
      title: "Web Applications",
      description: "Custom web applications that solve complex business problems.",
      features: ["User Authentication", "Database Integration", "API Development", "Real-time Updates"],
      category: "apps",
      details: {
        description: "Custom web applications tailored to your specific business needs. I develop scalable, secure, and user-friendly applications that automate processes, manage data, and improve operational efficiency.",
        process: [
          "Business process analysis and requirements gathering",
          "System architecture and database design",
          "User interface design focused on usability",
          "Secure development with authentication and authorization",
          "Testing, deployment, and maintenance planning"
        ],
        technologies: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase"],
        timeline: "8-16 weeks",
        pricing: "Starting at $6,000 • Unlimited revisions included"
      }
    },
    {
      icon: <Gauge size={32} />,
      title: "Performance Optimization",
      description: "Speed up your website for better user experience and SEO.",
      features: ["Core Web Vitals", "Image Optimization", "Code Splitting", "Caching Strategies"],
      category: "optimization",
      details: {
        description: "Improve your website's loading speed and overall performance. Fast websites provide better user experience, higher conversion rates, and improved search engine rankings.",
        process: [
          "Performance audit to identify bottlenecks",
          "Core Web Vitals optimization",
          "Asset optimization (images, scripts, styles)",
          "Implementation of modern caching strategies",
          "Server-side optimizations and CDN configuration"
        ],
        technologies: ["Lighthouse", "WebPageTest", "Webpack", "Next.js", "Vercel", "Cloudflare"],
        timeline: "1-3 weeks",
        pricing: "Starting at $1,200 • Unlimited revisions included"
      }
    },
  ]

  const categories = [
    { id: "websites", label: "Websites" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "apps", label: "Applications" },
    { id: "marketing", label: "Marketing" },
    { id: "optimization", label: "Optimization" },
    { id: "maintenance", label: "Maintenance" }
  ]

  const faqs = [
    {
      question: "What's included in your web development services?",
      answer: "My web development services include custom design, responsive development, SEO optimization, content management system setup, performance optimization, and ongoing support. Each project is tailored to your specific needs and business goals."
    },
    {
      question: "How long does it take to build a website?",
      answer: "Timeline varies based on project complexity. A basic business website typically takes 2-4 weeks, while complex e-commerce sites or web applications can take 6-12 weeks. I provide detailed timelines during the planning phase."
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer: "Yes, I offer comprehensive maintenance packages including regular updates, security monitoring, backup management, performance optimization, and technical support to keep your website running smoothly."
    },
    {
      question: "Can you help with SEO and digital marketing?",
      answer: "Absolutely! I provide comprehensive SEO services including keyword research, on-page optimization, technical SEO, content strategy, and performance tracking. I also offer digital marketing services to help grow your online presence."
    },
    {
      question: "What technologies do you use for development?",
      answer: "I use modern technologies including React, Next.js, Node.js, TypeScript, Tailwind CSS, and various databases. I choose the best technology stack based on your project requirements and long-term goals."
    },
    {
      question: "Do you work with existing websites or only build new ones?",
      answer: "I work with both! I can redesign and optimize existing websites, migrate to modern platforms, add new features, or build completely new websites from scratch. I'll assess your current site and recommend the best approach."
    }
  ]

  const filteredServices = services.filter(service => service.category === activeCategory)

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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
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
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
      50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
    }
    
    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(4); opacity: 0; }
    }
    
    .btn-shimmer {
      position: relative;
      overflow: hidden;
    }
    
    .btn-shimmer::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shimmer 2s infinite;
    }
    
    .btn-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    
    .btn-ripple {
      position: relative;
      overflow: hidden;
    }
    
    .btn-ripple::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 2s infinite;
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
    
    @keyframes slideIn {
      0% { transform: translateX(-100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0, -30px, 0); }
      70% { transform: translate3d(0, -15px, 0); }
      90% { transform: translate3d(0, -4px, 0); }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-pulse-glow {
      animation: pulse 2s infinite;
    }
    
    .animate-gradient-text {
      background: linear-gradient(90deg, #a855f7, #6366f1, #a855f7);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradientFlow 6s linear infinite;
    }
    
    .animate-shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
      background-size: 200% 100%;
      animation: shimmer 3s infinite;
    }
    
    .animate-bounce-custom {
      animation: bounce 2s infinite;
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
    
    .service-card {
      position: relative;
      overflow: hidden;
    }
    
    .service-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent);
      transition: left 0.5s;
    }
    
    .service-card:hover::before {
      left: 100%;
    }
  `;

  return (
    <>
      <SEO
        title="Professional Web Development Services - DevTone"
        description="DevTone offers comprehensive web development services including custom websites, e-commerce solutions, web applications, SEO optimization, and digital marketing. Transform your online presence with our expert team."
        keywords={['web development services', 'custom websites', 'e-commerce development', 'web applications', 'SEO services', 'digital marketing', 'DevTone services', 'professional web design']}
        ogUrl="https://devtone.com/services"
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718] overflow-hidden">
        {/* Add the custom styles */}
        <style >{customStyles}</style>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ci8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          className="relative pt-12 pb-24 overflow-hidden"
          style={{ opacity, scale }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">Professional Services</span>
                  <motion.div 
                    className="absolute inset-0 bg-purple-500/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                    Web Development Services That <span className="animate-gradient-text">Drive Results</span>
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-white/80 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  From custom websites to complex web applications, I deliver comprehensive solutions that help your business thrive in the digital world.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.a
                    href="/contact"
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full font-semibold flex items-center justify-center gap-2 transition-all text-white btn-shimmer btn-pulse-glow relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(168, 85, 247, 0.3)",
                        "0 0 30px rgba(168, 85, 247, 0.6)",
                        "0 0 20px rgba(168, 85, 247, 0.3)"
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <span className="relative z-10">Start Your Project</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10"
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.a>
                  
                  <motion.a
                    href="#services"
                    className="px-8 py-4 border border-white/20 hover:bg-white/5 rounded-full font-semibold transition-all text-white flex items-center justify-center gap-2 btn-ripple relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{ 
                      borderColor: [
                        "rgba(255, 255, 255, 0.2)",
                        "rgba(168, 85, 247, 0.5)",
                        "rgba(255, 255, 255, 0.2)"
                      ]
                    }}
                    transition={{ 
                      borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <span className="relative z-10">Explore Services</span>
                    <motion.div
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.a>
                </motion.div>
                
                <motion.div 
                  className="mt-12 grid grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {[
                    { label: "Projects Completed", value: "100+" },
                    { label: "Client Satisfaction", value: "99%" },
                    { label: "Years Experience", value: "5+" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{stat.value}</div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
              
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-30 animate-pulse-glow"></div>
                <div className="relative bg-[#0a0e24] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <ServicesGraphic />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Floating elements */}
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
              <Globe size={40} />
            </motion.div>
            <motion.div 
              className="absolute bottom-[30%] left-[20%] text-purple-400/30"
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <ShoppingBag size={28} />
            </motion.div>
            <motion.div 
              className="absolute top-[40%] right-[8%] text-purple-400/30"
              animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <Rocket size={36} />
            </motion.div>
          </div>
        </motion.section>

        {/* Services Section */}
        <section id="services" className="py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Comprehensive Solutions</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">My Development Services</h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                Tailored solutions to bring your digital vision to life with modern technologies and best practices
              </p>
              
              {/* Service Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                      activeCategory === category.id
                        ? "bg-purple-500/20 text-white border-2 border-purple-500/50"
                        : "bg-white/5 text-white/70 border-2 border-white/10 hover:border-purple-500/30"
                    }`}
                  >
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Service Details */}
            <AnimatePresence mode="wait">
              {serviceCategories.map((service) => (
                activeCategory === service.id && (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                          {service.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      </div>
                      
                      <p className="text-white/80 text-lg mb-8">{service.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={18} />
                            <span className="text-white/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <motion.a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full text-white font-medium transition-all btn-shimmer relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{ 
                          boxShadow: [
                            "0 4px 15px rgba(168, 85, 247, 0.2)",
                            "0 6px 20px rgba(168, 85, 247, 0.4)",
                            "0 4px 15px rgba(168, 85, 247, 0.2)"
                          ]
                        }}
                        transition={{ 
                          boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <span className="relative z-10">Get Started with {service.title}</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                          className="relative z-10"
                        >
                          <ArrowRight size={18} />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.a>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                      <div className="relative bg-[#0a0e24] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h4 className="text-xl font-semibold text-white mb-6">How {service.title} Works</h4>
                        
                        <div className="space-y-6">
                          {[
                            { 
                              title: "Discovery", 
                              description: "We start by understanding your requirements, goals, and target audience to create the perfect solution." 
                            },
                            { 
                              title: "Planning", 
                              description: "Detailed project planning with timelines, milestones, and technical specifications." 
                            },
                            { 
                              title: "Development", 
                              description: "Building your solution using modern technologies and industry best practices." 
                            },
                            { 
                              title: "Launch & Support", 
                              description: "Deployment, testing, and ongoing support to ensure everything runs smoothly." 
                            }
                          ].map((step, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              <div>
                                <h5 className="text-white font-medium mb-1">{step.title}</h5>
                                <p className="text-white/70 text-sm">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-gradient-to-b from-[#030718] to-[#0a0e24]">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Development Process</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">How I Work</h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                A proven methodology that ensures quality results and client satisfaction
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 to-purple-700/50 hidden lg:block"></div>
              
              <div className="space-y-24 relative">
                {[
                  {
                    title: "Discovery & Planning",
                    description: "Understanding your business goals, target audience, and project requirements to create a comprehensive strategy.",
                    icon: <Target size={24} />,
                    details: [
                      "Requirements gathering",
                      "Market research",
                      "Technical planning",
                      "Timeline creation",
                      "Budget estimation"
                    ]
                  },
                  {
                    title: "Design & Prototyping",
                    description: "Creating wireframes, mockups, and prototypes to visualize the final product before development begins.",
                    icon: <Palette size={24} />,
                    details: [
                      "User experience design",
                      "Visual design",
                      "Interactive prototypes",
                      "Design system creation",
                      "Client feedback integration"
                    ]
                  },
                  {
                    title: "Development & Testing",
                    description: "Building your solution using modern technologies with continuous testing to ensure quality and performance.",
                    icon: <Code size={24} />,
                    details: [
                      "Clean code development",
                      "Responsive implementation",
                      "Performance optimization",
                      "Security implementation",
                      "Quality assurance testing"
                    ]
                  },
                  {
                    title: "Launch & Optimization",
                    description: "Deploying your project and providing ongoing support, monitoring, and optimization for continued success.",
                    icon: <Rocket size={24} />,
                    details: [
                      "Production deployment",
                      "Performance monitoring",
                      "User feedback analysis",
                      "Continuous optimization",
                      "Ongoing support"
                    ]
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {/* Process step dot */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center z-10 border-2 border-purple-500/50 hidden lg:flex animate-pulse-glow">
                      <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                    </div>
                    
                    <div className={`backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8 card-hover-effect ${index % 2 === 0 ? 'lg:mr-12' : 'lg:order-2 lg:ml-12'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          {step.icon}
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-purple-400">0{index + 1}</div>
                          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-white/70 mb-6">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-white/80">
                            <CheckCircle className="text-purple-400 flex-shrink-0" size={16} />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Empty div for layout in grid */}
                    <div className={index % 2 === 0 ? 'lg:order-2' : ''}></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-to-b from-[#0a0e24] to-[#030718]">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10">Common Questions</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                Get answers to common questions about my services and development process
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-white">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 ml-4 text-purple-400"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-purple-700/20 border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-700 rounded-full opacity-20 blur-3xl"></div>
              </div>
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Ready to Start Your Project?
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Let's bring your digital vision to life with professional development services.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.a
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full font-semibold flex items-center justify-center gap-2 transition-all text-white btn-shimmer btn-pulse-glow relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 25px rgba(168, 85, 247, 0.4)",
                      "0 0 35px rgba(168, 85, 247, 0.7)",
                      "0 0 25px rgba(168, 85, 247, 0.4)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <span className="relative z-10">Start Your Project</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.a>
                
                <motion.a
                  href="/estimate"
                  className="px-8 py-4 border border-white/20 hover:bg-white/5 rounded-full font-semibold transition-all text-white btn-ripple relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ 
                    borderColor: [
                      "rgba(255, 255, 255, 0.2)",
                      "rgba(168, 85, 247, 0.6)",
                      "rgba(255, 255, 255, 0.2)"
                    ]
                  }}
                  transition={{ 
                    borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <span className="relative z-10">Get Free Estimate</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Services
