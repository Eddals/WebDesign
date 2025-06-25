import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Calendar
} from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/lib/supabase';
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
}

const Estimate = () => {
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
    features: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Project types with detailed descriptions
  const projectTypes = [
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Single page to capture leads',
      icon: <Globe className="w-6 h-6" />,
      goodFor: 'Product launches, marketing campaigns, lead generation',
      includes: 'Hero section, features, testimonials, contact form',
      startingPrice: '$500'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'Showcase your work',
      icon: <Palette className="w-6 h-6" />,
      goodFor: 'Freelancers, artists, photographers, designers',
      includes: 'Gallery, about section, contact, project showcase',
      startingPrice: '$800'
    },
    {
      id: 'business',
      name: 'Business Website',
      description: 'Professional company site',
      icon: <Briefcase className="w-6 h-6" />,
      goodFor: 'Small to medium businesses, service providers',
      includes: 'Multiple pages, services, team, blog-ready',
      startingPrice: '$1,500'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      description: 'Online store with payments',
      icon: <ShoppingCart className="w-6 h-6" />,
      goodFor: 'Retail businesses, online sellers, dropshippers',
      includes: 'Product catalog, cart, checkout, payment processing',
      startingPrice: '$2,500'
    },
    {
      id: 'webapp',
      name: 'Web Application',
      description: 'Custom web application',
      icon: <Code className="w-6 h-6" />,
      goodFor: 'SaaS products, dashboards, custom tools',
      includes: 'User authentication, database, custom features',
      startingPrice: '$5,000'
    }
  ];

  // Budget ranges
  const budgetRanges = [
    { id: 'starter', label: '$500 - $2,000', value: 'starter' },
    { id: 'professional', label: '$2,000 - $5,000', value: 'professional' },
    { id: 'premium', label: '$5,000 - $15,000', value: 'premium' },
    { id: 'enterprise', label: '$15,000+', value: 'enterprise' }
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
      icon: <Calendar className="w-4 h-4" />,
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

  // Helper function to check if feature is available for selected budget
  const isFeatureAvailable = (feature: any) => {
    if (!formData.budget) return true; // Show all if no budget selected
    
    const budgetOrder = ['starter', 'professional', 'premium', 'enterprise'];
    const selectedBudgetIndex = budgetOrder.indexOf(formData.budget);
    const requiredBudgetIndex = budgetOrder.indexOf(feature.minBudget);
    
    return selectedBudgetIndex >= requiredBudgetIndex;
  };

  // Countries list for notifications
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Brazil', 'Mexico', 'Argentina', 'Japan',
    'South Korea', 'Singapore', 'India', 'China', 'Russia', 'Poland', 'Czech Republic', 'Austria',
    'Switzerland', 'Belgium', 'Portugal', 'Ireland', 'New Zealand', 'South Africa'
  ];

  // Business industries for creative notifications
  const businessIndustries = [
    'Technology & Software', 'Healthcare & Medical', 'E-commerce & Retail', 'Real Estate',
    'Finance & Banking', 'Education & Training', 'Food & Restaurant', 'Fashion & Beauty',
    'Fitness & Wellness', 'Legal Services', 'Marketing & Advertising', 'Construction & Architecture',
    'Travel & Tourism', 'Entertainment & Media', 'Non-profit & Charity', 'Automotive',
    'Manufacturing', 'Consulting', 'Photography & Creative', 'Sports & Recreation',
    'Agriculture & Farming', 'Energy & Environment', 'Transportation & Logistics', 'Art & Design',
    'Music & Audio', 'Gaming & Apps', 'Security & Safety', 'Home Services', 'Pet Care & Veterinary',
    'Wedding & Events'
  ];

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('🚀 Starting form submission...');
    console.log('📋 Form data:', formData);

    try {
      // Format budget and timeline for display
      const budgetFormatted = budgetRanges.find(b => b.value === formData.budget)?.label || formData.budget;
      const timelineFormatted = timelineOptions.find(t => t.value === formData.timeline)?.label || formData.timeline;
      const featuresFormatted = formData.features.join(', ') || 'None selected';

      console.log('📧 Sending email via Web3Forms...');
      
      // Send email using Web3Forms
      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '3dba5685-e5bf-4a0e-9f94-15f2d38e47ff',
          
          // Email configuration
          subject: `New Estimate Request - ${formData.name} - ${formData.projectType}`,
          from_name: formData.name,
          email: formData.email,
          to: 'team@devtone.agency',
          
          // Main message
          message: `
NEW ESTIMATE REQUEST

CONTACT INFORMATION:
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}
• Company: ${formData.company || 'Not provided'}
• Country: ${formData.country || 'Not provided'}
• Industry: ${formData.industry || 'Not provided'}

PROJECT DETAILS:
• Project Type: ${formData.projectType}
• Budget: ${budgetFormatted}
• Timeline: ${timelineFormatted}
• Features: ${featuresFormatted}

PROJECT DESCRIPTION:
${formData.description || 'No description provided'}

---
Submitted at: ${new Date().toLocaleString()}
          `.trim(),
          
          // Additional fields for better organization
          name: formData.name,
          phone: formData.phone || 'Not provided',
          company: formData.company || 'Not provided',
          country: formData.country || 'Not provided',
          industry: formData.industry || 'Not provided',
          project_type: formData.projectType,
          budget: budgetFormatted,
          timeline: timelineFormatted,
          features: featuresFormatted,
          
          // Web3Forms settings
          botcheck: false,
          replyto: formData.email
        })
      });

      const result = await web3Response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send email');
      }

      console.log('📧 Web3Forms response:', result);

      // Send confirmation email to client
      console.log('📧 Sending confirmation email to client...');
      
      // Check if client is from Brazil for Portuguese email
      const isPortuguese = formData.country === 'Brazil' || formData.email.endsWith('.br');
      
      const clientEmailResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '3dba5685-e5bf-4a0e-9f94-15f2d38e47ff',
          
          // Email configuration for client
          subject: isPortuguese ? 'Recebemos sua solicitação de orçamento - DevTone' : 'We received your estimate request - DevTone',
          from_name: 'DevTone Team',
          email: 'team@devtone.agency',
          to: formData.email, // Send to client's email
          
          // Confirmation message
          message: isPortuguese ? `
Olá ${formData.name},

Obrigado pelo seu interesse na DevTone! Recebemos sua solicitação de orçamento e nossa equipe está animada para conhecer mais sobre seu projeto.

RESUMO DA SUA SOLICITAÇÃO:

INFORMAÇÕES DE CONTATO:
• Nome: ${formData.name}
• Email: ${formData.email}
• Telefone: ${formData.phone || 'Não informado'}
• Empresa: ${formData.company || 'Não informado'}
• País: ${formData.country || 'Não informado'}
• Indústria: ${formData.industry || 'Não informado'}

DETALHES DO PROJETO:
• Tipo de Projeto: ${formData.projectType}
• Orçamento: ${budgetFormatted}
• Prazo: ${timelineFormatted}
• Recursos Solicitados: ${featuresFormatted}

DESCRIÇÃO DO SEU PROJETO:
${formData.description || 'Nenhuma descrição fornecida'}

O QUE ACONTECE AGORA?

1. ANÁLISE DO PROJETO (Em 2-4 horas)
   Nossa equipe especializada está analisando seus requisitos agora mesmo.

2. PROPOSTA PERSONALIZADA (Em 24 horas)
   Você receberá uma proposta detalhada incluindo:
   • Roadmap do projeto adaptado às suas necessidades
   • Cronograma claro com marcos
   • Detalhamento transparente de preços
   • Recomendações de tecnologia

3. CHAMADA DE CONSULTORIA (Em 48 horas)
   Agendaremos uma chamada para discutir seu projeto em detalhes e responder suas dúvidas.

4. INÍCIO DO PROJETO
   Uma vez aprovado, sua equipe dedicada começa imediatamente.

PRECISA DE ASSISTÊNCIA IMEDIATA?
• Telefone: +1 917-741-3468
• Email: team@devtone.agency
• Site: https://devtone.agency

Estamos ansiosos para dar vida à sua visão!

Atenciosamente,
Equipe DevTone

---
Este é um email de confirmação automático. Sua solicitação foi enviada em ${new Date().toLocaleString('pt-BR')}.
          `.trim() : `
Hi ${formData.name},

Thank you for your interest in DevTone! We've received your estimate request and our team is excited to learn more about your project.

HERE'S A SUMMARY OF YOUR REQUEST:

CONTACT INFORMATION:
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}
• Company: ${formData.company || 'Not provided'}
• Country: ${formData.country || 'Not provided'}
• Industry: ${formData.industry || 'Not provided'}

PROJECT DETAILS:
• Project Type: ${formData.projectType}
• Budget Range: ${budgetFormatted}
• Timeline: ${timelineFormatted}
• Features Requested: ${featuresFormatted}

YOUR PROJECT DESCRIPTION:
${formData.description || 'No description provided'}

WHAT HAPPENS NEXT?

1. PROJECT REVIEW (Within 2-4 hours)
   Our expert team is analyzing your requirements right now.

2. CUSTOM PROPOSAL (Within 24 hours)
   You'll receive a detailed proposal including:
   • Project roadmap tailored to your needs
   • Clear milestone schedule
   • Transparent pricing breakdown
   • Technology recommendations

3. CONSULTATION CALL (Within 48 hours)
   We'll schedule a call to discuss your project in detail and answer any questions.

4. PROJECT KICKOFF
   Once approved, your dedicated team begins immediately.

NEED IMMEDIATE ASSISTANCE?
• Call us: +1 917-741-3468
• Email: team@devtone.agency
• Visit: https://devtone.agency

We're looking forward to bringing your vision to life!

Best regards,
The DevTone Team

---
This is an automated confirmation email. Your request was submitted on ${new Date().toLocaleString()}.
          `.trim(),
          
          // Web3Forms settings
          botcheck: false,
          replyto: 'team@devtone.agency'
        })
      });

      const clientResult = await clientEmailResponse.json();
      
      if (!clientResult.success) {
        console.error('Failed to send client confirmation:', clientResult.message);
        // Don't throw error - admin email was sent successfully
      } else {
        console.log('✅ Client confirmation email sent');
      }

      // Also try to send via API if available (for ActivePieces webhook)
      try {
        console.log('🔄 Sending to API for webhook...');
        const apiResult = await submitEstimate({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          country: formData.country || 'United States',
          industry: formData.industry,
          projectType: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.description,
          features: formData.features
        });
        console.log('📧 API response:', apiResult);
      } catch (apiError) {
        console.log('⚠️ API call failed (non-critical):', apiError);
        // Continue even if API fails - EmailJS is our primary method now
      }

      // Try to save to Supabase, but don't fail if it doesn't work
      try {
        const userCountry = formData.country || 'United States';
        const estimateData = {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          country: userCountry,
          industry: formData.industry || null,
          project_type: formData.projectType,
          description: formData.description,
          budget_range: formData.budget,
          timeline: formData.timeline,
          features: formData.features,
          status: 'pending'
        };

        console.log('💾 Attempting to save to Supabase...');
        
        // Add a timeout to the Supabase request
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase request timed out')), 5000)
        );
        
        // Race between the Supabase request and the timeout
        const supabasePromise = supabase
          .from('quotes')
          .insert([estimateData])
          .select();
          
        const result = await Promise.race([supabasePromise, timeoutPromise]);
        
        if (result.error) {
          console.error('❌ Supabase error (non-critical):', result.error);
        } else if (result.data) {
          console.log('✅ Saved to Supabase:', result.data);
        }
      } catch (supabaseError) {
        console.error('❌ Supabase error (non-critical):', supabaseError);
        // Continue with form submission even if Supabase fails
      }

      // Show success - EmailJS sent the email
      console.log('✅ Estimate submission completed');
      setIsSubmitted(true);
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Error: ${error.message}. Please try again or contact us directly at team@devtone.agency`);
      } else {
        alert('There was an error submitting your request. Please try again or contact us directly at team@devtone.agency');
      }
      
      setIsSubmitting(false);
    } finally {
      if (isSubmitted) {
        setIsSubmitting(false);
      }
      console.log('🏁 Form submission completed');
    }
  };

  if (isSubmitted) {
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
                    Our team will review your project details and get back to you within 24 hours with a detailed proposal.
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

            {/* Budget Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  Quick Budget Guide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-purple-400 font-semibold">Starter</p>
                    <p className="text-white text-sm">$500 - $2,000</p>
                    <p className="text-white/60 text-xs mt-1">Basic websites, landing pages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 font-semibold">Professional</p>
                    <p className="text-white text-sm">$2,000 - $5,000</p>
                    <p className="text-white/60 text-xs mt-1">Business sites, booking systems</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 font-semibold">Premium</p>
                    <p className="text-white text-sm">$5,000 - $15,000</p>
                    <p className="text-white/60 text-xs mt-1">E-commerce, custom features</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 font-semibold">Enterprise</p>
                    <p className="text-white text-sm">$15,000+</p>
                    <p className="text-white/60 text-xs mt-1">Complex apps, full systems</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                      required
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateFormData('company', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="" className="bg-gray-800">Select your country</option>
                      {countries.map((country) => (
                        <option key={country} value={country} className="bg-gray-800">
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Business Industry
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => updateFormData('industry', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="" className="bg-gray-800">Select your industry</option>
                      {businessIndustries.map((industry) => (
                        <option key={industry} value={industry} className="bg-gray-800">
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Project Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                  Project Type
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
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{type.name}</h3>
                            <span className="text-purple-400 text-sm font-medium">from {type.startingPrice}</span>
                          </div>
                          <p className="text-white/60 text-sm mb-3">{type.description}</p>
                          <div className="space-y-2">
                            <p className="text-xs text-purple-300">
                              <span className="font-medium">Good for:</span> {type.goodFor}
                            </p>
                            <p className="text-xs text-white/50">
                              <span className="font-medium">Includes:</span> {type.includes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Budget & Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                  Budget & Timeline
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Budget */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Budget Range</h3>
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
                    <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
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

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  What Features Would You Like?
                </h2>
                <p className="text-white/70 mb-6">
                  Select the features for your project. 
                  {formData.budget && formData.budget !== 'enterprise' && (
                    <span className="text-yellow-400 text-sm block mt-2">
                      ⚡ Some premium features require a higher budget
                    </span>
                  )}
                </p>

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
                                Requires {feature.minBudget === 'professional' ? '$2,000+' : '$5,000+'} budget
                              </p>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {formData.budget === 'starter' && (
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <p className="text-yellow-400 text-sm">
                      💡 <strong>Tip:</strong> Upgrade to Professional ($2,000+) to unlock premium features like booking systems, 
                      membership areas, and admin dashboards.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Project Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  Project Description
                </h2>

                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Tell us more about your project, goals, and any specific requirements..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.projectType}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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

                <p className="text-white/60 text-sm mt-4">
                  We'll review your request and get back to you within 24 hours
                </p>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Estimate;