// Test script for Vercel API endpoints
import fetch from 'node-fetch';

// Get the Vercel domain from command line arguments or use default
const vercelDomain = process.argv[2] || 'web-design-murex-kappa.vercel.app';

async function testVercelApi() {
  console.log(`Testing Vercel API endpoints on ${vercelDomain}...`);
  
  // Test data
  const testData = {
    full_name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    service_type: 'Web Development',
    property_type: 'Commercial',
    location: 'New York, USA',
    estimated_budget: '$5000',
    preferred_timeline: '1-2 weeks',
    property_size: '1000 sq ft',
    project_description: 'This is a test project description.'
  };
  
  // Test endpoints
  const endpoints = [
    {
      name: 'HubSpot API',
      url: `https://${vercelDomain}/api/hubspot`,
      method: 'POST',
      body: {
        name: testData.full_name,
        email: testData.email,
        phone: testData.phone,
        company: testData.property_type,
        country: testData.location,
        industry: testData.service_type
      }
    },
    {
      name: 'HubSpot Estimate Webhook',
      url: `https://${vercelDomain}/api/hubspot-estimate-webhook`,
      method: 'POST',
      body: testData
    },
    {
      name: 'Webhook Proxy',
      url: `https://${vercelDomain}/api/webhook-proxy?target=hubspot`,
      method: 'POST',
      body: testData
    }
  ];
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    console.log(`\nTesting ${endpoint.name}...`);
    
    try {
      console.log(`Sending ${endpoint.method} request to ${endpoint.url}`);
      console.log('Request body:', JSON.stringify(endpoint.body));
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(endpoint.body),
      });
      
      console.log('Response status:', response.status);
      
      let responseText;
      try {
        responseText = await response.text();
        console.log('Response text:', responseText);
      } catch (error) {
        console.error('Error getting response text:', error);
      }
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name} test successful!`);
      } else {
        console.error(`❌ ${endpoint.name} test failed!`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} test error:`, error);
    }
  }
}

// Run the test
testVercelApi();