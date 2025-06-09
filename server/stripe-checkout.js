require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Pricing configuration
const PRICING_CONFIG = {
  budgetRanges: {
    'under-1k': { min: 500, max: 1000, default: 750 },
    '1k-5k': { min: 1000, max: 5000, default: 2500 },
    '5k-10k': { min: 5000, max: 10000, default: 7500 },
    '10k-25k': { min: 10000, max: 25000, default: 15000 },
    '25k-plus': { min: 25000, max: 50000, default: 35000 },
    'custom': { min: 1000, max: 100000, default: 5000 }
  },
  projectTypeMultipliers: {
    'business-website': 1.0,
    'ecommerce-store': 1.5,
    'web-application': 2.0,
    'website-redesign': 0.8,
    'landing-page': 0.6,
    'portfolio-site': 0.7,
    'blog-website': 0.7,
    'custom-development': 2.5
  },
  timelineMultipliers: {
    'asap': 1.8,
    '1-week': 1.5,
    '2-weeks': 1.2,
    '1-month': 1.0,
    '2-3-months': 0.9,
    'flexible': 0.8
  },
  complexityMultipliers: {
    'simple': 0.8,
    'moderate': 1.0,
    'complex': 1.5,
    'enterprise': 2.0
  }
};

// Calculate project price
function calculateProjectPrice(formData) {
  const {
    budget,
    projectType,
    timeline,
    complexity = 'moderate',
    features = [],
    customBudget
  } = formData;

  // Base price from budget range
  let basePrice = PRICING_CONFIG.budgetRanges[budget]?.default || 2500;
  
  // Use custom budget if provided
  if (budget === 'custom' && customBudget) {
    basePrice = Math.max(1000, Math.min(100000, parseInt(customBudget)));
  }

  // Apply multipliers
  const projectMultiplier = PRICING_CONFIG.projectTypeMultipliers[projectType] || 1.0;
  const timelineMultiplier = PRICING_CONFIG.timelineMultipliers[timeline] || 1.0;
  const complexityMultiplier = PRICING_CONFIG.complexityMultipliers[complexity] || 1.0;

  // Feature-based additions
  let featureAdditions = 0;
  if (features.includes('ecommerce')) featureAdditions += 1000;
  if (features.includes('cms')) featureAdditions += 500;
  if (features.includes('api-integration')) featureAdditions += 800;
  if (features.includes('advanced-seo')) featureAdditions += 300;
  if (features.includes('analytics')) featureAdditions += 200;
  if (features.includes('social-media')) featureAdditions += 150;

  // Calculate final price
  const calculatedPrice = Math.round(
    (basePrice * projectMultiplier * timelineMultiplier * complexityMultiplier) + featureAdditions
  );

  // Ensure minimum price
  const finalPrice = Math.max(500, calculatedPrice);

  return {
    basePrice,
    finalPrice,
    breakdown: {
      projectMultiplier,
      timelineMultiplier,
      complexityMultiplier,
      featureAdditions
    }
  };
}

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { formData, customerInfo } = req.body;

    if (!formData || !customerInfo) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Calculate price
    const pricing = calculateProjectPrice(formData);
    const amount = pricing.finalPrice * 100; // Convert to cents

    // Validate minimum amount
    if (amount < 50) {
      return res.status(400).json({ error: 'Amount too low for Stripe processing' });
    }

    // Create product description
    const description = `${formData.projectType.replace('-', ' ').toUpperCase()} - ${formData.timeline} timeline`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Web Development Project`,
              description: description,
              images: ['https://your-domain.com/logo.png'], // Add your logo URL
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        customerCompany: customerInfo.company || '',
        projectType: formData.projectType,
        timeline: formData.timeline,
        budget: formData.budget,
        features: JSON.stringify(formData.features || []),
        description: formData.description || ''
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BR'],
      },
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      amount: amount / 100,
      customer: customerInfo.email
    });

    res.json({
      url: session.url,
      sessionId: session.id,
      amount: amount / 100,
      description: description
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Get pricing estimate endpoint
app.post('/calculate-price', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Missing form data' });
    }

    const pricing = calculateProjectPrice(formData);

    res.json({
      success: true,
      pricing: {
        basePrice: pricing.basePrice,
        finalPrice: pricing.finalPrice,
        breakdown: pricing.breakdown
      }
    });

  } catch (error) {
    console.error('❌ Error calculating price:', error);
    res.status(500).json({ 
      error: 'Failed to calculate price',
      details: error.message 
    });
  }
});

// Webhook endpoint for Stripe events
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment successful:', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        amount: session.amount_total / 100
      });
      
      // Here you would typically:
      // 1. Save order to database
      // 2. Send confirmation email
      // 3. Start project workflow
      // 4. Update CRM/project management system
      
      break;
    
    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stripe server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables');
  }
});

module.exports = app;
