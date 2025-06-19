# Email Setup Guide for DevTone Estimate Forms

This guide will help you set up SMTP email notifications for your estimate form submissions.

## Overview

When someone submits an estimate form on your website, the system will:
1. Send you an email notification with all the form details
2. Send the client a confirmation email
3. Save the data to your Supabase database (as backup)

## Prerequisites

- Node.js installed
- An email account with SMTP access (Gmail, Outlook, etc.)
- Your `.env` file configured

## Quick Setup

### 1. Install Dependencies

The email functionality has already been installed. If you need to reinstall:

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Edit your `server/.env` file and add these SMTP settings:

```env
# SMTP Configuration for Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Email Recipients
ESTIMATE_RECIPIENT_EMAIL=your-business-email@example.com

# Estimate API Configuration
ESTIMATE_API_PORT=3002
```

### 3. Gmail Setup (Recommended)

If using Gmail:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/security
   - Click on "2-Step Verification"
   - Scroll down and click on "App passwords"
   - Select "Mail" and your device
   - Copy the generated password
   - Use this password as `SMTP_PASS` in your `.env`

### 4. IONOS (Professional Email Hosting)

```env
SMTP_HOST=smtp.ionos.com
SMTP_PORT=587
SMTP_SECURE=false
```

IONOS Setup:
- Use your full email address as username
- Use your IONOS email password
- Authentication is required

### 5. Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Custom SMTP Server
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
```

## Running the Services

### Start All Services (Recommended)
```bash
cd server
npm run start:all
```

This will start both:
- Stripe payment server on port 3001
- Estimate email API on port 3002

### Start Services Individually
```bash
# Start only the estimate API
npm run start:estimate

# Start only the Stripe server
npm start
```

### Development Mode
```bash
# With auto-reload
npm run dev:estimate
```

## Testing the Email Service

1. Start the estimate API server:
   ```bash
   cd server
   npm run start:estimate
   ```

2. Submit a test form on your website at `/estimate`

3. Check:
   - Your business email for the notification
   - The client's email for the confirmation
   - Server logs for any errors

## Email Templates

The system sends two types of emails:

### 1. Admin Notification Email
- Sent to: `ESTIMATE_RECIPIENT_EMAIL`
- Contains: All form details in a formatted layout
- Subject: "New Estimate Request from [Client Name] - [Project Type]"

### 2. Client Confirmation Email
- Sent to: The email address provided in the form
- Contains: Thank you message and next steps
- Subject: "We received your estimate request - DevTone"

## Troubleshooting

### Common Issues

1. **"Invalid login" or Authentication errors**
   - Double-check your email and password
   - For Gmail, ensure you're using an App Password, not your regular password
   - Make sure 2FA is enabled on your account

2. **Connection timeout**
   - Check your firewall settings
   - Verify the SMTP host and port are correct
   - Some networks block SMTP ports

3. **Emails not being received**
   - Check spam/junk folders
   - Verify the recipient email addresses
   - Check server logs for errors

### Debug Mode

To see detailed logs, start the server with:
```bash
DEBUG=* npm run start:estimate
```

## Security Best Practices

1. **Never commit your `.env` file** to version control
2. **Use app-specific passwords** instead of your main email password
3. **Regularly rotate** your SMTP credentials
4. **Use environment-specific** email accounts (dev/staging/production)
5. **Monitor** your email sending limits to avoid being flagged as spam

## API Endpoint

The estimate form submits to:
```
POST http://localhost:3002/api/estimate
```

Required fields:
- `name` (string)
- `email` (string)
- `projectType` (string)
- `budget` (string)
- `timeline` (string)

Optional fields:
- `phone` (string)
- `company` (string)
- `country` (string)
- `industry` (string)
- `description` (string)
- `features` (array of strings)

## Production Deployment

When deploying to production:

1. Update the frontend `.env`:
   ```env
   VITE_API_URL=https://your-api-domain.com
   ```

2. Update CORS settings in `estimate-api.js`:
   ```javascript
   origin: process.env.FRONTEND_URL || 'https://your-domain.com'
   ```

3. Use a process manager like PM2:
   ```bash
   pm2 start estimate-api.js --name "estimate-api"
   pm2 start stripe-checkout.js --name "stripe-api"
   ```

4. Set up SSL certificates for secure email transmission

## Support

If you encounter any issues:
1. Check the server logs
2. Verify all environment variables are set correctly
3. Test with a simple SMTP client first
4. Contact your email provider for SMTP-specific issues