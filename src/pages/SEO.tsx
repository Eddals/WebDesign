"use client"

import { motion } from 'framer-motion'
import { 
  Search, BarChart2, Globe, Target, 
  TrendingUp, Users, CheckCircle, ArrowRight,
  Code, Layers, FileText, Award,
  Clock, Shield, Lightbulb, DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEOComponent from '@/components/SEO'

const SEO = () => {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Technical SEO",
      description: "Optimize your website's technical foundation for better search performance"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "On-Page SEO",
      description: "Optimize content and structure for improved keyword rankings"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Off-Page SEO",
      description: "Build authority through strategic link building and brand mentions"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Local SEO",
      description: "Dominate local search results and attract nearby customers"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Content Strategy",
      description: "Create SEO-optimized content that drives traffic and conversions"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "SEO Analytics",
      description: "Track performance and measure ROI with detailed reporting"
    }
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increased Organic Traffic",
      description: "Drive more qualified visitors to your website through search engines",
      stat: "142% Traffic Increase"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Higher Conversion Rates",
      description: "Attract visitors who are actively searching for your products or services",
      stat: "85% More Conversions"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Better ROI",
      description: "SEO provides long-term value with sustainable, cost-effective results",
      stat: "315% Average ROI"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Brand Authority",
      description: "Establish your business as a trusted leader in your industry",
      stat: "Top 10 Rankings"
    }
  ]

  const process = [
    {
      step: "01",
      title: "SEO Audit & Analysis",
      description: "Comprehensive analysis of your current SEO performance and opportunities"
    },
    {
      step: "02", 
      title: "Strategy Development",
      description: "Create a customized SEO strategy based on your goals and competition"
    },
    {
      step: "03",
      title: "Implementation",
      description: "Execute technical fixes, content optimization, and link building campaigns"
    },
    {
      step: "04",
      title: "Monitor & Optimize",
      description: "Continuously track performance and refine strategies for maximum results"
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
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .bounce-animation {
      animation: bounce 2s ease-in-out infinite;
    }
  `;



  return (
    <>
      <SEOComponent 
        title="SEO Services | Search Engine Optimization Expert"
        description="Professional SEO services that drive real results. Improve your search rankings, increase organic traffic, and grow your business with data-driven strategies."
        keywords={['SEO services', 'search engine optimization', 'technical SEO', 'local SEO', 'content strategy']}
        ogUrl="https://matheusweb.com/seo"
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
              <Search className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">SEO Services</span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Dominate Search
              </span>
              <br />
              <span className="text-white">Rankings</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-white/70 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Drive more organic traffic, increase visibility, and grow your business with
              data-driven SEO strategies that deliver measurable results.
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
                Comprehensive SEO Services
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                From technical optimization to content strategy, we cover every aspect of SEO
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
                Why Choose Our SEO Services
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Proven strategies that deliver real, measurable results for your business
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
                Our SEO Process
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A proven methodology that ensures your SEO success
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
              Ready to Dominate Search Results?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Let's create an SEO strategy that drives real traffic, leads, and revenue for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
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
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default SEO
