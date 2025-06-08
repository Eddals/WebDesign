import { spawn } from 'child_process';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Stripe server...');

// Kill any existing process on port 3001
exec('lsof -ti:3001', (error, stdout, stderr) => {
  if (stdout) {
    const pids = stdout.trim().split('\n');
    pids.forEach(pid => {
      if (pid) {
        exec(`kill -9 ${pid}`, () => {});
      }
    });
    console.log('🔄 Killed existing server processes');
  }
  
  // Wait a moment then start server
  setTimeout(startServer, 1000);
});

function startServer() {
  const serverPath = path.join(__dirname, 'server', 'stripe-checkout.js');
  
  // Check if server file exists
  if (!fs.existsSync(serverPath)) {
    console.error('❌ Server file not found:', serverPath);
    process.exit(1);
  }
  
  // Start the server
  const server = spawn('node', [serverPath], {
    cwd: path.join(__dirname, 'server'),
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
  });
  
  // Test server after 2 seconds
  setTimeout(() => {
    const req = http.get('http://localhost:3001/health', (res) => {
      console.log('✅ Server is responding on http://localhost:3001');
      console.log('📋 Endpoints available:');
      console.log('   - POST http://localhost:3001/create-checkout-session');
      console.log('   - GET  http://localhost:3001/health');
      console.log('');
      console.log('🎉 Ready to accept payments!');
      process.exit(0);
    });
    
    req.on('error', () => {
      console.error('❌ Server is not responding. Check for errors above.');
      process.exit(1);
    });
    
    req.setTimeout(5000, () => {
      console.error('❌ Server response timeout');
      process.exit(1);
    });
  }, 2000);
  
  console.log(`✅ Stripe server started with PID: ${server.pid}`);
}