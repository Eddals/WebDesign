import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle, 
  ArrowRight, Sparkles, Zap, Globe, Users, Calendar,
  Star, Award, Shield, Lightbulb, Code, Palette, Monitor,
  Send, User, Building, FileText, Coffee, Rocket, Target
} from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  projectType: string;
  budget: string;
  timeline: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    projectType: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8 rounded-full" />,
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'support@devtone.agency',
      link: 'mailto:support@devtone.agency',
      color: 'from-blue-500 to-cyan-500',
      response: 'Usually responds within 2 hours'

    },
    {
      icon: <Phone className="w-8 h-8 rounded-full" />,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'from-green-500 to-emerald-500',
      response: 'Available during business hours'
    },
    {
      icon: <MessageSquare className="w-8 h-8 rounded-full" />,
      title: 'Live Chat',
      description: 'Chat with our team',
      details: 'Start a conversation',
      link: '#',
      color: 'from-purple-500 to-pink-500',
      response: 'Average response time: 5 minutes'
    },
    {
      icon: <Calendar className="w-8 h-8 rounded-full" />,
      title: 'Schedule Meeting',
      description: 'Book a consultation',
      details: 'Free 30-min call',
      link: '#',
      color: 'from-orange-500 to-red-500',
      response: 'Available slots this week'
    }
  ];

  const projectTypes = [
    { id: 'website', label: 'Website Development', icon: <Globe className="w-8 h-8 rounded-full" /> },
    { id: 'ecommerce', label: 'E-commerce Store', icon: <Monitor className="w-8 h-8 rounded-full" /> },
    { id: 'webapp', label: 'Web Application', icon: <Code className="w-8 h-8 rounded-full" /> },
    { id: 'redesign', label: 'Website Redesign', icon: <Palette className="w-8 h-8 rounded-full" /> },
    { id: 'maintenance', label: 'Maintenance & Support', icon: <Shield className="w-8 h-8 rounded-full" /> },
    { id: 'consultation', label: 'Consultation', icon: <Lightbulb className="w-8 h-8 rounded-full" /> }
  ];

  const budgetRanges = [
    { id: 'small', label: '$1,000 - $5,000' },
    { id: 'medium', label: '$5,000 - $15,000' },
    { id: 'large', label: '$15,000 - $50,000' },
    { id: 'enterprise', label: '$50,000+' },
    { id: 'discuss', label: 'Let\'s discuss' }
  ];

  const timelineOptions = [
    { id: 'asap', label: 'ASAP (Rush)' },
    { id: '1month', label: 'Within 1 month' },
    { id: '3months', label: '1-3 months' },
    { id: '6months', label: '3-6 months' },
    { id: 'flexible', label: 'I\'m flexible' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        project_type: formData.projectType,
        budget_range: formData.budget,
        timeline: formData.timeline,
        status: 'pending'
      };

      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - simulating successful submission');
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert(contactData);

        if (error) {
          throw new Error(error.message);
        }
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
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
          title="Message Sent | Contact Confirmation"
          description="Thank you for contacting us. We'll get back to you within 24 hours."
          keywords={['contact sent', 'message confirmation', 'web development inquiry']}
          ogUrl="https://matheusweb.com/contact"
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
              Message Sent Successfully!
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              Thank you for reaching out! We've received your message and will get back to you within 24 hours.
            </p>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold text-sm">1</span>
                  </div>
                  <span className="text-white/70">We'll review your project details</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold text-sm">2</span>
                  </div>
                  <span className="text-white/70">Our team will prepare a personalized response</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold text-sm">3</span>
                  </div>
                  <span className="text-white/70">We'll reach out to discuss your project</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
