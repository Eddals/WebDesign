"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Share2, TrendingUp, Users, Heart, 
  MessageCircle, Eye, CheckCircle, ArrowRight,
  Instagram, Facebook, Twitter, Linkedin,
  Youtube, Calendar, BarChart, Target,
  Zap, Award, Clock, DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'

const SocialMediaMarketing = () => {
  const platforms = [
    {
      icon: <Instagram className="w-8 h-8" />,
      name: "Instagram",
      description: "Visual storytelling and brand building",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Facebook className="w-8 h-8" />,
      name: "Facebook",
      description: "Community building and targeted advertising",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: <Twitter className="w-8 h-8" />,
      name: "Twitter",
      description: "Real-time engagement and thought leadership",
      color: "from-sky-400 to-sky-500"
    },
    {
      icon: <Linkedin className="w-8 h-8" />,
      name: "LinkedIn",
      description: "Professional networking and B2B marketing",
      color: "from-blue-700 to-blue-800"
    },
    {
      icon: <Youtube className="w-8 h-8" />,
      name: "YouTube",
      description: "Video content and channel growth",
      color: "from-red-500 to-red-600"
    }
  ]

  const services = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Content Planning",
      description: "Strategic content calendars that align with your business goals"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Content Creation",
      description: "High-quality posts, graphics, and videos that engage your audience"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Management",
      description: "Active engagement and relationship building with your followers"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Paid Advertising",
      description: "Targeted ad campaigns that drive results and ROI"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Analytics & Reporting",
      description: "Detailed insights and performance tracking"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Strategy Development",
      description: "Custom social media strategies for your brand"
    }
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increased Brand Awareness",
      description: "Reach more potential customers and build brand recognition",
      stat: "300% Reach Increase"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Engaged Community",
      description: "Build a loyal following that actively engages with your brand",
      stat: "150% Engagement Boost"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Higher Conversions",
      description: "Turn social media followers into paying customers",
      stat: "85% Conversion Increase"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Brand Authority",
      description: "Establish your brand as a leader in your industry",
      stat: "Top 10% Authority"
    }
  ]



  const process = [
    {
      step: "01",
      title: "Strategy & Audit",
      description: "Analyze your current presence and develop a winning strategy"
    },
    {
      step: "02", 
      title: "Content Planning",
      description: "Create a comprehensive content calendar aligned with your goals"
    },
    {
      step: "03",
      title: "Content Creation",
      description: "Produce high-quality, engaging content for your platforms"
    },
    {
      step: "04",
      title: "Engagement & Growth",
      description: "Actively manage your community and grow your following"
    }
  ]

  return (
    <>
      <SEO 
        title="Social Media Marketing Services | Grow Your Brand Online"
        description="Boost your brand with professional social media marketing. Content creation, community management, and paid advertising across all major platforms."
        keywords={['social media marketing', 'social media management', 'content creation', 'social media advertising']}
        ogUrl="https://matheusweb.com/services/social-media-marketing"
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718] overflow-hidden">
        <style jsx="true" global="true">{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .bounce-animation {
            animation: bounce 2s ease-in-out infinite;
          }
        `}</style>
        
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
              <Share2 className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Social Media Marketing</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Grow Your Brand
              </span>
              <br />
              <span className="text-white">on Social Media</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/70 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Build a strong social media presence that engages your audience, grows your following, 
              and drives real business results across all major platforms.
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
                  View Portfolio
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Platforms Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Platforms We Master
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                We create engaging content and manage your presence across all major social media platforms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {platforms.map((platform, index) => (
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
                      {platform.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{platform.name}</h3>
                  <p className="text-white/70 text-sm">{platform.description}</p>
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
                Our Social Media Services
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Comprehensive social media management that covers every aspect of your online presence
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
                Our social media strategies deliver measurable results for your business
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
                Our Process
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A proven methodology that ensures your social media success
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
                      <div className="text-white text-xl font-bold">
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
              Ready to Grow Your Social Media Presence?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Let's create a social media strategy that builds your brand, engages your audience, and drives real business results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/estimate">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Custom Quote
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

export default SocialMediaMarketing
