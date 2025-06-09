"use client"

import { motion } from 'framer-motion'
import { 
  Zap, Bot, Workflow, Clock, 
  Target, Mail, Users, CheckCircle,
  ArrowRight, Star, TrendingUp, Award,
  Settings, BarChart, DollarSign, Shield,
  MessageSquare, Calendar, Eye, Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'

const MarketingAutomation = () => {
  const features = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Automation",
      description: "Automated email sequences that nurture leads and drive conversions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Lead Scoring",
      description: "Automatically score and prioritize leads based on behavior"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Behavioral Triggers", 
      description: "Trigger actions based on user behavior and interactions"
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "Custom Workflows",
      description: "Build complex automation workflows tailored to your business"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Performance Tracking",
      description: "Track and optimize automation performance in real-time"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "CRM Integration",
      description: "Seamlessly integrate with your existing CRM and tools"
    }
  ]

  const automations = [
    {
      icon: <Mail className="w-8 h-8" />,
      name: "Welcome Series",
      description: "Onboard new subscribers with automated welcome sequences",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      name: "Lead Nurturing",
      description: "Guide prospects through your sales funnel automatically",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      name: "Abandoned Cart",
      description: "Recover lost sales with automated cart abandonment emails",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      name: "Customer Retention",
      description: "Keep customers engaged with automated retention campaigns",
      color: "from-purple-500 to-purple-600"
    }
  ]

  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save Time",
      description: "Automate repetitive marketing tasks and focus on strategy",
      stat: "80% Time Saved"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increase Conversions",
      description: "Deliver the right message at the right time automatically",
      stat: "45% Conversion Boost"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Higher Revenue",
      description: "Generate more revenue with automated sales processes",
      stat: "300% Revenue Growth"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Better Engagement",
      description: "Personalized automation increases customer engagement",
      stat: "60% Engagement Increase"
    }
  ]

  const process = [
    {
      step: "01",
      title: "Strategy & Planning",
      description: "Analyze your customer journey and identify automation opportunities"
    },
    {
      step: "02", 
      title: "Workflow Design",
      description: "Design custom automation workflows that align with your goals"
    },
    {
      step: "03",
      title: "Setup & Integration",
      description: "Implement automations and integrate with your existing tools"
    },
    {
      step: "04",
      title: "Optimize & Scale",
      description: "Monitor performance and continuously optimize for better results"
    }
  ]

  const customStyles = `
    @keyframes circuit {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
    .circuit-animation {
      animation: circuit 3s ease-in-out infinite;
    }
  `

  return (
    <>
      <SEO 
        title="Marketing Automation Services | Automate Your Marketing Workflows"
        description="Streamline your marketing with powerful automation. Email sequences, lead nurturing, and workflow automation that drives results 24/7."
        keywords={['marketing automation', 'email automation', 'lead nurturing', 'workflow automation', 'marketing workflows']}
        ogUrl="https://matheusweb.com/services/marketing-automation"
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718] overflow-hidden">
        <style >{customStyles}</style>
        
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
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Marketing Automation</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Automate Your
              </span>
              <br />
              <span className="text-white">Marketing Success</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/70 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Streamline your marketing with intelligent automation that works 24/7. 
              Nurture leads, increase conversions, and grow your business while you sleep.
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
                  See Demo
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Automation Types Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Automation Types We Build
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                From simple email sequences to complex multi-channel workflows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {automations.map((automation, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`bg-gradient-to-r ${automation.color} rounded-full p-3 w-fit mx-auto mb-4`}>
                    <div className="text-white">
                      {automation.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{automation.name}</h3>
                  <p className="text-white/70 text-sm">{automation.description}</p>
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
                Why Automation Works
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Marketing automation delivers consistent results while saving time and resources
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
                Automation Features
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Powerful features that make your marketing work smarter, not harder
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
                Our Automation Process
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A systematic approach to building automation that delivers results
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
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
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
            className="text-center bg-gradient-to-r from-purple-500/10 to-purple-800/10 rounded-2xl p-12 border border-purple-500/20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Automate Your Success?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Let's build marketing automation that works around the clock to grow your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/estimate">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Automating
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

export default MarketingAutomation