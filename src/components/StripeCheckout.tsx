import React, { useState } from 'react';
import { CreditCard, Loader, DollarSign, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  paymentModel: string;
  subscriptionPlan: string;
}

interface StripeCheckoutProps {
  formData: FormData;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

// Pricing configuration (matches backend)
const PRICING_CONFIG = {
  budgetRanges: {
    'starter': { min: 500, max: 1500, default: 1000 },
    'professional': { min: 1500, max: 5000, default: 3000 },
    'premium': { min: 5000, max: 15000, default: 10000 },
    'enterprise': { min: 15000, max: 50000, default: 25000 }
  },
  subscriptionPlans: {
    'starter': { setupFee: 99, monthlyPrice: 29 },
    'business': { setupFee: 149, monthlyPrice: 59 },
    'pro': { setupFee: 199, monthlyPrice: 99 }
  },
  projectTypeMultipliers: {
    'business': 1.0,
    'ecommerce': 1.5,
    'portfolio': 0.8,
    'blog': 0.7,
    'landing': 0.6,
    'webapp': 2.0
  },
  timelineMultipliers: {
    'asap': 1.5,
    '2weeks': 1.0,
    '1month': 0.9,
    'flexible': 0.8
  }
};

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  formData,
  onSuccess,
  onError,
  disabled = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  // Calculate estimated price (same logic as backend)
  const calculateEstimatedPrice = (): { price: number; description: string } => {
    const { budget, projectType, timeline, paymentModel, subscriptionPlan } = formData;
    
    let basePrice = 0;
    let description = '';
    
    if (paymentModel === 'onetime') {
      const budgetConfig = PRICING_CONFIG.budgetRanges[budget as keyof typeof PRICING_CONFIG.budgetRanges];
      if (budgetConfig) {
        basePrice = budgetConfig.default;
      }
      
      const projectMultiplier = PRICING_CONFIG.projectTypeMultipliers[projectType as keyof typeof PRICING_CONFIG.projectTypeMultipliers] || 1.0;
      basePrice *= projectMultiplier;
      
      const timelineMultiplier = PRICING_CONFIG.timelineMultipliers[timeline as keyof typeof PRICING_CONFIG.timelineMultipliers] || 1.0;
      basePrice *= timelineMultiplier;
      
      description = `Web Design Package - ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Website`;
      
    } else if (paymentModel === 'subscription' && subscriptionPlan) {
      const planConfig = PRICING_CONFIG.subscriptionPlans[subscriptionPlan as keyof typeof PRICING_CONFIG.subscriptionPlans];
      if (planConfig) {
        basePrice = planConfig.setupFee;
        description = `Web Design Package - ${subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)} Plan Setup`;
      }
    }
    
    basePrice = Math.max(basePrice, 99);
    
    return { price: basePrice, description };
  };

  // Validate form data
  const validateFormData = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.projectType) return 'Project type is required';
    if (!formData.paymentModel) return 'Payment model is required';
    
    if (formData.paymentModel === 'onetime' && !formData.budget) {
      return 'Budget range is required for one-time payments';
    }
    
    if (formData.paymentModel === 'subscription' && !formData.subscriptionPlan) {
      return 'Subscription plan is required';
    }
    
    return null;
  };

  // Handle Stripe Checkout
  const handleCheckout = async () => {
    // Validate form
    const validationError = validateFormData();
    if (validationError) {
      onError?.(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare customer info
      const customerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company
      };

      // Call your backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          customerInfo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url, sessionId, amount, description } = await response.json();

      console.log('✅ Checkout session created:', {
        sessionId,
        amount,
        description
      });

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }

      onSuccess?.();

    } catch (error) {
      console.error('❌ Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment setup failed';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get estimated pricing for display
  React.useEffect(() => {
    if (formData.paymentModel && (formData.budget || formData.subscriptionPlan)) {
      const { price } = calculateEstimatedPrice();
      setEstimatedPrice(price);
    }
  }, [formData]);

  const { description } = calculateEstimatedPrice();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Price Preview */}
      {estimatedPrice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">{description}</h3>
              <p className="text-white/60 text-sm mt-1">
                {formData.paymentModel === 'subscription' ? 'Setup fee' : 'One-time payment'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-300">
                ${estimatedPrice.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">USD</div>
            </div>
          </div>
          
          {formData.paymentModel === 'subscription' && formData.subscriptionPlan && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Monthly subscription</span>
                <span className="text-white">
                  ${PRICING_CONFIG.subscriptionPlans[formData.subscriptionPlan as keyof typeof PRICING_CONFIG.subscriptionPlans]?.monthlyPrice}/month
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Payment Button */}
      <motion.button
        onClick={handleCheckout}
        disabled={disabled || isLoading || !estimatedPrice}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
          disabled || isLoading || !estimatedPrice
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25'
        }`}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Setting up payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay with Stripe
            {estimatedPrice && (
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                ${estimatedPrice.toLocaleString()}
              </span>
            )}
          </>
        )}
      </motion.button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
        <Shield className="w-4 h-4" />
        <span>Secure payment powered by Stripe</span>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>Money Back Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;