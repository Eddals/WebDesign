#!/usr/bin/env node

/**
 * Script to verify email content changes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../api/send-estimate-resend.js');
const content = fs.readFileSync(filePath, 'utf8');

console.log('=== VERIFYING EMAIL CONTENT ===\n');

// Check for WhatsApp mentions in client email
const whatsappMatches = content.match(/WhatsApp.*?<\/a>/gi);
const clientEmailSection = content.substring(
  content.indexOf('// Send client confirmation email'),
  content.indexOf('} catch (emailError)')
);

console.log('1. Checking for WhatsApp in client email:');
if (clientEmailSection.includes('WhatsApp')) {
  console.error('❌ WhatsApp still found in client email!');
  const matches = clientEmailSection.match(/.*WhatsApp.*/g);
  matches?.forEach(match => console.log('   Found:', match.trim()));
} else {
  console.log('✅ WhatsApp removed from client email');
}

console.log('\n2. Checking name in signature:');
if (clientEmailSection.includes('Matheus Silva')) {
  console.log('✅ Name correctly set to Matheus Silva');
} else if (clientEmailSection.includes('Matheus Brito')) {
  console.error('❌ Old name "Matheus Brito" still found!');
} else {
  console.warn('⚠️  Could not find name in signature');
}

console.log('\n3. Checking LinkedIn URL:');
const correctLinkedIn = 'https://www.linkedin.com/in/devtone-agency-6a055b371/';
if (clientEmailSection.includes(correctLinkedIn)) {
  console.log('✅ LinkedIn URL is correct:', correctLinkedIn);
} else {
  console.error('❌ LinkedIn URL not found or incorrect');
}

console.log('\n4. Checking email sender:');
if (clientEmailSection.includes('hello@devtone.agency')) {
  console.log('✅ Using hello@devtone.agency as sender');
} else {
  console.warn('⚠️  Not using hello@devtone.agency');
}

console.log('\n=== DEPLOYMENT CHECKLIST ===');
console.log('1. Commit changes: git add -A && git commit -m "Update email template"');
console.log('2. Push to GitHub: git push origin main');
console.log('3. Deploy to Vercel: vercel --prod');
console.log('4. Clear any caches');
console.log('5. Test with a new estimate submission');

console.log('\n=== CURRENT EMAIL PREVIEW ===');
// Extract just the greeting and signature parts
const greetingMatch = clientEmailSection.match(/Dear.*?,/);
const signatureMatch = clientEmailSection.match(/Matheus.*?DevTone Agency.*?LinkedIn/s);

if (greetingMatch) {
  console.log('Greeting:', greetingMatch[0]);
}
if (signatureMatch) {
  console.log('Signature:', signatureMatch[0].replace(/\s+/g, ' '));
}