#!/usr/bin/env node

const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 DevTone Email Server Manager\n');

function checkServerStatus() {
  exec('lsof -i :3002', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Email server is NOT running\n');
      showMenu();
    } else {
      const lines = stdout.trim().split('\n');
      if (lines.length > 1) {
        const processInfo = lines[1].split(/\s+/);
        const pid = processInfo[1];
        console.log('✅ Email server is RUNNING');
        console.log(`   PID: ${pid}`);
        console.log('   Port: 3002');
        console.log('   Status: Active\n');
        
        // Test the health endpoint
        exec('curl -s http://localhost:3002/health', (error, stdout) => {
          if (!error && stdout.includes('ok')) {
            console.log('   Health: ✅ Healthy\n');
          }
          showMenu(pid);
        });
      }
    }
  });
}

function showMenu(pid = null) {
  console.log('What would you like to do?\n');
  
  if (pid) {
    console.log('1. Stop the server');
    console.log('2. Restart the server');
    console.log('3. Test email sending');
    console.log('4. View server info');
  } else {
    console.log('1. Start the server');
    console.log('3. Test email sending (will fail if server not running)');
  }
  console.log('5. Exit\n');
  
  rl.question('Enter your choice (1-5): ', (answer) => {
    handleChoice(answer, pid);
  });
}

function handleChoice(choice, pid) {
  switch(choice) {
    case '1':
      if (pid) {
        stopServer(pid);
      } else {
        startServer();
      }
      break;
    case '2':
      if (pid) {
        restartServer(pid);
      } else {
        console.log('\n❌ Server is not running. Use option 1 to start it.\n');
        setTimeout(() => checkServerStatus(), 1000);
      }
      break;
    case '3':
      testEmail();
      break;
    case '4':
      if (pid) {
        showServerInfo();
      } else {
        console.log('\n❌ Invalid option\n');
        setTimeout(() => checkServerStatus(), 1000);
      }
      break;
    case '5':
      console.log('\n👋 Goodbye!\n');
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('\n❌ Invalid option\n');
      setTimeout(() => checkServerStatus(), 1000);
  }
}

function startServer() {
  console.log('\n🚀 Starting email server...\n');
  
  const spawn = require('child_process').spawn;
  const server = spawn('node', ['estimate-api.js'], {
    cwd: __dirname,
    detached: true,
    stdio: 'ignore'
  });
  
  server.unref();
  
  setTimeout(() => {
    exec('lsof -i :3002', (error, stdout) => {
      if (!error && stdout) {
        console.log('✅ Server started successfully!\n');
      } else {
        console.log('❌ Failed to start server. Check if port 3002 is available.\n');
      }
      checkServerStatus();
    });
  }, 2000);
}

function stopServer(pid) {
  console.log(`\n🛑 Stopping server (PID: ${pid})...\n`);
  
  exec(`kill ${pid}`, (error) => {
    if (error) {
      console.log('❌ Failed to stop server:', error.message);
    } else {
      console.log('✅ Server stopped successfully!\n');
    }
    setTimeout(() => checkServerStatus(), 1000);
  });
}

function restartServer(pid) {
  console.log('\n🔄 Restarting server...\n');
  
  exec(`kill ${pid}`, (error) => {
    if (!error) {
      console.log('✅ Stopped old server');
      setTimeout(() => {
        startServer();
      }, 1000);
    } else {
      console.log('❌ Failed to stop server:', error.message);
      checkServerStatus();
    }
  });
}

function testEmail() {
  console.log('\n📧 Testing email system...\n');
  
  exec('node test-enhanced-emails.js', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Email test failed:', error.message);
      console.log('\nMake sure the server is running first!\n');
    } else {
      console.log(stdout);
    }
    setTimeout(() => checkServerStatus(), 2000);
  });
}

function showServerInfo() {
  console.log('\n📊 Server Information:\n');
  console.log('Service: Estimate API Server');
  console.log('Port: 3002');
  console.log('Email Provider: Gmail SMTP');
  console.log('From: team@devtone.agency');
  console.log('To: team@devtone.agency');
  console.log('Features:');
  console.log('  - Admin notifications with priority indicators');
  console.log('  - Client confirmations with next steps');
  console.log('  - ActivePieces webhook integration');
  console.log('  - Rate limiting (5 requests per 15 minutes per IP)');
  console.log('\nEndpoints:');
  console.log('  - GET  /health - Health check');
  console.log('  - POST /api/estimate - Submit estimate\n');
  
  setTimeout(() => checkServerStatus(), 2000);
}

// Start the manager
checkServerStatus();