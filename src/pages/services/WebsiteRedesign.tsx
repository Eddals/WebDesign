"use client"

import { motion } from "framer-motion"
import { RefreshCw, Zap, Smartphone, Search, Users, BarChart, Palette, Code } from "lucide-react"
import SEO from '@/components/SEO'

export default function WebsiteRedesign() {
  return (
    <>
      <SEO
        title="Website Redesign Services - DevTone"
        description="Transform your outdated website with our professional redesign services. Modern design, improved performance, and better user experience."
        keywords={['website redesign', 'website makeover', 'modern web design', 'website refresh', 'UI/UX improvement', 'DevTone']}
        ogUrl="https://devtone.agency/services/website-redesign"
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
              <RefreshCw size={16} />
              <span>Website Redesign</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your Website
            </motion.h1>
            
            <motion.p 
              className="text-white/70 text-lg max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Breathe new life into your outdated website with a modern redesign that improves performance, user experience, and conversions.
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
              Start Redesign
              <RefreshCw size={20} />
            </motion.a>
          </motion.div>

          {/* Why Redesign Section */}
          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Your Website Needs a Redesign</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Outdated Design",
                  description: "Your website looks old and doesn't reflect current design trends or your brand evolution."
                },
                {
                  title: "Poor Performance",
                  description: "Slow loading times and poor mobile experience are hurting your search rankings and user engagement."
                },
                {
                  title: "Low Conversions",
                  description: "Your current website isn't converting visitors into customers or generating leads effectively."
                },
                {
                  title: "Not Mobile-Friendly",
                  description: "Your site doesn't work well on mobile devices, missing out on mobile traffic and sales."
                },
                {
                  title: "Hard to Update",
                  description: "Your current website is difficult to maintain and update with new content or features."
                },
                {
                  title: "Security Issues",
                  description: "Outdated technology and security vulnerabilities put your business and customers at risk."
                }
              ].map((reason, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-3">{reason.title}</h3>
                  <p className="text-white/70 text-sm">{reason.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What We Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: <Palette className="w-8 h-8 text-purple-400" />,
                title: "Modern Design",
                description: "Contemporary, professional design that reflects your brand and appeals to your target audience."
              },
              {
                icon: <Zap className="w-8 h-8 text-purple-400" />,
                title: "Performance",
                description: "Faster loading times, optimized images, and improved Core Web Vitals for better SEO."
              },
              {
                icon: <Smartphone className="w-8 h-8 text-purple-400" />,
                title: "Mobile Experience",
                description: "Responsive design that works perfectly on all devices and screen sizes."
              },
              {
                icon: <Search className="w-8 h-8 text-purple-400" />,
                title: "SEO Optimization",
                description: "Improved search engine optimization to increase visibility and organic traffic."
              },
              {
                icon: <Users className="w-8 h-8 text-purple-400" />,
                title: "User Experience",
                description: "Intuitive navigation and user-friendly interface that guides visitors to take action."
              },
              {
                icon: <BarChart className="w-8 h-8 text-purple-400" />,
                title: "Conversion Rate",
                description: "Strategic design elements and calls-to-action to increase conversions and sales."
              },
              {
                icon: <Code className="w-8 h-8 text-purple-400" />,
                title: "Clean Code",
                description: "Modern, maintainable code that's easy to update and secure from vulnerabilities."
              },
              {
                icon: <RefreshCw className="w-8 h-8 text-purple-400" />,
                title: "Easy Updates",
                description: "Content management system that makes it easy to update and maintain your website."
              }
            ].map((improvement, index) => (
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
                  {improvement.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{improvement.title}</h3>
                <p className="text-white/70 text-sm">{improvement.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Process Section */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Redesign Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Analysis & Audit",
                  description: "Comprehensive review of your current website's performance, design, and user experience."
                },
                {
                  step: "02", 
                  title: "Strategy & Planning",
                  description: "Define goals, target audience, and create a strategic plan for the redesign."
                },
                {
                  step: "03",
                  title: "Design & Development",
                  description: "Create modern designs and develop with the latest technologies and best practices."
                },
                {
                  step: "04",
                  title: "Testing & Launch",
                  description: "Thorough testing, content migration, and successful launch of your new website."
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Website?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Let's give your website the modern makeover it deserves and start converting more visitors into customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full text-white font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Redesign
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