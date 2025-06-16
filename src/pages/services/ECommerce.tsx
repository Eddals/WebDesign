"use client"

import { motion } from "framer-motion"
import { ShoppingBag, CreditCard, Package, Users, BarChart, Shield, Smartphone, Globe } from "lucide-react"
import SEO from '@/components/SEO'

export default function ECommerce() {
  return (
    <>
      <SEO
        title="E-Commerce Development Services - DevTone"
        description="Professional e-commerce website development services. Custom online stores with secure payment processing, inventory management, and conversion optimization."
        keywords={['e-commerce development', 'online store', 'shopping cart', 'payment integration', 'inventory management', 'DevTone']}
        ogUrl="https://devtone.com/services/ecommerce"
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
              <ShoppingBag size={16} />
              <span>E-Commerce Development</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              E-Commerce Stores That Sell
            </motion.h1>
            
            <motion.p 
              className="text-white/70 text-lg max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Complete online stores with secure payment processing, inventory management, and conversion optimization to maximize your sales.
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
              Start Your Store
              <ShoppingBag size={20} />
            </motion.a>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <CreditCard className="w-8 h-8 text-purple-400" />,
                title: "Secure Payments",
                description: "Multiple payment gateways with SSL encryption and PCI compliance for secure transactions."
              },
              {
                icon: <Package className="w-8 h-8 text-purple-400" />,
                title: "Inventory Management",
                description: "Real-time inventory tracking, automated stock alerts, and product management system."
              },
              {
                icon: <Users className="w-8 h-8 text-purple-400" />,
                title: "Customer Accounts",
                description: "User registration, order history, wishlist, and personalized shopping experience."
              },
              {
                icon: <BarChart className="w-8 h-8 text-purple-400" />,
                title: "Sales Analytics",
                description: "Detailed sales reports, customer insights, and performance tracking dashboard."
              },
              {
                icon: <Shield className="w-8 h-8 text-purple-400" />,
                title: "Security Features",
                description: "Advanced security measures, fraud protection, and data encryption."
              },
              {
                icon: <Smartphone className="w-8 h-8 text-purple-400" />,
                title: "Mobile Optimized",
                description: "Responsive design optimized for mobile shopping and touch interactions."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Process Section */}
          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our E-Commerce Development Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Strategy & Planning",
                  description: "Market research, competitor analysis, and e-commerce strategy development."
                },
                {
                  step: "02", 
                  title: "Design & UX",
                  description: "User-friendly design focused on conversion optimization and brand consistency."
                },
                {
                  step: "03",
                  title: "Development & Integration",
                  description: "Custom development with payment gateways, shipping, and third-party integrations."
                },
                {
                  step: "04",
                  title: "Testing & Launch",
                  description: "Comprehensive testing, security audits, and successful store launch."
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

          {/* CTA Section */}
          <motion.div 
            className="text-center bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch Your Online Store?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Let's create an e-commerce solution that drives sales and grows your business online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full text-white font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Today
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