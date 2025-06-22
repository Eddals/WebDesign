// Load the polyfills
require('./node-polyfills.cjs');

// Test the crypto polyfill
try {
  const buffer = new Uint8Array(16);
  global.crypto.getRandomValues(buffer);
  console.log('✅ Crypto polyfill test successful!');
  console.log('Random values generated:', buffer);
} catch (error) {
  console.error('❌ Crypto polyfill test failed:', error);
  process.exit(1);
}