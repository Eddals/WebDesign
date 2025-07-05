#!/usr/bin/env node

/**
 * Test script for direct Brevo email endpoint
 * Run with: node scripts/test-brevo-direct.js
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

async function testBrevoDirect() {
  console.log('🧪 Testing Direct Brevo Email Endpoint');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  const testData = {
    name: 'MATTHEUS VICTTOR DA SILVA',
    email: 'mattheus.victorgold@gmail.com',
    message: `
Your estimate request has been received with the following details:

Project Type: Content Strategy
Budget: 343
Timeline: Flexible
Description: Test message for Brevo direct endpoint

We will review your request and get back to you shortly with a detailed proposal.
Thank you for choosing Devtone Agency!
    `.trim()
  };

  console.log('\n📤 Sending test email to Brevo...');
  console.log('📋 Test data:', testData);
  
  try {
    const response = await fetch(`${BASE_URL}/api/send-brevo-email-direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`📥 Response text: ${responseText}`);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      result = { error: 'Invalid JSON response', rawText: responseText };
    }

    if (response.ok && result.success) {
      console.log('✅ SUCCESS: Brevo email sent successfully!');
      console.log('📧 Email sent to:', result.sentTo);
      console.log('📧 Template ID:', result.templateId);
      console.log('📧 Response data:', result.data);
      
      console.log('\n📬 Check your inbox at mattheus.victorgold@gmail.com');
      console.log('📂 Also check spam folder if not in inbox');
      
      return { success: true, data: result };
    } else {
      console.log('❌ FAILED: Brevo email failed');
      console.log('❌ Error:', result.error);
      console.log('❌ Details:', result.details);
      
      return { success: false, error: result.error, details: result.details };
    }
  } catch (error) {
    console.error('❌ ERROR: Network error:', error.message);
    return { success: false, error: error.message };
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testBrevoDirect()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Test completed successfully!');
        console.log('📧 Email should be delivered via Brevo');
        process.exit(0);
      } else {
        console.log('\n⚠️  Test failed');
        console.log('❌ Error:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Test runner error:', error);
      process.exit(1);
    });
}

module.exports = { testBrevoDirect }; 