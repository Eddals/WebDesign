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
  projectTypes: {
    'landing': { basePrice: 299, name: 'Landing Page' },
    'portfolio': { basePrice: 499, name: 'Portfolio Website' },
    'business': { basePrice: 799, name: 'Business Website' },
    'ecommerce': { basePrice: 1299, name: 'E-commerce Store' },
    'webapp': { basePrice: 2499, name: 'Web Application' }
  },
  timelineMultipliers: {
    'asap': 1.5,
    '2weeks': 1.0,
    '1month': 0.9,
    'flexible': 0.8
  },
  features: {
    'seo': { price: 149, name: 'SEO Optimization' },
    'analytics': { price: 79, name: 'Analytics Setup' },
    'social': { price: 99, name: 'Social Media Integration' },
    'security': { price: 129, name: 'Security Package' },
    'performance': { price: 99, name: 'Speed Optimization' },
    'maintenance': { price: 199, name: '6 Months Support' },
    'training': { price: 99, name: 'Training Session' },
    'backup': { price: 49, name: 'Automated Backups' }
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

  // Calculate estimated price (matches backend logic)
  const calculateEstimatedPrice = (): { price: number; description: string } => {
    const { projectType, timeline } = formData;

    // Get base price from project type
    const projectConfig = PRICING_CONFIG.projectTypes[projectType as keyof typeof PRICING_CONFIG.projectTypes];
    if (!projectConfig) {
      return { price: 0, description: 'Invalid project type' };
    }

    let basePrice = projectConfig.basePrice;

    // Apply timeline multiplier
    const timelineMultiplier = PRICING_CONFIG.timelineMultipliers[timeline as keyof typeof PRICING_CONFIG.timelineMultipliers] || 1.0;
    basePrice = Math.round(basePrice * timelineMultiplier);

    // Add feature costs (this would be passed from parent component)
    // For now, we'll calculate it here
    let featureAdditions = 0;
    if (formData.features && Array.isArray(formData.features)) {
      formData.features.forEach((featureId: string) => {
        const feature = PRICING_CONFIG.features[featureId as keyof typeof PRICING_CONFIG.features];
        if (feature) {
          featureAdditions += feature.price;
        }
      });
    }

    const finalPrice = basePrice + featureAdditions;
    const description = projectConfig.name;

    return { price: finalPrice, description };
  };

  // Validate form data
  const validateFormData = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.projectType) return 'Project type is required';
    if (!formData.timeline) return 'Timeline is required';

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
    if (formData.projectType && formData.timeline) {
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
                {formData.paymentModel === 'monthly' ? 'Monthly payment option available' : 'One-time payment'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-300">
                ${estimatedPrice.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">USD</div>
            </div>
          </div>

          {formData.paymentModel === 'monthly' && estimatedPrice && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Monthly payment option</span>
                <span className="text-white">
                  ${Math.round(estimatedPrice / 12)}/month for 12 months
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