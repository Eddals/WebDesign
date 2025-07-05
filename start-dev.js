// Script to start both the Vite development server and the local API server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import chalk from 'chalk';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to start a process
function startProcess(command, args, name, color) {
  console.log(chalk[color](`Starting ${name}...`));
  
  const process = spawn(command, args, {
    cwd: __dirname,
    shell: true,
    stdio: 'pipe'
  });
  
  process.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(chalk[color](`[${name}] ${line}`));
    });
  });
  
  process.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(chalk.red(`[${name} ERROR] ${line}`));
    });
  });
  
  process.on('close', (code) => {
    console.log(chalk[color](`${name} process exited with code ${code}`));
  });
  
  return process;
}

// Start the local API server
const apiServer = startProcess('node', ['local-api-server.js'], 'API Server', 'blue');

// Start the Vite development server
const viteServer = startProcess('npm', ['run', 'dev'], 'Vite Server', 'green');

// Handle process termination
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nShutting down servers...'));
  apiServer.kill();
  viteServer.kill();
  process.exit(0);
});

console.log(chalk.yellow('\nPress Ctrl+C to stop all servers'));