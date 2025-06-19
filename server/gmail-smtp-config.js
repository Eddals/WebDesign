// Gmail SMTP Configuration Guide

/*
To use Gmail SMTP instead of IONOS (better deliverability):

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Copy the 16-character password

3. Update your .env file:
*/

// Add these to your .env file:
/*
# Gmail SMTP Configuration (Alternative to IONOS)
GMAIL_SMTP_HOST=smtp.gmail.com
GMAIL_SMTP_PORT=587
GMAIL_SMTP_SECURE=false
GMAIL_SMTP_USER=matheusnagringanyc@gmail.com
GMAIL_SMTP_PASS=your-16-char-app-password

# Use Gmail as backup when IONOS is marked suspicious
USE_GMAIL_BACKUP=true
*/

// Enhanced email service with Gmail fallback
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create IONOS transporter
const createIONOSTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Create Gmail transporter (better deliverability)
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_SMTP_USER,
      pass: process.env.GMAIL_SMTP_PASS
    }
  });
};

// Smart send function that uses Gmail for better deliverability
const sendEmailSmart = async (mailOptions) => {
  try {
    // If sending to Gmail, use Gmail SMTP for better deliverability
    const recipientIsGmail = mailOptions.to.includes('@gmail.com');
    const useGmailBackup = process.env.USE_GMAIL_BACKUP === 'true';
    
    if (recipientIsGmail && useGmailBackup && process.env.GMAIL_SMTP_USER) {
      console.log('📧 Using Gmail SMTP for better deliverability...');
      const gmailTransporter = createGmailTransporter();
      
      // Modify from address to use Gmail
      const gmailOptions = {
        ...mailOptions,
        from: `"${mailOptions.from.match(/"([^"]+)"/)[1]}" <${process.env.GMAIL_SMTP_USER}>`,
        replyTo: process.env.SMTP_USER // Keep reply-to as IONOS email
      };
      
      return await gmailTransporter.sendMail(gmailOptions);
    } else {
      // Use IONOS for non-Gmail addresses
      const ionosTransporter = createIONOSTransporter();
      return await ionosTransporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

module.exports = { sendEmailSmart };