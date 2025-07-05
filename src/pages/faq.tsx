"use client"

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Plus, Minus, Search, CheckCircle, ArrowRight, 
  MessageSquare, Package, Clock, CreditCard, 
  RefreshCw, HelpCircle, ChevronDown, ChevronUp,
  Star, Award, Shield, Zap, Users, Sparkles,
  FileText, Target, Layers, Send, Mail, Phone, Calendar
} from 'lucide-react';
import SEO from '@/components/SEO';

interface FAQItem {
  category: string;
  question: string;
  answer: ReactNode;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isInView, setIsInView] = useState(false);
  
  const searchRef = useRef(null);
  
  // Animation references and effects
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInView(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // FAQ Categories
  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle size={18} /> },
    { id: 'pricing', label: 'Pricing', icon: <CreditCard size={18} /> },
    { id: 'process', label: 'Process', icon: <RefreshCw size={18} /> },
    { id: 'support', label: 'Support', icon: <MessageSquare size={18} /> },
  ];

  // Creative contact methods section
  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      description: 'Send us an email anytime',
      details: 'team@devtone.agency',
      link: 'mailto:team@devtone.agency',
      color: 'from-purple-400 to-purple-600',
      response: 'Response within 24 hours'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone Support',
      description: 'Mon-Fri from 12am to 6pm EST',
      details: 'Available during business hours',
      link: '#',
      color: 'from-purple-500 to-purple-700',
      response: 'Available during business hours only'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Schedule Call',
      description: 'Book a support call',
      details: 'Free consultation',
      link: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ090688oDQPcvG5Wxi-vZugSIP1LGHQrZxgk5fB5rM46mgFZP1fVoq8xT70bguxDkjBy09qswqj',
      color: 'from-purple-500 to-purple-700',
      response: 'Available slots this week'
    }
  ];

  // FAQ Items - removed the "services" category and related questions
  const faqItems = [
    {
      category: 'pricing',
      question: "Do you offer a money-back guarantee?",
      answer: (
        <>
          Yes, we offer a comprehensive money-back guarantee:
          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2">
              <Shield className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <div>
                <strong className="text-purple-400">100% Money-Back Guarantee</strong> within the first
                48 hours if you're not satisfied with our initial design concepts.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <div>
                <strong className="text-purple-400">Partial Refund</strong> if we can't deliver on the agreed-upon
                requirements after multiple revision attempts.
              </div>
            </li>
          </ul>
          <p className="mt-4">
            Our goal is your complete satisfaction. If at any point you feel we're not meeting your
            expectations, please let us know, and we'll work to make it right.
          </p>
        </>
      ),
    },
    {
      category: 'process',
      question: "What is your development process?",
      answer: (
        <>
          <p className="mb-4">Our development process is structured to ensure quality, efficiency, and client satisfaction:</p>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                  1
                </div>
                <h4 className="font-semibold text-white">Discovery & Planning</h4>
              </div>
              <p className="text-white/70 pl-11">We learn about your business, goals, target audience, and project requirements through in-depth consultation.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                  2
                </div>
                <h4 className="font-semibold text-white">Design</h4>
              </div>
              <p className="text-white/70 pl-11">We create wireframes and design mockups for your approval before any coding begins.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                  3
                </div>
                <h4 className="font-semibold text-white">Development</h4>
              </div>
              <p className="text-white/70 pl-11">We build your website with clean, efficient code, focusing on performance, security, and user experience.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                  4
                </div>
                <h4 className="font-semibold text-white">Testing</h4>
              </div>
              <p className="text-white/70 pl-11">We thoroughly test across devices and browsers to ensure everything works perfectly.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                  5
                </div>
                <h4 className="font-semibold text-white">Launch</h4>
              </div>
              <p className="text-white/70 pl-11">We deploy your website and ensure everything is working properly in the live environment.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                  6
                </div>
                <h4 className="font-semibold text-white">Support & Maintenance</h4>
              </div>
              <p className="text-white/70 pl-11">We provide ongoing support and maintenance to keep your website secure, up-to-date, and performing optimally.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      category: 'process',
      question: "What information do you need to get started?",
      answer: (
        <>
          <p className="mb-4">To get started on your project, we'll need the following information:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Business Information</h4>
                <p className="text-white/70">Your business name, industry, target audience, and unique selling points</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Project Goals</h4>
                <p className="text-white/70">What you want to achieve with your website (e.g., generate leads, sell products, provide information)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Layers className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Design Preferences</h4>
                <p className="text-white/70">Your brand colors, logo, examples of websites you like, and any design preferences</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Content</h4>
                <p className="text-white/70">Website copy, images, videos, and any other content you want to include</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Package className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Functionality Requirements</h4>
                <p className="text-white/70">Specific features you need (e.g., contact forms, booking systems, e-commerce)</p>
              </div>
            </div>
          </div>
          <p className="mt-4">Don't worry if you don't have all this information ready. We can help guide you through the process and gather what we need during our initial consultation.</p>
        </>
      ),
    },
    {
      category: 'support',
      question: "What support options do you provide?",
      answer: (
        <>
          <p className="mb-4">We offer various support options to ensure you get the help you need:</p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Email Support</h4>
                <p className="text-white/70">24/7 access with responses within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Phone className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Phone Support</h4>
                <p className="text-white/70">Available during business hours (Mon-Fri, 12am-6pm EST)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Technical Support</h4>
                <p className="text-white/70">Assistance with issues, questions, and troubleshooting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Content Updates</h4>
                <p className="text-white/70">Help with updating content, images, and products</p>
              </div>
            </div>
          </div>
          <p className="mt-4">Our support packages start at $50/month and can be customized based on your specific needs.</p>
        </>
      ),
    },
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqItems.filter((faq: FAQItem) => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Custom styles
  const customStyles = `
    .animate-gradient-text {
      background-image: linear-gradient(to right, #a855f7, #ec4899, #a855f7);
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: gradientText 3s linear infinite;
    }
    
    @keyframes gradientText {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    
    .card-hover-effect {
      transition: all 0.3s ease;
    }
    
    .card-hover-effect:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.3);
    }
    
    .text-glow {
      text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
    }
  `;

  return (
    <>
      {/* Live Chat Component */}

      
      <SEO
        title="FAQ - Devtone Agency Web Development & SEO Services"
        description="Find answers about Devtone Agency's web development & SEO services. Learn about our digital marketing solutions, pricing, and how we help businesses unlock online success."
        keywords={['DevTone FAQ', 'web development questions', 'pricing packages', 'development process', 'support', 'DevTone services', 'SEO services', 'digital marketing', 'branding agency', 'content creation']}
        ogUrl="https://devtone.agency/faq"
      />
      <div className="min-h-screen pt-24 bg-[#030718] overflow-hidden">
        {/* Add the custom styles */}
        <style>{customStyles}</style>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative pt-12 pb-16 overflow-hidden"
          style={{ opacity, scale }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block px-6 py-2 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-500">❓ Help Center</span>
                <motion.div
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Frequently Asked Questions
              </motion.h1>

              <motion.p
                className="text-xl text-white max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Get quick answers to common questions about our web development services, pricing, and support options.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 pb-24">
          {/* Contact Methods */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -5 }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${method.color} rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500`}></div>
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 text-center h-full">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.color} bg-opacity-20 flex items-center justify-center`}>
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-white mb-3 text-sm">{method.description}</p>
                  <div className="text-purple-400 font-semibold mb-2">{method.details}</div>
                  <div className="text-xs text-white">{method.response}</div>

                  <motion.a
                    href={method.link}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Connect
                    <ArrowRight className="w-3 h-3" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* FAQ Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">FAQ Categories</h2>
                  <p className="text-white">
                    Browse our frequently asked questions by category or use the search to find specific answers.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={16} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search questions..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Category Buttons */}
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                        activeCategory === category.id
                          ? "bg-purple-500/20 text-white border border-purple-500/50"
                          : "bg-white/5 text-white/70 border border-white/10 hover:border-purple-500/30"
                      }`}
                    >
                      {category.icon}
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>

                {/* Need a Project Estimate */}
                <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">Need a Project Estimate?</h3>
                  <p className="text-white text-sm mb-4">
                    Looking to start a new project? Get a detailed estimate with our project calculator.
                  </p>
                  <motion.a
                    href="/estimate"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full font-semibold text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                    Get Estimate
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                    {activeCategory === 'all' 
                      ? 'All Questions' 
                      : categories.find(cat => cat.id === activeCategory)?.label || 'Questions'}
                  </h2>
                  <p className="text-white">
                    Find answers to your questions about our web development services. If you can't find what you're looking for, feel free to contact us.
                  </p>
                </div>

                {filteredFaqs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl overflow-hidden card-hover-effect"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <button
                          onClick={() => setOpenIndex(openIndex === index ? null : index)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left"
                        >
                          <span className="font-medium text-white">{faq.question}</span>
                          <motion.div
                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 ml-4 text-purple-400"
                          >
                            {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {openIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-6 pb-6"
                            >
                              <div className="text-white/80 leading-relaxed">{faq.answer}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HelpCircle className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                    <p className="text-white/70 mb-6">
                      We couldn't find any questions matching your search. Try different keywords or browse all categories.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setActiveCategory('all');
                      }}
                      className="px-6 py-2 bg-purple-500/20 text-white border border-purple-500/50 rounded-full hover:bg-purple-500/30 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Contact Us CTA */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <MessageSquare className="text-purple-400" size={28} />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Still have questions?</h3>
                  <p className="text-white/70 mb-6 max-w-xl mx-auto">
                    Can't find the answer you're looking for? Please reach out to our friendly team.
                  </p>
                  <motion.a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r 
                    from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 
                    text-white font-semibold rounded-xl transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact Us
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;