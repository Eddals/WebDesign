#!/usr/bin/env node

// Test script to verify Resend email is working

const testResendEmail = async () => {
  console.log('Testing Resend Email Integration...\n');

  // Test data
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '(555) 123-4567',
    company: 'Test Company',
    country: 'United States',
    industry: 'Technology',
    projectType: 'Business Website',
    budget: '$1,500 - $5,000',
    timeline: '1 Month',
    description: 'This is a test submission to verify Resend email is working',
    features: ['Contact Form', 'SEO Optimization', 'Newsletter']
  };

  try {
    // Test locally first
    console.log('Testing local endpoint...');
    const localUrl = 'http://localhost:3000/api/send-estimate-resend';
    
    // Set the API key for local testing
    process.env.RESEND_API_KEY = 're_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR';
    
    const response = await fetch(localUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success:', data);
      console.log('\nCheck these inboxes:');
      console.log('1. team@devtone.agency - for admin notification');
      console.log('2. test@example.com - for client confirmation');
      console.log('\nAlso check: https://resend.com/emails to see sent emails');
    } else {
      console.log('❌ Error:', response.status, await response.text());
    }

  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('\nMake sure to:');
    console.log('1. Run this after deploying to Vercel');
    console.log('2. Add RESEND_API_KEY to Vercel environment variables');
    console.log('3. Use the production URL: https://devtone.agency/api/send-estimate-resend');
  }
};

// Run the test
testResendEmail();