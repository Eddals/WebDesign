# URGENT: Fix Admin Email Notifications for team@devtone.agency

## Problem Summary
The admin email `team@devtone.agency` is NOT receiving estimate notifications. The system appears to be configured for `sweepeasellc@gmail.com` in many places.

## Immediate Solutions

### Solution 1: Update Vercel Environment Variables (FASTEST)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:

```
ADMIN_EMAIL = team@devtone.agency
RESEND_API_KEY = re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR
```

5. **Redeploy** your project for changes to take effect

### Solution 2: Check Email Deliverability Issues

The problem might be that emails ARE being sent but not delivered. Check:

1. **Spam/Junk Folder** - Look for emails from:
   - `onboarding@resend.dev`
   - `noreply@devtone.agency`

2. **Email Provider Blocking** - Some providers block Resend's default sender
   - Add `onboarding@resend.dev` to your contacts/safe senders

3. **Domain Not Verified** - Resend is using `onboarding@resend.dev` because `devtone.agency` isn't verified

### Solution 3: Verify Domain in Resend (BEST LONG-TERM)

1. Log into [Resend Dashboard](https://resend.com)
2. Go to **Domains**
3. Add `devtone.agency`
4. Add these DNS records to your domain provider:

```
Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all

Type: CNAME
Name: resend._domainkey
Value: [Provided by Resend]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:team@devtone.agency
```

5. Wait for verification (5-30 minutes)

### Solution 4: Test with Different Email (TEMPORARY)

If you need it working NOW:

1. In Vercel, set `ADMIN_EMAIL` to a Gmail address that you know works
2. Test the form
3. Once confirmed working, change back to `team@devtone.agency`

### Solution 5: Use Alternative Email Service

If Resend continues to fail, use Web3Forms:

1. Go to [Web3Forms](https://web3forms.com)
2. Enter `team@devtone.agency`
3. Get your access key
4. Update the estimate API to use Web3Forms instead

## Debug Steps

### 1. Check Resend Dashboard
- Log into [Resend](https://resend.com)
- Go to **Emails** section
- Look for sent emails to `team@devtone.agency`
- Check for bounces or errors

### 2. Test Email Directly
Create `test-team-email.js`:

```javascript
const { Resend } = require('resend');
const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function test() {
  const { data, error } = await resend.emails.send({
    from: 'Test <onboarding@resend.dev>',
    to: ['team@devtone.agency'],
    subject: 'Direct Test to Team Email',
    html: '<p>If you receive this, the email system works!</p>'
  });
  
  console.log('Result:', data || error);
}

test();
```

Run: `node test-team-email.js`

### 3. Check Vercel Logs
- Go to Vercel Dashboard → Functions
- Look for `send-estimate-email` or `send-estimate-resend`
- Check recent invocations for errors

## Most Likely Issues

1. **Email in Spam** - Check spam/junk folder
2. **Domain Not Verified** - Emails from `onboarding@resend.dev` being blocked
3. **Wrong Environment Variable** - `ADMIN_EMAIL` not set in Vercel
4. **Email Provider Issue** - The email provider for `team@devtone.agency` might be blocking

## Quick Test

Submit this test form and check ALL folders:

```javascript
// Test data
{
  name: "Test Admin Email",
  email: "test@example.com",
  phone: "555-1234",
  company: "Test Company",
  projectType: "Landing Page",
  budget: "$500-$1500",
  timeline: "ASAP"
}
```

Then check:
- Inbox
- Spam/Junk
- Promotions (Gmail)
- All Mail
- Trash

## Contact Resend Support

If nothing works, contact Resend:
- Email: support@resend.com
- Include your API key (first few characters)
- Mention emails to `team@devtone.agency` are not being delivered

## Alternative: Use Your Gmail

As a temporary solution, you could:
1. Set `ADMIN_EMAIL = your-personal@gmail.com`
2. Set up forwarding from Gmail to `team@devtone.agency`
3. This ensures you receive notifications while debugging the issue