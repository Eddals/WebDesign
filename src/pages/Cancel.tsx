import React from 'react';
import { XCircle, ArrowLeft, MessageSquare, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const Cancel = () => {
  return (
    <>
      <SEO 
        title="Payment Cancelled | No Charges Applied"
        description="Your payment was cancelled. No charges have been applied to your account. You can try again or contact us for assistance."
        keywords={['payment cancelled', 'checkout cancelled', 'web development']}
        ogUrl="https://mywebsite.com/cancel"
      />
      
      <div className="min-h-screen bg-[#030718] pt-24 pb-12">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-40 h-40 bg-red-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Cancel Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Cancel Message */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-white"
                >
                  Payment Cancelled
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-white/80"
                >
                  No worries! Your payment was cancelled.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/60"
                >
                  No charges have been applied to your account. You can try again or contact us for assistance.
                </motion.p>
              </div>

              {/* Information Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">What happened?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <p className="text-white/70 text-sm">
                      You cancelled the payment process before completion
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-white/70 text-sm">
                      No charges were made to your payment method
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <p className="text-white/70 text-sm">
                      Your project information is still saved and ready to proceed
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">What would you like to do?</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-left">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-purple-400" />
                      Try Payment Again
                    </h4>
                    <p className="text-white/60 text-sm mb-3">
                      Go back to the estimate page and complete your payment
                    </p>
                    <Link to="/estimate">
                      <motion.button
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all duration-300 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back to Estimate
                      </motion.button>
                    </Link>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 text-left">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      Get Free Quote
                    </h4>
                    <p className="text-white/60 text-sm mb-3">
                      Discuss your project with us before making any payment
                    </p>
                    <Link to="/contact">
                      <motion.button
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-medium transition-all duration-300 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Contact Us
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/estimate">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Try Again
                  </motion.button>
                </Link>
                
                <Link to="/">
                  <motion.button
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </motion.button>
                </Link>
              </motion.div>

              {/* Support Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-white/60 text-sm"
              >
                <p>
                  Having trouble? We're here to help!{' '}
                  <a href="mailto:support@mywebsite.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Contact our support team
                  </a>
                  {' '}and we'll assist you with your payment.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cancel;