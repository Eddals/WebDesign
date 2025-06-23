const fetch = require('node-fetch');
require('dotenv').config();

async function sendTestToMatheus() {
  console.log('📧 Sending test email to matheusnagringanyc@gmail.com\n');

  // Test data
  const testEstimate = {
    // Contact info
    name: 'Matheus Test',
    email: 'matheusnagringanyc@gmail.com', // This email will receive the confirmation
    phone: '+1 (917) 555-0123',
    company: 'NYC Digital Agency',
    country: 'United States',
    industry: 'Digital Marketing',
    
    // Project details
    projectType: 'E-commerce Website',
    budget: '$10,000 - $15,000',
    timeline: '2-3 months',
    description: 'Looking to build a modern e-commerce platform with advanced features. Need integration with payment systems, inventory management, and customer analytics. The design should be modern and mobile-first.',
    features: ['Payment Integration', 'Inventory System', 'Analytics Dashboard', 'Mobile App'],
    
    // Additional fields
    service_type: 'E-commerce Website',
    project_description: 'Modern e-commerce platform with full features',
    estimated_budget: '$10,000 - $15,000',
    preferred_timeline: '2-3 months',
    property_type: 'Online Store',
    property_size: 'Large (500+ products)',
    location: 'New York, NY'
  };

  try {
    console.log('🚀 Sending estimate request...\n');
    
    const apiUrl = 'http://localhost:3002';
    const response = await fetch(`${apiUrl}/api/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEstimate)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ SUCCESS! Email sent to matheusnagringanyc@gmail.com\n');
      
      console.log('📬 What you\'ll receive:');
      console.log('\n1️⃣ CUSTOMER EMAIL (at matheusnagringanyc@gmail.com):');
      console.log('   Subject: "✨ We received your estimate request - DevTone"');
      console.log('   - Modern dark theme design');
      console.log('   - Your project summary (E-commerce, $10k-15k)');
      console.log('   - Visual timeline with 4 steps');
      console.log('   - Contact information');
      console.log('   - Purple gradient buttons\n');
      
      console.log('2️⃣ ADMIN EMAIL (at sweepeasellc@gmail.com):');
      console.log('   Subject: "🚀 New Estimate Request from Matheus Test"');
      console.log('   - Full contact details');
      console.log('   - Project requirements');
      console.log('   - Quick action buttons\n');
      
      console.log('🎨 Both emails feature:');
      console.log('   - Dark modern design');
      console.log('   - Purple gradients');
      console.log('   - Your logo');
      console.log('   - Mobile responsive');
      console.log('   - Professional layout');
      
    } else {
      console.log('❌ Failed to send email');
      console.log('Error:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
console.log('='.repeat(60));
sendTestToMatheus();