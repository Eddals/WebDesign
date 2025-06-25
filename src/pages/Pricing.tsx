import React, { useState, useEffect } from 'react';
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
  Zap,
  CreditCard,
  Lock,
  AlertTriangle,
  Mail
} from 'lucide-react';
import SEO from '@/components/SEO';
import StripeCheckout from '@/components/StripeCheckout';

const Pricing = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isSecure, setIsSecure] = useState(true);

  // Security check
  React.useEffect(() => {
    // Check if we're on HTTPS in production
    if (typeof window !== 'undefined') {
      const isSecureConnection = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      setIsSecure(isSecureConnection);
    }
  }, []);

  // Handle package selection
  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPayment(true);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPackage(null);
    // Redirect to success page or show success message
    window.location.href = '/success';
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  // Pricing packages with lower, more affordable prices
  const pricingPackages = [
    {
      id: 'starter',
      name: 'Starter Package',
      description: 'Perfect for small businesses and personal projects',
      price: 299,
      originalPrice: 599,
      savings: 300,
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
      price: 599,
      originalPrice: 999,
      savings: 400,
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
      price: 999,
      originalPrice: 1799,
      savings: 800,
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
      price: 1999,
      originalPrice: 3999,
      savings: 2000,
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

  // Add-on services with affordable pricing
  const addOnServices = [
    { name: 'SEO Optimization', price: 149, description: 'Complete SEO setup and optimization' },
    { name: 'Logo Design', price: 99, description: 'Professional logo design and branding' },
    { name: 'Content Writing', price: 79, description: 'Professional copywriting for your website' },
    { name: 'Social Media Setup', price: 49, description: 'Social media profiles and integration' },
    { name: 'Email Marketing', price: 99, description: 'Email campaign setup and automation' },
    { name: 'Analytics & Reporting', price: 79, description: 'Advanced analytics and monthly reports' }
  ];

  return (
    <>
      <SEO
        title="Web Development Pricing - Devtone Agency Packages"
        description="Unlock online success with Devtone Agency's affordable web development packages. From basic websites to premium e-commerce solutions with SEO optimization."
        keywords={['DevTone pricing', 'web development packages', 'website pricing', 'affordable web design', 'transparent pricing', 'SEO services', 'digital marketing', 'branding agency', 'content creation', 'PPC advertising']}
        ogUrl="https://www.devtone.agency/pricing"
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
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard className="w-4 h-4" />
                  {pkg.popular ? 'Choose Popular' : 'Select Package'}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Security Notice */}
          {!isSecure && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Insecure Connection</h3>
                  <p className="text-sm">For your security, payments require a secure HTTPS connection.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Modal */}
          {showPayment && selectedPackage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPayment(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#030718] border border-white/20 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Complete Your Order</h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Selected Package Info */}
                {(() => {
                  const pkg = pricingPackages.find(p => p.id === selectedPackage);
                  if (!pkg) return null;

                  return (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-purple-400">{pkg.icon}</div>
                        <div>
                          <h4 className="text-white font-semibold">{pkg.name}</h4>
                          <p className="text-white/60 text-sm">{pkg.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">${pkg.price}</div>
                          <div className="text-white/60 text-sm line-through">${pkg.originalPrice}</div>
                        </div>
                        <div className="text-green-400 font-medium">
                          Save ${pkg.savings}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Customer Information Form */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-white font-semibold">Customer Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={customerInfo.company}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Secure Payment</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-green-400" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span>Fraud Protection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>Money Back Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Contact Form Alternative */}
                {customerInfo.name && customerInfo.email && selectedPackage && (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-yellow-400">
                        <AlertTriangle className="w-5 h-5" />
                        <div>
                          <h4 className="font-semibold">Payment System Temporarily Unavailable</h4>
                          <p className="text-sm">Our automated payment system is being updated. Please contact us directly to complete your order.</p>
                        </div>
                      </div>
                    </div>

                    <motion.a
                      href={`mailto:support@devtone.agency?subject=Order Request - ${pricingPackages.find(p => p.id === selectedPackage)?.name}&body=Hi DevTone Team,%0D%0A%0D%0AI would like to order the ${pricingPackages.find(p => p.id === selectedPackage)?.name} for $${pricingPackages.find(p => p.id === selectedPackage)?.price}.%0D%0A%0D%0ACustomer Information:%0D%0AName: ${customerInfo.name}%0D%0AEmail: ${customerInfo.email}%0D%0APhone: ${customerInfo.phone}%0D%0ACompany: ${customerInfo.company}%0D%0A%0D%0APlease send me payment instructions.%0D%0A%0D%0AThank you!`}
                      className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Mail className="w-5 h-5" />
                      Contact Us to Complete Order
                    </motion.a>

                    <div className="text-center text-white/60 text-sm">
                      We'll respond within 2 hours with payment instructions
                    </div>
                  </div>
                )}

                {(!customerInfo.name || !customerInfo.email) && (
                  <div className="text-center text-white/60 text-sm">
                    Please fill in your name and email to contact us about this package
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

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

          {/* Security & Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Shield className="w-8 h-8 text-green-400" />
                Secure & Trusted Payments
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Your security is our priority. All payments are processed through industry-leading security standards.
              </p>
            </div>

            {/* Security Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">SSL Encryption</h3>
                <p className="text-white/60 text-sm">256-bit SSL encryption protects all data transmission</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">PCI Compliant</h3>
                <p className="text-white/60 text-sm">Meets highest payment card industry standards</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Fraud Protection</h3>
                <p className="text-white/60 text-sm">Advanced fraud detection and prevention systems</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Money Back Guarantee</h3>
                <p className="text-white/60 text-sm">30-day money back guarantee on all packages</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="text-center border-t border-white/10 pt-6">
              <p className="text-white/60 text-sm mb-4">Accepted Payment Methods</p>
              <div className="flex items-center justify-center gap-4 text-white/40">
                <span className="text-lg font-bold">VISA</span>
                <span className="text-lg font-bold">MASTERCARD</span>
                <span className="text-lg font-bold">AMEX</span>
                <span className="text-lg font-bold">DISCOVER</span>
                <span className="text-lg font-bold">PAYPAL</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Choose a package above or contact us for a custom quote. All packages include our security guarantee.
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
