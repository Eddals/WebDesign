"use client"

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Calculator,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  Zap,
  Shield,
  Star,
  Users,
  ShoppingCart,
  Briefcase,
  Code,
  Palette,
  Mail,
  Globe,
  Search,
  BarChart3,
  Smartphone
} from 'lucide-react';
import SEO from '@/components/SEO';
import StripeCheckout from '@/components/StripeCheckout';

// Circular design styles with purple theme
const customStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .glass-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(147, 51, 234, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(147, 51, 234, 0.15);
  }

  .circular-card {
    border-radius: 50%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .rounded-card {
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .rounded-card:hover {
    border-radius: 40px;
    background: rgba(147, 51, 234, 0.1);
    border: 1px solid rgba(147, 51, 234, 0.3);
    transform: scale(1.02);
  }

  .floating-animation {
    animation: float 4s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  .pulse-purple {
    animation: pulse-purple 2s infinite;
  }

  @keyframes pulse-purple {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 0 15px rgba(147, 51, 234, 0);
      transform: scale(1.02);
    }
  }

  .circular-progress {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, #8b5cf6, #a855f7, #c084fc, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .circular-progress::before {
    content: '';
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #030718;
    position: absolute;
  }

  .price-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border-radius: 28px;
  }

  .price-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 25px 50px rgba(147, 51, 234, 0.2);
    border-radius: 32px;
  }

  .price-card.popular {
    transform: scale(1.05);
    border: 2px solid #8b5cf6;
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
    border-radius: 32px;
  }

  .price-card.popular::before {
    content: 'POPULAR';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(45deg, #8b5cf6, #a855f7);
    color: white;
    padding: 6px 20px;
    border-radius: 25px;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }

  .circular-button {
    border-radius: 50px;
    transition: all 0.3s ease;
  }

  .circular-button:hover {
    border-radius: 60px;
    transform: scale(1.05);
  }

  .feature-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(168, 85, 247, 0.1));
    border: 1px solid rgba(147, 51, 234, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }
`;

interface FormData {
  // Personal Info
  name: string;
  email: string;
  phone: string;
  company: string;

  // Project Details
  projectType: string;
  budget: string;
  timeline: string;
  description: string;

  // Features & Requirements
  features: string[];
  paymentModel: string;
  subscriptionPlan: string;
}

const Estimate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    features: [],
    paymentModel: 'one-time',
    subscriptionPlan: ''
  });

  const [showPayment, setShowPayment] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  // Animation references
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const totalSteps = 4;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Simplified project types with reasonable pricing
  const projectTypes = [
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Simple, effective landing page',
      icon: <Zap className="w-8 h-8" />,
      basePrice: 299,
      competitorPrice: 800,
      savings: 501,
      features: [
        'Responsive Design',
        'Contact Form',
        'Basic SEO',
        'Mobile Optimized'
      ],
      monthlyOption: 49,
      popular: false
    },
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'Showcase your work professionally',
      icon: <Palette className="w-8 h-8" />,
      basePrice: 499,
      competitorPrice: 1200,
      savings: 701,
      features: [
        'Custom Design',
        'Gallery System',
        'Contact Integration',
        'Blog Section',
        '1 Month Support'
      ],
      monthlyOption: 79,
      popular: false
    },
    {
      id: 'business',
      name: 'Business Website',
      description: 'Professional business presence',
      icon: <Briefcase className="w-8 h-8" />,
      basePrice: 799,
      competitorPrice: 2000,
      savings: 1201,
      features: [
        'Custom Design',
        'CMS Integration',
        'SEO Optimization',
        'Contact Forms',
        'Analytics Setup',
        '3 Months Support'
      ],
      monthlyOption: 129,
      popular: true
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      description: 'Online store with payment processing',
      icon: <ShoppingCart className="w-8 h-8" />,
      basePrice: 1299,
      competitorPrice: 3500,
      savings: 2201,
      features: [
        'Store Design',
        'Payment Gateway',
        'Product Management',
        'Order Tracking',
        'Customer Accounts',
        '6 Months Support'
      ],
      monthlyOption: 199,
      popular: false
    },
    {
      id: 'webapp',
      name: 'Web Application',
      description: 'Custom web application',
      icon: <Code className="w-8 h-8" />,
      basePrice: 2499,
      competitorPrice: 6000,
      savings: 3501,
      features: [
        'Custom Development',
        'Database Integration',
        'User Authentication',
        'Admin Dashboard',
        'API Development',
        '12 Months Support'
      ],
      monthlyOption: 399,
      popular: false
    }
  ];

  // Budget ranges
  const budgetRanges = [
    { id: 'starter', label: '$500 - $1,500', value: 'starter' },
    { id: 'professional', label: '$1,500 - $5,000', value: 'professional' },
    { id: 'premium', label: '$5,000 - $15,000', value: 'premium' },
    { id: 'enterprise', label: '$15,000+', value: 'enterprise' }
  ];

  // Timeline options
  const timelineOptions = [
    { id: 'asap', label: 'ASAP (Rush)', value: 'asap', multiplier: 1.5 },
    { id: '2weeks', label: '2-4 Weeks', value: '2weeks', multiplier: 1.0 },
    { id: '1month', label: '1-2 Months', value: '1month', multiplier: 0.9 },
    { id: 'flexible', label: 'Flexible', value: 'flexible', multiplier: 0.8 }
  ];

  // Simplified available features with affordable pricing
  const availableFeatures = [
    {
      id: 'seo',
      name: 'SEO Optimization',
      price: 149,
      originalPrice: 299,
      description: 'Basic SEO setup with meta tags and keyword optimization',
      icon: <Search className="w-5 h-5" />
    },
    {
      id: 'analytics',
      name: 'Analytics Setup',
      price: 79,
      originalPrice: 149,
      description: 'Google Analytics integration and basic tracking',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'social',
      name: 'Social Media Integration',
      price: 99,
      originalPrice: 199,
      description: 'Social sharing buttons and basic social integration',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'security',
      name: 'Security Package',
      price: 129,
      originalPrice: 249,
      description: 'SSL certificate and basic security features',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'performance',
      name: 'Speed Optimization',
      price: 99,
      originalPrice: 199,
      description: 'Image optimization and basic performance improvements',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'maintenance',
      name: '6 Months Support',
      price: 199,
      originalPrice: 399,
      description: 'Extended support and maintenance for 6 months',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'training',
      name: 'Training Session',
      price: 99,
      originalPrice: 199,
      description: 'One-hour training session on managing your website',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'backup',
      name: 'Automated Backups',
      price: 49,
      originalPrice: 99,
      description: 'Daily automated backups for peace of mind',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  // Payment plans
  const paymentPlans = [
    {
      id: 'one-time',
      name: 'One-Time Payment',
      description: 'Pay once, own forever',
      discount: 0,
      badge: 'Best Value',
      features: [
        'Full ownership of code',
        'No recurring fees',
        'Lifetime updates for 1 year',
        'Priority support'
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly Payments',
      description: 'Spread the cost over 12 months',
      discount: 0.15, // 15% more expensive
      badge: 'Most Popular',
      features: [
        'No upfront costs',
        'Flexible payment terms',
        'Ongoing support included',
        'Regular updates'
      ]
    },
    {
      id: 'subscription',
      name: 'Subscription Model',
      description: 'Monthly subscription with hosting',
      discount: -0.20, // 20% cheaper but recurring
      badge: 'All Inclusive',
      features: [
        'Hosting included',
        'Unlimited updates',
        '24/7 support',
        'Performance monitoring'
      ]
    }
  ];

  // Calculate estimated price
  const calculatePrice = () => {
    if (!formData.projectType) return 0;

    const selectedProject = projectTypes.find(p => p.id === formData.projectType);
    if (!selectedProject) return 0;

    let basePrice = selectedProject.basePrice;

    // Apply timeline multiplier
    const selectedTimeline = timelineOptions.find(t => t.value === formData.timeline);
    if (selectedTimeline) {
      basePrice *= selectedTimeline.multiplier;
    }

    // Add feature costs
    const featureCosts = formData.features.reduce((total, featureId) => {
      const feature = availableFeatures.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);

    return Math.round(basePrice + featureCosts);
  };

  // Handle form updates
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle feature toggle
  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.projectType;
      case 3:
        return formData.budget && formData.timeline;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Update estimated price when form data changes
  React.useEffect(() => {
    const price = calculatePrice();
    setEstimatedPrice(price);
  }, [formData]);

  return (
    <>
      <SEO
        title="Get Your Project Estimate | Professional Web Development"
        description="Get a detailed estimate for your web development project. Interactive pricing calculator with instant quotes and secure Stripe payments."
        keywords={['web development estimate', 'project quote', 'website pricing', 'development cost calculator']}
        ogUrl="https://matheusweb.com/estimate"
      />

      <div className="min-h-screen pt-24 bg-[#030718] overflow-hidden">
        {/* Custom styles */}
        <style>{customStyles}</style>

        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          style={{ opacity, scale }}
          className="relative py-20"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Calculator className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">Get Your Project Estimate</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                Professional Web Development
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                Made Affordable
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Get a custom website that fits your budget. Transparent pricing,
              quality work, and ongoing support included.
            </motion.p>

            {/* Simple Benefits */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="rounded-card p-6">
                <div className="feature-circle">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-white font-semibold mb-1">Fair Pricing</div>
                <div className="text-white/70 text-sm">No hidden fees or surprises</div>
              </div>

              <div className="rounded-card p-6">
                <div className="feature-circle">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-white font-semibold mb-1">Fast Delivery</div>
                <div className="text-white/70 text-sm">Quick turnaround times</div>
              </div>

              <div className="rounded-card p-6">
                <div className="feature-circle">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-white font-semibold mb-1">Quality Support</div>
                <div className="text-white/70 text-sm">Ongoing maintenance included</div>
              </div>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              className="flex justify-center items-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      i + 1 <= currentStep
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {i + 1 < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        i + 1 < currentStep ? 'bg-purple-500' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Form Container */}
        <div className="container mx-auto px-4 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-12">

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                      Let's Get Started
                    </h2>
                    <p className="text-white/70">Tell us about yourself and your company</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-3">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Project Type */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                      Choose Your Project Type
                    </h2>
                    <p className="text-white/70">Select the type of website that best fits your needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectTypes.map((project) => (
                      <motion.div
                        key={project.id}
                        className={`relative cursor-pointer group price-card ${
                          project.popular ? 'popular' : ''
                        } ${formData.projectType === project.id ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, projectType: project.id }))}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`rounded-card p-8 h-full transition-all duration-300 ${
                          formData.projectType === project.id
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'hover:bg-white/10'
                        }`}>
                          {/* Circular Icon */}
                          <div className="feature-circle floating-animation">
                            <div className="text-purple-400">{project.icon}</div>
                          </div>

                          <h3 className="text-xl font-semibold text-white mb-3 text-center">{project.name}</h3>
                          <p className="text-white/70 text-sm mb-6 text-center">{project.description}</p>

                          {/* Circular Pricing Display */}
                          <div className="circular-progress mx-auto mb-6">
                            <div className="relative z-10 text-center">
                              <div className="text-2xl font-bold text-white">
                                ${project.basePrice}
                              </div>
                              <div className="text-xs text-purple-300">
                                was ${project.competitorPrice}
                              </div>
                            </div>
                          </div>

                          <div className="text-center mb-6">
                            <div className="text-sm text-purple-400 mb-2">
                              Or ${project.monthlyOption}/month
                            </div>
                            <div className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                              Save ${project.savings}
                            </div>
                          </div>

                          {/* Features */}
                          <ul className="space-y-2">
                            {project.features.map((feature, idx) => (
                              <li key={idx} className="text-white/70 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* Selection Indicator */}
                          {formData.projectType === project.id && (
                            <div className="absolute inset-0 bg-purple-500/10 rounded-card border-2 border-purple-500 pointer-events-none">
                              <div className="absolute top-6 right-6 bg-purple-500 text-white rounded-full p-2">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>


                </motion.div>
              )}

              {/* Step 3: Budget & Timeline */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                      Budget & Timeline
                    </h2>
                    <p className="text-white/70">Help us understand your project requirements</p>
                  </div>

                  <div className="space-y-8">
                    {/* Budget Selection */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-6">What's your budget range?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {budgetRanges.map((budget) => (
                          <motion.div
                            key={budget.id}
                            className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                              formData.budget === budget.value
                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, budget: budget.value }))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <DollarSign className="w-5 h-5" />
                              <span className="font-medium">{budget.label}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Selection */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-6">When do you need it completed?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {timelineOptions.map((timeline) => (
                          <motion.div
                            key={timeline.id}
                            className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                              formData.timeline === timeline.value
                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, timeline: timeline.value }))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">{timeline.label}</span>
                              </div>
                              {timeline.multiplier !== 1.0 && (
                                <span className="text-sm text-purple-400">
                                  {timeline.multiplier > 1 ? '+' : ''}{((timeline.multiplier - 1) * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div>
                      <label className="block text-xl font-semibold text-white mb-6">
                        Tell us about your project
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 h-32"
                        placeholder="Describe your project goals, target audience, and any specific requirements..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Features & Payment */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                      Premium Add-ons & Payment Options
                    </h2>
                    <p className="text-white/70">Enhance your project with professional features</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Features Selection */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        Premium Add-ons
                      </h3>
                      <div className="space-y-4">
                        {availableFeatures.map((feature) => (
                          <motion.div
                            key={feature.id}
                            className={`cursor-pointer p-5 rounded-xl border transition-all duration-300 glow-effect ${
                              formData.features.includes(feature.id)
                                ? 'bg-purple-500/20 border-purple-500 shimmer'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => toggleFeature(feature.id)}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-1 ${
                                  formData.features.includes(feature.id)
                                    ? 'bg-purple-500 border-purple-500'
                                    : 'border-white/30'
                                }`}>
                                  {formData.features.includes(feature.id) && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-purple-400">{feature.icon}</span>
                                    <span className="text-white font-semibold">{feature.name}</span>
                                  </div>
                                  <p className="text-white/70 text-sm">{feature.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-purple-300 font-bold text-lg">
                                  ${feature.price}
                                </div>
                                <div className="text-red-400 line-through text-sm">
                                  ${feature.originalPrice}
                                </div>
                                <div className="text-green-400 text-xs">
                                  Save ${feature.originalPrice - feature.price}
                                </div>
                              </div>
                            </div>

                            {/* Popular badge for certain features */}
                            {['seo', 'maintenance', 'mobile'].includes(feature.id) && (
                              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-1 text-yellow-400 text-xs font-medium inline-block">
                                🔥 Most Popular
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Payment Plan Selection */}
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-purple-400" />
                          Payment Options
                        </h3>
                        <div className="space-y-4">
                          {paymentPlans.map((plan) => (
                            <motion.div
                              key={plan.id}
                              className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                                formData.paymentModel === plan.id
                                  ? 'bg-purple-500/20 border-purple-500'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                              onClick={() => setFormData(prev => ({ ...prev, paymentModel: plan.id }))}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    formData.paymentModel === plan.id
                                      ? 'bg-purple-500 border-purple-500'
                                      : 'border-white/30'
                                  }`}>
                                    {formData.paymentModel === plan.id && (
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-white font-semibold">{plan.name}</span>
                                    {plan.badge && (
                                      <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                        {plan.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {plan.discount !== 0 && (
                                  <span className={`text-sm font-medium ${
                                    plan.discount > 0 ? 'text-red-400' : 'text-green-400'
                                  }`}>
                                    {plan.discount > 0 ? '+' : ''}{(plan.discount * 100).toFixed(0)}%
                                  </span>
                                )}
                              </div>
                              <p className="text-white/70 text-sm mb-3">{plan.description}</p>
                              <ul className="space-y-1">
                                {plan.features.map((feature, idx) => (
                                  <li key={idx} className="text-white/60 text-xs flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-purple-400" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Price Summary & Payment */}
                    <div>
                      <div className="glass-card rounded-2xl p-6 mb-6 glow-effect">
                        <div className="flex items-center gap-2 mb-6">
                          <h3 className="text-xl font-semibold text-white">Project Summary</h3>
                          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full pulse-purple">
                            LIVE PRICING
                          </div>
                        </div>

                        {/* Selected Project */}
                        {formData.projectType && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white font-medium">
                                {projectTypes.find(p => p.id === formData.projectType)?.name}
                              </span>
                              <div className="text-right">
                                <div className="text-purple-300 font-bold text-lg">
                                  ${projectTypes.find(p => p.id === formData.projectType)?.basePrice.toLocaleString()}
                                </div>
                                <div className="text-red-400 line-through text-sm">
                                  ${projectTypes.find(p => p.id === formData.projectType)?.competitorPrice.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-green-400 text-sm">
                              ✓ You save ${projectTypes.find(p => p.id === formData.projectType)?.savings.toLocaleString()} vs competitors
                            </div>
                          </div>
                        )}

                        {/* Payment Plan Impact */}
                        {formData.paymentModel && formData.paymentModel !== 'one-time' && (
                          <div className="mb-4 p-4 bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center">
                              <span className="text-white">
                                Payment Plan: {paymentPlans.find(p => p.id === formData.paymentModel)?.name}
                              </span>
                              <span className={`font-semibold ${
                                paymentPlans.find(p => p.id === formData.paymentModel)?.discount > 0
                                  ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {paymentPlans.find(p => p.id === formData.paymentModel)?.discount > 0 ? '+' : ''}
                                {((paymentPlans.find(p => p.id === formData.paymentModel)?.discount || 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Timeline Adjustment */}
                        {formData.timeline && (
                          <div className="mb-4 p-4 bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center">
                              <span className="text-white">
                                Timeline: {timelineOptions.find(t => t.value === formData.timeline)?.label}
                              </span>
                              <span className={`font-semibold ${
                                (timelineOptions.find(t => t.value === formData.timeline)?.multiplier || 1) > 1
                                  ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {timelineOptions.find(t => t.value === formData.timeline)?.multiplier !== 1
                                  ? `${((timelineOptions.find(t => t.value === formData.timeline)?.multiplier || 1) - 1) * 100 > 0 ? '+' : ''}${((timelineOptions.find(t => t.value === formData.timeline)?.multiplier || 1) - 1) * 100}%`
                                  : 'Standard'
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Selected Features */}
                        {formData.features.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              Premium Add-ons:
                            </h4>
                            {formData.features.map(featureId => {
                              const feature = availableFeatures.find(f => f.id === featureId);
                              return feature ? (
                                <div key={featureId} className="flex justify-between items-center p-3 bg-white/5 rounded-lg mb-2 border border-purple-500/20">
                                  <div className="flex items-center gap-2">
                                    <span className="text-purple-400">{feature.icon}</span>
                                    <span className="text-white/90 text-sm">{feature.name}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-purple-300 font-semibold text-sm">
                                      +${feature.price}
                                    </div>
                                    <div className="text-red-400 line-through text-xs">
                                      ${feature.originalPrice}
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}

                        {/* Savings Summary */}
                        {formData.projectType && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
                            <div className="text-center">
                              <div className="text-green-400 font-bold text-lg mb-1">
                                Total Savings: ${(
                                  (projectTypes.find(p => p.id === formData.projectType)?.savings || 0) +
                                  formData.features.reduce((total, featureId) => {
                                    const feature = availableFeatures.find(f => f.id === featureId);
                                    return total + ((feature?.originalPrice || 0) - (feature?.price || 0));
                                  }, 0)
                                ).toLocaleString()}
                              </div>
                              <div className="text-green-300 text-sm">vs competitor pricing</div>
                            </div>
                          </div>
                        )}

                        {/* Total Price */}
                        <div className="border-t border-white/20 pt-6">
                          <div className="text-center mb-4">
                            <div className="text-white/70 text-sm mb-2">Your Investment:</div>
                            <div className="text-4xl font-bold text-purple-400 mb-2">
                              ${estimatedPrice?.toLocaleString() || '0'}
                            </div>
                            {formData.paymentModel === 'monthly' && estimatedPrice && (
                              <div className="text-purple-300 text-lg">
                                or ${Math.round(estimatedPrice / 12).toLocaleString()}/month
                              </div>
                            )}
                            {formData.paymentModel === 'subscription' && estimatedPrice && (
                              <div className="text-purple-300 text-lg">
                                or ${Math.round(estimatedPrice * 0.15).toLocaleString()}/month subscription
                              </div>
                            )}
                          </div>

                          {/* Value Proposition */}
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                            <div className="text-white font-semibold mb-2">🎯 What You Get:</div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
                              <div>✓ Premium Design</div>
                              <div>✓ Mobile Optimized</div>
                              <div>✓ SEO Ready</div>
                              <div>✓ Fast Loading</div>
                              <div>✓ Secure Hosting</div>
                              <div>✓ 24/7 Support</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Payment Options */}
                      <div className="space-y-4">
                        {/* Primary CTA */}
                        <motion.button
                          onClick={() => setShowPayment(true)}
                          className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 pulse-purple glow-effect relative overflow-hidden"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
                          <CreditCard className="w-6 h-6" />
                          <div className="text-center">
                            <div>Start Project Now - Pay Securely</div>
                            <div className="text-sm font-normal opacity-90">
                              {formData.paymentModel === 'monthly' && estimatedPrice
                                ? `Just $${Math.round(estimatedPrice / 12)}/month`
                                : '100% Money-Back Guarantee'
                              }
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            SAVE 60%
                          </div>
                        </motion.button>

                        {/* Secondary CTA */}
                        <motion.button
                          onClick={() => {
                            // Handle quote request with more sophisticated logic
                            const projectDetails = {
                              type: formData.projectType,
                              features: formData.features,
                              budget: formData.budget,
                              timeline: formData.timeline,
                              estimatedPrice: estimatedPrice
                            };
                            console.log('Quote request:', projectDetails);
                            alert('🎉 Quote request sent! Our team will contact you within 2 hours with a detailed proposal.');
                          }}
                          className="w-full py-4 px-6 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 border border-white/20 hover:border-purple-500/50"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Mail className="w-5 h-5" />
                          <div className="text-center">
                            <div>Get Custom Quote Instead</div>
                            <div className="text-sm font-normal opacity-80">Free consultation included</div>
                          </div>
                        </motion.button>

                      </div>

                      {/* Trust Indicators */}
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span>SSL Secured</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>4.9/5 Rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-400" />
                            <span>Professional Service</span>
                          </div>
                        </div>

                        {/* Money Back Guarantee */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium text-sm">30-Day Money-Back Guarantee</span>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="text-center">
                          <div className="text-white/60 text-sm mb-2">Secure payment with</div>
                          <div className="flex items-center justify-center">
                            <div className="bg-white/10 rounded-lg px-4 py-2 text-white/80 text-sm font-medium border border-white/20">
                              💳 Stripe
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/20">
                <motion.button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentStep === 1
                      ? 'text-white/30 cursor-not-allowed'
                      : 'text-white hover:bg-white/10'
                  }`}
                  whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </motion.button>

                <div className="text-center">
                  <span className="text-white/60">
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>

                <motion.button
                  onClick={nextStep}
                  disabled={!isStepValid() || currentStep === totalSteps}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    !isStepValid() || currentStep === totalSteps
                      ? 'text-white/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                  }`}
                  whileHover={isStepValid() && currentStep < totalSteps ? { scale: 1.05 } : {}}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Stripe Checkout Modal */}
        {showPayment && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#030718] border border-white/20 rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Complete Your Order</h3>
                <p className="text-white/70">Secure payment powered by Stripe</p>
              </div>

              <StripeCheckout
                formData={formData}
                onSuccess={() => {
                  setShowPayment(false);
                  // Handle success
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                  alert('Payment failed. Please try again.');
                }}
              />

              <button
                onClick={() => setShowPayment(false)}
                className="w-full mt-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Estimate;

