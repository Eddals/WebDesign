# Deployment Checklist for DevTone Agency

## ✅ What's Already Working

1. **ActivePieces Webhook** - The form submissions are being sent to ActivePieces successfully
2. **Frontend Form** - The estimate form is properly configured to handle submissions
3. **Error Handling** - The form gracefully handles API failures and still submits via webhook

## 📋 Steps to Deploy on Vercel

### 1. Push Changes to GitHub
```bash
git add .
git commit -m "Add Vercel API routes for estimate form"
git push origin main
```

### 2. Deploy to Vercel
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Import your GitHub repository if not already done
- The deployment will automatically use the `vercel.json` configuration

### 3. Set Environment Variables (Optional - for email)
In Vercel Dashboard > Settings > Environment Variables, add:

```
ADMIN_EMAIL=team@devtone.agency
```

If you want email notifications, also add one of these:
- `SENDGRID_API_KEY` for SendGrid
- `RESEND_API_KEY` for Resend
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` for SMTP

### 4. Verify Deployment
Run the test script:
```bash
node scripts/test-vercel-deployment.js
```

## 🔍 How It Works

1. **User submits form** → Frontend sends to `/api/send-estimate`
2. **Vercel API route** receives the request
3. **ActivePieces webhook** is called (always works)
4. **Email notifications** are sent (if configured)
5. **Success response** is returned to user

## 📁 File Structure

```
/api/
  send-estimate.js          # Main API endpoint
  lib/
    email-templates.js      # Email HTML templates

/src/
  lib/
    estimate-api.ts         # Frontend API service
  pages/
    Estimate.tsx            # Estimate form component
```

## 🚨 Important Notes

1. **The form works without email setup** - ActivePieces webhook is the primary method
2. **Email is optional** - You can add it later by setting environment variables
3. **CORS is configured** - Accepts requests from devtone.agency and localhost

## 🧪 Testing

### Local Testing
```bash
npm run dev
# Visit http://localhost:5173/estimate
```

### Production Testing
1. Visit https://devtone.agency/estimate
2. Submit a test form
3. Check ActivePieces dashboard for the submission

## 🛠️ Troubleshooting

### Form shows "Failed to submit"
- Check browser console for errors
- Verify ActivePieces webhook is accessible
- Check Vercel function logs

### No emails received
- Verify environment variables in Vercel
- Check if email service is configured in `/api/send-estimate.js`
- Review Vercel function logs

### CORS errors
- Ensure the domain is listed in the allowed origins in `/api/send-estimate.js`

## 📞 Support

Need help? Contact:
- Email: team@devtone.agency
- WhatsApp: +1 917-741-3468