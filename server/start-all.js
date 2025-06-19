#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting all backend services...\n');

// Start Stripe server
const stripeServer = spawn('node', ['stripe-checkout.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: '1' }
});

// Start Estimate API server
const estimateServer = spawn('node', ['estimate-api.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, FORCE_COLOR: '1' }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all services...');
  stripeServer.kill('SIGTERM');
  estimateServer.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  stripeServer.kill('SIGTERM');
  estimateServer.kill('SIGTERM');
  process.exit(0);
});

// Handle server crashes
stripeServer.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Stripe server exited with code ${code}`);
    estimateServer.kill('SIGTERM');
    process.exit(1);
  }
});

estimateServer.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Estimate API server exited with code ${code}`);
    stripeServer.kill('SIGTERM');
    process.exit(1);
  }
});

console.log('✅ All services started successfully!');
console.log('📧 Estimate API: http://localhost:3002');
console.log('💳 Stripe API: http://localhost:3001');
console.log('\nPress Ctrl+C to stop all services\n');