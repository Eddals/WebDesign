const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS headers for Amplify
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Credentials': true
};

// Pricing configuration
const PRICING_CONFIG = {
  projectTypes: {
    'starter': { basePrice: 299, name: 'Starter Package' },
    'professional': { basePrice: 599, name: 'Professional Package' },
    'business': { basePrice: 999, name: 'Business Package' },
    'enterprise': { basePrice: 1999, name: 'Enterprise Package' }
  },
  features: {
    'seo': { price: 149, name: 'SEO Optimization' },
    'analytics': { price: 79, name: 'Analytics Setup' },
    'social': { price: 49, name: 'Social Media Integration' },
    'security': { price: 99, name: 'Security Package' },
    'maintenance': { price: 99, name: 'Ongoing Support' },
    'training': { price: 79, name: 'Training Session' }
  }
};

// Calculate project price
function calculateProjectPrice(formData) {
  const { projectType, features = [] } = formData;
  
  const projectConfig = PRICING_CONFIG.projectTypes[projectType];
  if (!projectConfig) {
    throw new Error(`Invalid project type: ${projectType}`);
  }

  let basePrice = projectConfig.basePrice;
  let featureAdditions = 0;

  features.forEach(featureId => {
    const feature = PRICING_CONFIG.features[featureId];
    if (feature) {
      featureAdditions += feature.price;
    }
  });

  return {
    finalPrice: basePrice + featureAdditions,
    projectName: projectConfig.name
  };
}

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { formData, customerInfo } = body;

    if (!formData || !customerInfo) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required data' })
      };
    }

    // Calculate price
    const pricing = calculateProjectPrice(formData);
    const amount = pricing.finalPrice * 100; // Convert to cents

    // Validate minimum amount
    if (amount < 50) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Amount too low for Stripe processing' })
      };
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
            source: 'devtone_website'
          }
        });
      }
    } catch (customerError) {
      console.error('Error handling customer:', customerError);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: pricing.projectName,
            description: `DevTone Agency - ${pricing.projectName}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer: customer?.id,
      customer_email: customer ? undefined : customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        customerCompany: customerInfo.company || '',
        projectType: formData.projectType,
        features: JSON.stringify(formData.features || []),
        estimatedPrice: pricing.finalPrice.toString()
      },
      success_url: 'https://devtone.agency/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://devtone.agency/cancel',
      billing_address_collection: 'required',
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      amount: amount / 100,
      customer: customerInfo.email
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        url: session.url,
        sessionId: session.id,
        amount: amount / 100,
        description: pricing.projectName
      })
    };

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: error.message
      })
    };
  }
};
