import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Mail, Calendar, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '@/components/SEO';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optional: Fetch session details from your backend
    const fetchSessionData = async () => {
      if (sessionId) {
        try {
          // You can create an endpoint to fetch session details
          // const response = await fetch(`/api/checkout-session/${sessionId}`);
          // const data = await response.json();
          // setSessionData(data);
          
          // For now, we'll just show a success message
          setSessionData({ id: sessionId });
        } catch (error) {
          console.error('Error fetching session data:', error);
        }
      }
      setLoading(false);
    };

    fetchSessionData();
  }, [sessionId]);

  return (
    <>
      <SEO
        title="Payment Successful - Thank You for Choosing DevTone"
        description="Your payment has been processed successfully! Thank you for choosing DevTone for your web development project. We'll be in touch soon to get started."
        keywords={['payment success', 'DevTone order confirmation', 'web development project', 'successful payment']}
        ogUrl="https://www.devtone.agency/success"
      />
      
      <div className="min-h-screen bg-[#030718] pt-24 pb-12">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"
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
            className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"
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
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-white/60">Confirming your payment...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Success Message */}
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold text-white"
                  >
                    Payment Successful! 🎉
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-white/80"
                  >
                    Thank you for choosing our web development services!
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/60"
                  >
                    Your payment has been processed successfully. We're excited to start working on your project!
                  </motion.p>
                </div>

                {/* Session Info */}
                {sessionId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Transaction ID:</span>
                        <span className="text-white font-mono">{sessionId.slice(0, 20)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Status:</span>
                        <span className="text-green-400 font-medium">Paid</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Date:</span>
                        <span className="text-white">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Next Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    What happens next?
                  </h3>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                      <div>
                        <h4 className="text-white font-medium">Confirmation Email</h4>
                        <p className="text-white/60 text-sm">You'll receive a detailed confirmation email within 5 minutes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                      <div>
                        <h4 className="text-white font-medium">Project Kickoff</h4>
                        <p className="text-white/60 text-sm">Our team will contact you within 24 hours to schedule a kickoff call.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                      <div>
                        <h4 className="text-white font-medium">Development Begins</h4>
                        <p className="text-white/60 text-sm">We'll start working on your project according to the agreed timeline.</p>
                      </div>
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
                  <motion.a
                    href="mailto:hello@devtone.agency"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-4 h-4" />
                    Contact DevTone
                  </motion.a>
                  
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
                    Need help? Contact DevTone at{' '}
                    <a href="mailto:support@devtone.agency" className="text-purple-400 hover:text-purple-300 transition-colors">
                      support@devtone.agency
                    </a>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;