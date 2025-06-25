#!/usr/bin/env node

/**
 * Test script to verify Resend email configuration
 * Run this locally with: node scripts/test-email-config.js
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== TESTING EMAIL CONFIGURATION ===\n');

// Check if API key exists
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('❌ RESEND_API_KEY not found in environment variables!');
  console.error('Please add it to your .env file or Vercel environment variables');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY found');
console.log(`API Key starts with: ${apiKey.substring(0, 10)}...`);

// Initialize Resend
const resend = new Resend(apiKey);

// Test sending email
async function testEmail() {
  console.log('\n=== SENDING TEST EMAIL ===');
  console.log('To: team@devtone.agency');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'DevTone Test <noreply@devtone.agency>',
      to: ['team@devtone.agency'],
      subject: 'Test Email - Verifying Configuration',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify that the email configuration is working correctly.</p>
        <p>If you receive this email, the Resend API is properly configured!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: `Test Email\n\nThis is a test email to verify that the email configuration is working correctly.\n\nTimestamp: ${new Date().toISOString()}`
    });

    if (error) {
      console.error('\n❌ EMAIL FAILED!');
      console.error('Error:', error);
      
      if (error.name === 'validation_error') {
        console.error('\n⚠️  This might be a domain verification issue.');
        console.error('Make sure devtone.agency is verified in your Resend account.');
      }
      
      if (error.name === 'authentication_error') {
        console.error('\n⚠️  API key is invalid or expired.');
        console.error('Check your Resend dashboard for the correct API key.');
      }
    } else {
      console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
      console.log('Email ID:', data.id);
      console.log('\nCheck team@devtone.agency inbox (and spam folder)');
    }
  } catch (err) {
    console.error('\n❌ UNEXPECTED ERROR:', err);
  }
}

// Run the test
testEmail();