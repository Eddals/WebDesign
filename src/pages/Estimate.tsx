
import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Globe,
  ShoppingCart,
  Code,
  Palette,
  CreditCard,
  Rocket,
  Crown,
  User,
  Mail,
  Phone,
  Building,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import SEO from '@/components/SEO'

const Estimate = () => {
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    company: '',

    // Project Details
    projectType: '',
    budget: '',
    timeline: '',
    complexity: 'moderate',
    features: [] as string[],
    description: '',

    // Additional Requirements
    hasExistingWebsite: '',
    existingWebsiteUrl: '',
    targetAudience: '',
    mainGoals: [] as string[],
    designPreferences: '',
    contentReady: '',

    // Technical Requirements
    hostingNeeded: '',
    domainNeeded: '',
    maintenanceNeeded: '',
    customBudget: ''
  })
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  // Animation references and effects
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  // Project configuration data
  const projectTypes = [
    {
      id: 'business-website',
      name: 'Business Website',
      icon: <Globe className="w-6 h-6" />,
      description: 'Professional website for your business',
      basePrice: 2500
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Store',
      icon: <ShoppingCart className="w-6 h-6" />,
      description: 'Online store with payment processing',
      basePrice: 4000
    },
    {
      id: 'web-application',
      name: 'Web Application',
      icon: <Code className="w-6 h-6" />,
      description: 'Custom web application development',
      basePrice: 8000
    },
    {
      id: 'website-redesign',
      name: 'Website Redesign',
      icon: <Palette className="w-6 h-6" />,
      description: 'Modernize your existing website',
      basePrice: 2000
    },
    {
      id: 'landing-page',
      name: 'Landing Page',
      icon: <Rocket className="w-6 h-6" />,
      description: 'High-converting landing page',
      basePrice: 1500
    },
    {
      id: 'custom-development',
      name: 'Custom Development',
      icon: <Crown className="w-6 h-6" />,
      description: 'Fully custom solution',
      basePrice: 10000
    }
  ]



  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Calculate estimated price
  const calculatePrice = () => {
    const selectedProject = projectTypes.find(p => p.id === formData.projectType)
    if (!selectedProject) return 0

    let basePrice = selectedProject.basePrice

    // Apply complexity multiplier
    const complexityMultipliers = {
      'simple': 0.8,
      'moderate': 1.0,
      'complex': 1.5,
      'enterprise': 2.0
    }

    const complexityMultiplier = complexityMultipliers[formData.complexity as keyof typeof complexityMultipliers] || 1.0

    const finalPrice = Math.round(basePrice * complexityMultiplier)
    return Math.max(500, finalPrice) // Minimum $500
  }

  // Handle Stripe payment
  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          customerInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url

    } catch (error) {
      setIsLoading(false)
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    }
  }

  // Get price estimate from server
  const getEstimate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/calculate-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      })

      if (response.ok) {
        const { pricing } = await response.json()
        setEstimatedPrice(pricing.finalPrice)
      } else {
        // Fallback to client-side calculation
        setEstimatedPrice(calculatePrice())
      }
    } catch (error) {
      // Fallback to client-side calculation
      setEstimatedPrice(calculatePrice())
    }
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
        description="Get a detailed estimate for your web development project. Professional pricing with transparent breakdown."
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
                <span className="relative z-10">📋 Step {currentStep} of 5</span>
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
                  Get Your <span className="animate-gradient-text">Project Estimate</span>
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-white/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Tell us about your project and get an instant estimate with transparent pricing breakdown.
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      step <= currentStep
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: "20%" }}
                  animate={{ width: `${(currentStep / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Multi-Step Form */}
        <div className="container mx-auto px-4 pb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Personal Information</h2>
                  <p className="text-white/60 mb-8">Let's start with your contact details</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Project Type */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Project Type</h2>
                  <p className="text-white/60 mb-8">What type of project are you looking to build?</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projectTypes.map((type) => (
                      <motion.div
                        key={type.id}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.projectType === type.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-purple-500/50'
                        }`}
                        onClick={() => setFormData({...formData, projectType: type.id})}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                            {type.icon}
                          </div>
                          <h4 className="text-white font-semibold mb-2">{type.name}</h4>
                          <p className="text-white/60 text-sm mb-2">{type.description}</p>
                          <p className="text-purple-400 font-semibold text-sm">
                            Starting at ${type.basePrice.toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
                <motion.button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    currentStep === 1
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
                  whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </motion.button>

                <div className="text-center">
                  <p className="text-white/60 text-sm">Step {currentStep} of 2</p>
                  {estimatedPrice && (
                    <p className="text-purple-400 font-semibold">
                      Estimated: ${estimatedPrice.toLocaleString()}
                    </p>
                  )}
                </div>

                <motion.button
                  onClick={currentStep === 2 ? () => setShowPayment(true) : nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.name || !formData.email)) ||
                    (currentStep === 2 && !formData.projectType)
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep === 2 ? 'Get Estimate' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Payment Section */}
              {showPayment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Start?</h3>
                  <p className="text-white/70 mb-6">
                    Your estimated project cost is ${estimatedPrice?.toLocaleString()}.
                    Click below to proceed with secure payment via Stripe.
                  </p>

                  <div className="flex gap-4">
                    <motion.button
                      onClick={getEstimate}
                      className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-semibold text-white transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Quote Only
                    </motion.button>

                    <motion.button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full font-semibold text-white transition-all disabled:opacity-50"
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
                          Pay & Start Now
                        </div>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Estimate;