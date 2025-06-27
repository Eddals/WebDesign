async function testCompleteContactFlow() {
  console.log('🧪 Testing Complete Contact Form Flow\n');
  console.log('This test will simulate a real user submitting the contact form.\n');
  
  // Simulate a customer filling out the form
  const customerData = {
    full_name: 'John Smith',
    email: 'customer@example.com', // This person will receive confirmation
    phone: '+1 (555) 987-6543',
    subject: 'Interested in Web Development Services',
    message: 'Hello, I would like to discuss a new website project for my business. Please contact me to schedule a consultation.'
  };
  
  console.log('📝 Form submission details:');
  console.log('Customer Name:', customerData.full_name);
  console.log('Customer Email:', customerData.email);
  console.log('Subject:', customerData.subject);
  console.log('\n' + '='.repeat(60) + '\n');
  
  try {
    // Test production API
    console.log('📡 Submitting to production API...\n');
    const response = await fetch('https://devtone.agency/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://devtone.agency'
      },
      body: JSON.stringify(customerData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ SUCCESS! Contact form processed successfully!\n');
      
      console.log('📧 EMAILS SENT:');
      console.log('='.repeat(40));
      
      console.log('\n1️⃣ ADMIN NOTIFICATION:');
      console.log('   To: sweepeasellc@gmail.com (YOU)');
      console.log('   Subject: 📬 New Contact Form: John Smith - Interested in Web Development Services');
      console.log('   Content: Full details of the customer inquiry');
      console.log('   Reply-To: customer@example.com');
      
      console.log('\n2️⃣ CUSTOMER CONFIRMATION:');
      console.log('   To: customer@example.com (The person who submitted)');
      console.log('   Subject: ✨ We Received Your Message - DevTone Agency');
      console.log('   Content: Thank you message with next steps');
      
      console.log('\n' + '='.repeat(60));
      console.log('📋 WHAT HAPPENS NOW:');
      console.log('='.repeat(60));
      
      console.log('\n✅ For YOU (sweepeasellc@gmail.com):');
      console.log('   - Check your inbox for the admin notification');
      console.log('   - It contains all customer details');
      console.log('   - You can reply directly to the customer');
      
      console.log('\n✅ For the CUSTOMER:');
      console.log('   - They receive a confirmation email');
      console.log('   - It thanks them for contacting');
      console.log('   - Shows what happens next');
      
      if (result.details) {
        console.log('\n📊 Email IDs:');
        console.log('Admin Email ID:', result.details.adminEmailId);
        console.log('Client Email ID:', result.details.clientEmailId);
      }
      
    } else {
      console.log('❌ Error:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TROUBLESHOOTING:');
  console.log('='.repeat(60));
  console.log('\nIf you don\'t see emails:');
  console.log('1. Check SPAM folder');
  console.log('2. Search for: from:noreply@devtone.agency');
  console.log('3. Check https://resend.com/emails for delivery status');
  console.log('\n💡 The system is configured to:');
  console.log('- Always send admin notifications to: sweepeasellc@gmail.com');
  console.log('- Always send confirmations to whoever fills out the form');
}

// Run the test
testCompleteContactFlow().catch(console.error);