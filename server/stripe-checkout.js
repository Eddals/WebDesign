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

// Updated pricing configuration to match frontend
const PRICING_CONFIG = {
  projectTypes: {
    'landing': { basePrice: 299, name: 'Landing Page' },
    'portfolio': { basePrice: 499, name: 'Portfolio Website' },
    'business': { basePrice: 799, name: 'Business Website' },
    'ecommerce': { basePrice: 1299, name: 'E-commerce Store' },
    'webapp': { basePrice: 2499, name: 'Web Application' }
  },
  budgetRanges: {
    'starter': { min: 500, max: 1500, default: 1000 },
    'professional': { min: 1500, max: 5000, default: 3000 },
    'premium': { min: 5000, max: 15000, default: 10000 },
    'enterprise': { min: 15000, max: 50000, default: 25000 }
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

// Calculate project price based on new structure
function calculateProjectPrice(formData) {
  const {
    projectType,
    timeline,
    features = []
  } = formData;

  // Get base price from project type
  const projectConfig = PRICING_CONFIG.projectTypes[projectType];
  if (!projectConfig) {
    throw new Error(`Invalid project type: ${projectType}`);
  }

  let basePrice = projectConfig.basePrice;

  // Apply timeline multiplier
  const timelineMultiplier = PRICING_CONFIG.timelineMultipliers[timeline] || 1.0;
  basePrice = Math.round(basePrice * timelineMultiplier);

  // Add feature costs
  let featureAdditions = 0;
  const selectedFeatures = [];

  features.forEach(featureId => {
    const feature = PRICING_CONFIG.features[featureId];
    if (feature) {
      featureAdditions += feature.price;
      selectedFeatures.push({
        id: featureId,
        name: feature.name,
        price: feature.price
      });
    }
  });

  const finalPrice = basePrice + featureAdditions;

  return {
    basePrice: projectConfig.basePrice,
    timelineAdjustedPrice: basePrice,
    featureAdditions,
    finalPrice,
    selectedFeatures,
    breakdown: {
      projectType: projectConfig.name,
      timelineMultiplier,
      features: selectedFeatures
    }
  };
}

// Create checkout session endpoint with invoice generation
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

    // Create or retrieve customer
    let customer;
    try {
      const existingCustomers = await stripe.customers.list({
        email: customerInfo.email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          metadata: {
            company: customerInfo.company || '',
            source: 'website_estimate'
          }
        });
      }
    } catch (customerError) {
      console.error('Error handling customer:', customerError);
      // Continue without customer if there's an issue
    }

    // Create line items for invoice
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: pricing.breakdown.projectType,
            description: `${formData.timeline} timeline`,
          },
          unit_amount: pricing.timelineAdjustedPrice * 100,
        },
        quantity: 1,
      }
    ];

    // Add feature line items
    pricing.selectedFeatures.forEach(feature => {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: feature.name,
            description: 'Premium add-on feature',
          },
          unit_amount: feature.price * 100,
        },
        quantity: 1,
      });
    });

    // Create invoice for record keeping
    let invoice = null;
    if (customer) {
      try {
        // Create invoice items
        for (const item of lineItems) {
          await stripe.invoiceItems.create({
            customer: customer.id,
            amount: item.price_data.unit_amount,
            currency: 'usd',
            description: `${item.price_data.product_data.name} - ${item.price_data.product_data.description}`,
          });
        }

        // Create the invoice
        invoice = await stripe.invoices.create({
          customer: customer.id,
          description: `Web Development Project - ${pricing.breakdown.projectType}`,
          metadata: {
            projectType: formData.projectType,
            timeline: formData.timeline,
            features: JSON.stringify(formData.features || []),
            customerName: customerInfo.name,
            estimateDate: new Date().toISOString()
          },
          auto_advance: false, // Don't auto-finalize
        });

        console.log('✅ Invoice created:', invoice.id);
      } catch (invoiceError) {
        console.error('Error creating invoice:', invoiceError);
        // Continue without invoice if there's an issue
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer: customer?.id,
      customer_email: customer ? undefined : customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        customerCompany: customerInfo.company || '',
        projectType: formData.projectType,
        timeline: formData.timeline,
        features: JSON.stringify(formData.features || []),
        description: formData.description || '',
        invoiceId: invoice?.id || '',
        estimatedPrice: pricing.finalPrice.toString()
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/cancel`,
      billing_address_collection: 'required',
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      amount: amount / 100,
      customer: customerInfo.email,
      invoiceId: invoice?.id
    });

    res.json({
      url: session.url,
      sessionId: session.id,
      amount: amount / 100,
      description: pricing.breakdown.projectType,
      invoiceId: invoice?.id
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

      // Finalize invoice if it exists
      if (session.metadata.invoiceId) {
        try {
          const invoice = await stripe.invoices.finalize(session.metadata.invoiceId);
          console.log('✅ Invoice finalized:', invoice.id);

          // Mark invoice as paid
          await stripe.invoices.pay(invoice.id);
          console.log('✅ Invoice marked as paid:', invoice.id);
        } catch (invoiceError) {
          console.error('❌ Error finalizing invoice:', invoiceError);
        }
      }

      // Here you would typically:
      // 1. Save order to database
      // 2. Send confirmation email with invoice
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
