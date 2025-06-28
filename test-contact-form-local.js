// Test script to verify the contact form API locally
// Run with: node test-contact-form-local.js

const testContactForm = async () => {
  console.log('🧪 Testing contact form submission...\n');

  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Test Company',
    subject: 'general-inquiry',
    message: 'This is a test message from the local test script.'
  };

  try {
    // Test local development (through Vite proxy)
    console.log('📡 Testing through localhost:5173 (Vite proxy)...');
    const localResponse = await fetch('http://localhost:5173/api/webhooks/resend-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify(testData)
    });

    if (localResponse.ok) {
      const result = await localResponse.json();
      console.log('✅ Local test successful:', result);
    } else {
      console.log('❌ Local test failed:', localResponse.status, await localResponse.text());
    }
  } catch (error) {
    console.error('❌ Local test error:', error.message);
    console.log('\n💡 Make sure your Vite dev server is running on port 5173');
  }

  console.log('\n---\n');

  try {
    // Test production API directly
    console.log('📡 Testing production API directly...');
    const prodResponse = await fetch('https://devtone.agency/api/webhooks/resend-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify(testData)
    });

    if (prodResponse.ok) {
      const result = await prodResponse.json();
      console.log('✅ Production test successful:', result);
    } else {
      console.log('❌ Production test failed:', prodResponse.status, await prodResponse.text());
    }
  } catch (error) {
    console.error('❌ Production test error:', error.message);
  }
};

// Run the test
testContactForm().then(() => {
  console.log('\n🏁 Test completed');
}).catch(error => {
  console.error('🚨 Test script error:', error);
});