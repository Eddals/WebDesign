"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Target, TrendingUp, Zap, CheckCircle, 
  ArrowRight, Star, BarChart, Users,
  Rocket, Eye, MousePointer, Award,
  Clock, Shield, Lightbulb, DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'

const LandingPage = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Conversion Focused",
      description: "Designed specifically to convert visitors into customers"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Loading",
      description: "Optimized for speed to reduce bounce rates"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Eye-Catching Design",
      description: "Visually appealing layouts that capture attention"
    },
    {
      icon: <MousePointer className="w-6 h-6" />,
      title: "Clear Call-to-Actions",
      description: "Strategic placement of CTAs for maximum conversions"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Analytics Ready",
      description: "Built-in tracking for measuring performance"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Mobile Optimized",
      description: "Perfect performance across all devices"
    }
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Higher Conversion Rates",
      description: "Our landing pages typically see 25-40% higher conversion rates",
      stat: "35% Average Increase"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Turnaround",
      description: "Get your landing page live in just 5-7 business days",
      stat: "5-7 Days Delivery"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Better ROI",
      description: "Maximize your advertising spend with optimized landing pages",
      stat: "200% ROI Improvement"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "More Leads",
      description: "Generate more qualified leads for your business",
      stat: "3x More Leads"
    }
  ]



  const process = [
    {
      step: "01",
      title: "Strategy & Planning",
      description: "Understand your goals, audience, and campaign objectives"
    },
    {
      step: "02", 
      title: "Design & Copy",
      description: "Create compelling designs and persuasive copy that converts"
    },
    {
      step: "03",
      title: "Development",
      description: "Build a fast, responsive landing page optimized for conversions"
    },
    {
      step: "04",
      title: "Testing & Launch",
      description: "Test everything thoroughly and launch your campaign"
    }
  ]

  const customStyles = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .pulse-animation {
      animation: pulse 2s ease-in-out infinite;
    }
  `

  return (
    <>
      <SEO 
        title="High-Converting Landing Pages | Landing Page Design Services"
        description="Create landing pages that convert. Professional landing page design services that turn visitors into customers with proven conversion strategies."
        keywords={['landing page design', 'conversion optimization', 'landing page development', 'high converting pages']}
        ogUrl="https://matheusweb.com/services/landing-page"
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718] overflow-hidden">
        <style jsx="true" global="true">{customStyles}</style>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Landing Page Design</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                High-Converting
              </span>
              <br />
              <span className="text-white">Landing Pages</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/70 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Turn your traffic into customers with professionally designed landing pages that convert. 
              Optimized for maximum conversions and built to drive results for your campaigns.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/estimate">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  className="px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded-full font-semibold hover:bg-white/5 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Examples
                </motion.button>
              </Link>
            </motion.div>
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
                Why Landing Pages Work
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Dedicated landing pages significantly outperform generic website pages
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

          {/* Features Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Makes Our Landing Pages Convert
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Every element is strategically designed to guide visitors toward conversion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
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
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
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
                Our Landing Page Process
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A proven process that delivers results every time
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
              Ready to Boost Your Conversions?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Let's create a landing page that turns your visitors into customers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/estimate">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Campaign
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

export default LandingPage