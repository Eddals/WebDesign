#!/usr/bin/env node

/**
 * Quick test script for Vercel deployment
 * Run with: node scripts/test-vercel-deployment.js
 */

// Use node-fetch if available, otherwise use global fetch
let fetch;
try {
  fetch = require('node-fetch');
} catch (error) {
  // In Node.js 18+, fetch is available globally
  fetch = global.fetch;
}

const BASE_URL = 'https://devtone.agency';

async function testEndpoint(endpoint, method = 'GET', data = null) {
  console.log(`\n🧪 Testing: ${method} ${endpoint}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data && method === 'POST') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    console.log(`📥 Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`📥 Response: ${responseText}`);

    if (response.ok) {
      console.log(`✅ SUCCESS: ${endpoint}`);
      return { success: true, data: responseText };
    } else {
      console.log(`❌ FAILED: ${endpoint} - ${response.status}`);
      return { success: false, error: responseText, status: response.status };
    }
  } catch (error) {
    console.error(`❌ ERROR: ${endpoint} -`, error.message);
    return { success: false, error: error.message };
  }
}

async function runVercelTests() {
  console.log('🚀 Testing Vercel Deployment');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  const tests = [
    {
      endpoint: '/api/vercel-test',
      method: 'GET',
      description: 'Vercel test endpoint (GET)'
    },
    {
      endpoint: '/api/vercel-test',
      method: 'POST',
      data: { test: 'data' },
      description: 'Vercel test endpoint (POST)'
    },
    {
      endpoint: '/api/health',
      method: 'GET',
      description: 'Health check endpoint'
    },
    {
      endpoint: '/api/send-brevo-email-simple',
      method: 'POST',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message for Vercel deployment'
      },
      description: 'Brevo email simple endpoint'
    }
  ];

  const results = [];

  for (const test of tests) {
    const result = await testEndpoint(test.endpoint, test.method, test.data);
    results.push({ ...test, result });
  }

  // Summary
  console.log('\n📊 VERCEL DEPLOYMENT TEST SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach((test, index) => {
    const status = test.result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${status} - ${test.method} ${test.endpoint}`);
    if (!test.result.success) {
      console.log(`   Error: ${test.result.error}`);
    }
  });

  const passedTests = results.filter(r => r.result.success).length;
  const totalTests = results.length;
  
  console.log('\n' + '='.repeat(60));
  console.log(`📈 Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All Vercel tests passed! Deployment is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the Vercel configuration.');
  }

  return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runVercelTests()
    .then(results => {
      const allPassed = results.every(r => r.result.success);
      process.exit(allPassed ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test runner error:', error);
      process.exit(1);
    });
}

module.exports = { runVercelTests, testEndpoint };