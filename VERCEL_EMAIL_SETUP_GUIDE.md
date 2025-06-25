# Email Notifications Setup for DevTone on Vercel

## Quick Setup Guide

### Step 1: Get a Resend API Key

1. Go to [Resend.com](https://resend.com) and create a free account
2. Verify your email domain (devtone.agency)
3. Go to API Keys section and create a new API key
4. Copy the API key (starts with `re_`)

### Step 2: Add Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your DevTone project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=team@devtone.agency
```

### Step 3: Verify Domain in Resend

1. In Resend dashboard, go to **Domains**
2. Add `devtone.agency`
3. Add the DNS records they provide to your domain:
   - SPF record
   - DKIM records
   - (Optional) DMARC record

### Step 4: Update Your Code

The email function is already set up in `/api/send-estimate-email.js`

To use it, update your frontend to call the email endpoint:

```javascript
// In src/lib/estimate-api.ts
const endpoint = API_URL ? `${API_URL}/api/estimate` : '/api/send-estimate-email';
```

### Step 5: Deploy and Test

1. Push your changes:
```bash
git add .
git commit -m "Add email notifications with Resend"
git push
```

2. Vercel will automatically deploy

3. Test the form at https://devtone.agency/estimate

## What Happens When Someone Submits

1. **ActivePieces Webhook** - Always fires (backup)
2. **Admin Email** - You receive a formatted email with all details
3. **Client Email** - They receive a confirmation with next steps

## Troubleshooting

### Emails not sending?

1. Check Vercel Function logs:
   - Vercel Dashboard → Functions → View logs

2. Verify environment variables:
   - Make sure `RESEND_API_KEY` is set correctly
   - No quotes around the value

3. Check Resend dashboard:
   - Look for failed emails
   - Verify domain is verified

### Testing Locally

You can test with a local Resend API key:

```bash
# .env.local
RESEND_API_KEY=re_test_key_here
ADMIN_EMAIL=your-test-email@gmail.com
```

## Alternative: Use SendGrid Instead

If you prefer SendGrid:

1. Get a SendGrid API key
2. Install: `npm install @sendgrid/mail`
3. Update the API function to use SendGrid
4. Set `SENDGRID_API_KEY` in Vercel

## Current Status

- ✅ ActivePieces webhook (working)
- ⏳ Email notifications (needs Resend API key)
- ✅ Vercel functions configured
- ✅ Beautiful email templates ready

## Support

Need help? Contact:
- Email: team@devtone.agency
- WhatsApp: +1 917-741-3468