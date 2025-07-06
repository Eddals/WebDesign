"use client"

import { useState, useEffect, useRef } from "react"
import { 
  ArrowRight, CheckCircle, Zap, Star, 
  Briefcase, Rocket, Crown, Globe, 
  Lightbulb, Layers, Target, Loader,
  Monitor, Database, FileText, Package, User, Mail, Phone,
  Calendar, Clock, Award, TrendingUp, BarChart3, 
  Sparkles, ChevronRight, Play, Quote, 
  Code, Palette, Smartphone, Search, Shield, 
  Users, MessageCircle, Heart, Eye, MousePointer,
  Cpu, Wifi, Lock, Headphones, Coffee, Laptop
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import SEO from '@/components/SEO'

const Home = () => {
  const [activeService, setActiveService] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Web Development",
      description: "Custom websites built with modern technologies",
      features: ["React/Next.js", "Responsive Design", "SEO Optimized", "Fast Loading"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Development", 
      description: "Native and cross-platform mobile applications",
      features: ["iOS & Android", "React Native", "Flutter", "App Store Ready"]
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "SEO Optimization",
      description: "Improve your search engine rankings",
      features: ["Keyword Research", "On-page SEO", "Technical SEO", "Analytics"]
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Beautiful and intuitive user interfaces",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"]
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechFlow Solutions",
      content: "The team delivered an exceptional website that exceeded our expectations. Our conversion rate increased by 40% within the first month!",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "InnovateLab",
      content: "Professional, responsive, and incredibly talented. They transformed our vision into a stunning reality. Highly recommended!",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Emily Rodriguez",
      role: "Founder",
      company: "Creative Studio",
      content: "Working with this team was a game-changer for our business. The attention to detail and user experience is outstanding.",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ]

  const stats = [
    { number: "50+", label: "Projects Completed", icon: <Briefcase className="w-6 h-6" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Heart className="w-6 h-6" /> },
    { number: "24/7", label: "Support Available", icon: <Headphones className="w-6 h-6" /> },
    { number: "3+", label: "Years Experience", icon: <Award className="w-6 h-6" /> }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <SEO 
        title="Professional Web Development Services"
        description="Transform your digital presence with custom web development, mobile apps, and SEO optimization. Get a free consultation today!"
        keywords={['web development', 'mobile apps', 'SEO', 'UI/UX design', 'custom websites']}
        ogUrl="https://matheusdev.net"
      />
      <div className="min-h-screen bg-[#030718] overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
          <motion.div 
            style={{ y, opacity }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome to the Future of Web Development
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Transform Your
                <span className="block text-purple-400">Digital Presence</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                We create stunning, high-performance websites and applications that drive results and exceed expectations.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.a
                  href="/estimate"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Free Estimate
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
                  href="/contact"
                  className="px-8 py-3 border border-white/20 hover:border-white/40 rounded-full font-semibold text-white hover:bg-white/5 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Floating elements */}
          <motion.div 
            className="absolute top-1/4 left-10 text-purple-400/30"
            animate={{ y: [0, -20], rotate: [0, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code size={40} />
          </motion.div>
          <motion.div 
            className="absolute bottom-1/4 right-10 text-purple-400/30"
            animate={{ y: [0, -15], rotate: [0, -10] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Rocket size={35} />
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Services
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                What We Do Best
              </motion.h2>
              
              <motion.p 
                className="text-white/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                From concept to deployment, we provide comprehensive digital solutions
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeService === index 
                      ? 'bg-purple-500/10 border-purple-500/50' 
                      : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveService(index)}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      activeService === index ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/70'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {service.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-white/70 mb-4">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex}
                        className="flex items-center gap-2 text-sm text-white/60"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Testimonial Section */}
        <section className="container mx-auto px-4 py-24 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 to-purple-900/10 opacity-50"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-10"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Client Success Story
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                See What Our Clients Say
              </motion.h2>
              
              <motion.p 
                className="text-white/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Real testimonials from real clients who've experienced the transformation
              </motion.p>
            </motion.div>

            {/* Video Testimonial */}
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm border border-white/10 p-8">
                {/* Video placeholder - replace with actual video */}
                <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30"></div>
                  
                  <motion.div 
                    className="relative z-10 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-white/90 font-medium">Watch Client Testimonial</p>
                    <p className="text-white/60 text-sm mt-1">See how we transformed their business</p>
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-12 h-12 border border-white/10 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border border-white/10 rounded-full"></div>
                </div>
                
                {/* Testimonial text */}
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <blockquote className="text-lg text-white/90 mb-4 italic">
                    "Working with this team was incredible. They delivered exactly what we needed and exceeded our expectations. Our website now converts 3x better than before!"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      JS
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">John Smith</p>
                      <p className="text-white/60 text-sm">CEO, TechStart Inc.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="container mx-auto px-4 py-16 relative">
          {/* Background elements for testimonials section */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 to-purple-900/10 opacity-50"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-24 h-24 border border-purple-500/20 rounded-full animate-spin-slow opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 border border-purple-500/20 rounded-full animate-spin-slow opacity-30" style={{ animationDuration: "15s" }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Client Reviews
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                What Our Clients Say
              </motion.h2>
              
              <motion.p 
                className="text-white/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Don't just take our word for it - hear from our satisfied clients
              </motion.p>
            </motion.div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Marketing Director",
                  company: "TechFlow Solutions",
                  content: "The team delivered an exceptional website that exceeded our expectations. Our conversion rate increased by 40% within the first month!",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "CEO",
                  company: "InnovateLab",
                  content: "Professional, responsive, and incredibly talented. They transformed our vision into a stunning reality. Highly recommended!",
                  rating: 5
                },
                {
                  name: "Emily Rodriguez",
                  role: "Founder",
                  company: "Creative Studio",
                  content: "Working with this team was a game-changer for our business. The attention to detail and user experience is outstanding.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <blockquote className="text-white/90 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-white/60 text-xs">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500/20 to-purple-700/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 text-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Background animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-2xl"
                animate={{ 
                  background: [
                    "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.05) 0%, rgba(99, 102, 241, 0.025) 50%, rgba(0, 0, 0, 0) 100%)",
                    "radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.05) 0%, rgba(99, 102, 241, 0.025) 50%, rgba(0, 0, 0, 0) 100%)",
                    "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.05) 0%, rgba(99, 102, 241, 0.025) 50%, rgba(0, 0, 0, 0) 100%)"
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              
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
                  href="/estimate"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 
                    hover:from-purple-700 hover:to-purple-900 rounded-full font-semibold 
                    text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 
                    transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Free Estimate
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
                  href="/contact"
                  className="px-8 py-3 border border-white/20 hover:border-white/40 
                    rounded-full font-semibold text-white hover:bg-white/5 
                    transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">Contact Us</span>
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

export default Home;