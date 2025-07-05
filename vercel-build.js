#!/usr/bin/env node

/**
 * Custom build script for Vercel deployment
 * This ensures API endpoints are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build...');

// Check if API directory exists
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
  console.error('❌ API directory not found!');
  process.exit(1);
}

// List API files
const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));
console.log('📁 API files found:', apiFiles);

// Check if required API files exist
const requiredFiles = [
  'send-brevo-email.js',
  'send-brevo-email-simple.js',
  'test-endpoint.js'
];

for (const file of requiredFiles) {
  const filePath = path.join(apiDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`⚠️  ${file} not found`);
  }
}

// Create a simple health check for the API
const healthCheckContent = `
// Health check endpoint for Vercel
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiFiles: ${JSON.stringify(apiFiles)}
  });
}
`;

fs.writeFileSync(path.join(apiDir, 'health.js'), healthCheckContent);
console.log('✅ Health check endpoint created');

console.log('🎉 Vercel build completed successfully!');