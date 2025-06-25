# Debug Email Issues on Vercel

## Current Problem
Neither client nor admin emails are being received after domain verification.

## Immediate Debugging Steps

### 1. Check Vercel Environment Variables

Go to [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables

Ensure these are set:
```
RESEND_API_KEY = re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR
ADMIN_EMAIL = team@devtone.agency
```

### 2. Check Resend Dashboard

1. Log into [Resend Dashboard](https://resend.com)
2. Go to **Emails** section
3. Look for recent emails - are they showing as sent?
4. Check for any errors or bounces
5. Go to **Domains** - is `devtone.agency` showing as verified?

### 3. Test Email Directly from Vercel

Create a test API endpoint `api/test-email.js`:

```javascript
import { Resend } from 'resend';

export default async function handler(req, res) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Test <noreply@devtone.agency>',
      to: ['team@devtone.agency'],
      subject: 'Test Email from Vercel',
      html: '<p>If you receive this, emails are working!</p>'
    });
    
    if (error) {
      return res.status(400).json({ error });
    }
    
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
```

Deploy and test: `https://devtone.agency/api/test-email`

### 4. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on **Functions** tab
3. Find `send-estimate-email` or `send-estimate-resend`
4. Click on it and check recent logs
5. Look for any error messages

### 5. Common Issues & Solutions

#### A. Domain Not Properly Verified
- In Resend, check if domain shows "Verified"
- Make sure all DNS records are added correctly
- DNS propagation can take up to 48 hours

#### B. Wrong Sender Address
- We've updated from `onboarding@resend.dev` to `noreply@devtone.agency`
- Make sure to deploy the changes

#### C. API Key Issues
- Verify the API key is correct in Vercel
- No quotes or spaces around the key
- Try regenerating the API key in Resend

#### D. Email Provider Blocking
- Check spam/junk folders
- Add `noreply@devtone.agency` to safe senders
- Some providers block new domains initially

### 6. Alternative Solutions

#### Use Web3Forms (Free & Reliable)
If Resend continues to fail, add this to your API:

```javascript
// api/send-estimate-web3forms.js
export default async function handler(req, res) {
  const formData = req.body;
  
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_key: 'YOUR_WEB3FORMS_KEY', // Get from web3forms.com
      to: 'team@devtone.agency',
      subject: `New Estimate: ${formData.name}`,
      from_name: formData.name,
      from_email: formData.email,
      message: `
        Name: ${formData.name}
        Email: ${formData.email}
        Project: ${formData.projectType}
        Budget: ${formData.budget}
        Timeline: ${formData.timeline}
        Description: ${formData.description}
      `
    }),
  });
  
  const result = await response.json();
  return res.status(200).json(result);
}
```

### 7. Deploy the Fixed Code

```bash
git add .
git commit -m "Fix email sender addresses for verified domain"
git push
```

Vercel will automatically deploy.

### 8. Test Checklist

After deployment:
- [ ] Submit a test estimate form
- [ ] Check Resend dashboard for sent emails
- [ ] Check Vercel function logs
- [ ] Check all email folders (inbox, spam, promotions)
- [ ] Try with different email addresses

### 9. If Nothing Works

1. **Contact Resend Support**
   - Email: support@resend.com
   - Include your domain: devtone.agency
   - Mention emails not being delivered

2. **Try Different Email Service**
   - SendGrid
   - Mailgun
   - Amazon SES
   - Web3Forms (easiest)

3. **Temporary Workaround**
   - Use ActivePieces webhook (already working)
   - Set up email notifications in ActivePieces

## Quick Test Script

Save as `test-resend-local.js` and run locally:

```javascript
const { Resend } = require('resend');
const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function test() {
  console.log('Testing Resend with verified domain...');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'DevTone <noreply@devtone.agency>',
      to: ['team@devtone.agency'],
      subject: 'Test from Verified Domain',
      html: '<p>This email uses the verified domain!</p>'
    });
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', data);
      console.log('Check team@devtone.agency inbox!');
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

test();
```

Run: `node test-resend-local.js`

## Most Likely Issue

Since you verified the domain but emails stopped working, the issue is probably:
1. The code was still using `onboarding@resend.dev` (now fixed)
2. DNS records might not be fully propagated
3. Resend might need time to activate the verified domain

## Next Steps

1. Deploy the updated code with correct sender addresses
2. Wait 5-10 minutes for deployment
3. Test the form again
4. Check Resend dashboard for any errors
5. If still not working, use the test script above