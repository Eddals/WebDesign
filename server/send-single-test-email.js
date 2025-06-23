const fetch = require('node-fetch');
require('dotenv').config();

async function sendSingleTestEmail() {
  console.log('📧 Sending ONE test email to matheussenhorzin@gmail.com\n');

  // Test data for a realistic estimate
  const testEstimate = {
    // Contact info
    name: 'Matheus Sena',
    email: 'matheussenhorzin@gmail.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc',
    country: 'United States',
    industry: 'Technology',
    
    // Project details
    projectType: 'Modern Business Website',
    budget: '$3,000 - $5,000',
    timeline: '4-6 weeks',
    description: 'This is a test of the new modern email design. The email should have a dark theme with purple gradients, modern typography, and a professional layout that matches the estimate form design.',
    features: ['Responsive Design', 'SEO Optimization', 'Contact Forms', 'Analytics Integration'],
    
    // Additional fields
    service_type: 'Business Website',
    project_description: 'Test of new modern email template design',
    estimated_budget: '$3,000 - $5,000',
    preferred_timeline: '4-6 weeks',
    property_type: 'Technology Business',
    property_size: 'Medium',
    location: 'San Francisco, CA'
  };

  try {
    console.log('🚀 Sending estimate with modern email design...\n');
    
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
      console.log('✅ SUCCESS! Test email sent!\n');
      
      console.log('📬 Check matheussenhorzin@gmail.com for:');
      console.log('\n🎨 NEW MODERN EMAIL DESIGN:');
      console.log('   ✨ Dark theme background');
      console.log('   🟣 Purple gradient header');
      console.log('   📱 Mobile-responsive layout');
      console.log('   🎯 Visual timeline with steps');
      console.log('   💎 Glassmorphism effects');
      console.log('   🔗 Modern hover effects');
      console.log('   📋 Your project summary in cards');
      
      console.log('\n📧 Email Subject: "✨ We received your estimate request - DevTone"');
      console.log('\nThe email will show:');
      console.log('   - Your project details in a modern card');
      console.log('   - Visual timeline (Review → Proposal → Call → Start)');
      console.log('   - Contact information with icons');
      console.log('   - Purple CTA button');
      console.log('   - Professional dark footer');
      
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
sendSingleTestEmail();