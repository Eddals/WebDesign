"use client"

import { motion } from 'framer-motion'
import { 
  Globe, TrendingUp, Target, Search, 
  Mail, MousePointer, BarChart, CheckCircle,
  ArrowRight, Star, Zap, Award,
  Users, DollarSign, Clock, Shield,
  Megaphone, Eye, Heart, MessageSquare
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'

const DigitalMarketing = () => {
  const services = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Search Engine Marketing",
      description: "Google Ads, Bing Ads, and paid search campaigns that drive qualified traffic"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Marketing",
      description: "Automated email campaigns that nurture leads and drive conversions"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "PPC Advertising",
      description: "Pay-per-click campaigns optimized for maximum ROI"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Analytics & Tracking",
      description: "Comprehensive tracking and reporting to measure campaign performance"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Audience Targeting",
      description: "Precise targeting to reach your ideal customers"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Conversion Optimization",
      description: "Optimize your funnels to maximize conversions and revenue"
    }
  ]

  const channels = [
    {
      icon: <Search className="w-8 h-8" />,
      name: "Search Marketing",
      description: "Google Ads, Bing Ads, Shopping campaigns",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      name: "Display Advertising",
      description: "Banner ads, retargeting, programmatic advertising",
      color: "from-purple-400 to-purple-500"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      name: "Email Marketing",
      description: "Newsletters, automation, drip campaigns",
      color: "from-purple-600 to-purple-700"
    },
    {
      icon: <Megaphone className="w-8 h-8" />,
      name: "Content Marketing",
      description: "Blog posts, videos, infographics, whitepapers",
      color: "from-purple-300 to-purple-400"
    }
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increased Traffic",
      description: "Drive more qualified visitors to your website",
      stat: "250% Traffic Boost"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Higher ROI",
      description: "Get more value from your marketing investment",
      stat: "400% ROI Increase"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "More Leads",
      description: "Generate high-quality leads for your business",
      stat: "180% Lead Growth"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Brand Authority",
      description: "Establish your brand as an industry leader",
      stat: "Top 5% Authority"
    }
  ]

  const process = [
    {
      step: "01",
      title: "Strategy & Audit",
      description: "Analyze your current marketing and develop a comprehensive strategy"
    },
    {
      step: "02", 
      title: "Campaign Setup",
      description: "Create and configure campaigns across multiple channels"
    },
    {
      step: "03",
      title: "Launch & Optimize",
      description: "Launch campaigns and continuously optimize for better performance"
    },
    {
      step: "04",
      title: "Scale & Grow",
      description: "Scale successful campaigns and expand to new opportunities"
    }
  ]

  const customStyles = `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
      50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.6); }
    }
    .glow-animation {
      animation: glow 3s ease-in-out infinite;
    }
  `

  return (
    <>
      <SEO 
        title="Digital Marketing Services - Devtone Agency"
        description="Unlock online success with Devtone Agency's comprehensive digital marketing solutions. PPC advertising, email marketing, social media management, and content creation."
        keywords={['digital marketing', 'PPC advertising', 'email marketing', 'online marketing', 'digital strategy', 'SEO services', 'social media management', 'content creation', 'branding agency']}
        ogUrl="https://devtone.agency/services/digital-marketing"
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718] overflow-hidden">
        <style >{customStyles}</style>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Digital Marketing</span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Complete Digital
              </span>
              <br />
              <span className="text-white">Marketing Solutions</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-white/70 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Drive growth with comprehensive digital marketing strategies. From PPC and email marketing
              to conversion optimization, we help you reach your audience and achieve your business goals.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/estimate" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded-full font-semibold hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Channels Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Marketing Channels We Master
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                We leverage multiple digital channels to maximize your reach and impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {channels.map((channel, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`bg-gradient-to-r ${channel.color} rounded-full p-3 w-fit mx-auto mb-4`}>
                    <div className="text-white">
                      {channel.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{channel.name}</h3>
                  <p className="text-white/70 text-sm">{channel.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Results That Drive Growth
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Our digital marketing strategies deliver measurable results for your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-purple-500/20 rounded-full p-3 w-fit mx-auto mb-4">
                    <div className="text-purple-400">
                      {benefit.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">{benefit.stat}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Digital Marketing Services
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Comprehensive digital marketing solutions to grow your business online
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-purple-500/20 rounded-full p-3 w-fit mb-4">
                    <div className="text-purple-400">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-white/70">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Process Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Marketing Process
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A data-driven approach to digital marketing success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="text-white font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center bg-gradient-to-r from-purple-500/10 to-purple-700/10 rounded-2xl p-12 border border-purple-500/20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Let's create a digital marketing strategy that drives real results for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/estimate">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Growing Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  className="px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded-full font-semibold hover:bg-white/5 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default DigitalMarketing