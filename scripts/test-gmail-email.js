#!/usr/bin/env node

/**
 * Test script to verify email sending to Gmail
 * Run this locally with: node scripts/test-gmail-email.js
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== TESTING EMAIL TO GMAIL ===\n');

// Check if API key exists
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('❌ RESEND_API_KEY not found in environment variables!');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY found');

// Initialize Resend
const resend = new Resend(apiKey);

// Test sending email to Gmail
async function testGmailEmail() {
  console.log('\n=== SENDING TEST EMAIL TO GMAIL ===');
  console.log('To: sweepeasellc@gmail.com');
  
  try {
    // Try with Resend's test domain first
    console.log('\n1. Testing with Resend test domain...');
    const { data: testData, error: testError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['sweepeasellc@gmail.com'],
      subject: 'DevTone Test - From Resend Domain',
      html: `
        <h2>Test Email from DevTone</h2>
        <p>This email is sent from Resend's test domain.</p>
        <p>If you receive this, the basic email configuration is working!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: `Test Email from DevTone\n\nThis email is sent from Resend's test domain.\nTimestamp: ${new Date().toISOString()}`
    });

    if (testError) {
      console.error('❌ Test domain failed:', testError);
    } else {
      console.log('✅ Test domain email sent! ID:', testData.id);
    }

    // Try with DevTone domain
    console.log('\n2. Testing with DevTone domain...');
    const { data: devtoneData, error: devtoneError } = await resend.emails.send({
      from: 'DevTone Agency <noreply@devtone.agency>',
      to: ['sweepeasellc@gmail.com'],
      subject: 'DevTone Estimate Test - From DevTone Domain',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, rgb(109 40 217 / .9) 0%, rgb(109 40 217) 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">DevTone Email Test</h1>
          </div>
          <div style="padding: 30px; background: #f5f5f5;">
            <h2 style="color: rgb(109 40 217);">Email Configuration Test</h2>
            <p>This is a test email from the DevTone domain.</p>
            <p><strong>If you receive this email:</strong></p>
            <ul>
              <li>✅ Resend API is working</li>
              <li>✅ DevTone domain is verified</li>
              <li>✅ Emails to Gmail are working</li>
            </ul>
            <p>You should now receive estimate notifications at sweepeasellc@gmail.com</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
      text: `DevTone Email Test\n\nThis is a test email from the DevTone domain.\n\nIf you receive this email:\n- Resend API is working\n- DevTone domain is verified\n- Emails to Gmail are working\n\nSent at: ${new Date().toISOString()}`
    });

    if (devtoneError) {
      console.error('\n❌ DevTone domain failed:', devtoneError);
      if (devtoneError.name === 'validation_error') {
        console.error('⚠️  The devtone.agency domain might not be verified in Resend.');
        console.error('   Please verify the domain in your Resend dashboard.');
      }
    } else {
      console.log('✅ DevTone domain email sent! ID:', devtoneData.id);
    }

  } catch (err) {
    console.error('\n❌ UNEXPECTED ERROR:', err);
  }

  console.log('\n=== IMPORTANT NOTES ===');
  console.log('1. Check sweepeasellc@gmail.com inbox (including spam/promotions folders)');
  console.log('2. If using DevTone domain fails, verify devtone.agency in Resend dashboard');
  console.log('3. Gmail might take a few minutes to receive the email');
  console.log('4. If you see the email, the estimate notifications should work!');
}

// Run the test
testGmailEmail();