import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
try {
  const envFile = readFileSync(join(process.cwd(), '.env'), 'utf8');
  const envVars = envFile.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  envVars.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
  
  console.log('Environment variables loaded successfully');
} catch (error) {
  console.warn('Could not load .env file:', error.message);
}