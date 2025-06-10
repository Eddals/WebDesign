import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  DollarSign,
  Clock,
  Shield,
  Users,
  ShoppingCart,
  Briefcase,
  Code,
  Palette,
  Globe,
  Star,
  Zap
} from 'lucide-react';
import SEO from '@/components/SEO';

const Pricing = () => {
  // Pricing packages
  const pricingPackages = [
    {
      id: 'starter',
      name: 'Starter Package',
      description: 'Perfect for small businesses and personal projects',
      price: 799,
      originalPrice: 1299,
      savings: 500,
      timeline: '1-2 weeks',
      popular: false,
      icon: <Globe className="w-8 h-8" />,
      features: [
        'Responsive Landing Page',
        'Contact Form Integration',
        'Basic SEO Setup',
        'Mobile Optimization',
        'Social Media Links',
        '1 Month Support',
        'SSL Certificate',
        'Fast Loading Speed'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Package',
      description: 'Ideal for growing businesses and portfolios',
      price: 1499,
      originalPrice: 2499,
      savings: 1000,
      timeline: '2-3 weeks',
      popular: true,
      icon: <Briefcase className="w-8 h-8" />,
      features: [
        'Multi-page Website (up to 5 pages)',
        'Custom Design & Branding',
        'Content Management System',
        'Advanced SEO Optimization',
        'Google Analytics Setup',
        'Contact Forms & Lead Capture',
        '3 Months Support',
        'Performance Optimization',
        'Social Media Integration',
        'Blog Setup (optional)'
      ]
    },
    {
      id: 'business',
      name: 'Business Package',
      description: 'Complete solution for established businesses',
      price: 2999,
      originalPrice: 4999,
      savings: 2000,
      timeline: '3-4 weeks',
      popular: false,
      icon: <ShoppingCart className="w-8 h-8" />,
      features: [
        'E-commerce Functionality',
        'Payment Gateway Integration',
        'Product Management System',
        'Customer Account Portal',
        'Order Tracking System',
        'Inventory Management',
        'Advanced Analytics',
        '6 Months Support',
        'Security Package',
        'Email Marketing Integration',
        'Live Chat Support',
        'Custom Features'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Package',
      description: 'Custom solutions for large organizations',
      price: 5999,
      originalPrice: 9999,
      savings: 4000,
      timeline: '4-8 weeks',
      popular: false,
      icon: <Code className="w-8 h-8" />,
      features: [
        'Custom Web Application',
        'Database Integration',
        'User Authentication System',
        'Admin Dashboard',
        'API Development',
        'Third-party Integrations',
        'Advanced Security Features',
        '12 Months Support',
        'Performance Monitoring',
        'Scalable Architecture',
        'Custom Training',
        'Priority Support'
      ]
    }
  ];

  // Add-on services
  const addOnServices = [
    { name: 'SEO Optimization', price: 299, description: 'Complete SEO setup and optimization' },
    { name: 'Logo Design', price: 199, description: 'Professional logo design and branding' },
    { name: 'Content Writing', price: 149, description: 'Professional copywriting for your website' },
    { name: 'Social Media Setup', price: 99, description: 'Social media profiles and integration' },
    { name: 'Email Marketing', price: 199, description: 'Email campaign setup and automation' },
    { name: 'Analytics & Reporting', price: 149, description: 'Advanced analytics and monthly reports' }
  ];

  return (
    <>
      <SEO
        title="Pricing - DevTone Web Development Packages"
        description="Transparent pricing for professional web development services. Choose from our affordable packages designed for businesses of all sizes. No hidden fees, just quality work."
        keywords={['DevTone pricing', 'web development packages', 'website pricing', 'affordable web design', 'transparent pricing']}
        ogUrl="https://devtone.com/pricing"
      />
      
      <div className="min-h-screen bg-[#030718] pt-24 pb-12">
        {/* Hero Section */}
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Transparent Pricing</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Simple, Honest Pricing
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Choose the perfect package for your business. All packages include professional design, 
                development, and ongoing support with no hidden fees.
              </p>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {pricingPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/5 border rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 ${
                  pkg.popular 
                    ? 'border-purple-500 bg-purple-500/10 scale-105' 
                    : 'border-white/10'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-purple-400 mb-4">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-white">${pkg.price}</span>
                      <span className="text-white/40 line-through text-lg">${pkg.originalPrice}</span>
                    </div>
                    <div className="text-green-400 text-sm font-medium">
                      Save ${pkg.savings}
                    </div>
                    <div className="text-white/60 text-sm mt-2">
                      Timeline: {pkg.timeline}
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/80 text-sm">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Add-on Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Add-on Services</h2>
              <p className="text-white/70">Enhance your website with additional professional services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addOnServices.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{service.name}</h3>
                    <span className="text-purple-400 font-bold">${service.price}</span>
                  </div>
                  <p className="text-white/60 text-sm">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and let's discuss how we can bring your vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/estimate"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Free Estimate
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold border border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
