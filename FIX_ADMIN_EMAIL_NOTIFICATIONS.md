# Fix Admin Email Notifications - team@devtone.agency

## Current Issue
Admin email `team@devtone.agency` is NOT receiving estimate notifications from the website.

## Root Causes & Solutions

### 1. Domain Verification Issue (Most Likely)

**Problem**: The `devtone.agency` domain is not verified in Resend, so emails are being sent from `onboarding@resend.dev` which might be blocked or going to spam.

**Solution**:
1. Log into [Resend Dashboard](https://resend.com)
2. Go to **Domains** section
3. Add `devtone.agency`
4. Add these DNS records to your domain provider:

```
Type: TXT
Name: resend._domainkey
Value: [Provided by Resend]

Type: TXT  
Name: @
Value: v=spf1 include:amazonses.com ~all

Type: CNAME
Name: resend._domainkey
Value: [Provided by Resend]
```

5. Wait for verification (5-30 minutes)
6. Update the API files to use verified sender

### 2. Email Going to Spam

**Quick Fix - Check these folders**:
- Spam/Junk folder
- Promotions tab (Gmail)
- All Mail folder
- Trash (in case of auto-delete rules)

**Add to Safe Senders**:
- Add `onboarding@resend.dev` to contacts
- Add `noreply@devtone.agency` to contacts (for after domain verification)
- Mark any found emails as "Not Spam"

### 3. Temporary Solution (Use Different Email)

If you need it working NOW, update the admin email to a different address:

**Option A - Update in Vercel Dashboard**:
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Settings → Environment Variables
4. Update `ADMIN_EMAIL` to a working email (e.g., your personal Gmail)
5. Redeploy

**Option B - Test with Personal Email**:
```javascript
// Temporarily change in the code
const adminEmailAddress = 'your-personal-email@gmail.com'; // Instead of team@devtone.agency
```

### 4. Alternative Email Services

If Resend continues to have issues, consider these alternatives:

**A. Use Gmail SMTP directly**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=team@devtone.agency
SMTP_PASS=[App Password from Google]
```

**B. Use Web3Forms (Free)**:
1. Go to [Web3Forms](https://web3forms.com)
2. Enter `team@devtone.agency`
3. Get access key
4. Update the code to use Web3Forms

### 5. Debug Steps

**1. Check Resend Dashboard**:
- Log into [Resend](https://resend.com)
- Go to "Emails" section
- Check if emails are being sent
- Look for any errors or bounces

**2. Check Vercel Function Logs**:
```bash
# In Vercel Dashboard
Functions → send-estimate-email → View Logs
```

**3. Test Email Directly**:
Create a test file `test-admin-email.js`:

```javascript
const { Resend } = require('resend');
const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: ['team@devtone.agency'],
      subject: 'Test Admin Email',
      html: '<p>This is a test email to verify delivery</p>'
    });
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', data);
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

testEmail();
```

Run: `node test-admin-email.js`

### 6. Immediate Actions

1. **Check Spam Folder** - Look for emails from `onboarding@resend.dev`

2. **Update Environment Variable** (if needed):
   ```
   ADMIN_EMAIL=working-email@gmail.com
   ```

3. **Add Email Filters**:
   - Create filter for subject containing "New Estimate Request"
   - Never send to spam
   - Apply label "Estimates"

4. **Test the Form**:
   - Submit a test estimate
   - Note the exact time
   - Check all email folders
   - Check Resend dashboard

### 7. Long-term Solution

1. **Verify Domain** in Resend (best solution)
2. **Set up proper DNS records**:
   - SPF
   - DKIM
   - DMARC
3. **Use professional email service** (Google Workspace)

### 8. Contact Support

If nothing works:
- **Resend Support**: support@resend.com
- **Check Resend Status**: https://status.resend.com
- **DevTone Support**: Use alternative contact methods

## Testing Checklist

- [ ] Checked spam/junk folder
- [ ] Checked Resend dashboard for sent emails
- [ ] Verified environment variables in Vercel
- [ ] Tested with alternative email address
- [ ] Checked Vercel function logs
- [ ] Added sender to safe list
- [ ] Verified domain in Resend (if possible)

## Quick Fix Code

If you need to quickly change the admin email in code:

```javascript
// In /api/send-estimate-email.js and /api/send-estimate-resend.js
// Change this line:
to: process.env.ADMIN_EMAIL || 'team@devtone.agency',

// To:
to: 'your-working-email@gmail.com', // Temporary fix
```

Then deploy:
```bash
git add .
git commit -m "Temporary fix: Change admin email"
git push
```

Remember to change it back once the issue is resolved!