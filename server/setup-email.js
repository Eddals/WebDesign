#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('📧 DevTone Email Setup Wizard\n');
console.log('This wizard will help you configure SMTP email settings for estimate form notifications.\n');

const emailProviders = {
  '1': {
    name: 'IONOS',
    host: 'smtp.ionos.com',
    port: 587,
    secure: false,
    instructions: `
IONOS Setup Instructions:
1. Use your full IONOS email address as username
2. Use your IONOS email password
3. SMTP Server: smtp.ionos.com
4. Port: 587 (STARTTLS)
5. Authentication: Required
`
  },
  '2': {
    name: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    instructions: `
Gmail Setup Instructions:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Click on "App passwords"
   - Generate a new app password for "Mail"
   - Use this password (not your regular Gmail password)
`
  },
  '3': {
    name: 'Outlook/Hotmail',
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    instructions: `
Outlook Setup Instructions:
1. Use your full email address as username
2. Use your regular Outlook password
3. Make sure 2FA is not blocking SMTP access
`
  },
  '4': {
    name: 'Yahoo',
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    instructions: `
Yahoo Setup Instructions:
1. Generate an app password from your Yahoo account settings
2. Use the app password instead of your regular password
`
  },
  '5': {
    name: 'Custom SMTP',
    host: '',
    port: 587,
    secure: false,
    instructions: ''
  }
};

async function setup() {
  try {
    // Check if .env exists
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Found existing .env file\n');
    } else {
      // Copy from .env.example
      const examplePath = path.join(__dirname, '.env.example');
      if (fs.existsSync(examplePath)) {
        envContent = fs.readFileSync(examplePath, 'utf8');
        console.log('📋 Creating .env from .env.example\n');
      }
    }

    // Select email provider
    console.log('Select your email provider:');
    Object.entries(emailProviders).forEach(([key, provider]) => {
      console.log(`${key}. ${provider.name}`);
    });
    
    const providerChoice = await question('\nEnter your choice (1-5): ');
    const provider = emailProviders[providerChoice];
    
    if (!provider) {
      console.log('❌ Invalid choice');
      process.exit(1);
    }

    console.log(`\n✅ Selected: ${provider.name}`);
    
    if (provider.instructions) {
      console.log(provider.instructions);
    }

    // Get SMTP details
    let smtpHost = provider.host;
    let smtpPort = provider.port;
    
    if (providerChoice === '5') {
      smtpHost = await question('Enter SMTP host: ');
      smtpPort = await question('Enter SMTP port (usually 587 or 465): ');
    }

    const smtpUser = await question('Enter your email address: ');
    const smtpPass = await question('Enter your password/app password: ');
    
    // Get recipient email
    const recipientEmail = await question(`\nWhere should estimate notifications be sent? (press Enter for ${smtpUser}): `) || smtpUser;

    // Update or add SMTP configuration
    const smtpConfig = `
# SMTP Configuration for Email Notifications
SMTP_HOST=${smtpHost}
SMTP_PORT=${smtpPort}
SMTP_SECURE=${smtpPort === '465' ? 'true' : 'false'}
SMTP_USER=${smtpUser}
SMTP_PASS=${smtpPass}

# Email Recipients
ESTIMATE_RECIPIENT_EMAIL=${recipientEmail}

# Estimate API Configuration
ESTIMATE_API_PORT=3002`;

    // Update or append to .env
    if (envContent.includes('SMTP_HOST=')) {
      // Replace existing SMTP configuration
      envContent = envContent.replace(
        /# SMTP Configuration[\s\S]*?(?=\n#|$)/,
        smtpConfig.trim()
      );
    } else {
      // Append new SMTP configuration
      envContent += '\n' + smtpConfig;
    }

    // Write .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Email configuration saved to .env file');

    // Offer to test
    const testNow = await question('\nWould you like to test the email configuration now? (y/n): ');
    
    if (testNow.toLowerCase() === 'y') {
      console.log('\n🧪 Running email test...\n');
      require('./test-email.js');
    } else {
      console.log('\n✅ Setup complete!');
      console.log('\nTo test your email configuration later, run:');
      console.log('  npm run test:email');
      console.log('\nTo start the estimate API server, run:');
      console.log('  npm run start:estimate');
    }

  } catch (error) {
    console.error('\n❌ Setup error:', error.message);
  } finally {
    rl.close();
  }
}

// Run setup
setup();