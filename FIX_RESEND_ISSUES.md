# 🔧 Fix Resend Issues

## ❌ Current Issues

1. **UUID Validation Error** - This is likely from the webhook configuration
2. **Domain Not Verified** - You need to verify devtone.agency in Resend

## ✅ Solution Steps

### 1. Verify Your Domain (MOST IMPORTANT)

1. Go to [Resend Domains](https://app.resend.com/domains)
2. Click "Add Domain"
3. Enter: `devtone.agency`
4. Add these DNS records to your domain provider:

   **SPF Record:**
   ```
   Type: TXT
   Name: @ (or leave blank)
   Value: v=spf1 include:amazonses.com ~all
   ```

   **DKIM Records:** (Resend will show 3 CNAME records)
   ```
   Type: CNAME
   Name: [provided by Resend]
   Value: [provided by Resend]
   ```

5. Wait 5-30 minutes for verification
6. Click "Verify DNS Records" in Resend

### 2. Update Webhook URL

Since you're getting UUID errors, use the simpler webhook endpoint:

In Resend Dashboard:
1. Go to [Webhooks](https://app.resend.com/webhooks)
2. Edit your webhook
3. Change URL to: `https://devtone.agency/api/webhooks/resend-simple`
4. Save changes

### 3. Test Email Flow

Once domain is verified, test with this script:

```javascript
// test-verified-domain.js
import { Resend } from 'resend';

const resend = new Resend('re_68sbnJcD_9agW1SfXoz3drqNNEdmEN2gd');

async function testVerifiedDomain() {
  try {
    const result = await resend.emails.send({
      from: 'DevTone <noreply@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      subject: 'Test from Verified Domain',
      html: '<p>Your domain is verified and working!</p>'
    });
    
    console.log('✅ Success!', result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testVerifiedDomain();
```

### 4. Common "From" Addresses After Verification

You can use any of these:
- `noreply@devtone.agency`
- `hello@devtone.agency`
- `team@devtone.agency`
- `contact@devtone.agency`

### 5. If UUID Error Persists

The UUID error might be because:
1. Wrong webhook endpoint URL
2. Webhook expecting different format

**Quick Fix:**
- Remove the webhook temporarily
- Test form submission without webhooks
- Re-add webhook with simpler endpoint

### 6. Alternative Testing

While waiting for domain verification, you can:
1. Use `onboarding@resend.dev` as from address
2. Only send to `team@devtone.agency` (your verified email)

Example:
```javascript
from: 'Test <onboarding@resend.dev>',
to: ['team@devtone.agency'], // Must be your verified email
```

## 📊 Verification Checklist

- [ ] Domain added to Resend
- [ ] DNS records added to domain provider
- [ ] Domain verified in Resend (green checkmark)
- [ ] Updated from addresses in code
- [ ] Webhook using `/api/webhooks/resend-simple`
- [ ] Test email sends successfully

## 🚀 Once Verified

Your emails will:
- Not go to spam
- Show your domain as sender
- Have better deliverability
- Work with any recipient email

Need help? The issue is almost certainly the domain verification!