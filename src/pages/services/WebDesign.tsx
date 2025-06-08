"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, Monitor, Smartphone, Layers, 
  Zap, CheckCircle, ArrowRight, Star,
  Code, Figma, Chrome, Users, Award,
  Target, Lightbulb, Rocket
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'

const WebDesign = () => {
  const features = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Responsive Design",
      description: "Perfect display on all devices - desktop, tablet, and mobile"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Custom UI/UX",
      description: "Unique designs tailored to your brand and user needs"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Loading",
      description: "Optimized for speed and performance"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Clean Code",
      description: "Modern, maintainable, and scalable code structure"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User-Centered",
      description: "Designed with your users' experience in mind"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "SEO Ready",
      description: "Built with search engine optimization best practices"
    }
  ]

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We understand your goals, target audience, and requirements",
      icon: <Target className="w-8 h-8" />
    },
    {
      step: "02", 
      title: "Design & Wireframing",
      description: "Create wireframes and visual designs that align with your brand",
      icon: <Figma className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Development",
      description: "Transform designs into a fully functional, responsive website",
      icon: <Code className="w-8 h-8" />
    },
    {
      step: "04",
      title: "Testing & Launch",
      description: "Thorough testing across devices and browsers before going live",
      icon: <Rocket className="w-8 h-8" />
    }
  ]



  const customStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .float-animation {
      animation: float 6s ease-in-out infinite;
    }
  `

  return (
    <>
      <SEO 
        title="Professional Web Design Services | Custom Website Design"
        description="Transform your online presence with our professional web design services. Custom, responsive websites that convert visitors into customers."
        keywords={['web design', 'website design', 'responsive design', 'UI/UX design', 'custom websites']}
        ogUrl="https://matheusweb.com/services/web-design"
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
              <Palette className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Web Design Services</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Beautiful Web Design
              </span>
              <br />
              <span className="text-white">That Converts</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/70 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Create stunning, responsive websites that captivate your audience and drive business growth. 
              Our custom web designs combine aesthetics with functionality for maximum impact.
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
                Why Choose Our Web Design?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                We create websites that not only look amazing but also perform exceptionally
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
                Our Design Process
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A proven methodology that ensures your project's success from concept to launch
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
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {step.step}
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
              Ready to Transform Your Online Presence?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Let's create a stunning website that represents your brand and drives results. 
              Get a custom quote tailored to your specific needs and budget.
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

export default WebDesign