const fetch = require('node-fetch');
require('dotenv').config({ path: '../server/.env' });

async function sendTestWhiteEmail() {
  console.log('📧 Sending test email with WHITE background\n');

  const testEstimate = {
    name: 'Matheus Sena',
    email: 'matheussenhorzin@gmail.com',
    phone: '+1 (555) 123-4567',
    company: 'Test Company',
    country: 'United States',
    industry: 'Technology',
    projectType: 'Website Test',
    budget: '$1,000 - $2,000',
    timeline: '2-3 weeks',
    description: 'Testing email with WHITE background. The email should now have a clean white background instead of dark theme.',
    features: ['White Background', 'Clean Design'],
    service_type: 'Test Service',
    project_description: 'White background email test',
    estimated_budget: '$1,000 - $2,000',
    preferred_timeline: '2-3 weeks',
    property_type: 'Test',
    property_size: 'Small',
    location: 'Test Location'
  };

  try {
    console.log('🚀 Sending email with white background...\n');
    
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
      console.log('✅ SUCCESS! Email sent with WHITE background!\n');
      console.log('📬 Check your email for:');
      console.log('   ⚪ White/light gray background');
      console.log('   🟣 Purple header (kept for branding)');
      console.log('   📝 Dark text on light background');
      console.log('   🎨 Light gray cards and sections');
      console.log('\n📧 Subject: "✨ We received your estimate request - DevTone"');
    } else {
      console.log('❌ Failed to send email');
      console.log('Error:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

console.log('='.repeat(60));
sendTestWhiteEmail();