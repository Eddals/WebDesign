"use client"

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
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'hello@matheusweb.com',
      link: 'mailto:hello@matheusweb.com',
      color: 'from-blue-500 to-cyan-500',
      response: 'Usually responds within 2 hours'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'from-green-500 to-emerald-500',
      response: 'Available during business hours'
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Chat with our team',
      details: 'Start a conversation',
      link: '#',
      color: 'from-purple-500 to-pink-500',
      response: 'Average response time: 5 minutes'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Schedule Meeting',
      description: 'Book a consultation',
      details: 'Free 30-min call',
      link: '#',
      color: 'from-orange-500 to-red-500',
      response: 'Available slots this week'
    }
  ];

  const projectTypes = [
    { id: 'website', label: 'Website Development', icon: <Globe className="w-5 h-5" /> },
    { id: 'ecommerce', label: 'E-commerce Store', icon: <Monitor className="w-5 h-5" /> },
    { id: 'webapp', label: 'Web Application', icon: <Code className="w-5 h-5" /> },
    { id: 'redesign', label: 'Website Redesign', icon: <Palette className="w-5 h-5" /> },
    { id: 'maintenance', label: 'Maintenance & Support', icon: <Shield className="w-5 h-5" /> },
    { id: 'consultation', label: 'Consultation', icon: <Lightbulb className="w-5 h-5" /> }
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
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/services'}
                className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Services
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
        title="Contact Us | Professional Web Development Services"
        description="Get in touch for web development services, project inquiries, or consultations. We're here to help bring your digital vision to life."
        keywords={['contact', 'web development', 'hire developer', 'project inquiry', 'consultation']}
        ogUrl="https://matheusweb.com/contact"
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
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Let's Start a Conversation</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Get In
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>

              <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
                Ready to transform your digital presence? Let's discuss your project and create something amazing together. 
                We're here to turn your vision into reality.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { number: '24h', label: 'Response Time' },
                  { number: '100+', label: 'Projects Completed' },
                  { number: '5★', label: 'Client Rating' },
                  { number: '24/7', label: 'Support Available' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-white/60 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Methods */}
        <div className="container mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Preferred Way to Connect
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We offer multiple ways to get in touch. Pick the one that works best for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
                onClick={() => method.link !== '#' && window.open(method.link, '_blank')}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {method.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                <p className="text-white/60 mb-3">{method.description}</p>
                <div className="text-purple-400 font-semibold mb-2">{method.details}</div>
                <div className="text-xs text-white/50">{method.response}</div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Send Us a Message</h2>
                <p className="text-white/60">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Project Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {projectTypes.map((type) => (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({...formData, projectType: type.id})}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.projectType === type.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`${formData.projectType === type.id ? 'text-purple-400' : 'text-white/60'}`}>
                            {type.icon}
                          </div>
                          <span className={`text-sm font-medium ${formData.projectType === type.id ? 'text-white' : 'text-white/70'}`}>
                            {type.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((budget) => (
                        <option key={budget.id} value={budget.id} className="bg-gray-800">
                          {budget.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map((timeline) => (
                        <option key={timeline.id} value={timeline.id} className="bg-gray-800">
                          {timeline.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="What's your project about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    rows={6}
                    placeholder="Tell us about your project, goals, and any specific requirements..."
                    required
                  />
                </div>

                <div className="text-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-12 py-4 rounded-lg font-semibold transition-all flex items-center gap-3 mx-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  question: "How quickly can you start my project?",
                  answer: "We typically start new projects within 1-2 weeks, depending on our current workload and project complexity."
                },
                {
                  question: "Do you provide ongoing support?",
                  answer: "Yes! We offer various maintenance and support packages to keep your website running smoothly after launch."
                },
                {
                  question: "What's included in your web development service?",
                  answer: "Our service includes design, development, testing, deployment, and basic SEO optimization. Additional features can be added as needed."
                },
                {
                  question: "Can you work with my existing brand guidelines?",
                  answer: "Absolutely! We can work with your existing brand guidelines or help you develop new ones if needed."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-white/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
