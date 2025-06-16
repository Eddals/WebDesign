import { spawn } from 'child_process';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting DevtoneDashboard server...');

// Kill any existing process on port 5000 (the dashboard server port)
exec('lsof -ti:5000', (error, stdout, stderr) => {
  if (stdout) {
    const pids = stdout.trim().split('\n');
    pids.forEach(pid => {
      if (pid) {
        exec(`kill -9 ${pid}`, () => {});
      }
    });
    console.log('🔄 Killed existing dashboard server processes');
  }
  
  // Wait a moment then start server
  setTimeout(startDashboardServer, 1000);
});

function startDashboardServer() {
  const dashboardDir = path.join(__dirname, 'src', 'DevtoneDashboard');
  
  // First check if tsx is installed
  const server = spawn('npm', ['run', 'dev'], {
    cwd: dashboardDir,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  server.stdout.on('data', (data) => {
    console.log(`[Dashboard] ${data.toString()}`);
  });
  
  server.stderr.on('data', (data) => {
    console.error(`[Dashboard Error] ${data.toString()}`);
  });
  
  server.on('error', (error) => {
    console.error('❌ Failed to start dashboard server:', error.message);
  });
  
  console.log(`✅ DevtoneDashboard server started with PID: ${server.pid}`);
  console.log('📋 Dashboard will be available at: http://localhost:5173/devtone-dashboard');
}