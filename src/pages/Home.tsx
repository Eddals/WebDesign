"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowRight, ExternalLink, CheckCircle, ChevronRight, Zap, Star,
  Briefcase, Rocket, Crown, Code, Laptop, Globe, Sparkles,
  Lightbulb, Cpu, Layers, Smartphone, Palette, Gauge, Heart,
  Monitor, Database, FileText, Package, User, Mail, Phone,
  Target, Loader, Shield, Building, MapPin, Users, ShoppingCart,
  LineChart, BarChart, MessageCircle, Eye
} from "lucide-react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import SEO from '@/components/SEO'
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Quote, PackageType } from '../types/quotes';
import { PostgrestError } from '@supabase/supabase-js';
import BrevoChatWidget from '@/components/BrevoChatWidget';
import NewsletterPopup from '@/components/NewsletterPopup';

// Enhanced custom CSS for animations
const customStyles = `
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
    100% { opacity: 0.5; transform: scale(1); }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }
  
  @keyframes blink {
    50% { border-color: transparent }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-slow {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-float-fast {
    animation: float 4s ease-in-out infinite;
  }
  
  .animate-spin-slow {
    animation: spin 12s linear infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce 3s ease-in-out infinite;
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
  }
  
  .animate-gradient {
    background: linear-gradient(90deg, #a855f7, #6366f1, #a855f7);
    background-size: 200% 200%;
    animation: gradientFlow 6s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
  }
  
  .animate-typing {
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid #a855f7;
    animation: 
      typing 3.5s steps(40, end),
      blink .75s step-end infinite;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s forwards;
  }
  
  .animate-fade-in-delay-1 {
    animation: fadeIn 0.5s 0.1s forwards;
    opacity: 0;
  }
  
  .animate-fade-in-delay-2 {
    animation: fadeIn 0.5s 0.2s forwards;
    opacity: 0;
  }
  
  .animate-fade-in-delay-3 {
    animation: fadeIn 0.5s 0.3s forwards;
    opacity: 0;
  }
  
  .animate-fade-in-delay-4 {
    animation: fadeIn 0.5s 0.4s forwards;
    opacity: 0;
  }
  
  .animate-fade-in-delay-5 {
    animation: fadeIn 0.5s 0.5s forwards;
    opacity: 0;
  }
  
  .text-glow {
    text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
  }
  
  .box-glow {
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.3);
  }
  
  .gradient-text {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-image: linear-gradient(90deg, #a855f7, #6366f1);
  }
`;

const Home = () => {
  const [selectedPlan, setSelectedPlan] = useState<PackageType | null>("Standard");
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("packages"); // Start with packages tab
  const [animateStats, setAnimateStats] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation trigger on component mount
  useEffect(() => {
    // Small delay to ensure animation is visible after page load
    const timer = setTimeout(() => {
      setAnimateStats(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const planDetails = {
    Basic: {
      icon: <Briefcase className="w-6 h-6 text-purple-400" />,
      title: "Basic Package",
      description: "Includes a custom 2-page website with responsive design.",
      price: "$120",
      details: [
        "2 Pages",
        "Responsive Design",
        "Content Upload",
        "Plugins/Extensions Installation",
        "3 Revisions",
        "3 Days Delivery",
      ],
    },
    Standard: {
      icon: <Rocket className="w-6 h-6 text-purple-400" />,
      title: "Standard Package",
      description: "Includes up to 5 custom pages, mobile-friendly design, SEO setup, etc.",
      price: "$300",
      details: [
        "Up to 5 Pages",
        "SEO Setup",
        "Responsive Design",
        "Content Upload",
        "Plugins/Extensions Installation",
        "3 Revisions",
        "5 Days Delivery",
        "Speed Optimization",
      ],
    },
    Premium: {
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      title: "Premium Package",
      description: "Includes up to 10 pages, animations, SEO and speed optimization, e-commerce functionality.",
      price: "$650",
      details: [
        "Up to 10 Pages",
        "E-commerce Functionality",
        "Payment Integration",
        "Opt-in Form",
        "Autoresponder Integration",
        "Animations",
        "SEO & Speed Optimization",
        "10 Revisions",
        "7 Days Delivery",
        "Social Media Icons",
      ],
    },
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!selectedPlan) {
      setError('Please select a package first');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      
      const quoteData = {
        full_name: formData.get('full_name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || null,
        business_name: formData.get('business_name') as string || null,
        website_goal: formData.get('website_goal') as string || null,
        selected_package: selectedPlan,
        status: 'pending'
      };

      // Log the data being sent
      console.log('Submitting quote:', quoteData);

      if (!isSupabaseConfigured) {
        // Simulate successful submission when Supabase is not configured
        console.warn('Supabase not configured - simulating successful submission');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      } else {
        const { error: supabaseError } = await supabase
          .from('quotes')
          .insert(quoteData);

        if (supabaseError) {
          console.error('Supabase Error:', supabaseError);
          throw new Error(supabaseError.message);
        }
      }

      setFormSubmitted(true);
      e.currentTarget.reset();
      setSelectedPlan(null);
      
    } catch (err) {
      console.error('Submission Error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to submit form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoPlayPause = (videoElement: HTMLVideoElement) => {
    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  // Stats data with colors matching the page theme and animation delays
  const statsData = [
    {
      value: "100+",
      label: "Projects Completed",
      barColor: "from-[#0a0e24] to-purple-900",
      textColor: "text-purple-300",
      animDelay: "delay-0",
      barWidth: "100%"
    },
    {
      value: "98%",
      label: "Client Satisfaction",
      barColor: "from-[#0a0e24] to-purple-800",
      textColor: "text-purple-300",
      animDelay: "delay-200",
      barWidth: "98%"
    },
    {
      value: "5",
      label: "Years Experience",
      barColor: "from-[#0a0e24] to-purple-900",
      textColor: "text-purple-300",
      animDelay: "delay-400",
      barWidth: "50%"
    },
    {
      value: "24/7",
      label: "Support",
      barColor: "from-[#0a0e24] to-purple-800",
      textColor: "text-purple-300",
      animDelay: "delay-600",
      barWidth: "100%"
    }
  ]

  return (
    <>
      <SEO
        title="Unlock Web Development & SEO Services with Devtone Agency"
        description="Unlock online success with Devtone Agency's cutting-edge web development & SEO services. Elevate your brand with our web development expertise."
        keywords={['web development', 'responsive design', 'custom websites', 'e-commerce solutions', 'SEO services', 'web design agency', 'DevTone', 'business websites', 'branding agency', 'performance optimization', 'mobile-friendly websites']}
        ogUrl="https://devtone.agency"
      />
      <NewsletterPopup />
      <div className="min-h-screen bg-[#030718]">
        {/* Add the custom styles */}
        <style >{customStyles}</style>
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Enhanced Hero Section with Interactive Elements */}
        <section className="relative overflow-hidden pt-32 pb-32">
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[#030718]">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')]"></div>
              
              {/* Animated gradient orbs */}
              <motion.div 
                initial={{ x: -100, opacity: 0.2 }}
                animate={{ x: 0, opacity: 0.5 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-[100px] animate-float-slow"
              ></motion.div>
              <motion.div 
                initial={{ x: 100, opacity: 0.2 }}
                animate={{ x: 0, opacity: 0.5 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-[100px] animate-float"
                style={{ animationDelay: "2s" }}
              ></motion.div>
              <motion.div 
                initial={{ y: 100, opacity: 0.2 }}
                animate={{ y: 0, opacity: 0.5 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-800 rounded-full opacity-10 blur-[100px] animate-float-fast"
                style={{ animationDelay: "1s" }}
              ></motion.div>
            </div>
          </div>

          {/* Floating tech icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-[15%] left-[10%] text-purple-400/30"
              animate={{ y: [0, -15], rotate: [0, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
            >
              <Code size={32} />
            </motion.div>
            <motion.div 
              className="absolute top-[25%] right-[15%] text-purple-400/30"
              animate={{ y: [0, -20], rotate: [0, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1, repeatType: "reverse" }}
            >
              <Laptop size={40} />
            </motion.div>
            <motion.div 
              className="absolute bottom-[30%] left-[20%] text-purple-400/30"
              animate={{ y: [0, -10], rotate: [0, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5, repeatType: "reverse" }}
            >
              <Globe size={28} />
            </motion.div>
            <motion.div 
              className="absolute bottom-[20%] right-[25%] text-purple-400/30"
              animate={{ y: [0, -12], rotate: [0, -8] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5, repeatType: "reverse" }}
            >
              <Smartphone size={24} />
            </motion.div>
            <motion.div 
              className="absolute top-[40%] left-[25%] text-purple-400/30"
              animate={{ y: [0, -15], rotate: [0, 15] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.7, repeatType: "reverse" }}
            >
              <Palette size={30} />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">Web Design & Development</span>
                  <motion.div 
                    className="absolute inset-0 bg-purple-500/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                
                <div className="relative mb-6">
                  <motion.h1 
                    className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 text-glow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <span className="inline-block">Websites That</span>{" "}
                    <motion.div 
                      className="inline-block relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <span className="relative z-10">
                        <span className="animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500">Work</span>
                      </span>
                      <motion.div 
                        className="absolute -bottom-2 left-0 h-3 w-full bg-purple-500/30 rounded-full blur-sm"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      />
                    </motion.div>
                    <br />
                    <motion.span 
                      className="inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      Designs That{" "}
                      <motion.span 
                        className="relative inline-block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <span className="animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500">Speak</span>
                        <motion.div 
                          className="absolute -bottom-2 left-0 h-3 w-full bg-purple-500/30 rounded-full blur-sm"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.8, delay: 1 }}
                        />
                      </motion.span>
                    </motion.span>
                  </motion.h1>
                </div>
                
                <motion.p 
                  className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  We create beautiful, fast, and SEO-friendly websites powered by strategic <span className="text-purple-300">digital marketing</span> and professional <span className="text-purple-300">content creation</span>. 
                  Let's bring your ideas to life!
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="relative group">
                    <motion.button
                      onClick={() => {
                        window.location.href = "/estimate";
                      }}
                      className="group relative px-8 py-4 bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-indigo-800/90
                        rounded-xl font-semibold text-lg overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 transform translate-x-full group-hover:translate-x-[-150%] transition-transform duration-700">
                        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                      </div>
                      
                      {/* Button content */}
                      <div className="relative flex items-center justify-center">
                        <span className="text-white/90 mr-4">Get Free Estimate</span>
                        <motion.div
                          animate={{ y: [0, -4] }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        >
                          <Sparkles className="w-5 h-5 text-purple-200/90" />
                        </motion.div>
                      </div>
                    </motion.button>
                  </div>
                  
                  <div className="relative group">
                    <motion.button
                      onClick={() => window.location.href = "/contact"}
                      className="group relative px-8 py-4 bg-transparent border-2 border-purple-500/20
                        rounded-xl font-semibold text-lg overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {/* Background glow */}
                      <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 transform translate-x-full group-hover:translate-x-[-150%] transition-transform duration-700">
                        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                      </div>
                      
                      {/* Button content */}
                      <div className="relative flex items-center justify-center">
                        <span className="text-white/90 mr-4">Contact Us</span>
                        <motion.div
                          animate={{ rotate: [0, 10] }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        >
                          <Mail className="w-5 h-5 text-purple-200/90" />
                        </motion.div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Animated scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.p 
              className="text-white/50 text-sm mb-2"
              animate={{ y: [0, 5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              Scroll to explore
            </motion.p>
            <motion.div 
              className="w-6 h-10 border-2 border-purple-500/30 rounded-full flex justify-center p-1"
              animate={{ y: [0, 5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <motion.div 
                className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                animate={{ y: [0, 12] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* New Services Showcase Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-[#0a0e24] to-[#030718] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
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
                My Services
              </motion.div>
              <motion.h2 
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                What I Can Do For You
              </motion.h2>
              <motion.p 
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Comprehensive web solutions including SEO services, digital marketing strategies, and content creation tailored to your specific needs
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Service Card 1 */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-[#0a0e24] border border-white/10 rounded-2xl p-8 h-full backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors duration-300">
                    <Palette className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">Web Design & Content Creation</h3>
                  <p className="text-white/70 mb-6">
                    Stunning, responsive designs combined with professional content creation that captivates your audience and reflects your brand identity.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Responsive layouts</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>UI/UX optimization</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Brand consistency</span>
                    </li>
                  </ul>
                  <motion.div 
                    className="absolute bottom-8 right-8"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Service Card 2 */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-[#0a0e24] border border-white/10 rounded-2xl p-8 h-full backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors duration-300">
                    <Code className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">Web Development & Digital Marketing</h3>
                  <p className="text-white/70 mb-6">
                    Clean, efficient code integrated with digital marketing best practices to bring your designs to life with seamless functionality.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>React & Next.js</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Custom functionality</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>API integration</span>
                    </li>
                  </ul>
                  <motion.div 
                    className="absolute bottom-8 right-8"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Service Card 3 */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-[#0a0e24] border border-white/10 rounded-2xl p-8 h-full backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors duration-300">
                    <Gauge className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">SEO Services & Optimization</h3>
                  <p className="text-white/70 mb-6">
                    Professional SEO services and strategic optimization to improve your visibility and drive organic traffic to your website.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Keyword research</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>On-page optimization</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Performance tuning</span>
                    </li>
                  </ul>
                  <motion.div 
                    className="absolute bottom-8 right-8"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* View All Services Button */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button 
                className="px-8 py-3 border border-purple-500/30 hover:border-purple-500/50 
                  bg-purple-500/10 hover:bg-purple-500/20 rounded-full font-medium 
                  flex items-center justify-center gap-2 transition-all text-white mx-auto backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Services
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 border border-purple-500/20 rounded-full animate-spin-slow opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border border-purple-500/20 rounded-full animate-spin-slow opacity-30" style={{ animationDuration: "15s" }}></div>
        </section>

        {/* Enhanced Stats Section with Advanced Animations */}
        <section className="py-24 relative overflow-hidden">
          {/* Background with mesh gradient and noise texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-purple-950/10 to-[#030718] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImhzbCgyNzEsIDkxJSwgNjUlLCAwLjEpIi8+PC9zdmc+Cg==')] opacity-20"></div>
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-1/4 left-10 w-64 h-64 bg-purple-600/10 rounded-full filter blur-[80px]"
            animate={{ 
              scale: [1, 1.2],
              opacity: [0.1, 0.2]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[100px]"
            animate={{ 
              scale: [1.2, 1],
              opacity: [0.15, 0.25]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          ></motion.div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating particles */}
            <motion.div 
              className="absolute top-[20%] left-[15%] w-2 h-2 bg-purple-400/30 rounded-full"
              animate={{ y: [0, -30], opacity: [0.3, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
            ></motion.div>
            <motion.div 
              className="absolute top-[30%] right-[25%] w-3 h-3 bg-purple-400/30 rounded-full"
              animate={{ y: [0, -40], opacity: [0.3, 0.7] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1, repeatType: "reverse" }}
            ></motion.div>
            <motion.div 
              className="absolute bottom-[40%] left-[30%] w-2 h-2 bg-purple-400/30 rounded-full"
              animate={{ y: [0, -25], opacity: [0.3, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5, repeatType: "reverse" }}
            ></motion.div>
            <motion.div 
              className="absolute bottom-[25%] right-[20%] w-2 h-2 bg-purple-400/30 rounded-full"
              animate={{ y: [0, -35], opacity: [0.3, 0.6] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5, repeatType: "reverse" }}
            ></motion.div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Stats Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">By The Numbers</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 text-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Proven Track Record
              </motion.h2>
              
              <motion.p 
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Delivering exceptional results for clients across various industries
              </motion.p>
            </motion.div>
            
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {statsData.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75"
                    animate={{ 
                      opacity: [0.25, 0.5],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  ></motion.div>
                  
                  <div className="relative bg-[#0a0e24]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-lg group-hover:shadow-purple-900/20 overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`grid-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
                      </svg>
                    </div>
                    
                    {/* Stat Value with Animated Counter */}
                    <div className="mb-4 relative">
                      <motion.div
                        className="relative z-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.3 + (index * 0.1),
                          type: "spring",
                          stiffness: 100
                        }}
                      >
                        <span className={`text-4xl md:text-5xl font-bold ${stat.textColor} inline-block transition-all duration-500 group-hover:scale-110 group-hover:translate-y-[-2px] origin-left`}>
                          {stat.value}
                        </span>
                        
                        {/* Decorative element */}
                        <motion.div 
                          className="absolute -bottom-2 left-0 h-1 bg-purple-500/50 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: "40%" }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 1, 
                            delay: 0.5 + (index * 0.1),
                            ease: "easeOut"
                          }}
                        />
                      </motion.div>
                      
                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${stat.barColor}`}
                          initial={{ width: "0%" }}
                          whileInView={{ width: stat.barWidth }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 1.2, 
                            delay: 0.2 + (index * 0.1),
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Stat Label with Animation */}
                    <motion.p 
                      className="text-white/70 text-sm md:text-base font-medium group-hover:text-white/90 transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    >
                      {stat.label}
                    </motion.p>
                    
                    {/* Decorative icon */}
                    <motion.div 
                      className="absolute top-4 right-4 text-purple-500/20 group-hover:text-purple-500/40 transition-colors duration-300"
                      initial={{ opacity: 0, rotate: -20 }}
                      whileInView={{ opacity: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                    >
                      {index === 0 && <Briefcase size={24} />}
                      {index === 1 && <Heart size={24} />}
                      {index === 2 && <Rocket size={24} />}
                      {index === 3 && <Zap size={24} />}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Additional decorative element */}
            <motion.div 
              className="mt-16 max-w-5xl mx-auto h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </section>

        {/* Interactive Process Timeline */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-[#0a0e24] to-[#030718] opacity-80"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">Our Process</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 text-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                How We Work Together
              </motion.h2>
              
              <motion.p 
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                A streamlined process designed to deliver exceptional results efficiently
              </motion.p>
            </motion.div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <motion.div 
                  className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-500 rounded-full"
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  style={{ top: "2rem", bottom: "2rem" }}
                />
                
                {[
                  {
                    step: "01",
                    title: "Discovery & Planning",
                    description: "We dive deep into your business goals, target audience, and project requirements to create a comprehensive digital marketing and content strategy.",
                    icon: <Lightbulb className="w-6 h-6" />,
                    side: "left"
                  },
                  {
                    step: "02",
                    title: "Design & Prototyping",
                    description: "Creating wireframes and high-fidelity designs that align with your brand and provide exceptional user experience.",
                    icon: <Palette className="w-6 h-6" />,
                    side: "right"
                  },
                  {
                    step: "03",
                    title: "Development & Testing",
                    description: "Building your website with clean, efficient code and rigorous testing to ensure everything works perfectly.",
                    icon: <Code className="w-6 h-6" />,
                    side: "left"
                  },
                  {
                    step: "04",
                    title: "Launch & Optimization",
                    description: "Deploying your website with SEO services and providing ongoing support to ensure optimal performance and continuous improvement.",
                    icon: <Rocket className="w-6 h-6" />,
                    side: "right"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`relative flex items-center mb-16 ${item.side === 'right' ? 'flex-row-reverse' : ''}`}
                    initial={{ opacity: 0, x: item.side === 'left' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 * index }}
                  >
                    {/* Content */}
                    <div className={`w-5/12 ${item.side === 'right' ? 'text-right' : ''}`}>
                      <motion.div 
                        className="bg-[#0a0e24]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative group hover:border-purple-500/50 transition-all duration-300"
                        whileHover={{ y: -5 }}
                      >
                        <div className={`flex items-center mb-4 ${item.side === 'right' ? 'justify-end' : ''}`}>
                          <div className="text-purple-400 mr-3">
                            {item.icon}
                          </div>
                          <span className="text-purple-300 text-sm font-semibold">Step {item.step}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-white/70">{item.description}</p>
                      </motion.div>
                    </div>
                    
                    {/* Timeline dot */}
                    <motion.div 
                      className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-[#030718] z-10"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 * index }}
                      whileHover={{ scale: 1.5 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-[#0a0e24] to-[#030718] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-1/3 right-10 w-64 h-64 bg-purple-600/10 rounded-full filter blur-[80px]"
            animate={{ 
              scale: [1, 1.2],
              opacity: [0.1, 0.2]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.div>
          
          <motion.div 
            className="absolute top-1/3 left-10 w-80 h-80 bg-purple-600/10 rounded-full filter blur-[100px]"
            animate={{ 
              scale: [1, 1.2],
              opacity: [0.1, 0.2]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.div>
          
          <motion.div 
            className="absolute bottom-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px]"
            animate={{ 
              scale: [1.2, 1],
              opacity: [0.15, 0.25]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          ></motion.div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">Tech Stack</span>
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 text-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Technologies I Work With
              </motion.h2>
              
              <motion.p 
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Modern tools and frameworks that power exceptional digital experiences
              </motion.p>
            </motion.div>
            
            {/* Tech logos grid */}
            <div className="max-w-5xl mx-auto">
              {/* Frontend Technologies */}
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-6 text-white flex items-center gap-2 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Monitor size={20} className="text-purple-400" />
                  Frontend Technologies
                </motion.h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {[
                    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                    { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                    { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
                    { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg" },
                    { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
                  ].map((tech, index) => (
                    <motion.div 
                      key={tech.name}
                      className="group flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-xl flex items-center justify-center p-4 mb-3 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                        />
                        <motion.img 
                          src={tech.logo} 
                          alt={tech.name} 
                          className="w-full h-full object-contain"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                      </div>
                      <span className="text-white/70 text-sm group-hover:text-purple-300 transition-colors duration-300">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Backend Technologies */}
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-6 text-white flex items-center gap-2 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Database size={20} className="text-purple-400" />
                  Backend Technologies
                </motion.h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {[
                    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                    { name: "Express", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
                    { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
                    { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
                    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
                  ].map((tech, index) => (
                    <motion.div 
                      key={tech.name}
                      className="group flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-xl flex items-center justify-center p-4 mb-3 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                        />
                        <motion.img 
                          src={tech.logo} 
                          alt={tech.name} 
                          className="w-full h-full object-contain"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                      </div>
                      <span className="text-white/70 text-sm group-hover:text-purple-300 transition-colors duration-300">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Tools & Design */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-6 text-white flex items-center gap-2 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Palette size={20} className="text-purple-400" />
                  Tools & Design
                </motion.h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {[
                    { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
                    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
                    { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
                    { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
                    { name: "Photoshop", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
                  ].map((tech, index) => (
                    <motion.div 
                      key={tech.name}
                      className="group flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-xl flex items-center justify-center p-4 mb-3 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                        />
                        <motion.img 
                          src={tech.logo} 
                          alt={tech.name} 
                          className="w-full h-full object-contain"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                      </div>
                      <span className="text-white/70 text-sm group-hover:text-purple-300 transition-colors duration-300">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-[#030718] to-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </div>
        </section>

        {/* Why Choose Us Section */}
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
                Why Choose Us
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Built for Success
              </motion.h2>
              
              <motion.p
                className="text-white/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                We build websites that actually work for your business. Simple, fast, and designed to get you more customers.
              </motion.p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Super Fast",
                  description: "Your website loads in under 3 seconds. Fast sites keep visitors happy and boost sales.",
                  color: "from-purple-500 to-purple-700"
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Safe & Secure",
                  description: "Your website is protected 24/7. We handle security so you can focus on your business.",
                  color: "from-purple-500 to-purple-700"
                },
                {
                  icon: <Smartphone className="w-8 h-8" />,
                  title: "Works on All Devices",
                  description: "Looks great on phones, tablets, and computers. Your customers can find you anywhere.",
                  color: "from-purple-500 to-purple-700"
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Easy to Find on Google",
                  description: "Our SEO services and digital marketing expertise ensure people can find your business when they search online. More visibility = more customers.",
                  color: "from-purple-500 to-purple-700"
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Easy to Use",
                  description: "Simple navigation that makes sense. Visitors find what they need quickly and easily.",
                  color: "from-purple-500 to-purple-700"
                },
                {
                  icon: <Gauge className="w-8 h-8" />,
                  title: "Built for Results",
                  description: "Every feature is designed with content creation and digital marketing in mind to help your business grow. More leads, more sales, more success.",
                  color: "from-purple-500 to-purple-700"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Interactive Icon */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} mb-4 relative z-10 cursor-pointer`}
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -10],
                      boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                      rotate: { duration: 0.6 }
                    }}
                    animate={{
                      y: [0, -5],
                    }}
                    style={{
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <motion.div
                      className="text-white"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-8 h-8 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO & Digital Marketing Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-purple-950/20 to-[#030718] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
          {/* Animated gradient orbs */}
          <motion.div 
            className="absolute top-1/3 left-10 w-80 h-80 bg-purple-600/10 rounded-full filter blur-[100px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.div>
          
          <motion.div 
            className="absolute bottom-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px]"
            animate={{ 
              scale: [1.2, 1],
              opacity: [0.15, 0.25]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          ></motion.div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Main Heading */}
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 leading-tight">
                  Unleash Your Digital Potential with Devtone Agency
                </span>
              </motion.h1>
              
              {/* Subheading */}
              <motion.h2 
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-4 sm:mb-6 text-white/90 px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white/80">Your Premier Partner for </span>
                <span className="text-purple-300">Web Development</span>
              </motion.h2>
              
              {/* Introduction Paragraph */}
              <motion.p 
                className="text-base sm:text-lg text-white/70 text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span>Devtone Agency is not just a </span>
                <b className="text-purple-300"><strong>branding agency</strong></b>
                <span>, we are your key to unlocking an unparalleled online presence. Our expertise in </span>
                <b className="text-purple-300"><strong>web development</strong></b>
                <span> empowers businesses to build dynamic websites that engage visitors and convert them into loyal customers.</span>
              </motion.p>
              
              {/* Why Choose Section */}
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-4 sm:mb-6 px-4 sm:px-0">
                  <span className="text-white/90">Why Choose Devtone for </span>
                  <span className="text-purple-300">Web Development</span>
                  <span className="text-white/90">?</span>
                </h2>
                
                <p className="text-base sm:text-lg text-white/70 text-center max-w-3xl mx-auto px-4 sm:px-0">
                  <span>In the digital realm, a powerful web presence is essential. Our tailored </span>
                  <b className="text-purple-300"><strong>web development services</strong></b>
                  <span> ensure your brand stands out with fast, responsive, and visually stunning websites that engage your target audience and drive business growth.</span>
                </p>
              </motion.div>
              
              {/* Digital Marketing Solutions */}
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8 px-4 sm:px-0">
                  <span className="text-white/90">Our Comprehensive </span>
                  <span className="text-purple-300">Web Development</span>
                  <span className="text-white/90"> Solutions</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto px-4 sm:px-0">
                  {[
                    {
                      title: "Responsive Design",
                      description: "Websites that look stunning on every device - from smartphones to desktops, ensuring your visitors have a seamless experience.",
                      icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                    },
                    {
                      title: "Custom Development",
                      description: "Bespoke solutions crafted with cutting-edge technologies that perfectly align with your unique business goals and requirements.",
                      icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                    },
                    {
                      title: "E-commerce Solutions",
                      description: "Feature-rich online stores with secure checkout, inventory management, and intuitive shopping experiences that drive sales.",
                      icon: <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    },
                    {
                      title: "Performance Optimization",
                      description: "Lightning-fast websites optimized for speed, search engines, and conversion rates to maximize your online success.",
                      icon: <Gauge className="w-5 h-5 sm:w-6 sm:h-6" />
                    }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-purple-900/10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-4">
                        <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/30 transition-colors duration-300 shadow-lg shadow-purple-900/20 group-hover:scale-110 transform transition-transform">
                          {service.icon}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-2 group-hover:text-purple-300 transition-colors">
                            {service.title}
                          </h4>
                          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Contact CTA */}
              <motion.div 
                className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/10 max-w-3xl mx-auto mt-12 mb-8 shadow-xl shadow-purple-900/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-white/90 px-2 sm:px-0">
                  <span>Contact Devtone Agency Today</span>
                </h2>
                
                <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 px-2 sm:px-0">
                  <span>Ready to propel your business forward? Partner with Devtone Agency, and let's make your digital vision a reality. Contact us at </span>
                  <a href="mailto:team@devtone.agency" className="text-purple-300 hover:text-purple-400 transition-colors font-semibold">
                    team@devtone.agency
                  </a>
                  <span> to discuss your project.</span>
                </p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <motion.button
                    onClick={() => window.location.href = "/contact"}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-indigo-800/90
                      rounded-xl font-semibold text-base sm:text-lg overflow-hidden shadow-lg shadow-purple-900/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 transform translate-x-full group-hover:translate-x-[-150%] transition-transform duration-700">
                      <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    </div>
                    <div className="relative flex items-center justify-center">
                      <span className="text-white/90 mr-2 sm:mr-4">Get Started Today</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200/90" />
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.location.href = "/estimate"}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-purple-500/20
                      rounded-xl font-semibold text-base sm:text-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 transform translate-x-full group-hover:translate-x-[-150%] transition-transform duration-700">
                      <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    </div>
                    <div className="relative flex items-center justify-center">
                      <span className="text-white/90 mr-2 sm:mr-4">Free Quote</span>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200/90" />
                    </div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Success Metrics & Impact */}
        <section className="container mx-auto px-4 py-16 relative">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 to-indigo-900/10 opacity-50"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-indigo-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-24 h-24 border border-purple-500/20 rounded-full animate-spin-slow opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 border border-indigo-500/20 rounded-full animate-spin-slow opacity-30" style={{ animationDuration: "15s" }}></div>
          
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
                Real Results
              </motion.div>
              
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-400 px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Real-Time Project Dashboard
              </motion.h2>

              <motion.p
                className="text-white/80 max-w-2xl mx-auto px-4 sm:px-0 text-base sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                After completing your estimate, gain access to our intuitive client dashboard where you can track your project's progress in real-time, communicate with our team, and visualize your website's performance metrics all in one place.
              </motion.p>
            </motion.div>

            {/* Dashboard Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 px-4 sm:px-0">
              {[
                {
                  value: "100%",
                  label: "Project Transparency",
                  description: "Track every milestone and task in real-time with our intuitive visual progress indicators",
                  icon: <LineChart className="w-8 h-8" />,
                  color: "from-purple-500 to-purple-700",
                  prefix: "",
                  suffix: "%"
                },
                {
                  value: "24/7",
                  label: "Access Anywhere",
                  description: "Check your project status anytime, anywhere on any device with our responsive dashboard interface",
                  icon: <Smartphone className="w-8 h-8" />,
                  color: "from-purple-500 to-purple-700",
                  prefix: "",
                  suffix: ""
                },
                {
                  value: "Live",
                  label: "Team Communication",
                  description: "Direct messaging with our development team ensures your feedback is implemented promptly",
                  icon: <MessageCircle className="w-8 h-8" />,
                  color: "from-purple-500 to-purple-700",
                  prefix: "",
                  suffix: ""
                },
                {
                  value: "Real",
                  label: "Performance Analytics",
                  description: "Monitor your website's traffic, engagement, and conversion metrics with beautiful visual graphs",
                  icon: <BarChart className="w-8 h-8" />,
                  color: "from-purple-500 to-purple-700",
                  prefix: "",
                  suffix: "-time"
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden text-center"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Interactive Icon */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${metric.color} mb-4 relative z-10 cursor-pointer`}
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, 15],
                      boxShadow: "0 15px 40px rgba(168, 85, 247, 0.5)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      rotate: { duration: 0.8 }
                    }}
                    animate={{
                      y: [0, -8],
                      rotateY: [0, 360]
                    }}
                    style={{
                      animationDelay: `${index * 0.3}s`
                    }}
                  >
                    <motion.div
                      className="text-white"
                      whileHover={{
                        scale: 1.15,
                        filter: "brightness(1.2)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {metric.icon}
                    </motion.div>
                  </motion.div>
                  
                  {/* Animated Value */}
                  <motion.div 
                    className="relative z-10 mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index * 0.1) + 0.3 }}
                  >
                    <span className="text-3xl md:text-4xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {metric.prefix}{metric.value}{metric.suffix}
                    </span>
                  </motion.div>
                  
                  {/* Label */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300 relative z-10">
                    {metric.label}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/60 text-sm relative z-10">
                    {metric.description}
                  </p>
                  
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-8 h-8 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>

            {/* Dashboard Mockup */}
            <motion.div
              className="mt-12 mb-16 max-w-4xl mx-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-white/10 shadow-2xl overflow-hidden">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                      <Monitor className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">Project Dashboard</h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Project Progress */}
                  <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                    <h4 className="text-white/90 text-sm font-medium mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-purple-400" /> Project Progress
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/70">Design</span>
                          <span className="text-green-400">Completed</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/70">Development</span>
                          <span className="text-purple-400">75%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/70">Testing</span>
                          <span className="text-blue-400">25%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Chart */}
                  <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm md:col-span-2">
                    <h4 className="text-white/90 text-sm font-medium mb-3 flex items-center">
                      <BarChart className="w-4 h-4 mr-2 text-purple-400" /> Website Performance
                    </h4>
                    <div className="h-32 flex items-end justify-between space-x-1">
                      {[15, 25, 18, 30, 22, 35, 40, 30, 25, 45, 35, 55].map((height, i) => (
                        <div key={i} className="h-full flex flex-col justify-end">
                          <motion.div 
                            className="w-5 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-sm"
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          ></motion.div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/50">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="text-center relative z-10 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-purple-500/40"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/estimate"}
              >
                Get Your Dashboard Access
              </motion.button>
            </motion.div>
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

        {/* Brevo Chat Widget */}
        <BrevoChatWidget />
      </div>
    </>
  )
}

export default Home; 
