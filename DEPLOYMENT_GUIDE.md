# 🚀 Deployment Guide - Email Automation

You have several options for deploying your email automation system. Choose based on your needs:

## Option 1: **Vercel** (Recommended) ✨

### Pros:
- Free tier available
- Automatic deployments from GitHub
- Serverless functions included
- No server management needed

### Setup:
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=team@devtone.agency
   SMTP_PASS=your-app-password
   ESTIMATE_RECIPIENT_EMAIL=team@devtone.agency
   ```

4. **Update your estimate API URL**:
   ```typescript
   // In src/lib/estimate-api.ts
   const API_URL = 'https://your-app.vercel.app/api/estimate';
   ```

## Option 2: **EmailJS** (No Server Needed!) 🎯

### Pros:
- Works entirely in the browser
- No server or backend needed
- Free tier: 200 emails/month
- Very easy setup

### Setup:
1. **Sign up** at [EmailJS](https://www.emailjs.com)

2. **Create an email service** (Gmail, Outlook, etc.)

3. **Create an email template** with variables:
   ```
   Subject: New Estimate Request from {{from_name}}
   
   Body:
   Name: {{from_name}}
   Email: {{from_email}}
   Project Type: {{project_type}}
   Budget: {{budget}}
   Timeline: {{timeline}}
   Description: {{description}}
   ```

4. **Update your code**:
   ```typescript
   // In src/pages/Estimate.tsx
   import emailjs from '@emailjs/browser';
   
   // In handleSubmit function
   emailjs.send(
     'YOUR_SERVICE_ID',
     'YOUR_TEMPLATE_ID',
     formData,
     'YOUR_PUBLIC_KEY'
   );
   ```

5. **Add to index.html**:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```

## Option 3: **Formspree** (Simple Form Handler) 📧

### Pros:
- No coding required
- 50 submissions/month free
- Spam protection included

### Setup:
1. **Sign up** at [Formspree](https://formspree.io)

2. **Create a form** and get your endpoint

3. **Update estimate-api.ts**:
   ```typescript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(formData)
   });
   ```

## Option 4: **Netlify** (With Functions)

### Setup:
1. **Deploy to Netlify**:
   ```bash
   npm install netlify-cli -g
   netlify deploy
   ```

2. **Environment variables** in Netlify dashboard

3. **Functions automatically deployed** from `netlify/functions/`

## Option 5: **Railway/Render** (Full Node.js Server)

### For Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### Environment Setup:
```bash
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_USER=team@devtone.agency
railway variables set SMTP_PASS=your-app-password
```

## 🎯 Quick Recommendation

**For immediate deployment with zero server management:**

1. Use **EmailJS** - it's the fastest to set up
2. Sign up at https://www.emailjs.com
3. Follow their React guide
4. You'll be live in 10 minutes!

**For production with more control:**
- Use **Vercel** with serverless functions
- Better for scaling and custom logic

## 📝 Update Your Code

After choosing a service, update `src/lib/estimate-api.ts`:

```typescript
// For EmailJS (no server needed)
export const submitEstimate = async (formData: EstimateFormData) => {
  // Send via EmailJS
  const result = await emailjs.send(
    'service_id',
    'template_id',
    formData,
    'public_key'
  );
  
  // Still send to ActivePieces if needed
  await sendToActivePieces(formData);
  
  return { success: true };
};
```

## 🔒 Security Notes

1. **Never expose SMTP passwords** in client-side code
2. **Use environment variables** for all sensitive data
3. **Enable rate limiting** to prevent spam
4. **Add CAPTCHA** for production sites

## 🚀 Deployment Checklist

- [ ] Choose deployment platform
- [ ] Set up environment variables
- [ ] Update API endpoints in code
- [ ] Test email delivery
- [ ] Add error handling
- [ ] Set up monitoring/alerts
- [ ] Configure custom domain

## Need Help?

The easiest path is:
1. **EmailJS** for immediate deployment (no server)
2. **Vercel** for professional deployment (with server)
3. **Formspree** for simple form handling

All options will work 24/7 without you needing to manage a server!