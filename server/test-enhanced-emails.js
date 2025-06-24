const { sendEstimateEmail, sendClientConfirmationEmail } = require('./email-service');
require('dotenv').config();

async function testEnhancedEmails() {
  console.log('🧪 Testing Enhanced Email System\n');
  
  console.log('📧 Email Configuration:');
  console.log(`   SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP User: ${process.env.SMTP_USER}`);
  console.log(`   Admin Email: ${process.env.ESTIMATE_RECIPIENT_EMAIL}`);
  console.log('\n');

  // Test data with all fields to showcase the enhanced features
  const testData = {
    name: 'John Smith',
    email: 'test@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TechStartup Inc.',
    country: 'United States',
    industry: 'Technology & Software',
    projectType: 'ecommerce',
    budget: 'enterprise',
    timeline: 'asap',
    description: `We need a complete e-commerce platform for our tech accessories business. 
    
Key requirements:
- Modern, mobile-first design
- Integration with our inventory system
- Multi-currency support
- Advanced analytics dashboard
- Customer loyalty program

We're looking to launch before the holiday season and need a team that can deliver quickly without compromising quality.`,
    features: [
      'payment',
      'membership',
      'analytics',
      'multilingual',
      'seo',
      'security',
      'maintenance'
    ]
  };

  try {
    console.log('📤 Sending test estimate emails...\n');
    
    // Send admin notification
    console.log('1️⃣ Sending admin notification to:', process.env.ESTIMATE_RECIPIENT_EMAIL);
    const adminResult = await sendEstimateEmail(testData);
    
    if (adminResult.success) {
      console.log('✅ Admin notification sent successfully!');
      console.log('   Message ID:', adminResult.messageId);
    } else {
      console.log('❌ Failed to send admin notification:', adminResult.error);
    }
    
    console.log('\n');
    
    // Send client confirmation
    console.log('2️⃣ Sending client confirmation to:', testData.email);
    const clientResult = await sendClientConfirmationEmail(testData);
    
    if (clientResult.success) {
      console.log('✅ Client confirmation sent successfully!');
    } else {
      console.log('❌ Failed to send client confirmation:', clientResult.error);
    }
    
    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`Admin Email: ${adminResult.success ? '✅ Sent' : '❌ Failed'}`);
    console.log(`Client Email: ${clientResult.success ? '✅ Sent' : '❌ Failed'}`);
    
    if (adminResult.success && clientResult.success) {
      console.log('\n🎉 All emails sent successfully!');
      console.log('\n📬 Check these inboxes:');
      console.log(`   - Admin: ${process.env.ESTIMATE_RECIPIENT_EMAIL}`);
      console.log(`   - Client: ${testData.email} (test email)`);
      console.log('\n💡 Features demonstrated:');
      console.log('   - Priority indicators (HIGH PRIORITY for enterprise/rush projects)');
      console.log('   - Formatted budget ranges and timelines');
      console.log('   - Industry and country information');
      console.log('   - Quick response template with pre-filled email');
      console.log('   - Response tips and best practices');
      console.log('   - Project-specific content (e-commerce expertise section)');
      console.log('   - Enhanced timeline with specific timeframes');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
console.log('🚀 DevTone Enhanced Email System Test\n');
console.log('This test will send emails to demonstrate the new features:\n');
console.log('- Creative subject lines with priority indicators');
console.log('- Enhanced formatting and visual hierarchy');
console.log('- Quick action buttons with pre-filled templates');
console.log('- Personalized content based on project type');
console.log('- Response tips for the sales team\n');

testEnhancedEmails();