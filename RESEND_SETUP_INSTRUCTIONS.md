# Resend Email Setup - Step by Step

## What You Need to Do

### 1. Add Your Resend API Key to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **devtone** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add this variable:
   ```
   Name: RESEND_API_KEY
   Value: [Your Resend API key that starts with re_]
   ```
6. Click **Save**

### 2. Verify Your Domain in Resend (Optional but Recommended)

Right now, emails will be sent from `onboarding@resend.dev`. To send from your own domain:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Enter `devtone.agency`
4. Add these DNS records to your domain provider:
   - The SPF record
   - The DKIM records
5. Wait for verification (usually takes a few minutes)

Once verified, update the `from` address in `/api/send-estimate-resend.js`:
```javascript
from: 'DevTone <noreply@devtone.agency>', // Instead of onboarding@resend.dev
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Add Resend email notifications"
git push
```

## That's It! 🎉

Once deployed with your RESEND_API_KEY, you'll receive:

1. **Admin Email** at `team@devtone.agency` with all estimate details
2. **Client Email** confirmation to the person who submitted the form

## Testing

1. Go to https://devtone.agency/estimate
2. Submit a test form
3. Check your email (team@devtone.agency)
4. Check the Resend dashboard for delivery status

## What the Emails Look Like

### Admin Email:
- Subject: "New Estimate Request: [Name] - [Project Type]"
- Beautiful HTML format with all client details
- Reply-to set to client's email

### Client Email:
- Subject: "We received your estimate request - DevTone"
- Professional confirmation with next steps
- Timeline of what happens next

## Troubleshooting

**Not receiving emails?**

1. **Check Resend Dashboard**: https://resend.com/emails
   - Look for failed emails
   - Check error messages

2. **Verify API Key in Vercel**:
   - Make sure there are no quotes around the API key
   - Redeploy after adding the key

3. **Check Vercel Function Logs**:
   - Vercel Dashboard → Functions → send-estimate-resend → View Logs

**Common Issues:**

- API key not set: Add RESEND_API_KEY to Vercel
- Domain not verified: Emails work but come from onboarding@resend.dev
- Wrong email: Make sure team@devtone.agency is correct

## Current Status

✅ Resend integration code is ready
⏳ Waiting for you to add RESEND_API_KEY to Vercel
✅ Will work immediately after adding the API key

## Need Your Resend API Key?

1. Go to [Resend.com](https://resend.com)
2. Sign in to your account
3. Go to **API Keys**
4. Copy your API key (starts with `re_`)
5. Add it to Vercel as shown above

---

**That's all! Just add your RESEND_API_KEY to Vercel and deploy.**