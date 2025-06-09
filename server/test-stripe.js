require('dotenv').config();

console.log('🧪 Testing Stripe Configuration...\n');

// Check environment variables
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'FRONTEND_URL'
];

let allEnvVarsPresent = true;

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: ${envVar.includes('SECRET') ? '***hidden***' : process.env[envVar]}`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
    allEnvVarsPresent = false;
  }
});

if (!allEnvVarsPresent) {
  console.log('\n⚠️  Please set up your environment variables in server/.env');
  console.log('Copy server/.env.example to server/.env and add your Stripe keys');
  process.exit(1);
}

// Test Stripe connection
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeConnection() {
  try {
    console.log('\n🔌 Testing Stripe connection...');
    
    // Test API connection by retrieving account info
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Connected to Stripe account: ${account.display_name || account.id}`);
    
    // Test creating a simple product (won't be saved)
    console.log('\n💳 Testing checkout session creation...');
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Web Development Project',
              description: 'Test project for Stripe integration',
            },
            unit_amount: 250000, // $2,500.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });
    
    console.log(`✅ Test checkout session created: ${session.id}`);
    console.log(`✅ Session URL: ${session.url}`);
    
    console.log('\n🎉 All tests passed! Your Stripe integration is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Start your frontend application');
    console.log('3. Test the estimate form with payment');
    
  } catch (error) {
    console.log(`❌ Stripe test failed: ${error.message}`);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('🔑 Check your STRIPE_SECRET_KEY in .env file');
    } else if (error.type === 'StripeConnectionError') {
      console.log('🌐 Check your internet connection');
    }
    
    process.exit(1);
  }
}

testStripeConnection();
