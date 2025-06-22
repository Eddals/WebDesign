// Node.js polyfills for browser APIs
const crypto = require('crypto');

// Polyfill for crypto.getRandomValues
if (!global.crypto) {
  global.crypto = {
    getRandomValues: function(buffer) {
      return crypto.randomFillSync(buffer);
    }
  };
}

console.log('✅ Node.js polyfills loaded successfully');