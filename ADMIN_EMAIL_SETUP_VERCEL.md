# Admin Email Notifications Setup for Vercel

## Overview
This guide ensures that admin email notifications are properly configured when clients submit estimate requests through the DevTone website.

## Current Issue
- Client receives confirmation email ✅
- Admin is NOT receiving notification emails ❌

## Solution Steps

### 1. Configure Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **WebDesign** or **devtone** project
3. Click on **Settings** → **Environment Variables**
4. Add/Update these variables:

#### Required Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `RESEND_API_KEY` | `re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR` | Production, Preview, Development |
| `ADMIN_EMAIL` | Your admin email (e.g., `matheus@devtone.agency`) | Production, Preview, Development |

⚠️ **IMPORTANT**: Replace `Your admin email` with the actual email address where you want to receive estimate notifications!

### 2. Verify Email Configuration

The system uses two different API endpoints:

1. **Primary**: `/api/send-estimate-email` (uses `ADMIN_EMAIL` env variable)
2. **Backup**: `/api/send-estimate-resend` (now updated to use `ADMIN_EMAIL` env variable)

Both endpoints now properly use the `ADMIN_EMAIL` environment variable.

### 3. Deploy Changes

After setting the environment variables:

```bash
git add .
git commit -m "Fix admin email notifications - use environment variable"
git push
```

Vercel will automatically deploy with the new configuration.

### 4. Test the System

1. Go to https://devtone.agency/estimate
2. Fill out the form with test data
3. Submit the form
4. Check:
   - Client email (should receive confirmation)
   - Admin email (should receive notification)

### 5. Troubleshooting

#### If admin emails are still not received:

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Functions
   - Look for `send-estimate-email` or `send-estimate-resend`
   - Check the logs for errors

2. **Verify Environment Variables**:
   - In Vercel Dashboard → Settings → Environment Variables
   - Ensure `ADMIN_EMAIL` is set correctly
   - Ensure there are no typos or extra spaces

3. **Check Spam Folder**:
   - Admin notification emails might be in spam
   - Add `noreply@devtone.agency` to your safe senders list

4. **Verify Resend Configuration**:
   - Log into [Resend Dashboard](https://resend.com)
   - Check if emails are being sent
   - Verify domain configuration

### 6. Email Flow Diagram

```
Client Submits Form
       ↓
   Estimate API
       ↓
   ┌───┴───┐
   ↓       ↓
Client   Admin
Email    Email
   ↓       ↓
Client   ADMIN_EMAIL
Inbox    (env variable)
```

### 7. Code Changes Made

1. **Updated `/api/send-estimate-resend.js`**:
   - Changed from hardcoded `team@devtone.agency`
   - Now uses `process.env.ADMIN_EMAIL || 'team@devtone.agency'`

2. **Verified `/api/send-estimate-email.js`**:
   - Already using `process.env.ADMIN_EMAIL || 'team@devtone.agency'`

### 8. ActivePieces Backup

The system also sends data to ActivePieces webhook as a backup:
- Webhook URL: `https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg`
- This ensures data is captured even if email fails

### 9. Expected Result

After proper configuration:
- ✅ Client receives confirmation email at their provided email
- ✅ Admin receives notification email at `ADMIN_EMAIL` address
- ✅ ActivePieces webhook receives the data as backup

## Support

If you need help:
- Check Vercel function logs
- Contact: team@devtone.agency
- WhatsApp: +1 917-741-3468