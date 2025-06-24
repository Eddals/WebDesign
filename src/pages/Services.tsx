import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Layout, 
  ShoppingCart, 
  RefreshCw, 
  Search, 
  Smartphone,
  MessageSquare,
  BarChart
} from 'lucide-react';
import SEO from '../components/SEO';

const serviceItems = [
  {
    icon: <Globe className="w-10 h-10 text-purple-400" />,
    title: "Business Websites",
    description: "Professional websites designed to showcase your brand and convert visitors into customers.",
    link: "/services/business-websites"
  },
  {
    icon: <Layout className="w-10 h-10 text-purple-400" />,
    title: "Landing Pages",
    description: "High-converting landing pages designed to maximize your marketing campaigns.",
    link: "/services/landing-pages"
  },
  {
    icon: <ShoppingCart className="w-10 h-10 text-purple-400" />,
    title: "E-Commerce Stores",
    description: "Custom online stores that provide seamless shopping experiences and drive sales.",
    link: "/services/e-commerce-stores"
  },
  {
    icon: <RefreshCw className="w-10 h-10 text-purple-400" />,
    title: "Website Redesign",
    description: "Transform your outdated website into a modern, high-performing digital asset.",
    link: "/services/website-redesign"
  },
  {
    icon: <Search className="w-10 h-10 text-purple-400" />,
    title: "SEO Optimization",
    description: "Improve your search engine rankings and drive more organic traffic to your website.",
    link: "/services/seo-optimization"
  },
  {
    icon: <Smartphone className="w-10 h-10 text-purple-400" />,
    title: "Mobile Applications",
    description: "Custom mobile apps for iOS and Android that engage users and extend your digital presence.",
    link: "/services/mobile-applications"
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-purple-400" />,
    title: "Social Media Marketing",
    description: "Strategic social media campaigns that build your brand and engage your audience.",
    link: "/services/social-media-marketing"
  },
  {
    icon: <BarChart className="w-10 h-10 text-purple-400" />,
    title: "Digital Marketing",
    description: "Comprehensive digital marketing strategies to grow your online presence and drive results.",
    link: "/services/digital-marketing"
  }
];

export default function Services() {
  return (
    <>
      <SEO
        title="Web Development & Digital Marketing Services - DevTone"
        description="Professional web development, design, and digital marketing services. From business websites to e-commerce stores and SEO optimization."
        keywords={['web development services', 'digital marketing', 'website design', 'e-commerce development', 'SEO services', 'DevTone']}
        ogUrl="https://devtone.agency/services"
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
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our Services
            </motion.h1>
            
            <motion.p 
              className="text-white/70 text-lg max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              We offer a comprehensive range of web development and digital marketing services to help your business succeed online.
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceItems.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-white/70 mb-4">{service.description}</p>
                <Link 
                  to={service.link}
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="text-center bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Let's discuss your requirements and create a digital solution that drives results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full text-white font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
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
  );
}