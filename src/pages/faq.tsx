import DOMPurify from 'dompurify';
"use client"

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Plus, Minus, Search, CheckCircle, ArrowRight, 
  MessageSquare, Package, Clock, CreditCard, 
  RefreshCw, HelpCircle, ChevronDown, ChevronUp,
  Star, Award, Shield, Zap, Users, Sparkles,
  FileText, Target, Layers, Send, Mail, Phone, Calendar,
  DollarSign, Code, Laptop, Globe, Palette, Database
} from 'lucide-react';
import SEO from '@/components/SEO';

interface FAQItem {
  category: string;
  question: string;
  answer: ReactNode;
}

// GuaranteeItem component moved outside FAQ and faqItems
const GuaranteeItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <li className="flex items-start gap-2" role="listitem">
    <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
    <div>
      <strong className="text-purple-400">{title}</strong> {children}
    </div>
  </li>
);

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
    { id: 'tech', label: 'Technology', icon: <Code size={18} /> },
  ];

  // Creative contact methods section
  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'team@devtone.agency',
      link: 'mailto:team@devtone.agency',
      color: 'from-purple-600 to-purple-800',
      response: 'Response within 24 hours'
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

  // FAQ Items - reordered by priority and with new questions
  const faqItems = [
    {
      category: 'pricing',
      question: "How much do your services cost?",
      answer: (
        <>
          <p className="mb-4">Each project has different needs - that's why we offer a free estimate process.</p>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 mt-1">
                <DollarSign size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-lg mb-2">Personalized Pricing</h4>
                <p className="text-white/70">
                  In less than 2 minutes, you can tell us what you're looking for and we'll send you a personalized proposal.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 mt-1">
                <CheckCircle size={14} />
              </div>
              <p className="text-white/70">Custom website design tailored to your brand</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 mt-1">
                <CheckCircle size={14} />
              </div>
              <p className="text-white/70">Responsive design for all devices</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 mt-1">
                <CheckCircle size={14} />
              </div>
              <p className="text-white/70">SEO optimization to help your site get found</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 mt-1">
                <CheckCircle size={14} />
              </div>
              <p className="text-white/70">Ongoing support and maintenance options</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <motion.a
              href="/estimate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full font-semibold text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Your Free Estimate
            </motion.a>
          </div>
        </>
      ),
    },
    {
      category: 'process',
      question: "How long does a typical project take?",
      answer: (
        <>
          <p className="mb-4">Project timelines vary based on complexity and scope:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Basic Website</h4>
                <p className="text-white/70">3-5 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Standard Website</h4>
                <p className="text-white/70">1-2 weeks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Premium Website</h4>
                <p className="text-white/70">2-3 weeks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">E-commerce Website</h4>
                <p className="text-white/70">3-4 weeks</p>
              </div>
            </div>
          </div>
          <p className="mt-4 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
            <strong className="text-purple-300">Success Story:</strong> We recently delivered a complete e-commerce platform for a boutique clothing brand in just 18 days, which helped them increase online sales by 45% in the first month after launch.
          </p>
        </>
      ),
    },
    {
      category: 'process',
      question: "What's your development process like?",
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
          <p className="mt-4">
            Learn more about our approach on our <a href="/services" className="text-purple-400 underline hover:text-purple-300">Services page</a>.
          </p>
        </>
      ),
    },
    {
      category: 'tech',
      question: "Do you offer SEO or marketing services?",
      answer: (
        <>
          <p className="mb-4">Yes, we offer comprehensive SEO and digital marketing services to help your website get found and convert visitors:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Search Engine Optimization (SEO)</h4>
                <p className="text-white/70">Keyword research, on-page optimization, technical SEO, and content strategy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Content Marketing</h4>
                <p className="text-white/70">Blog posts, articles, and other content creation to drive organic traffic</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Social Media Marketing</h4>
                <p className="text-white/70">Strategy, content creation, and management for social platforms</p>
              </div>
            </div>
          </div>
          <p className="mt-4 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
            <strong className="text-purple-300">Client Success:</strong> Our SEO services helped a local service business increase their organic traffic by 210% and generate 35+ qualified leads per month, resulting in a 3x ROI on their marketing investment.
          </p>
        </>
      ),
    },
    {
      category: 'tech',
      question: "What technologies do you use?",
      answer: (
        <>
          <p className="mb-4">We use modern, cutting-edge technologies to build fast, secure, and scalable websites:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Code className="text-purple-400" size={16} />
                </div>
                <h4 className="font-semibold text-white">Frontend</h4>
              </div>
              <p className="text-white/70 pl-11">React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Database className="text-purple-400" size={16} />
                </div>
                <h4 className="font-semibold text-white">Backend</h4>
              </div>
              <p className="text-white/70 pl-11">Node.js, Express, Supabase, Firebase</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Palette className="text-purple-400" size={16} />
                </div>
                <h4 className="font-semibold text-white">Design</h4>
              </div>
              <p className="text-white/70 pl-11">Figma, Adobe XD, Photoshop</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="text-purple-400" size={16} />
                </div>
                <h4 className="font-semibold text-white">CMS</h4>
              </div>
              <p className="text-white/70 pl-11">WordPress, Shopify, Contentful, Sanity</p>
            </div>
          </div>
          <p className="mt-4">
            We primarily use React, Next.js, and Supabase — learn more on our <a href="/services" className="text-purple-400 underline hover:text-purple-300">Services page</a>.
          </p>
        </>
      ),
    },
    {
      category: 'support',
      question: "Do you provide post-launch support?",
      answer: (
        <>
          <p className="mb-4">Yes, we offer comprehensive post-launch support and maintenance services:</p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Monthly Maintenance Plans</h4>
                <p className="text-white/70">Regular updates, security patches, backups, and performance monitoring</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Technical Support</h4>
                <p className="text-white/70">Help with technical issues, troubleshooting, and bug fixes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Content Updates</h4>
                <p className="text-white/70">Assistance with updating content, adding new pages, and making design changes</p>
              </div>
            </div>
          </div>
          <p className="mt-4">
            Our support packages start at $50/month and can be customized based on your specific needs. <a href="/contact" className="text-purple-400 underline hover:text-purple-300">Contact us</a> to discuss your support requirements.
          </p>
        </>
      ),
    },
    {
      category: 'pricing',
      question: "Do you offer a money-back guarantee?",
      answer: (
        <section>
          Yes, we offer a comprehensive money-back guarantee:
          <ul className="mt-4 space-y-2" role="list">
            <GuaranteeItem title="100% Money-Back Guarantee">
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    "within the first 48 hours if you're not satisfied with our initial design concepts."
                  ),
                }}
              />
            </GuaranteeItem>
            <GuaranteeItem title="Partial Refund">
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    "if we can't deliver on the agreed-upon requirements after multiple revision attempts."
                  ),
                }}
              />
            </GuaranteeItem>
          </ul>
          <p className="mt-4">
            {
              DOMPurify.sanitize(
                "Our goal is your complete satisfaction. If at any point you feel we're not meeting your expectations, please let us know, and we'll work to make it right."
              )
            }
          </p>
        </section>
      ),
    },
    {
      category: 'tech',
      question: "Do you work with my industry?",
      answer: (
        <>
          <p className="mb-4">Yes, we have experience working with clients across various industries:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400"><CheckCircle size={16} /></div>
              <p className="text-white/70">E-commerce & Retail</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400"><CheckCircle size={16} /></div>
              <p className="text-white/70">Professional Services</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400"><CheckCircle size={16} /></div>
              <p className="text-white/70">Healthcare & Wellness</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400"><CheckCircle size={16} /></div>
              <p className="text-white/70">Real Estate & Property</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400"><CheckCircle size={16} /></div>
              <p className="text-white/70">Technology & SaaS</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400"><CheckCircle size={16} /></div>
              <p className="text-white/70">Food & Hospitality</p>
            </div>
          </div>
          <p className="mt-4">
            We take the time to understand your industry's specific needs and challenges to create a website that resonates with your target audience and achieves your business goals.
          </p>
        </>
      ),
    },
    {
      category: 'support',
      question: "Do you offer ongoing support or updates?",
      answer: (
        <>
          <p className="mb-4">Yes, we offer flexible support options to keep your website running smoothly:</p>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Monthly Retainers</h4>
              <p className="text-white/70">Ongoing support with a set number of hours each month for updates, changes, and maintenance.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">One-Off Support</h4>
              <p className="text-white/70">Pay-as-you-go support for occasional updates or changes to your website.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Maintenance Plans</h4>
              <p className="text-white/70">Regular updates, security patches, backups, and performance monitoring to keep your site secure and up-to-date.</p>
            </div>
          </div>
          <p className="mt-4">
            Our clients appreciate the peace of mind that comes with knowing their website is being properly maintained and that help is available when needed. <a href="/contact" className="text-purple-400 underline hover:text-purple-300">Contact us</a> to discuss your ongoing support needs.
          </p>
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
                Got questions? We've answered the most common ones below. If you're wondering about something else, feel free to reach out we're here to help.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 pb-24">
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
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24 faq-rgb-border">
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
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 faq-rgb-border">
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
                    Let's talk about your goals — <a href="/contact" className="text-purple-400 underline hover:text-purple-300">schedule a free consultation</a>.
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