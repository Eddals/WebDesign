#!/usr/bin/env node

/**
 * Preview the exact client email that will be sent
 */

// Sample form data
const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  projectType: 'Web Application',
  budget: '$10,000 - $15,000',
  timeline: '2-3 months',
  features: ['User Authentication', 'Payment Integration', 'Admin Dashboard']
};

// Extract the email template from the actual file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../api/send-estimate-resend.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract HTML template
const htmlStart = fileContent.indexOf('html: `') + 7;
const htmlEnd = fileContent.indexOf('`,', htmlStart);
const htmlTemplate = fileContent.substring(htmlStart, htmlEnd);

// Extract text template
const textStart = fileContent.indexOf('text: `', htmlEnd) + 7;
const textEnd = fileContent.indexOf('`', textStart);
const textTemplate = fileContent.substring(textStart, textEnd);

// Process templates with sample data
let html = htmlTemplate;
let text = textTemplate;

// Replace variables
Object.keys(formData).forEach(key => {
  const value = Array.isArray(formData[key]) ? formData[key].join(', ') : formData[key];
  const regex = new RegExp(`\\$\\{formData\\.${key}\\}`, 'g');
  html = html.replace(regex, value);
  text = text.replace(regex, value);
});

// Replace conditional sections
html = html.replace(/\$\{formData\.features.*?\}/g, 'User Authentication, Payment Integration, Admin Dashboard');
text = text.replace(/\$\{formData\.features.*?\}/g, '- Features: User Authentication, Payment Integration, Admin Dashboard');

// Replace date
const date = new Date();
html = html.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, date.getFullYear());
text = text.replace(/\$\{new Date\(\)\.getFullYear\(\)\}/g, date.getFullYear());

// Write preview files
fs.writeFileSync(path.join(__dirname, 'email-preview.html'), html);
fs.writeFileSync(path.join(__dirname, 'email-preview.txt'), text);

console.log('=== CLIENT EMAIL PREVIEW ===\n');
console.log('HTML version saved to: scripts/email-preview.html');
console.log('Text version saved to: scripts/email-preview.txt');
console.log('\nOpen the HTML file in a browser to see the exact email design.');

// Show key details from text version
console.log('\n=== TEXT EMAIL PREVIEW ===');
const textLines = text.split('\n').filter(line => line.trim());
textLines.slice(0, 20).forEach(line => console.log(line));
console.log('...\n');

// Check for issues
console.log('=== VERIFICATION ===');
console.log('WhatsApp mentioned:', text.includes('WhatsApp') ? '❌ YES' : '✅ NO');
console.log('Name is Matheus Silva:', text.includes('Matheus Silva') ? '✅ YES' : '❌ NO');
console.log('LinkedIn URL correct:', text.includes('https://www.linkedin.com/in/devtone-agency-6a055b371/') ? '✅ YES' : '❌ NO');