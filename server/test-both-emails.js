const fetch = require('node-fetch');
require('dotenv').config();

async function testBothEmails() {
  console.log('🧪 Testing BOTH Email Notifications\n');
  console.log('This will send:');
  console.log('1️⃣ Admin notification to YOU at sweepeasellc@gmail.com');
  console.log('2️⃣ Confirmation email to the CUSTOMER who submitted the form\n');

  // Example: A customer named Sarah wants a website
  const customerEstimate = {
    // Customer's information
    name: 'Sarah Johnson',
    email: 'matheussenhorzin@gmail.com', // Customer's email - they will get confirmation
    phone: '+1 (555) 987-6543',
    company: 'Sarah\'s Bakery',
    country: 'United States',
    industry: 'Food & Beverage',
    
    // What the customer wants
    projectType: 'E-commerce Website',
    budget: '$5,000 - $10,000',
    timeline: '2-3 months',
    description: 'I need an online store for my bakery. I want customers to be able to order cakes and pastries online for pickup or delivery. Need payment processing and inventory management.',
    features: ['Online Ordering', 'Payment Processing', 'Inventory Management', 'Customer Accounts'],
    
    // Additional details
    service_type: 'E-commerce Website',
    project_description: 'Online bakery store with ordering system',
    estimated_budget: '$5,000 - $10,000',
    preferred_timeline: '2-3 months',
    property_type: 'Bakery Business',
    property_size: 'Small Business',
    location: 'Chicago, IL'
  };

  try {
    console.log('📤 Sarah is submitting her estimate request...\n');
    
    const apiUrl = 'http://localhost:3002';
    const response = await fetch(`${apiUrl}/api/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerEstimate)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ SUCCESS! Both emails have been sent!\n');
      
      console.log('📧 EMAIL 1 - SENT TO YOU (sweepeasellc@gmail.com):');
      console.log('   Subject: "New Estimate Request from Sarah Johnson - E-commerce Website"');
      console.log('   Contents:');
      console.log('   - Sarah\'s contact info (email: matheussenhorzin@gmail.com)');
      console.log('   - Her company: Sarah\'s Bakery');
      console.log('   - Project: E-commerce Website');
      console.log('   - Budget: $5,000 - $10,000');
      console.log('   - Full project description');
      console.log('   - You can reply directly to Sarah\n');
      
      console.log('📧 EMAIL 2 - SENT TO SARAH (matheussenhorzin@gmail.com):');
      console.log('   Subject: "We received your estimate request - DevTone"');
      console.log('   Contents:');
      console.log('   - Thank you message');
      console.log('   - Summary of her request');
      console.log('   - Her project details (E-commerce for bakery)');
      console.log('   - Next steps (review → proposal → call → start)');
      console.log('   - Your contact info for questions\n');
      
      console.log('📬 Check these inboxes:');
      console.log('   1. sweepeasellc@gmail.com - You\'ll see Sarah\'s request');
      console.log('   2. matheussenhorzin@gmail.com - Sarah\'s confirmation\n');
      
      console.log('This is exactly how it works when real customers submit forms on your website!');
      
    } else {
      console.log('❌ Failed to send emails');
      console.log('Error:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
console.log('='.repeat(60));
testBothEmails();