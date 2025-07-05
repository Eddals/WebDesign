#!/usr/bin/env node

/**
 * Test script to verify Brevo email endpoint fixes
 * Run with: node scripts/test-brevo-fix.js
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

async function testEndpoint(endpoint, data, description) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`📍 Endpoint: ${endpoint}`);
  console.log(`📋 Data:`, data);
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(`📥 Status: ${response.status} ${response.statusText}`);
    console.log(`📥 Headers:`, Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log(`📥 Response Text:`, responseText);

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
      console.log(`📥 Parsed Data:`, parsedData);
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON:`, parseError);
      console.log(`📥 Raw Response:`, responseText);
    }

    if (response.ok) {
      console.log(`✅ SUCCESS: ${description}`);
      return { success: true, data: parsedData };
    } else {
      console.log(`❌ FAILED: ${description} - Status ${response.status}`);
      return { success: false, error: parsedData?.error || 'Unknown error', status: response.status };
    }
  } catch (error) {
    console.error(`❌ ERROR: ${description} -`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Brevo Email Endpoint Tests');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message to verify the Brevo email endpoint is working correctly.'
  };

  const tests = [
    {
      endpoint: '/api/test-endpoint',
      data: { test: 'data' },
      description: 'Basic API routing test'
    },
    {
      endpoint: '/api/send-brevo-email',
      data: testData,
      description: 'Original Brevo endpoint with SDK'
    },
    {
      endpoint: '/api/send-brevo-email-simple',
      data: testData,
      description: 'Simplified Brevo endpoint without SDK'
    }
  ];

  const results = [];

  for (const test of tests) {
    const result = await testEndpoint(test.endpoint, test.data, test.description);
    results.push({ ...test, result });
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(50));
  
  results.forEach((test, index) => {
    const status = test.result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${status} - ${test.description}`);
    if (!test.result.success) {
      console.log(`   Error: ${test.result.error}`);
    }
  });

  const passedTests = results.filter(r => r.result.success).length;
  const totalTests = results.length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📈 Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The Brevo email system should be working.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above for details.');
  }

  return results;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(results => {
      const allPassed = results.every(r => r.result.success);
      process.exit(allPassed ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test runner error:', error);
      process.exit(1);
    });
}

module.exports = { runTests, testEndpoint }; 