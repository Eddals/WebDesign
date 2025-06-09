
import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Globe,
  ShoppingCart,
  Code,
  Palette,
  CreditCard,
  Check,
  ArrowRight,
  Package,
  Rocket,
  Crown
} from "lucide-react"
import { loadStripe } from '@stripe/stripe-js'
import SEO from '@/components/SEO'

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...')

const Estimate = () => {
  // State management
  const [projectDetails, setProjectDetails] = useState({
    projectType: '',
    features: [] as string[],
    timeline: '',
    budget: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Animation references and effects
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  // Pricing plans data
  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 999,
      icon: <Package className="w-8 h-8" />,
      description: 'Perfect for small businesses and personal projects',
      features: [
        'Responsive Design',
        'Up to 5 Pages',
        'Basic SEO Setup',
        'Contact Form',
        '30 Days Support',
        'Mobile Optimized'
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 2499,
      icon: <Rocket className="w-8 h-8" />,
      description: 'Ideal for growing businesses with advanced needs',
      features: [
        'Everything in Starter',
        'Up to 15 Pages',
        'Advanced SEO',
        'E-commerce Integration',
        'Analytics Setup',
        'Social Media Integration',
        '90 Days Support',
        'Performance Optimization'
      ],
      color: 'from-purple-500 to-indigo-500',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 4999,
      icon: <Crown className="w-8 h-8" />,
      description: 'Complete solution for large businesses',
      features: [
        'Everything in Professional',
        'Unlimited Pages',
        'Custom Functionality',
        'API Integrations',
        'Advanced Security',
        'Priority Support',
        '1 Year Support',
        'Dedicated Account Manager'
      ],
      color: 'from-yellow-500 to-orange-500',
      popular: false
    }
  ]

  // Project types data
  const projectTypes = [
    {
      id: 'website',
      name: 'Business Website',
      icon: <Globe className="w-6 h-6" />,
      description: 'Professional website for your business'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      icon: <ShoppingCart className="w-6 h-6" />,
      description: 'Online store with payment processing'
    },
    {
      id: 'webapp',
      name: 'Web Application',
      icon: <Code className="w-6 h-6" />,
      description: 'Custom web application development'
    },
    {
      id: 'redesign',
      name: 'Website Redesign',
      icon: <Palette className="w-6 h-6" />,
      description: 'Modernize your existing website'
    }
  ]

  // Handle Stripe payment
  const handlePayment = async (planId: string, amount: number) => {
    setIsLoading(true)
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to initialize')

      // In a real app, you would call your backend to create a payment intent
      // For demo purposes, we'll show a success message
      setTimeout(() => {
        setIsLoading(false)
        alert(`Payment initiated for ${planId} plan - $${amount}`)
      }, 2000)
    } catch (error) {
      setIsLoading(false)
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    }
  }

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
        title="Get a Free Estimate - Web Development Services"
        description="Get a free estimate for your web development project. We provide custom quotes based on your specific requirements."
        keywords={['free estimate', 'web development quote', 'project estimate', 'custom website pricing']}
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
                <span className="relative z-10">💰 Professional Pricing</span>
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
                  Choose Your <span className="animate-gradient-text">Perfect Plan</span>
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-white/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Professional web development packages designed to fit your business needs and budget.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* Pricing Plans Section */}
        <div className="container mx-auto px-4 pb-24">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Choose Your <span className="animate-gradient-text">Package</span>
            </motion.h2>

            <motion.p
              className="text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Select the perfect plan for your project. All plans include professional design and development.
            </motion.p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative group ${plan.popular ? 'md:-mt-4' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`absolute -inset-1 bg-gradient-to-r ${plan.color} rounded-3xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500`}></div>

                <div className="relative bg-[#0a0e24] border border-white/10 rounded-3xl p-8 h-full backdrop-blur-sm">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} bg-opacity-20 flex items-center justify-center mx-auto mb-4`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                    <div className="text-4xl font-bold text-white mb-1">
                      ${plan.price.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">One-time payment</div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => handlePayment(plan.id, plan.price)}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-full font-semibold text-white transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Project Type Selection */}
          <motion.div
            className="mt-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">What Type of Project?</h3>
              <p className="text-white/70">Tell us more about your specific needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {projectTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    projectDetails.projectType === type.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                  }`}
                  onClick={() => setProjectDetails({...projectDetails, projectType: type.id})}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      {type.icon}
                    </div>
                    <h4 className="text-white font-semibold mb-2">{type.name}</h4>
                    <p className="text-white/60 text-sm">{type.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-500/20 to-purple-700/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Quote?</h3>
              <p className="text-white/70 mb-6">
                Have a unique project in mind? Let's discuss your specific requirements and create a custom solution.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full font-semibold text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Estimate;