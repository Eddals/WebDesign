async function testContactAPI() {
  console.log('🧪 Testing Contact Form API...\n');
  
  // Test data
  const testData = {
    full_name: 'Test User',
    email: 'test@example.com', // Change this to your email
    phone: '+1 (555) 123-4567',
    subject: 'Test Contact Form API',
    message: 'This is a test message to verify the contact form API is working correctly.'
  };
  
  // Test both local and production endpoints
  const endpoints = [
    { name: 'Local', url: 'http://localhost:3000/api/contact' },
    { name: 'Production', url: 'https://devtone.agency/api/contact' }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📍 Testing ${endpoint.name} endpoint: ${endpoint.url}`);
    console.log('---');
    
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Success!');
        console.log('Message:', result.message);
        console.log('Email sent:', result.emailSent);
        if (result.details) {
          console.log('Client Email ID:', result.details.clientEmailId);
          console.log('Admin Email ID:', result.details.adminEmailId);
        }
      } else {
        console.log('❌ Failed!');
        console.log('Status:', response.status);
        console.log('Response:', result);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
      if (error.message.includes('fetch')) {
        console.log('💡 Make sure the server is running or the endpoint is accessible');
      }
    }
  }
  
  console.log('\n\n📊 Summary:');
  console.log('- Make sure to change the email address to yours');
  console.log('- Check your inbox and spam folder');
  console.log('- View logs at: https://resend.com/emails');
  console.log('- For local testing, run: vercel dev');
}

// Run the test
testContactAPI();