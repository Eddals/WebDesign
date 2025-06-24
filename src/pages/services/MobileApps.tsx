"use client"

import { motion } from "framer-motion"
import { Smartphone, Zap, Users, Bell, Shield, Download, Code, Palette } from "lucide-react"
import SEO from '@/components/SEO'

export default function MobileApps() {
  return (
    <>
      <SEO
        title="Mobile App Development Services - DevTone"
        description="Professional mobile app development for iOS and Android. Custom mobile applications with native performance and modern features."
        keywords={['mobile app development', 'iOS app', 'Android app', 'React Native', 'mobile applications', 'DevTone']}
        ogUrl="https://devtone.agency/services/mobile-apps"
      />
      
      <div className="min-h-screen pt-24 pb-16 bg-[#030718]">
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Smartphone size={16} />
              <span>Mobile App Development</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Mobile Apps That Engage
            </motion.h1>
            
            <motion.p 
              className="text-white/70 text-lg max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Custom mobile applications for iOS and Android that provide exceptional user experiences and drive business growth.
            </motion.p>

            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full text-white font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Start Your App
              <Smartphone size={20} />
            </motion.a>
          </motion.div>

          {/* App Types */}
          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Types of Mobile Apps We Build</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Business Apps",
                  description: "Internal tools, productivity apps, and business process automation for improved efficiency.",
                  examples: ["CRM Apps", "Inventory Management", "Employee Portals", "Task Management"]
                },
                {
                  title: "E-Commerce Apps",
                  description: "Mobile shopping experiences with secure payments and seamless user journeys.",
                  examples: ["Shopping Apps", "Marketplace Apps", "Booking Systems", "Service Apps"]
                },
                {
                  title: "Social & Community",
                  description: "Social networking, community platforms, and communication applications.",
                  examples: ["Social Networks", "Chat Apps", "Forums", "Event Apps"]
                }
              ].map((type, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{type.title}</h3>
                  <p className="text-white/70 mb-4">{type.description}</p>
                  <div className="space-y-2">
                    {type.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span className="text-white/80 text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: <Zap className="w-8 h-8 text-purple-400" />,
                title: "Native Performance",
                description: "Fast, responsive apps that feel natural on each platform with optimized performance."
              },
              {
                icon: <Users className="w-8 h-8 text-purple-400" />,
                title: "User Authentication",
                description: "Secure login systems with social media integration and user profile management."
              },
              {
                icon: <Bell className="w-8 h-8 text-purple-400" />,
                title: "Push Notifications",
                description: "Engage users with targeted push notifications and real-time updates."
              },
              {
                icon: <Shield className="w-8 h-8 text-purple-400" />,
                title: "Data Security",
                description: "Advanced security measures to protect user data and ensure privacy compliance."
              },
              {
                icon: <Download className="w-8 h-8 text-purple-400" />,
                title: "Offline Capability",
                description: "Apps that work offline and sync data when connection is restored."
              },
              {
                icon: <Code className="w-8 h-8 text-purple-400" />,
                title: "API Integration",
                description: "Seamless integration with third-party services and existing business systems."
              },
              {
                icon: <Palette className="w-8 h-8 text-purple-400" />,
                title: "Custom Design",
                description: "Beautiful, intuitive interfaces designed specifically for your brand and users."
              },
              {
                icon: <Smartphone className="w-8 h-8 text-purple-400" />,
                title: "Cross-Platform",
                description: "Single codebase for both iOS and Android with platform-specific optimizations."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Development Process */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our App Development Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description: "Understanding your app idea, target audience, and business objectives."
                },
                {
                  step: "02", 
                  title: "Design",
                  description: "Creating wireframes, user flows, and beautiful UI/UX designs."
                },
                {
                  step: "03",
                  title: "Development",
                  description: "Building your app with clean code and modern development practices."
                },
                {
                  step: "04",
                  title: "Testing",
                  description: "Comprehensive testing on multiple devices and operating systems."
                },
                {
                  step: "05",
                  title: "Launch",
                  description: "App store submission, launch support, and ongoing maintenance."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-400 font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technologies */}
          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Technologies We Use</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                "MongoDB",
                "Supabase",
                "Node.js",
                "PostgreSQL",
                "Flutter"
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white font-medium">{tech}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Mobile App?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Let's turn your app idea into reality with a custom mobile application that engages users and drives business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full text-white font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Your App
              </motion.a>
              <motion.a
                href="/estimate"
                className="px-8 py-4 border border-purple-500/30 hover:bg-purple-500/10 rounded-full text-white font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Free Quote
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}