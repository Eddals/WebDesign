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
  ChevronDown,
  Search
} from 'lucide-react';
import SEO from '@/components/SEO';
import { submitEstimate } from '@/lib/estimate-api';

interface FormData {
  // Personal Info
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  industry: string;

  // Project Details
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  features: string[];
  retainer: string;
}

const Estimate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
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

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryRef = useRef<HTMLDivElement>(null);

  // Project types - simplified
  const projectTypes = [
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Professional single-page website',
      icon: <Globe className="w-6 h-6" />,
      minBudget: 'starter'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'Showcase your work professionally',
      icon: <Palette className="w-6 h-6" />,
      minBudget: 'starter'
    },
    {
      id: 'business',
      name: 'Business Website',
      description: 'Professional business presence',
      icon: <Briefcase className="w-6 h-6" />,
      minBudget: 'starter'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      description: 'Secure online store',
      icon: <ShoppingCart className="w-6 h-6" />,
      minBudget: 'professional'
    },
    {
      id: 'webapp',
      name: 'Web Application / Dashboard',
      description: 'Custom application or dashboard',
      icon: <Code className="w-6 h-6" />,
      minBudget: 'professional'
    }
  ];

  // Budget ranges - simplified and secure
  const budgetRanges = [
    { 
      id: 'starter', 
      label: '$500 - $1,500', 
      value: 'starter',
      minAmount: 500
    },
    { 
      id: 'professional', 
      label: '$1,500 - $5,000', 
      value: 'professional',
      minAmount: 1500
    },
    { 
      id: 'premium', 
      label: '$5,000 - $15,000', 
      value: 'premium',
      minAmount: 5000
    },
    { 
      id: 'enterprise', 
      label: '$15,000+', 
      value: 'enterprise',
      minAmount: 15000
    }
  ];

  // Monthly retainer options
  const retainerOptions = [
    { 
      id: 'none', 
      label: 'No monthly retainer', 
      value: 'none',
      price: '$0/mo',
      description: 'One-time project only'
    },
    { 
      id: 'basic', 
      label: 'Basic Maintenance', 
      value: 'basic',
      price: '$200/mo',
      description: 'Monthly updates, backups, basic support'
    },
    { 
      id: 'standard', 
      label: 'Standard Support', 
      value: 'standard',
      price: '$500/mo',
      description: 'Weekly updates, priority support, minor changes'
    },
    { 
      id: 'premium', 
      label: 'Premium Management', 
      value: 'premium',
      price: '$1,000/mo',
      description: 'Daily monitoring, unlimited support, ongoing improvements'
    }
  ];

  // Timeline options
  const timelineOptions = [
    { id: 'asap', label: '1-2 Weeks (Rush)', value: 'asap' },
    { id: '1month', label: '1 Month', value: '1month' },
    { id: '2months', label: '2-3 Months', value: '2months' },
    { id: 'flexible', label: 'Flexible Timeline', value: 'flexible' }
  ];

  // Available features with descriptions and budget requirements
  const availableFeatures = [
    { 
      id: 'contact_form', 
      name: 'Contact Form', 
      icon: <Mail className="w-4 h-4" />,
      description: 'Let visitors reach you easily',
      minBudget: 'starter'
    },
    { 
      id: 'blog', 
      name: 'Blog System', 
      icon: <MessageSquare className="w-4 h-4" />,
      description: 'Share updates and improve SEO',
      minBudget: 'starter'
    },
    { 
      id: 'gallery', 
      name: 'Image Gallery', 
      icon: <Palette className="w-4 h-4" />,
      description: 'Showcase photos and portfolio',
      minBudget: 'starter'
    },
    { 
      id: 'newsletter', 
      name: 'Newsletter Signup', 
      icon: <Mail className="w-4 h-4" />,
      description: 'Build your email list',
      minBudget: 'starter'
    },
    { 
      id: 'seo', 
      name: 'SEO Optimization', 
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Rank higher on Google',
      minBudget: 'starter'
    },
    { 
      id: 'social', 
      name: 'Social Media Integration', 
      icon: <Users className="w-4 h-4" />,
      description: 'Connect your social accounts',
      minBudget: 'starter'
    },
    { 
      id: 'live_chat', 
      name: 'Live Chat Feature', 
      icon: <MessageSquare className="w-4 h-4" />,
      description: 'Real-time customer support',
      minBudget: 'starter'
    },
    { 
      id: 'multilingual', 
      name: 'Multilingual Support', 
      icon: <Globe className="w-4 h-4" />,
      description: 'Multiple language versions',
      minBudget: 'professional'
    },
    { 
      id: 'payment', 
      name: 'Payment Processing', 
      icon: <DollarSign className="w-4 h-4" />,
      description: 'Accept online payments',
      minBudget: 'professional'
    },
    { 
      id: 'booking', 
      name: 'Booking/Appointment System', 
      icon: <Clock className="w-4 h-4" />,
      description: 'Let clients book online',
      minBudget: 'professional',
      premium: true
    },
    { 
      id: 'analytics', 
      name: 'Analytics Dashboard', 
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Track visitor behavior',
      minBudget: 'professional',
      premium: true
    },
    { 
      id: 'membership', 
      name: 'Membership/Login System', 
      icon: <User className="w-4 h-4" />,
      description: 'User accounts & profiles',
      minBudget: 'professional',
      premium: true
    },
    { 
      id: 'security', 
      name: 'Advanced Security Package', 
      icon: <Shield className="w-4 h-4" />,
      description: 'Enhanced protection & SSL',
      minBudget: 'professional',
      premium: true
    },
    { 
      id: 'admin_dashboard', 
      name: 'Admin Dashboard', 
      icon: <Code className="w-4 h-4" />,
      description: 'Manage your site content',
      minBudget: 'professional',
      premium: true
    },
    { 
      id: 'maintenance', 
      name: 'Maintenance Plan', 
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Monthly updates & support',
      minBudget: 'premium'
    },
    { 
      id: 'training', 
      name: 'Admin Training', 
      icon: <Users className="w-4 h-4" />,
      description: '1-on-1 training sessions',
      minBudget: 'premium'
    }
  ];

  // Helper function to check if feature is available for selected budget and project type
  const isFeatureAvailable = (feature: any) => {
    if (!formData.budget || !formData.projectType) return false; // Hide all if no budget/type selected
    
    const budgetOrder = ['starter', 'professional', 'premium', 'enterprise'];
    const selectedBudgetIndex = budgetOrder.indexOf(formData.budget);
    const requiredBudgetIndex = budgetOrder.indexOf(feature.minBudget);
    
    // Special restrictions for certain features
    if (feature.id === 'admin_dashboard' || feature.id === 'membership' || feature.id === 'analytics') {
      // These require at least professional budget AND specific project types
      if (selectedBudgetIndex < 1) return false; // Must be at least professional
      if (!['webapp', 'ecommerce', 'business'].includes(formData.projectType)) return false;
    }
    
    if (feature.id === 'booking' || feature.id === 'payment') {
      // These require at least professional budget
      if (selectedBudgetIndex < 1) return false;
    }
    
    return selectedBudgetIndex >= requiredBudgetIndex;
  };

  // Countries list with flags
  const countries = [
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'Sweden', flag: '🇸🇪' },
    { name: 'Norway', flag: '🇳🇴' },
    { name: 'Denmark', flag: '🇩🇰' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'Russia', flag: '🇷🇺' },
    { name: 'Poland', flag: '🇵🇱' },
    { name: 'Czech Republic', flag: '🇨🇿' },
    { name: 'Austria', flag: '🇦🇹' },
    { name: 'Switzerland', flag: '🇨🇭' },
    { name: 'Belgium', flag: '🇧🇪' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Ireland', flag: '🇮🇪' },
    { name: 'New Zealand', flag: '🇳🇿' },
    { name: 'South Africa', flag: '🇿🇦' }
  ];

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Personal Info
        return formData.name && formData.email && formData.phone && formData.company && formData.country && formData.industry;
      case 2: // Project Type
        return formData.projectType;
      case 3: // Budget & Timeline
        return formData.budget && formData.timeline;
      case 4: // Features & Description
        return true; // Features are optional
      default:
        return false;
    }
  };

  // Go to next step
  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  // Go to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only proceed if we're on the last step and the user clicked submit
    if (currentStep !== 4) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Send data to webhook
      try {
        const webhookData = {
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone,
          empresa: formData.company,
          pais: formData.country,
          industria: formData.industry,
          tipo_projeto: formData.projectType,
          orcamento: budgetRanges.find(b => b.value === formData.budget)?.label || formData.budget,
          prazo: timelineOptions.find(t => t.value === formData.timeline)?.label || formData.timeline,
          mensagem: formData.description,
          recursos: formData.features.join(', '),
          data_envio: new Date().toISOString(),
          origem: 'formulario-estimate'
        };
        
        console.log('Sending data to webhook:', webhookData);
        
        // Dentro do bloco try que envia para o webhook do n8n
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          // Atualize a URL do webhook aqui
          const response = await fetch('https://devtone.app.n8n.cloud/webhook-test/https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/cq2QrNJ', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          console.log('N8N webhook response status:', response.status);
        } catch (webhookError) {
          console.error('Error sending to N8N webhook:', webhookError);
          // Continue even if webhook fails
        }
      
      // Use the estimate API service
      const result = await submitEstimate({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
        industry: formData.industry,
        projectType: formData.projectType,
        budget: budgetRanges.find(b => b.value === formData.budget)?.label || formData.budget,
        timeline: timelineOptions.find(t => t.value === formData.timeline)?.label || formData.timeline,
        description: formData.description,
        features: formData.features
      });

      if (result.success) {
        try {
          // Envio para o webhook do HubSpot apenas via proxy backend
          const hubspotResponse = await fetch("/api/hubspot-webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company,
              country: formData.country,
              industry: formData.industry
            })
          });
          console.log('Status da resposta da API:', hubspotResponse.status);
        } catch (e) {
          console.error("HubSpot error", e);
        }
        setIsSuccess(true);
      } else {
        throw new Error(result.error || 'Failed to send estimate');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <>
        <SEO
          title="Estimate Request Submitted - DevTone"
          description="Thank you for your estimate request! DevTone will review your project details and get back to you within 24 hours."
          keywords={['estimate submitted', 'DevTone response', 'project quote']}
          ogUrl="https://devtone.agency/estimate"
        />
        <div className="min-h-screen bg-[#030718] pt-24 pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Success Icon */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Thank You, {formData.name}!
                  </h1>
                  <p className="text-xl text-white/80">
                    Your estimate request has been submitted successfully.
                  </p>
                </div>

                {/* What Happens Next */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-purple-400" />
                    What Happens Next?
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Check Your Email (Now)</h3>
                        <p className="text-white/70">
                          We've sent a confirmation to <span className="text-purple-400">{formData.email}</span> with a summary of your request.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Project Review (2-4 hours)</h3>
                        <p className="text-white/70">
                          Our expert team is analyzing your requirements to create the perfect solution for your {formData.projectType.toLowerCase()}.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Custom Proposal (Within 24 hours)</h3>
                        <p className="text-white/70">
                          You'll receive a detailed proposal including pricing breakdown, timeline, and our technical approach.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">Consultation Call (Within 48 hours)</h3>
                        <p className="text-white/70">
                          We'll schedule a call to discuss your project in detail, answer questions, and finalize the approach.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                
                {/* Important Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center space-y-4"
                >
                  <p className="text-white/60 text-sm">
                    💡 <strong>Pro Tip:</strong> Check your spam folder if you don't see our email within 5 minutes.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.a
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back to Home
                      <ArrowRight className="w-4 h-4" />
                    </motion.a>
                    
                    <motion.button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-semibold transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit Another Estimate
                    </motion.button>
                  </div>
                </motion.div>
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
        title="Get Your Project Estimate - Devtone Agency"
        description="Get a free estimate for your web development project. Unlock online success with Devtone Agency's cutting-edge web development & SEO services."
        keywords={['DevTone estimate', 'web development pricing', 'project quote', 'website cost calculator', 'development estimate', 'transparent pricing', 'SEO services', 'digital marketing', 'branding agency', 'content creation']}
        ogUrl="https://devtone.agency/estimate"
      />

      <div className="min-h-screen bg-[#030718] pt-24 pb-12">
        {/* Hero Section */}
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3">
                <Calculator className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Get Your Project Estimate</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Tell Us About Your Project
              </h1>

              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Share your project details and we'll provide you with a detailed estimate and timeline.
              </p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mt-8 mb-8"
            >
              <div className="flex items-center max-w-md w-full">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === step 
                            ? 'bg-purple-600 text-white' 
                            : currentStep > step 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {currentStep > step ? <CheckCircle size={16} /> : step}
                      </div>
                      <span className={`text-xs mt-2 ${
                        currentStep === step 
                          ? 'text-purple-400' 
                          : currentStep > step 
                            ? 'text-green-400' 
                            : 'text-gray-500'
                      }`}>
                        {step === 1 ? 'Info' : 
                         step === 2 ? 'Project' : 
                         step === 3 ? 'Budget' : 'Details'}
                      </span>
                    </div>
                    {step < 4 && (
                      <div className={`h-1 flex-1 ${
                        currentStep > step ? 'bg-green-500' : 'bg-gray-700'
                      }`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <User className="w-6 h-6 text-purple-400" />
                      Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 font-medium mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 font-medium mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="company"
                          required
                          value={formData.company}
                          onChange={(e) => updateFormData('company', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="Your company name"
                        />
                      </div>

                      <div ref={countryRef}>
                        <label className="block text-white/80 font-medium mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:border-purple-500 transition-colors flex items-center justify-between"
                          >
                            <span className={formData.country ? 'text-white' : 'text-white/50'}>
                              {formData.country || 'Select your country'}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isCountryOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-2 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                              >
                                {/* Search Input */}
                                <div className="p-3 border-b border-white/10">
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                    <input
                                      type="text"
                                      value={countrySearch}
                                      onChange={(e) => setCountrySearch(e.target.value)}
                                      placeholder="Search countries..."
                                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 text-sm"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>

                                {/* Country List */}
                                <div className="max-h-64 overflow-y-auto">
                                  {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                      <button
                                        key={country.name}
                                        type="button"
                                        onClick={() => {
                                          updateFormData('country', country.name);
                                          setIsCountryOpen(false);
                                          setCountrySearch('');
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-colors flex items-center justify-between ${
                                          formData.country === country.name ? 'bg-purple-500/10' : ''
                                        }`}
                                      >
                                        <span className="text-white">{country.name}</span>
                                        {formData.country === country.name && (
                                          <CheckCircle className="w-5 h-5 text-purple-400" />
                                        )}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-4 py-8 text-center text-white/50">
                                      No countries found matching "{countrySearch}"
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 font-medium mb-2">
                          Business Industry *
                        </label>
                        <input
                          type="text"
                          name="industry"
                          required
                          value={formData.industry}
                          onChange={(e) => updateFormData('industry', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="e.g. Technology, Healthcare, Retail"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Type */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-purple-400" />
                      Project Type *
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projectTypes.map((type) => (
                        <motion.div
                          key={type.id}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                            formData.projectType === type.id
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-white/20 bg-white/5 hover:border-purple-400 hover:bg-white/10'
                          }`}
                          onClick={() => updateFormData('projectType', type.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-purple-400 flex-shrink-0">{type.icon}</div>
                            <div className="flex-1">
                              <h3 className="text-white font-semibold mb-2">{type.name}</h3>
                              <p className="text-white/60 text-sm">{type.description}</p>
                            </div>
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-purple-400" />
                      Budget & Timeline *
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Budget */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Budget Range *</h3>
                        <p className="text-white/60 text-sm mb-4">
                        Your budget determines available features and project scope
                        </p>
                        <div className="space-y-3">
                          {budgetRanges.map((budget) => (
                            <label
                              key={budget.id}
                              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                                formData.budget === budget.value
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-white/20 bg-white/5 hover:border-purple-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="budget"
                                value={budget.value}
                                checked={formData.budget === budget.value}
                                onChange={(e) => updateFormData('budget', e.target.value)}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                formData.budget === budget.value
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-white/40'
                              }`}>
                                {formData.budget === budget.value && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                )}
                              </div>
                              <span className="text-white font-medium">{budget.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Timeline *</h3>
                        <div className="space-y-3">
                          {timelineOptions.map((timeline) => (
                            <label
                              key={timeline.id}
                              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                                formData.timeline === timeline.value
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-white/20 bg-white/5 hover:border-purple-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name="timeline"
                                value={timeline.value}
                                checked={formData.timeline === timeline.value}
                                onChange={(e) => updateFormData('timeline', e.target.value)}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                formData.timeline === timeline.value
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-white/40'
                              }`}>
                                {formData.timeline === timeline.value && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                )}
                              </div>
                              <span className="text-white font-medium">{timeline.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Features & Description */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Features */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-purple-400" />
                        What Features Would You Like?
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableFeatures.map((feature) => {
                          const isAvailable = isFeatureAvailable(feature);
                          const isSelected = formData.features.includes(feature.id);
                          
                          return (
                            <label
                              key={feature.id}
                              className={`relative p-4 rounded-xl border transition-all duration-300 ${
                                !isAvailable 
                                  ? 'opacity-50 cursor-not-allowed border-white/10 bg-white/5' 
                                  : isSelected
                                    ? 'border-purple-500 bg-purple-500/20 cursor-pointer'
                                    : 'border-white/20 bg-white/5 hover:border-purple-400 cursor-pointer'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => isAvailable && toggleFeature(feature.id)}
                                disabled={!isAvailable}
                                className="sr-only"
                              />
                              
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                                  !isAvailable
                                    ? 'border-white/20'
                                    : isSelected
                                      ? 'border-purple-500 bg-purple-500'
                                      : 'border-white/40'
                                }`}>
                                  {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`${!isAvailable ? 'text-white/40' : 'text-purple-400'}`}>
                                      {feature.icon}
                                    </span>
                                    <span className={`font-medium ${!isAvailable ? 'text-white/40' : 'text-white'}`}>
                                      {feature.name}
                                    </span>
                                    {feature.premium && isAvailable && (
                                      <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                                        Premium
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-xs ${!isAvailable ? 'text-white/30' : 'text-white/60'}`}>
                                    {feature.description}
                                  </p>
                                  {!isAvailable && (
                                    <p className="text-xs text-yellow-400/80 mt-1">
                                      Not available for this selection
                                    </p>
                                  )}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Monthly Retainer */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Monthly Retainer (Optional)</h3>
                      <p className="text-white/60 text-sm mb-6">
                        Keep your website updated and secure with ongoing support
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {retainerOptions.map((retainer) => (
                          <label
                            key={retainer.id}
                            className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                              formData.retainer === retainer.value
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/20 bg-white/5 hover:border-purple-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="retainer"
                              value={retainer.value}
                              checked={formData.retainer === retainer.value}
                              onChange={(e) => updateFormData('retainer', e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 ${
                              formData.retainer === retainer.value
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-white/40'
                            }`}>
                              {formData.retainer === retainer.value && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white font-medium">{retainer.label}</span>
                                <span className="text-purple-400 font-semibold">{retainer.price}</span>
                              </div>
                              <p className="text-white/60 text-sm">{retainer.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-purple-400" />
                        Project Description
                      </h2>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        placeholder="Tell us more about your project, goals, and any specific requirements..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  <p className="text-red-400 text-sm text-center">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between"
              >
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back
                  </motion.button>
                )}
                
                {currentStep < 4 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-medium transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: isStepValid() ? 1.05 : 1 }}
                    whileTap={{ scale: isStepValid() ? 0.95 : 1 }}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button" // Changed from submit to button to prevent auto-submission
                    onClick={handleSubmit} // Explicitly call handleSubmit when clicked
                    disabled={isSubmitting}
                    className="ml-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center gap-2"
                    whileHover={{ scale: !isSubmitting ? 1.05 : 1 }}
                    whileTap={{ scale: !isSubmitting ? 0.95 : 1 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Get My Estimate
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Estimate;