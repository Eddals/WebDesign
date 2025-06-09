/*************  ✨ Codeium Command 🌟  *************/
"use client"

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Calculator, Rocket, Target, Clock, DollarSign, CheckCircle, 
  ArrowRight, Sparkles, Zap, Globe, Users, TrendingUp,
  Star, Award, Shield, Lightbulb, Code, Palette, Monitor,
  MessageSquare, Phone, Mail, Calendar, FileText, Download
} from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ProjectDetails {
  projectType: string;
  budget: string;
  timeline: string;
  features: string[];
  description: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}

const Estimate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    projectType: '',
    budget: '',
    timeline: '',
    features: [],
    description: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const projectTypes = [
    {
      id: 'website',
      title: 'Business Website',
      description: 'Professional website for your business',
      icon: <Globe className="w-8 h-8" />,
      basePrice: 2500,
      features: ['Responsive Design', 'SEO Optimized', 'Contact Forms', 'Analytics']
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Store',
      description: 'Online store with payment integration',
      icon: <Monitor className="w-8 h-8" />,
      basePrice: 5000,
      features: ['Product Catalog', 'Payment Gateway', 'Inventory Management', 'Order Tracking']
    },
    {
      id: 'webapp',
      title: 'Web Application',
      description: 'Custom web application solution',
      icon: <Code className="w-8 h-8" />,
      basePrice: 8000,
      features: ['Custom Development', 'Database Integration', 'User Authentication', 'API Development']
    },
    {
      id: 'landing',
      title: 'Landing Page',
      description: 'High-converting landing page',
      icon: <Rocket className="w-8 h-8" />,
      basePrice: 1200,
      features: ['Conversion Optimized', 'A/B Testing Ready', 'Lead Capture', 'Analytics']
    }
  ];

  const budgetRanges = [
    { id: 'small', label: '$1,000 - $5,000', multiplier: 0.8 },
    { id: 'medium', label: '$5,000 - $15,000', multiplier: 1.0 },
    { id: 'large', label: '$15,000 - $50,000', multiplier: 1.5 },
    { id: 'enterprise', label: '$50,000+', multiplier: 2.0 }
  ];

  const timelineOptions = [
    { id: 'rush', label: '1-2 weeks (Rush)', multiplier: 1.5 },
    { id: 'standard', label: '3-6 weeks (Standard)', multiplier: 1.0 },
    { id: 'flexible', label: '2-3 months (Flexible)', multiplier: 0.9 }
  ];

  const additionalFeatures = [
    { id: 'seo', label: 'SEO Optimization', price: 800 },
    { id: 'cms', label: 'Content Management System', price: 1200 },
    { id: 'analytics', label: 'Advanced Analytics', price: 500 },
    { id: 'security', label: 'Enhanced Security', price: 600 },
    { id: 'maintenance', label: '6 Months Maintenance', price: 1000 },
    { id: 'training', label: 'Team Training', price: 400 }
  ];

  const calculateEstimate = () => {
    const selectedProject = projectTypes.find(p => p.id === projectDetails.projectType);
    if (!selectedProject) return 0;

    let basePrice = selectedProject.basePrice;
    
    const budgetMultiplier = budgetRanges.find(b => b.id === projectDetails.budget)?.multiplier || 1;
    const timelineMultiplier = timelineOptions.find(t => t.id === projectDetails.timeline)?.multiplier || 1;
    
    const featuresPrice = projectDetails.features.reduce((total, featureId) => {
      const feature = additionalFeatures.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);

    const totalPrice = (basePrice * budgetMultiplier * timelineMultiplier) + featuresPrice;
    return Math.round(totalPrice);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 3) {
        setEstimatedPrice(calculateEstimate());
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const estimateData = {
        project_type: projectDetails.projectType,
        budget_range: projectDetails.budget,
        timeline: projectDetails.timeline,
        features: projectDetails.features.join(', '),
        description: projectDetails.description,
        full_name: projectDetails.contactInfo.name,
        email: projectDetails.contactInfo.email,
        phone: projectDetails.contactInfo.phone,
        company: projectDetails.contactInfo.company,
        estimated_budget: estimatedPrice,
        status: 'pending'
      };

      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - simulating successful submission');
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        const { error } = await supabase
          .from('quotes')
          .insert(estimateData);

        if (error) {
          throw new Error(error.message);
        }
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting estimate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (isSubmitted) {
    return (
      <>
        <SEO
          title="Estimate Submitted | Professional Web Development"
          description="Thank you for your estimate request. We'll get back to you within 24 hours with a detailed proposal."
          keywords={['estimate submitted', 'web development quote', 'project proposal']}
          ogUrl="https://matheusweb.com/estimate"
        />
        <div className="min-h-screen pt-24 pb-16 bg-[#030718] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Estimate Submitted Successfully!
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              Thank you for your interest! We'll review your project details and get back to you within 24 hours with a detailed proposal.
            </p>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Your Estimated Investment</h3>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                ${estimatedPrice.toLocaleString()}
              </div>
              <p className="text-white/60">*Final price may vary based on detailed requirements</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-full font-semibold transition-colors"
                className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Get a Free Project Estimate | Professional Web Development"
        description="Get a detailed estimate for your web development project. Our interactive calculator provides instant pricing based on your specific requirements."
        keywords={['web development estimate', 'project quote', 'website pricing', 'development cost calculator']}
        ogUrl="https://matheusweb.com/estimate"
      />
      
      <div className="min-h-screen bg-[#030718] overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          style={{ opacity, scale }}
          className="pt-24 pb-16"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-8">
                <Calculator className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Smart Estimate Calculator</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Get Your Project
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Estimate
                </span>
              </h1>

              <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
                Our intelligent calculator provides instant, accurate estimates for your web development project. 
                Answer a few questions and get a detailed breakdown in minutes.
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex justify-between items-center mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        step <= currentStep
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: "25%" }}
                    animate={{ width: `${(currentStep / 4) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Form Steps */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Project Type */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-2">What type of project do you need?</h2>
                  <p className="text-white/60 mb-8">Choose the option that best describes your project</p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {projectTypes.map((type) => (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setProjectDetails({...projectDetails, projectType: type.id})}
                        className={`p-6 rounded-full border-2 cursor-pointer transition-all ${
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          projectDetails.projectType === type.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${
                          <div className={`p-3 rounded-lg ${
                            projectDetails.projectType === type.id
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-purple-400'
                          }`}>
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                            <p className="text-white/60 mb-4">{type.description}</p>
                            <div className="text-2xl font-bold text-purple-400 mb-3">
                              Starting at ${type.basePrice.toLocaleString()}
                            </div>
                            <div className="space-y-1">
                              {type.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      disabled={!projectDetails.projectType}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Budget & Timeline */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-2">Budget & Timeline</h2>
                  <p className="text-white/60 mb-8">Help us understand your project constraints</p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Budget */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-purple-400" />
                        Budget Range
                      </h3>
                      <div className="space-y-3">
                        {budgetRanges.map((budget) => (
                          <motion.div
                            key={budget.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setProjectDetails({...projectDetails, budget: budget.id})}
                            className={`p-4 rounded-full border cursor-pointer transition-all ${
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              projectDetails.budget === budget.id
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="font-semibold text-white">{budget.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h
                        <Clock className="w-5 h-5 text-purple-400" />
                        Timeline
                      </h3>
                      <div className="space-y-3">
                        {timelineOptions.map((timeline) => (
                          <motion.div
                            key={timeline.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setProjectDetails({...projectDetails, timeline: timeline.id})}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              projectDetails.timeline === timeline.id
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="font-semibold text-white">{timeline.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentStep(1)}
                      className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      disabled={!projectDetails.budget || !projectDetails.timeline}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Features & Description */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-2">Additional Features</h2>
                  <p className="text-white/60 mb-8">Select any additional features you need</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {additionalFeatures.map((feature) => (
                      <motion.div
                        key={feature.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const newFeatures = projectDetails.features.includes(feature.id)
                            ? projectDetails.features.filter(f => f !== feature.id)
                            : [...projectDetails.features, feature.id];
                          setProjectDetails({...projectDetails, features: newFeatures});
                        }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          projectDetails.features.includes(feature.id)
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-white">{feature.label}</div>
                            <div className="text-purple-400 font-bold">+${feature.price}</div>
                          </div>
                          {projectDetails.features.includes(feature.id) && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mb-8">
                    <label className="block text-white font-semibold mb-3">
                      Project Description (Optional)
                    </label>
                    <textarea
                      value={projectDetails.description}
                      onChange={(e) => setProjectDetails({...projectDetails, description: e.target.value})}
                      placeholder="Tell us more about your project requirements, goals, and any specific features you need..."
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentStep(2)}
                      className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      Get Estimate <Calculator className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Contact Info & Final Estimate */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-6"
                    >
                      <Sparkles className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-medium">Estimate Ready!</span>
                    </motion.div>

                    <h2 className="text-4xl font-bold text-white mb-4">Your Project Estimate</h2>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                    >
                      ${estimatedPrice.toLocaleString()}
                    </motion.div>
                    <p className="text-white/60">*Final price may vary based on detailed requirements</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/70 mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={projectDetails.contactInfo.name}
                            onChange={(e) => setProjectDetails({
                              ...projectDetails,
                              contactInfo: {...projectDetails.contactInfo, name: e.target.value}
                            })}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-2">Email *</label>
                          <input
                            type="email"
                            value={projectDetails.contactInfo.email}
                            onChange={(e) => setProjectDetails({
                              ...projectDetails,
                              contactInfo: {...projectDetails.contactInfo, email: e.target.value}
                            })}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={projectDetails.contactInfo.phone}
                            onChange={(e) => setProjectDetails({
                              ...projectDetails,
                              contactInfo: {...projectDetails.contactInfo, phone: e.target.value}
                            })}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-2">Company</label>
                          <input
                            type="text"
                            value={projectDetails.contactInfo.company}
                            onChange={(e) => setProjectDetails({
                              ...projectDetails,
                              contactInfo: {...projectDetails.contactInfo, company: e.target.value}
                            })}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                            placeholder="Your Company"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Project Summary</h3>
                      <div className="bg-white/5 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/70">Project Type:</span>
                          <span className="text-white font-semibold">
                            {projectTypes.find(p => p.id === projectDetails.projectType)?.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Budget Range:</span>
                          <span className="text-white font-semibold">
                            {budgetRanges.find(b => b.id === projectDetails.budget)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Timeline:</span>
                          <span className="text-white font-semibold">
                            {timelineOptions.find(t => t.id === projectDetails.timeline)?.label}
                          </span>
                        </div>
                        {projectDetails.features.length > 0 && (
                          <div>
                            <span className="text-white/70">Additional Features:</span>
                            <div className="mt-2 space-y-1">
                              {projectDetails.features.map(featureId => {
                                const feature = additionalFeatures.find(f => f.id === featureId);
                                return (
                                  <div key={featureId} className="flex justify-between text-sm">
                                    <span className="text-white/60">{feature?.label}</span>
                                    <span className="text-purple-400">+${feature?.price}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentStep(3)}
                      className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={!projectDetails.contactInfo.name || !projectDetails.contactInfo.email || isSubmitting}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Estimate <Rocket className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Estimate; 

/******  59419d7b-5384-4e77-9f18-0b3b5afcf528  *******/