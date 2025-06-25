import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
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
  Mail,
  Globe,
  User,
  Building,
  Phone,
  MessageSquare,
  Send,
  MapPin,
  Calendar,
  ChevronDown,
  Search
} from 'lucide-react';
import SEO from '@/components/SEO';
import { useResendForm } from '@/hooks/useResendForm';

// ... (rest of your interfaces and component setup remains the same)

const EstimateWithResend = () => {
  // Use Resend hook instead of Formspree
  const { isSubmitting, isSuccess, error, submitForm } = useResendForm();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    industry: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    features: [],
    retainer: 'none'
  });

  // ... (rest of your state and functions remain the same)

  // Handle form submission with Resend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.company || !formData.country || !formData.industry || 
        !formData.projectType || !formData.budget || !formData.timeline) {
      alert('Please fill in all required fields');
      return;
    }

    await submitForm(formData);
  };

  // Show success message
  if (isSuccess) {
    return (
      <>
        <SEO
          title="Estimate Request Submitted - DevTone"
          description="Thank you for your estimate request! DevTone will review your project details and get back to you within 24 hours."
          keywords={['estimate submitted', 'DevTone response', 'project quote']}
          ogUrl="https://devtone.com/estimate"
        />
        <div className="min-h-screen bg-[#030718] pt-24 pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Thank You!
                  </h1>
                  <p className="text-xl text-white/80 mb-6">
                    Your estimate request has been submitted successfully.
                  </p>
                  <p className="text-white/60">
                    Check your email for a confirmation. Our team will review your project details and get back to you within 24 hours with a detailed proposal.
                  </p>
                </div>

                <motion.a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Get Your Project Estimate - DevTone Web Development"
        description="Get an instant estimate for your web development project with DevTone. Transparent pricing, professional service, and secure payment options. Start your project today!"
        keywords={['DevTone estimate', 'web development pricing', 'project quote', 'website cost calculator', 'development estimate', 'transparent pricing']}
        ogUrl="https://devtone.com/estimate"
      />

      <div className="min-h-screen bg-[#030718] pt-24 pb-12">
        {/* Your existing hero section and form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* All your existing form fields */}
          
          {/* Error message display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <p className="text-red-400 text-sm text-center">
                {error}. Please try again or contact us at team@devtone.com
              </p>
            </motion.div>
          )}

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.phone || !formData.company || !formData.country || !formData.industry || !formData.projectType || !formData.budget || !formData.timeline}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Get My Estimate
                </>
              )}
            </motion.button>

            <p className="text-white/60 text-sm mt-4">
              We'll review your request and get back to you within 24 hours
            </p>
          </motion.div>
        </form>
      </div>
    </>
  );
};

export default EstimateWithResend;