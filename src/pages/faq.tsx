"use client"

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Minus, Search, CheckCircle, ArrowRight, 
  MessageSquare, Package, Clock, CreditCard, 
  RefreshCw, HelpCircle, ChevronDown, ChevronUp,
  Star, Award, Shield, Zap, Users, Sparkles,
  FileText, Target, Layers
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
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInView(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // FAQ Categories
  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle size={18} /> },
    { id: 'services', label: 'Services', icon: <Package size={18} /> },
    { id: 'pricing', label: 'Pricing', icon: <CreditCard size={18} /> },
    { id: 'process', label: 'Process', icon: <RefreshCw size={18} /> },
    { id: 'support', label: 'Support', icon: <MessageSquare size={18} /> },
  ];

  // FAQ Items
  const faqItems = [
    {
      category: 'services',
      question: "What services do you offer?",
      answer: (
        <>
          We specialize in web development using <span className="text-purple-400">HTML</span>,{" "}
          <span className="text-purple-400">CSS</span>, <span className="text-purple-400">JavaScript</span>,{" "}
          <span className="text-purple-400">TypeScript</span>, <span className="text-purple-400">React</span>, and more.
          Our services include:
          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <span>Custom website development</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <span>E-commerce solutions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <span>Web application development</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <span>SEO optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <span>Website maintenance and support</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      category: 'pricing',
      question: "What are your package prices and what's included?",
      answer: (
        <>
          Our packages are designed to fit different needs and budgets:
          <div className="mt-4 space-y-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Star className="text-purple-400" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-white">Basic Package ($120)</h4>
              </div>
              <ul className="space-y-2 pl-10">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>2 responsive pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Content upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>3 revisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>3-day delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Basic plugins installation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Mobile-friendly design</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Award className="text-purple-400" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-white">Standard Package ($300)</h4>
              </div>
              <ul className="space-y-2 pl-10">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Up to 5 pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>SEO optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Speed optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>5 revisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>5-day delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Advanced plugins</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Analytics integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Content strategy</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="text-purple-400" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-white">Premium Package ($650)</h4>
              </div>
              <ul className="space-y-2 pl-10">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Up to 10 pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Full e-commerce functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Payment gateway integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Advanced animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Comprehensive SEO</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>10 revisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>7-day delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Social media integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      category: 'pricing',
      question: "What are the main differences between packages?",
      answer: (
        <>
          Here are the key differences between our packages:
          <div className="mt-4 space-y-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-lg font-semibold text-purple-400 mb-2">Basic vs Standard</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>3 more pages (2 vs 5 pages)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Added SEO optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Added speed optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>2 extra revisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Analytics integration included</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-lg font-semibold text-purple-400 mb-2">Standard vs Premium</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>5 more pages (5 vs 10 pages)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>E-commerce functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Payment integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Advanced animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>5 extra revisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                  <span>Social media integration</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
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
                48 hours if you're not satisfied
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <div>
                <strong className="text-purple-400">Partial Refund Policy</strong> based on work
                completed
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <div>
                <strong className="text-purple-400">Revision Guarantee</strong> - we'll keep revising
                until you're satisfied within the allocated revision limit
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <div>No hidden fees or surprise charges</div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="text-purple-400 flex-shrink-0 mt-1" size={16} />
              <div>Clear milestone-based payment structure</div>
            </li>
          </ul>
        </>
      ),
    },
    {
      category: 'pricing',
      question: "Can I customize a package?",
      answer: (
        <>
          Yes, all packages can be customized:
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Additional Pages</h4>
              <p>Add extra pages ($50-$100 per page)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Extra Revisions</h4>
              <p>Additional revisions ($30 per revision)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Rush Delivery</h4>
              <p>Rush delivery (+50% for 24-hour delivery)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Extra Features</h4>
              <ul className="space-y-1">
                <li>Blog integration ($150)</li>
                <li>Newsletter setup ($100)</li>
                <li>Advanced security ($200)</li>
                <li>Custom animations ($250)</li>
              </ul>
            </div>
          </div>
          <p className="mt-4">Contact us for custom requirements and pricing.</p>
        </>
      ),
    },
    {
      category: 'process',
      question: "How long does it take to complete a website?",
      answer: (
        <>
          <p className="mb-4">Delivery times vary by package:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Clock className="text-purple-400 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-white mb-1">Basic Package</h4>
              <p className="text-purple-300">3 days</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Clock className="text-purple-400 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-white mb-1">Standard Package</h4>
              <p className="text-purple-300">5 days</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Clock className="text-purple-400 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-white mb-1">Premium Package</h4>
              <p className="text-purple-300">7 days</p>
            </div>
          </div>
          <p className="mt-4">These timelines ensure quality while maintaining efficiency. More complex projects may require additional time, which we'll discuss during our initial consultation.</p>
        </>
      ),
    },
    {
      category: 'support',
      question: "Do you provide post-launch support?",
      answer: (
        <>
          <p className="mb-4">Yes, we offer comprehensive post-launch support to ensure your website continues to perform optimally:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="text-purple-400" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Maintenance Plans</h4>
                <p className="text-white/70">Regular updates, security patches, and performance monitoring</p>
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
    {
      category: 'services',
      question: "What technologies do you use?",
      answer: (
        <>
          <p className="mb-4">We use modern, cutting-edge technologies to build fast, scalable, and maintainable websites:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">R</span>
              </div>
              <span className="text-white">React</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">N</span>
              </div>
              <span className="text-white">Next.js</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">TS</span>
              </div>
              <span className="text-white">TypeScript</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">TW</span>
              </div>
              <span className="text-white">Tailwind CSS</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">FM</span>
              </div>
              <span className="text-white">Framer Motion</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">SP</span>
              </div>
              <span className="text-white">Supabase</span>
            </div>
          </div>
          <p className="mt-4">We stay up-to-date with the latest advancements in web development to ensure your website is built using the best technologies available.</p>
        </>
      ),
    },
    {
      category: 'pricing',
      question: "Can I upgrade my package later?",
      answer: (
        <>
          <p>Yes, you can upgrade from a Basic or Standard package to a higher tier. We'll help transition your existing work to the new package features.</p>
          <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="font-semibold text-purple-400 mb-2">Upgrade Process</h4>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Contact us about your desire to upgrade</li>
              <li>We'll provide a quote for the upgrade cost (typically the difference between packages plus a small integration fee)</li>
              <li>Once approved, we'll enhance your existing site with the new features</li>
              <li>You'll review the upgrades and request any revisions</li>
              <li>The upgraded site goes live with all new features</li>
            </ol>
          </div>
          <p className="mt-4">Upgrading is a smooth process that allows your website to grow alongside your business.</p>
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
      category: 'support',
      question: "What kind of ongoing maintenance do you offer?",
      answer: (
        <>
          <p className="mb-4">Our maintenance services keep your website secure, up-to-date, and performing at its best:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Basic Maintenance ($50/month)</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Security updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Software updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Monthly backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Uptime monitoring</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Standard Maintenance ($100/month)</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Weekly backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Performance optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>1 hour of content updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Monthly analytics report</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Premium Maintenance ($200/month)</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Everything in Standard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Daily backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>3 hours of content updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>SEO monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Weekly analytics report</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Custom Maintenance</h4>
              <p>We can create a custom maintenance plan tailored to your specific needs and budget.</p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 mt-2 text-purple-300 hover:text-purple-400 transition-colors"
              >
                Contact us for details <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </>
      ),
    },
    {
      category: 'services',
      question: "Do you offer e-commerce development?",
      answer: (
        <>
          <p className="mb-4">Yes, we offer comprehensive e-commerce development services to help you sell products or services online:</p>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">E-commerce Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Product catalog management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Inventory management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Order management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Customer accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Shipping integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Tax calculation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-purple-400 flex-shrink-0" size={14} />
                  <span>Discount codes</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">E-commerce Platforms</h4>
              <p className="mb-2">We work with various e-commerce platforms to find the best fit for your business:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">Shopify</div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">WooCommerce</div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">BigCommerce</div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">Custom Solutions</div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-purple-400 mb-2">Payment Gateways</h4>
              <p className="mb-2">We integrate with all major payment processors:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">Stripe</div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">PayPal</div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">Square</div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">And more</div>
              </div>
            </div>
          </div>
          <p className="mt-4">E-commerce development is included in our Premium Package or can be added to other packages for an additional fee.</p>
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

  // Custom styles for animations
  const customStyles = `
    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-gradient-text {
      background: linear-gradient(90deg, #a855f7, #6366f1, #a855f7);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradientFlow 6s linear infinite;
    }
    
    .card-hover-effect {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card-hover-effect:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.3);
    }
  `;

  return (
    <>
      <SEO 
        title="Frequently Asked Questions | Web Development Services"
        description="Find answers to common questions about our web development services, pricing, process, and support."
        keywords={['FAQ', 'web development', 'pricing', 'packages', 'process', 'support']}
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718] overflow-hidden">
        {/* Add the custom styles */}
        <style >{customStyles}</style>
        
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-block px-4 py-1 mb-4 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative z-10">Help Center</span>
              <motion.div 
                className="absolute inset-0 bg-purple-500/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
                Frequently Asked <span className="animate-gradient-text">Questions</span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Get quick answers to common questions about our web development services
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for questions..."
                  className="w-full bg-white/5 border border-white/20 focus:border-purple-500 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
            
            {/* Category Tabs */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                    activeCategory === category.id
                      ? "bg-purple-500/20 text-white border-2 border-purple-500/50"
                      : "bg-white/5 text-white/70 border-2 border-white/10 hover:border-purple-500/30"
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* FAQ Items */}
            {filteredFaqs.length > 0 ? (
              <motion.div 
                className="space-y-4 mb-16"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl overflow-hidden card-hover-effect"
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
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl"
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

            {/* Still Have Questions */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;