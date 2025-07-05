import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, User, Mail, Phone, Building, Calendar, DollarSign, 
  FileText, CheckCircle, Send, MapPin, Globe, Laptop, ShoppingBag, 
  RefreshCw, Search, Smartphone, Star, Calculator, ChevronDown,
  CreditCard, Zap, Shield, Palette, Settings, Clock, Globe2
} from 'lucide-react';
import { sendEstimateConfirmationEmail } from '../lib/brevo-email-service';
import { sendEstimateConfirmationEmailFallback } from '../lib/email-service-fallback';
import { sendEstimateConfirmationEmailDirect } from '../lib/brevo-email-direct';
import { sendEstimateConfirmationWeb3Forms } from '../lib/web3forms-email';

interface EstimateFormData {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  country: string;
  
  // Project Details
  projectTypes: string[];
  coreFeatures: string[];
  ecommerceFeatures: string[];
  designFeatures: string[];
  integrations: string[];
  maintenanceAddons: string[];
  
  // Timeline & Budget
  timeline: string;
  budget: string;
  
  // Additional Info
  additionalRequirements: string;
}

interface FeatureCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  features: Feature[];
  minBudget?: number;
}

interface Feature {
  id: string;
  label: string;
  description: string;
  basePrice: number;
  minBudget: number;
  icon?: React.ReactNode;
}

const EstimateForm: React.FC = () => {
  const [formData, setFormData] = useState<EstimateFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: '',
    country: '',
    projectTypes: [],
    coreFeatures: [],
    ecommerceFeatures: [],
    designFeatures: [],
    integrations: [],
    maintenanceAddons: [],
    timeline: '',
    budget: '',
    additionalRequirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<number>(0);

  // Budget ranges for filtering
  const budgetRanges = [
    { label: 'Under $1,000', value: 1000 },
    { label: '$1,000 – $3,000', value: 3000 },
    { label: '$3,000 – $5,000', value: 5000 },
    { label: '$5,000 – $10,000', value: 10000 },
    { label: '$10,000 – $25,000', value: 25000 },
    { label: '$25,000 – $50,000', value: 50000 },
    { label: '$50,000+', value: 100000 }
  ];

  // Project types
  const projectTypes = [
    { id: 'landing-page', label: 'Landing Page', icon: <Laptop size={16} /> },
    { id: 'business-website', label: 'Business Website (Corporate)', icon: <Building size={16} /> },
    { id: 'portfolio-website', label: 'Portfolio Website', icon: <Star size={16} /> },
    { id: 'blog-news', label: 'Blog or News Site', icon: <FileText size={16} /> },
    { id: 'ecommerce', label: 'E-commerce (WooCommerce)', icon: <ShoppingBag size={16} /> },
    { id: 'booking-website', label: 'Booking Website (Appointments, Services)', icon: <Calendar size={16} /> },
    { id: 'membership-website', label: 'Membership Website', icon: <User size={16} /> },
    { id: 'learning-platform', label: 'Learning Platform (LMS)', icon: <Globe2 size={16} /> },
    { id: 'web-app', label: 'Web App (Custom features)', icon: <Settings size={16} /> },
    { id: 'website-redesign', label: 'Website Redesign', icon: <RefreshCw size={16} /> },
    { id: 'one-page-scroll', label: 'One-Page Scroll Website', icon: <Globe size={16} /> },
    { id: 'custom-website', label: 'Custom Website', icon: <Star size={16} /> }
  ];

  // Feature categories with budget requirements
  const featureCategories: FeatureCategory[] = [
    {
      id: 'core',
      title: 'Core Features',
      icon: <Settings size={20} />,
      features: [
        { id: 'cms-integration', label: 'CMS Integration (WordPress)', description: 'Content management system setup', basePrice: 500, minBudget: 1000 },
        { id: 'admin-dashboard', label: 'Admin Dashboard / Panel', description: 'Custom admin interface', basePrice: 800, minBudget: 2000 },
        { id: 'contact-forms', label: 'Contact Forms', description: 'Custom contact form setup', basePrice: 200, minBudget: 500 },
        { id: 'newsletter-signup', label: 'Newsletter Signup', description: 'Email marketing integration', basePrice: 150, minBudget: 500 },
        { id: 'blog-setup', label: 'Blog Setup', description: 'Blog functionality and design', basePrice: 400, minBudget: 1000 },
        { id: 'custom-post-types', label: 'Custom Post Types', description: 'Custom content types (projects, team, testimonials)', basePrice: 600, minBudget: 2000 },
        { id: 'search-functionality', label: 'Search Functionality', description: 'Advanced search features', basePrice: 300, minBudget: 1000 },
        { id: 'seo-optimization', label: 'SEO Optimization (Basic/Advanced)', description: 'Search engine optimization', basePrice: 400, minBudget: 1000 },
        { id: 'analytics-setup', label: 'Analytics Setup', description: 'Google Analytics / Site Kit integration', basePrice: 200, minBudget: 500 },
        { id: 'chat-integration', label: 'Chat Integration', description: 'WhatsApp, Messenger, HubSpot chat', basePrice: 300, minBudget: 1000 },
        { id: 'booking-system', label: 'Booking / Appointment System', description: 'Online booking functionality', basePrice: 800, minBudget: 3000 },
        { id: 'multi-language', label: 'Multi-language (i18n)', description: 'Internationalization support', basePrice: 1000, minBudget: 5000 },
        { id: 'ada-compliance', label: 'ADA / Accessibility Compliance', description: 'Accessibility standards compliance', basePrice: 600, minBudget: 3000 },
        { id: 'mobile-optimization', label: 'Mobile Optimization', description: 'Mobile-first responsive design', basePrice: 400, minBudget: 1000 },
        { id: 'speed-optimization', label: 'Speed Optimization', description: 'Performance optimization', basePrice: 500, minBudget: 2000 }
      ]
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Features',
      icon: <ShoppingBag size={20} />,
      minBudget: 3000,
      features: [
        { id: 'woocommerce-store', label: 'WooCommerce Store', description: 'Complete e-commerce setup', basePrice: 1500, minBudget: 3000 },
        { id: 'stripe-integration', label: 'Stripe Payment Integration', description: 'Secure payment processing', basePrice: 400, minBudget: 3000 },
        { id: 'paypal-integration', label: 'PayPal Payment Integration', description: 'PayPal payment gateway', basePrice: 300, minBudget: 3000 },
        { id: 'buy-now-pay-later', label: 'Buy Now, Pay Later', description: 'Klarna, Affirm integration', basePrice: 600, minBudget: 5000 },
        { id: 'woocommerce-subscriptions', label: 'WooCommerce Subscriptions', description: 'Recurring billing system', basePrice: 800, minBudget: 5000 },
        { id: 'cartflows', label: 'CartFlows', description: 'Funnel optimization', basePrice: 500, minBudget: 5000 },
        { id: 'custom-checkout', label: 'Custom Checkout Experience', description: 'Personalized checkout flow', basePrice: 1000, minBudget: 10000 },
        { id: 'product-filters', label: 'Product Filters & Search', description: 'Advanced product filtering', basePrice: 400, minBudget: 3000 },
        { id: 'customer-accounts', label: 'Customer Accounts', description: 'User account management', basePrice: 600, minBudget: 3000 },
        { id: 'coupon-system', label: 'Coupon System / Discount Engine', description: 'Discount and promotion system', basePrice: 400, minBudget: 3000 },
        { id: 'inventory-management', label: 'Inventory Management', description: 'Stock management system', basePrice: 800, minBudget: 5000 },
        { id: 'multi-vendor', label: 'Multi-vendor Marketplace', description: 'Marketplace functionality', basePrice: 2000, minBudget: 25000 }
      ]
    },
    {
      id: 'design',
      title: 'Design & UX',
      icon: <Palette size={20} />,
      features: [
        { id: 'custom-ui-ux', label: 'Custom UI/UX Design', description: 'Custom design system', basePrice: 2000, minBudget: 5000 },
        { id: 'wireframing', label: 'Wireframing & Prototyping', description: 'Design mockups and prototypes', basePrice: 800, minBudget: 3000 },
        { id: 'logo-design', label: 'Logo Design', description: 'Custom logo creation', basePrice: 300, minBudget: 1000 },
        { id: 'brand-identity', label: 'Brand Identity Kit', description: 'Complete brand guidelines', basePrice: 600, minBudget: 3000 },
        { id: 'dark-mode', label: 'Dark Mode Design', description: 'Dark theme implementation', basePrice: 400, minBudget: 2000 },
        { id: 'accessibility-ux', label: 'Accessibility & UX Best Practices', description: 'UX optimization', basePrice: 500, minBudget: 2000 },
        { id: 'animations', label: 'Animations (Framer Motion / Lottie)', description: 'Custom animations', basePrice: 600, minBudget: 3000 },
        { id: 'mobile-first', label: 'Mobile-First Design', description: 'Mobile-optimized design', basePrice: 400, minBudget: 2000 },
        { id: 'custom-icons', label: 'Custom Icons & Graphics', description: 'Custom icon set', basePrice: 300, minBudget: 2000 }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Zap size={20} />,
      features: [
        { id: 'stripe', label: 'Stripe', description: 'Payment processing', basePrice: 300, minBudget: 1000 },
        { id: 'paypal', label: 'PayPal', description: 'Payment gateway', basePrice: 200, minBudget: 1000 },
        { id: 'google-analytics', label: 'Google Analytics', description: 'Analytics tracking', basePrice: 150, minBudget: 500 },
        { id: 'hubspot-crm', label: 'HubSpot CRM', description: 'CRM integration', basePrice: 400, minBudget: 3000 },
        { id: 'mailchimp', label: 'Mailchimp / Brevo / Klaviyo', description: 'Email marketing', basePrice: 250, minBudget: 1000 },
        { id: 'whatsapp-business', label: 'WhatsApp Business', description: 'WhatsApp integration', basePrice: 200, minBudget: 1000 },
        { id: 'zapier-automations', label: 'Zapier / n8n automations', description: 'Workflow automation', basePrice: 500, minBudget: 3000 },
        { id: 'social-feeds', label: 'Social Media Feeds', description: 'Social media integration', basePrice: 300, minBudget: 1000 },
        { id: 'calendly', label: 'Calendly / Scheduling tools', description: 'Scheduling integration', basePrice: 250, minBudget: 1000 }
      ]
    },
    {
      id: 'maintenance',
      title: 'Maintenance & Add-ons',
      icon: <Shield size={20} />,
      features: [
        { id: 'website-care', label: 'Website Care Plan', description: 'Updates, Security, Backups', basePrice: 100, minBudget: 500 },
        { id: 'hosting-setup', label: 'Hosting Setup', description: 'VPS / Managed WP / Cloud', basePrice: 200, minBudget: 1000 },
        { id: 'domain-setup', label: 'Domain Registration / Setup', description: 'Domain configuration', basePrice: 50, minBudget: 500 },
        { id: 'ssl-certificate', label: 'SSL Certificate (HTTPS)', description: 'Security certificate', basePrice: 100, minBudget: 500 },
        { id: 'backup-system', label: 'Backup System', description: 'Updraft / BlogVault', basePrice: 150, minBudget: 1000 },
        { id: 'security-plugins', label: 'Security Plugins', description: 'Wordfence / iThemes', basePrice: 100, minBudget: 1000 },
        { id: 'training-session', label: 'Website Training Session', description: 'Admin training', basePrice: 200, minBudget: 1000 },
        { id: 'white-label', label: 'Admin Area Customization', description: 'White label admin panel', basePrice: 400, minBudget: 5000 }
      ]
    }
  ];

  const timelineOptions = [
    { value: 'asap', label: 'ASAP (Urgent)' },
    { value: '1-2-weeks', label: '1–2 Weeks' },
    { value: '2-4-weeks', label: '2–4 Weeks' },
    { value: '1-2-months', label: '1–2 Months' },
    { value: 'flexible', label: 'No Rush / Flexible' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Real Estate',
    'Manufacturing', 'Consulting', 'Marketing', 'Legal', 'Non-profit', 'Entertainment',
    'Food & Beverage', 'Travel & Tourism', 'Fashion', 'Automotive', 'Other'
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
    'Brazil', 'Mexico', 'India', 'China', 'Japan', 'South Korea', 'Singapore',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Other'
  ];

  // Update selected budget when form data changes
  useEffect(() => {
    if (formData.budget) {
      const budgetRange = budgetRanges.find(range => range.label === formData.budget);
      setSelectedBudget(budgetRange?.value || 0);
    }
  }, [formData.budget]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category: string, featureId: string) => {
    setFormData(prev => {
      const currentFeatures = prev[category as keyof EstimateFormData] as string[];
      const updatedFeatures = currentFeatures.includes(featureId)
        ? currentFeatures.filter(id => id !== featureId)
        : [...currentFeatures, featureId];
      
      return {
        ...prev,
        [category]: updatedFeatures
      };
    });
  };

  const handleProjectTypeChange = (projectTypeId: string) => {
    setFormData(prev => {
      const updatedTypes = prev.projectTypes.includes(projectTypeId)
        ? prev.projectTypes.filter(id => id !== projectTypeId)
        : [...prev.projectTypes, projectTypeId];
      
      return {
        ...prev,
        projectTypes: updatedTypes
      };
    });
  };

  const isFeatureAvailable = (feature: Feature) => {
    return selectedBudget >= feature.minBudget;
  };

  const getAvailableFeatures = (category: FeatureCategory) => {
    return category.features.filter(isFeatureAvailable);
  };

  const calculateEstimatedCost = () => {
    let total = 0;
    
    // Calculate costs for each category
    featureCategories.forEach(category => {
      category.features.forEach(feature => {
        if (formData[category.id + 'Features' as keyof EstimateFormData]?.includes(feature.id)) {
          total += feature.basePrice;
        }
      });
    });

    // Add base project cost based on project types
    if (formData.projectTypes.includes('landing-page')) total += 800;
    if (formData.projectTypes.includes('business-website')) total += 2000;
    if (formData.projectTypes.includes('portfolio-website')) total += 1500;
    if (formData.projectTypes.includes('blog-news')) total += 1200;
    if (formData.projectTypes.includes('ecommerce')) total += 3000;
    if (formData.projectTypes.includes('booking-website')) total += 2500;
    if (formData.projectTypes.includes('membership-website')) total += 4000;
    if (formData.projectTypes.includes('learning-platform')) total += 8000;
    if (formData.projectTypes.includes('web-app')) total += 15000;
    if (formData.projectTypes.includes('website-redesign')) total += 3000;
    if (formData.projectTypes.includes('one-page-scroll')) total += 1000;
    if (formData.projectTypes.includes('custom-website')) total += 5000;

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setSubmitStatus({ type: 'success', message: 'Your estimate request has been submitted successfully! We\'ll get back to you within 24 hours.' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ type: 'error', message: 'There was an error submitting your request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Estimate Request Submitted!</h3>
          <p className="text-white/80 mb-6">{submitStatus.message}</p>
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Estimated Cost Range</h4>
            <p className="text-2xl font-bold text-green-400">
              ${calculateEstimatedCost().toLocaleString()} - ${(calculateEstimatedCost() * 1.3).toLocaleString()}
            </p>
            <p className="text-sm text-white/60 mt-2">*Final pricing will be confirmed after detailed review</p>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                companyName: '',
                industry: '',
                country: '',
                projectTypes: [],
                coreFeatures: [],
                ecommerceFeatures: [],
                designFeatures: [],
                integrations: [],
                maintenanceAddons: [],
                timeline: '',
                budget: '',
                additionalRequirements: ''
              });
              setCurrentStep(1);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 text-white/50'
              }`}>
                {step}
              </div>
              {step < 6 && (
                <div className={`w-12 h-1 mx-2 ${
                  step < currentStep ? 'bg-purple-600' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-white/60 text-sm">
          Step {currentStep} of 6
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-purple-400" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-gray-800 text-white">Select your industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry} className="bg-gray-800 text-white">{industry}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/80 mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-gray-800 text-white">Select your country</option>
                    {countries.map(country => (
                      <option key={country} value={country} className="bg-gray-800 text-white">{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Project Type */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-purple-400" />
                Project Type
              </h3>
              <p className="text-white/60 mb-6">Choose one or more project types that best describe your needs:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectTypes.map((projectType) => (
                  <label
                    key={projectType.id}
                    className={`flex items-center gap-3 p-4 rounded-full border cursor-pointer transition-all shadow-lg ${
                      formData.projectTypes.includes(projectType.id)
                        ? 'border-purple-500 bg-gradient-to-r from-purple-400 to-pink-400/30 scale-105'
                        : 'border-white/10 bg-white/10 hover:border-white/20'
                    }`}
                    style={{ minHeight: '64px' }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.projectTypes.includes(projectType.id)}
                      onChange={() => handleProjectTypeChange(projectType.id)}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-400">
                      {projectType.icon}
                    </div>
                    <span className="text-white font-medium">{projectType.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Budget Range */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-purple-400" />
                Budget Range
              </h3>
              <p className="text-white/60 mb-6">Select your budget range to see available features:</p>
              
              <div className="space-y-4">
                {budgetRanges.map((range) => (
                  <label
                    key={range.value}
                    className={`flex items-center gap-3 p-4 rounded-full border cursor-pointer transition-all shadow-lg ${
                      formData.budget === range.label
                        ? 'border-purple-500 bg-gradient-to-r from-purple-400 to-pink-400/30 scale-105'
                        : 'border-white/10 bg-white/10 hover:border-white/20'
                    }`}
                    style={{ minHeight: '64px' }}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value={range.label}
                      checked={formData.budget === range.label}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center bg-purple-500/10">
                      {formData.budget === range.label && (
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-white font-medium">{range.label}</span>
                  </label>
                ))}
              </div>
              
              {selectedBudget > 0 && (
                <div className="mt-6 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                  <p className="text-white/80 text-sm">
                    Based on your budget, you'll have access to features requiring up to ${selectedBudget.toLocaleString()} in budget.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Features */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {featureCategories.map((category) => {
                const availableFeatures = getAvailableFeatures(category);
                const isCategoryAvailable = selectedBudget >= (category.minBudget || 0);
                
                if (!isCategoryAvailable) return null;
                
                return (
                  <div key={category.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                      {category.icon}
                      {category.title}
                    </h3>
                    
                    {category.minBudget && selectedBudget < category.minBudget && (
                      <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                        <p className="text-yellow-400 text-sm">
                          This category requires a minimum budget of ${category.minBudget.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableFeatures.map((feature) => (
                        <label
                          key={feature.id}
                          className={`flex items-start gap-3 p-4 rounded-full border cursor-pointer transition-all shadow-lg ${
                            formData[category.id + 'Features' as keyof EstimateFormData]?.includes(feature.id)
                              ? 'border-purple-500 bg-gradient-to-r from-purple-400 to-pink-400/30 scale-105'
                              : 'border-white/10 bg-white/10 hover:border-white/20'
                          }`}
                          style={{ minHeight: '64px' }}
                        >
                          <input
                            type="checkbox"
                            checked={formData[category.id + 'Features' as keyof EstimateFormData]?.includes(feature.id)}
                            onChange={() => handleCheckboxChange(category.id + 'Features', feature.id)}
                            className="mt-1"
                          />
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-400 mr-2">
                            {feature.icon || <CheckCircle size={20} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium">{feature.label}</span>
                              <span className="text-purple-400 text-sm font-semibold">
                                ${feature.basePrice.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-white/60 text-sm">{feature.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Step 5: Timeline */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-400" />
                Timeline
              </h3>
              <p className="text-white/60 mb-6">When do you need your project completed?</p>
              
              <div className="space-y-4">
                {timelineOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 rounded-full border cursor-pointer transition-all shadow-lg ${
                      formData.timeline === option.value
                        ? 'border-purple-500 bg-gradient-to-r from-purple-400 to-pink-400/30 scale-105'
                        : 'border-white/10 bg-white/10 hover:border-white/20'
                    }`}
                    style={{ minHeight: '64px' }}
                  >
                    <input
                      type="radio"
                      name="timeline"
                      value={option.value}
                      checked={formData.timeline === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center bg-purple-500/10">
                      {formData.timeline === option.value && (
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-white font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 6: Additional Requirements */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                Additional Requirements
              </h3>
              <p className="text-white/60 mb-6">Tell us more about your project requirements, goals, and any specific features you need:</p>
              
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Describe your project requirements, target audience, specific features, design preferences, or any other details that will help us provide a more accurate estimate..."
              />
              
              {/* Cost Summary */}
              <div className="mt-6 p-6 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">Estimated Cost Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>Selected Features:</span>
                    <span>${calculateEstimatedCost().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Estimated Range:</span>
                    <span>${calculateEstimatedCost().toLocaleString()} - ${(calculateEstimatedCost() * 1.3).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between text-white font-semibold">
                      <span>Total Estimated Cost:</span>
                      <span className="text-purple-400">${calculateEstimatedCost().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-full transition-colors ${
              currentStep === 1
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Previous
          </button>
          
          <div className="flex gap-4">
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Estimate Request
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error/Success Message */}
        {submitStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}
          >
            {submitStatus.message}
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default EstimateForm;