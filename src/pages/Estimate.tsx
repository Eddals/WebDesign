import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calculator, Clock, DollarSign, FileText } from "lucide-react";
import SEO from '@/components/SEO';
import EstimateForm from '@/components/EstimateForm';

const Estimate = () => {
  // Animation references and effects
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // Benefits of getting an estimate
  const benefits = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: 'Accurate Pricing',
      description: 'Get a detailed breakdown of costs for your specific project needs.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Timeline Projection',
      description: 'Understand the timeframe required to complete your project successfully.',
      color: 'from-purple-500 to-purple-700'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Scope Definition',
      description: 'Clearly define what's included in your project to avoid scope creep.',
      color: 'from-purple-600 to-purple-800'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Budget Planning',
      description: 'Plan your budget effectively with our transparent pricing model.',
      color: 'from-purple-500 to-purple-700'
    }
  ];

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
        title="Get a Free Project Estimate - Devtone Agency"
        description="Request a detailed estimate for your web development, SEO, or digital marketing project. Our transparent pricing helps you plan your budget effectively."
        keywords={['project estimate', 'web development cost', 'SEO pricing', 'digital marketing budget', 'free quote', 'website cost calculator']}
        ogUrl="https://devtone.agency/estimate"
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
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-500">🧮 Free Estimate</span>
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
                Request Your Project Estimate
              </motion.h1>

              <motion.p
                className="text-xl text-white max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Fill out the form below to receive a detailed estimate for your project. We'll analyze your requirements and provide a comprehensive breakdown.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 pb-24">
          {/* Benefits Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -5 }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${benefit.color} rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500`}></div>
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 text-center h-full">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${benefit.color} bg-opacity-20 flex items-center justify-center`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Estimate Form Section */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Fill Out Your Project Details</h2>
              <p className="text-white/80 text-center mb-8">
                Please provide as much detail as possible to help us create an accurate estimate for your project.
              </p>
              
              <EstimateForm />
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="max-w-3xl mx-auto mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">How long does it take to receive an estimate?</h3>
                <p className="text-white/80">We typically provide estimates within 1-2 business days, depending on the complexity of your project.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Is the estimate binding?</h3>
                <p className="text-white/80">Our estimates provide a detailed breakdown of expected costs, but the final price may vary based on project scope changes or unforeseen requirements.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">What information should I include in my request?</h3>
                <p className="text-white/80">The more details you provide about your project goals, timeline, and specific requirements, the more accurate our estimate will be.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Do you offer payment plans?</h3>
                <p className="text-white/80">Yes, we offer flexible payment plans for larger projects. We'll discuss payment options when we provide your estimate.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Estimate;