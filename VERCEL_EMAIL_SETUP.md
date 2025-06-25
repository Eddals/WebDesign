# Vercel Email Setup for DevTone Agency

This guide explains how to set up email functionality for the estimate form on Vercel.

## Current Setup

The estimate form is configured to work with:
1. **ActivePieces Webhook** (primary) - Always works, no additional setup needed
2. **Vercel API Route** (secondary) - For email notifications

## How It Works

1. When a user submits the estimate form, it sends data to the ActivePieces webhook
2. The Vercel API route (`/api/send-estimate`) also receives the data
3. ActivePieces handles the workflow automation
4. The API can send email notifications if configured

## Vercel Environment Variables

To enable email notifications, you need to set these environment variables in Vercel:

### Required Variables
```bash
# ActivePieces (already working)
ACTIVEPIECES_USERNAME=eae
ACTIVEPIECES_PASSWORD=your_password

# Admin email to receive notifications
ADMIN_EMAIL=team@devtone.agency
```

### Optional Email Service Variables

Choose one of these email services:

#### Option 1: SendGrid
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
```

#### Option 2: Resend
```bash
RESEND_API_KEY=your_resend_api_key
```

#### Option 3: SMTP (Gmail, Outlook, etc.)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Navigate to "Environment Variables"
4. Add each variable with its value
5. Deploy your project again

## Testing the Form

1. **Local Testing**: The form will use `http://localhost:3002` in development
2. **Production Testing**: The form will use `/api/send-estimate` on Vercel

## Current Status

✅ **ActivePieces Webhook**: Working correctly
✅ **Vercel API Route**: Created and ready
⚠️ **Email Service**: Needs configuration (optional)

## File Structure

```
/api/
  send-estimate.js      # Main API endpoint
  lib/
    email-templates.js  # Email HTML templates
```

## Troubleshooting

### Form submission fails
- Check browser console for errors
- Verify ActivePieces webhook is accessible
- Check Vercel function logs

### Emails not sending
- Verify environment variables are set in Vercel
- Check Vercel function logs for errors
- Ensure email service API key is valid

### CORS errors
- The API is configured to accept requests from:
  - https://devtone.agency
  - https://www.devtone.agency
  - http://localhost:5173
  - http://localhost:5174

## Adding Email Service

To add email functionality, uncomment the email section in `/api/send-estimate.js` and install the required package:

### For SendGrid:
```bash
npm install @sendgrid/mail
```

### For Resend:
```bash
npm install resend
```

### For Nodemailer (SMTP):
```bash
npm install nodemailer
```

Then update the API route to use your chosen service.

## Support

If you need help setting this up:
- Email: team@devtone.agency
- WhatsApp: +1 917-741-3468