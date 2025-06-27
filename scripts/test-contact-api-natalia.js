async function testContactFormForNatalia() {
  console.log('🧪 Testing Contact Form API with nataliaaustin.tv@gmail.com\n');
  
  const testData = {
    full_name: 'Natalia Austin',
    email: 'nataliaaustin.tv@gmail.com',
    phone: '+1 (555) 123-4567',
    subject: 'Test Contact Form Submission',
    message: 'This is a test message from the contact form. Testing email delivery to Gmail account.'
  };
  
  console.log('📋 Form Data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');
  
  // Test local endpoint if running
  console.log('Testing local endpoint...');
  try {
    const localResponse = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (localResponse.ok) {
      const result = await localResponse.json();
      console.log('✅ Local API Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Local API not available (this is normal if not running locally)');
    }
  } catch (error) {
    console.log('❌ Local API not running (expected if testing in production)');
  }
  
  console.log('\n---\n');
  
  // Test production endpoint
  console.log('Testing production endpoint...');
  try {
    const prodResponse = await fetch('https://devtone.agency/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://devtone.agency'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await prodResponse.json();
    
    if (prodResponse.ok && result.success) {
      console.log('✅ Production API Response:');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n🎉 Email should be sent to:', testData.email);
      console.log('\n📧 CHECK THESE LOCATIONS:');
      console.log('1. Gmail SPAM folder (most likely)');
      console.log('2. Promotions tab');
      console.log('3. All Mail');
      console.log('4. Search for: from:onboarding@resend.dev');
    } else {
      console.log('❌ Production API Error:', result);
    }
  } catch (error) {
    console.log('❌ Error calling production API:', error.message);
  }
  
  console.log('\n📊 Additional Steps:');
  console.log('1. Check https://resend.com/emails for sent emails');
  console.log('2. In Gmail, search for: "from:onboarding@resend.dev"');
  console.log('3. Check spam folder and mark as "Not Spam"');
  console.log('4. Add onboarding@resend.dev to contacts');
}

// Run the test
testContactFormForNatalia().catch(console.error);