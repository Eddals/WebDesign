/**
 * Simple test to run the resend-simple API locally
 */

// Mock Resend for testing without sending real emails
const mockResend = {
  emails: {
    send: async (data) => {
      console.log('📧 Mock email would be sent:', data);
      return { id: 'mock-' + Date.now() };
    }
  }
};

// Import and test the handler
async function testHandler() {
  // Temporarily replace the Resend import in the handler
  const originalResend = global.Resend;
  global.Resend = function() { return mockResend; };

  try {
    // Dynamic import to get fresh module
    const { default: handler } = await import('./api/webhooks/resend-simple.js');

    // Create mock request and response
    const mockReq = {
      method: 'POST',
      headers: {
        origin: 'http://localhost:5173'
      },
      body: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1 555-1234',
        company: 'Test Company',
        subject: 'general-inquiry',
        message: 'This is a test message'
      }
    };

    const headers = {};
    const mockRes = {
      setHeader: (key, value) => {
        headers[key] = value;
        console.log(`Header set: ${key} = ${value}`);
      },
      status: (code) => {
        console.log(`Status: ${code}`);
        return mockRes;
      },
      json: (data) => {
        console.log('Response:', JSON.stringify(data, null, 2));
      },
      end: () => {
        console.log('Response ended');
      }
    };

    console.log('🧪 Testing resend-simple handler...\n');
    console.log('Request:', JSON.stringify(mockReq.body, null, 2));
    console.log('\n---\n');

    await handler(mockReq, mockRes);

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Restore original Resend
    global.Resend = originalResend;
  }
}

// Run the test
testHandler();