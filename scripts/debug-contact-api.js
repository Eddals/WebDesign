async function debugContactAPI() {
  console.log('🔍 Debugging Contact Form API\n');
  
  const testData = {
    full_name: 'Debug Test',
    email: 'test@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Test Company',
    subject: 'general-inquiry',
    message: 'This is a debug test message',
    preferredContact: 'email'
  };
  
  console.log('📋 Test data:', JSON.stringify(testData, null, 2));
  
  // Test different endpoints
  const endpoints = [
    'https://devtone.agency/api/contact',
    'https://devtone.agency/api/send-contact-email',
    '/api/contact'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n🧪 Testing endpoint: ${endpoint}`);
    console.log('-'.repeat(50));
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://devtone.agency'
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      
      const text = await response.text();
      console.log('Response:', text);
      
      try {
        const json = JSON.parse(text);
        console.log('Parsed JSON:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('Response is not JSON');
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
  
  console.log('\n📊 Checking Vercel deployment...');
  try {
    const vercelCheck = await fetch('https://devtone.agency/api/contact', {
      method: 'GET'
    });
    console.log('GET request status:', vercelCheck.status);
  } catch (error) {
    console.log('GET request error:', error.message);
  }
}

debugContactAPI().catch(console.error);