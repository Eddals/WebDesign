const fetch = require('node-fetch');
require('dotenv').config();

async function testEmailWithLogo() {
  console.log('🧪 Testing Email with Logo/Profile Picture\n');
  console.log('📧 Sending test email to: matheussenhorzin@gmail.com\n');

  // Test estimate data using the test email
  const testEstimate = {
    // Basic contact info
    name: 'Matheus Test',
    email: 'matheussenhorzin@gmail.com', // This email will receive the confirmation with logo
    phone: '+1 (555) 123-4567',
    company: 'Test Company',
    country: 'United States',
    industry: 'Technology',
    
    // Project details
    projectType: 'Business Website',
    budget: '$3,000 - $5,000',
    timeline: '2-4 weeks',
    description: 'This is a test email to verify the logo/profile picture is displaying correctly in the email template. The logo should appear at the top of this email in the purple header section.',
    features: ['Responsive Design', 'SEO Optimization', 'Contact Forms', 'Analytics'],
    
    // Additional fields
    service_type: 'Business Website',
    project_description: 'Test email for logo verification',
    estimated_budget: '$3,000 - $5,000',
    preferred_timeline: '2-4 weeks',
    property_type: 'Business',
    property_size: 'Medium',
    location: 'New York, USA'
  };

  try {
    console.log('📤 Sending estimate request to trigger email with logo...\n');
    
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
      console.log('✅ SUCCESS! Test email sent to matheussenhorzin@gmail.com\n');
      
      console.log('📧 What to look for in the email:');
      console.log('\n🖼️  LOGO/PROFILE PICTURE:');
      console.log('   - Should appear at the TOP of the email');
      console.log('   - Inside the purple header section');
      console.log('   - Above the "Thank You for Your Estimate Request!" text');
      console.log('   - Maximum width of 150px');
      
      console.log('\n📋 The email will also include:');
      console.log('   - Your estimate summary');
      console.log('   - Project details (Business Website, $3,000-$5,000)');
      console.log('   - Next steps timeline');
      console.log('   - Contact information');
      
      console.log('\n⚠️  IMPORTANT:');
      console.log('   - If you don\'t see the logo, it means the image URL needs to be updated');
      console.log('   - Current URL: https://devtone.agency/logo.png');
      console.log('   - Update this URL in /server/email-service.js with your actual logo URL');
      
      console.log('\n📬 Check your inbox at matheussenhorzin@gmail.com');
      console.log('   (Also check spam/junk folder if not in inbox)');
      
      console.log('\n💡 To add your own logo:');
      console.log('   1. Upload your logo to your website');
      console.log('   2. Get the direct URL (e.g., https://yoursite.com/logo.png)');
      console.log('   3. Update the URL in /server/email-service.js');
      console.log('   4. Run this test again');
      
    } else {
      console.log('❌ Failed to send test email');
      console.log('Error:', result.error || 'Unknown error');
      
      if (result.error && result.error.includes('Too many')) {
        console.log('\n⏱️  Rate limit reached. Please wait a few minutes and try again.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Make sure the estimate API is running:');
    console.log('   cd server && npm run start:estimate');
  }
}

// Run the test
console.log('='.repeat(60));
testEmailWithLogo();