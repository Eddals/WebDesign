// This file helps Vercel understand how to handle the build output
const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Create a simple file to verify the build process
fs.writeFileSync(
  path.join('dist', 'vercel-build-check.txt'),
  'This file was created during the Vercel build process to verify everything is working correctly.'
);

console.log('Vercel build helper script executed successfully.');