#!/usr/bin/env node

/**
 * Debug script to test email configuration and find issues
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';
import dns from 'dns/promises';

// Load environment variables
dotenv.config();

console.log('=== EMAIL DEBUGGING SCRIPT ===\n');

// 1. Check API Key
console.log('1. Checking API Key...');
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('❌ RESEND_API_KEY not found!');
  process.exit(1);
} else {
  console.log('✅ API Key found:', apiKey.substring(0, 15) + '...');
}

// 2. Check DNS records for domain
console.log('\n2. Checking DNS records for devtone.agency...');
try {
  const mxRecords = await dns.resolveMx('devtone.agency');
  console.log('✅ MX Records found:', mxRecords);
} catch (err) {
  console.error('❌ MX Records error:', err.message);
}

// 3. Initialize Resend
const resend = new Resend(apiKey);

// 4. Test different email configurations
console.log('\n3. Testing email configurations...\n');

const testConfigs = [
  {
    name: 'Simple text email',
    config: {
      from: 'onboarding@resend.dev', // Use Resend's test domain first
      to: 'team@devtone.agency',
      subject: 'Test 1: Simple Text',
      text: 'This is a simple text email test.'
    }
  },
  {
    name: 'From noreply@devtone.agency',
    config: {
      from: 'noreply@devtone.agency',
      to: 'team@devtone.agency',
      subject: 'Test 2: From noreply',
      text: 'Testing from noreply@devtone.agency'
    }
  },
  {
    name: 'From DevTone <noreply@devtone.agency>',
    config: {
      from: 'DevTone <noreply@devtone.agency>',
      to: 'team@devtone.agency',
      subject: 'Test 3: With display name',
      text: 'Testing with display name'
    }
  },
  {
    name: 'Multiple recipients',
    config: {
      from: 'noreply@devtone.agency',
      to: ['team@devtone.agency', 'admin@devtone.agency'],
      subject: 'Test 4: Multiple recipients',
      text: 'Testing multiple recipients'
    }
  }
];

// Test each configuration
for (const test of testConfigs) {
  console.log(`Testing: ${test.name}`);
  console.log(`From: ${test.config.from}`);
  console.log(`To: ${Array.isArray(test.config.to) ? test.config.to.join(', ') : test.config.to}`);
  
  try {
    const { data, error } = await resend.emails.send(test.config);
    
    if (error) {
      console.error(`❌ FAILED: ${error.message || JSON.stringify(error)}`);
      if (error.name === 'validation_error') {
        console.error('   → Domain might not be verified in Resend');
      }
      if (error.name === 'authentication_error') {
        console.error('   → API key might be invalid');
      }
    } else {
      console.log(`✅ SUCCESS! Email ID: ${data.id}`);
    }
  } catch (err) {
    console.error(`❌ ERROR: ${err.message}`);
  }
  
  console.log('---\n');
}

// 5. Get domain info from Resend
console.log('4. Checking Resend domain status...');
try {
  const domains = await resend.domains.list();
  console.log('Domains in your Resend account:');
  domains.data?.forEach(domain => {
    console.log(`- ${domain.name} (Status: ${domain.status})`);
  });
} catch (err) {
  console.error('Could not fetch domain list:', err.message);
}

console.log('\n=== RECOMMENDATIONS ===');
console.log('1. Make sure devtone.agency is added and verified in Resend dashboard');
console.log('2. Check that team@devtone.agency email exists and can receive emails');
console.log('3. Try using a different "from" address if domain is not verified');
console.log('4. Check spam folder for test emails');
console.log('5. Consider using a personal email for testing first');