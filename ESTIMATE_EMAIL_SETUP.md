# Estimate Form Email Setup

This document explains how the estimate form email notifications work.

## Overview

When a user submits the estimate form on the website, the following happens:

1. The form data is sent to the estimate API server (`http://localhost:3002/api/estimate`)
2. The API server sends email notifications via SMTP:
   - An admin notification email with all form details
   - A confirmation email to the client
3. The form data is also sent to the ActivePieces webhook for additional processing

## Components

### Frontend - EstimateForm Component
- Location: `/src/components/EstimateForm.tsx`
- Sends form data to the estimate API
- Also sends data to ActivePieces webhook as a backup
- Shows success/error messages to the user

### Backend - Estimate API Server
- Location: `/server/estimate-api.js`
- Runs on port 3002 (configurable via `ESTIMATE_API_PORT`)
- Handles form submissions and triggers email notifications
- Includes rate limiting (5 requests per 15 minutes per IP)

### Email Service
- Location: `/server/email-service.js`
- Uses Nodemailer with SMTP configuration
- Sends two types of emails:
  1. Admin notification with all form details
  2. Client confirmation email

## Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_ESTIMATE_API_URL=http://localhost:3002  # URL of the estimate API server
```

#### Backend (server/.env)
```env
# SMTP Configuration
SMTP_HOST=smtp.ionos.com          # Your SMTP server
SMTP_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
SMTP_SECURE=false                 # true for SSL, false for TLS
SMTP_USER=team@devtone.agency     # SMTP username (usually your email)
SMTP_PASS=your_password_here      # SMTP password

# Email Recipients
ESTIMATE_RECIPIENT_EMAIL=team@devtone.agency  # Where to send admin notifications

# Server Configuration
ESTIMATE_API_PORT=3002            # Port for the estimate API server
```

## Running the Services

### Start the Estimate API Server
```bash
cd server
npm run start:estimate
```

Or to run all servers (Stripe + Estimate):
```bash
cd server
npm run start:all
```

### Test Email Functionality
```bash
cd server
node test-estimate-email.js
```

This will send test emails to verify your SMTP configuration is working correctly.

## Email Templates

### Admin Notification Email
- Subject: "New Estimate Request from [Name] - [Project Type]"
- Contains all form fields in a formatted HTML layout
- Includes quick summary at the top
- Reply-to is set to the client's email

### Client Confirmation Email
- Subject: "We received your estimate request - DevTone"
- Thanks the client for their request
- Explains the next steps
- Professional HTML template with branding

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP credentials in `server/.env`
   - Verify SMTP host and port are correct
   - Check if your email provider requires app-specific passwords
   - Run `node test-estimate-email.js` to test configuration

2. **CORS errors**
   - Make sure the frontend URL is allowed in `estimate-api.js`
   - Check that `VITE_ESTIMATE_API_URL` matches your server URL

3. **Rate limiting**
   - The API limits each IP to 5 requests per 15 minutes
   - This prevents spam but may affect testing

4. **Connection refused**
   - Make sure the estimate API server is running
   - Check that the port (3002) is not in use by another service

### Debug Mode

To see detailed logs:
1. Check the server console for error messages
2. Check browser console for frontend errors
3. The API logs all incoming requests and email sending attempts

## Security Considerations

1. **Rate Limiting**: Prevents spam by limiting requests per IP
2. **Input Validation**: Server validates required fields and email format
3. **CORS**: Only allows requests from specified origins
4. **Environment Variables**: Sensitive data (SMTP credentials) stored in .env files

## Testing Checklist

- [ ] Start the estimate API server
- [ ] Submit a test form from the frontend
- [ ] Verify admin notification email is received
- [ ] Verify client confirmation email is received
- [ ] Check that form resets after successful submission
- [ ] Test error handling by stopping the server and submitting