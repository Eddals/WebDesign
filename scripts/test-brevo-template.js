#!/usr/bin/env node

// Test script to verify Brevo template ID 2 is working
const fetch = require('node-fetch');

const BREVO_API_KEY = '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';

async function testBrevoTemplate() {
  console.log('🧪 Testing Brevo Template ID 2\n');

  const testData = {
    sender: {
      name: 'DevTone Website',
      email: 'team@devtone.agency'
    },
    to: [
      {
        email: 'team@devtone.agency',
        name: 'DevTone Team'
      }
    ],
    templateId: 2,
    params: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '(555) 123-4567',
      company: 'Test Company',
      industry: 'Technology',
      projectType: 'Landing Page',
      budget: '$500 - $1,500',
      timeline: '1 Month',
      description: 'This is a test submission to verify template ID 2 is working.',
      features: 'Contact Form, SEO',
      retainer: 'No monthly retainer',
      submittedAt: new Date().toLocaleString(),
    }
  };

  try {
    console.log('📤 Sending test email to Brevo...');
    console.log('📋 Template ID: 2');
    console.log('📋 To: team@devtone.agency');
    console.log('📋 Data:', JSON.stringify(testData, null, 2));

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify(testData)
    });

    console.log('\n📥 Response Status:', response.status);
    console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📥 Response Text:', responseText);

    if (response.ok) {
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.log('⚠️ Response is not JSON, but request was successful');
        result = { message: 'Email sent successfully', rawResponse: responseText };
      }

      console.log('\n✅ SUCCESS: Email sent successfully!');
      console.log('📧 Message ID:', result.messageId || 'N/A');
      console.log('📧 Response:', JSON.stringify(result, null, 2));
      
      console.log('\n📬 Check your inbox at team@devtone.agency');
      console.log('📂 Also check spam folder if not in inbox');
      
      return true;
    } else {
      console.log('\n❌ FAILED: Brevo API returned error');
      console.log('❌ Status:', response.status);
      console.log('❌ Error:', responseText);
      
      // Try to parse error response
      try {
        const errorData = JSON.parse(responseText);
        console.log('❌ Error Details:', JSON.stringify(errorData, null, 2));
      } catch {
        console.log('❌ Raw Error Response:', responseText);
      }
      
      return false;
    }

  } catch (error) {
    console.error('\n❌ ERROR: Network or other error');
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Also test with different template parameters
async function testTemplateParameters() {
  console.log('\n🧪 Testing different template parameters...\n');

  const testCases = [
    {
      name: 'Basic parameters',
      params: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        company: 'Acme Corp',
        industry: 'Technology',
        projectType: 'E-commerce',
        budget: '$2,000 - $5,000',
        timeline: '2 Months',
        description: 'Need a modern e-commerce website',
        features: 'Payment Processing, Inventory Management',
        retainer: 'Basic Maintenance ($200/mo)',
        submittedAt: new Date().toLocaleString(),
      }
    },
    {
      name: 'Minimal parameters',
      params: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(555) 987-6543',
        company: 'Startup Inc',
        industry: 'Healthcare',
        projectType: 'Landing Page',
        budget: '$500 - $1,500',
        timeline: '1 Month',
        description: 'Simple landing page for healthcare startup',
        features: 'Contact Form',
        retainer: 'No monthly retainer',
        submittedAt: new Date().toLocaleString(),
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`📧 Testing: ${testCase.name}`);
    
    const emailData = {
      sender: {
        name: 'DevTone Website',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: 'team@devtone.agency',
          name: 'DevTone Team'
        }
      ],
      templateId: 2,
      params: testCase.params
    };

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        console.log(`✅ ${testCase.name}: SUCCESS`);
      } else {
        const errorText = await response.text();
        console.log(`❌ ${testCase.name}: FAILED - ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}: ERROR - ${error.message}`);
    }
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 Starting Brevo Template Tests\n');
  
  const success = await testBrevoTemplate();
  
  if (success) {
    console.log('\n🎉 Template ID 2 is working correctly!');
    console.log('📧 Emails should be received at team@devtone.agency');
  } else {
    console.log('\n⚠️ Template ID 2 has issues');
    console.log('🔧 Check the error details above');
  }
  
  await testTemplateParameters();
  
  console.log('\n🏁 Tests completed');
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testBrevoTemplate, testTemplateParameters }; 