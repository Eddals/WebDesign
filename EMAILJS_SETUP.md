# 📧 EmailJS Setup Guide for DevTone

## Step 1: Create Your EmailJS Account

1. Go to https://www.emailjs.com
2. Click "Sign Up Free"
3. Verify your email

## Step 2: Add Email Service (Gmail)

1. In EmailJS Dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"**
4. Click **"Connect Account"**
5. Sign in with your Gmail account (team@devtone.agency)
6. Name your service (e.g., "DevTone Gmail")
7. Click **"Create Service"**
8. Copy your **Service ID** (looks like: `service_abc123`)

## Step 3: Create Email Template

1. Click **"Email Templates"** in the dashboard
2. Click **"Create New Template"**
3. Set up your template:

### Template Settings:
- **Name**: Estimate Request Notification
- **To Email**: team@devtone.agency
- **From Name**: {{from_name}}
- **From Email**: {{from_email}}
- **Reply To**: {{from_email}}

### Subject Line:
```
New Estimate Request from {{from_name}} - {{project_type}}
```

### Email Content (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; margin-left: 10px; }
    .highlight { background: #e9d5ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New Estimate Request</h1>
      <p>You have received a new project inquiry!</p>
    </div>
    
    <div class="content">
      <div class="highlight">
        <h2>Contact Information</h2>
        <div class="field">
          <span class="label">Name:</span>
          <span class="value">{{from_name}}</span>
        </div>
        <div class="field">
          <span class="label">Email:</span>
          <span class="value"><a href="mailto:{{from_email}}">{{from_email}}</a></span>
        </div>
        <div class="field">
          <span class="label">Phone:</span>
          <span class="value">{{phone}}</span>
        </div>
        <div class="field">
          <span class="label">Company:</span>
          <span class="value">{{company}}</span>
        </div>
        <div class="field">
          <span class="label">Country:</span>
          <span class="value">{{country}}</span>
        </div>
        <div class="field">
          <span class="label">Industry:</span>
          <span class="value">{{industry}}</span>
        </div>
      </div>
      
      <div class="highlight">
        <h2>Project Details</h2>
        <div class="field">
          <span class="label">Project Type:</span>
          <span class="value">{{project_type}}</span>
        </div>
        <div class="field">
          <span class="label">Budget:</span>
          <span class="value">{{budget_formatted}}</span>
        </div>
        <div class="field">
          <span class="label">Timeline:</span>
          <span class="value">{{timeline_formatted}}</span>
        </div>
        <div class="field">
          <span class="label">Features:</span>
          <span class="value">{{features}}</span>
        </div>
      </div>
      
      <div class="highlight">
        <h2>Project Description</h2>
        <p>{{description}}</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="mailto:{{from_email}}" style="background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reply to Client</a>
      </div>
    </div>
  </div>
</body>
</html>
```

4. Click **"Save"**
5. Copy your **Template ID** (looks like: `template_xyz789`)

## Step 4: Get Your Public Key

1. Go to **"Account"** → **"API Keys"**
2. Copy your **Public Key** (looks like: `AbCdEfGhIjKlMnOpQr`)

## Step 5: Update Your Code

Update `src/config/emailjs.ts` with your actual values:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_YOUR_ID',  // Replace with your Service ID
  TEMPLATE_ID: 'template_YOUR_ID', // Replace with your Template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',   // Replace with your Public Key
};
```

## Step 6: Test Your Setup

1. Go to your website's estimate page
2. Fill out the form
3. Submit it
4. Check team@devtone.agency for the email

## 🎯 Auto-Reply Template (Optional)

Create another template for client confirmation:

1. Create new template called "Client Confirmation"
2. **To Email**: {{from_email}}
3. **Subject**: We received your estimate request!
4. **Content**: Thank you message with next steps

Then add to your code:
```typescript
// Send confirmation to client
await emailjs.send(
  EMAILJS_CONFIG.SERVICE_ID,
  'template_client_confirm', // Your auto-reply template ID
  { 
    to_email: formData.email,
    from_name: formData.name 
  }
);
```

## 📊 EmailJS Dashboard Features

- **Email History**: See all sent emails
- **Analytics**: Track open rates
- **Logs**: Debug any issues
- **Rate Limits**: 200 emails/month on free plan

## 🚨 Troubleshooting

If emails aren't sending:
1. Check browser console for errors
2. Verify all IDs are correct
3. Check EmailJS dashboard logs
4. Make sure you're not exceeding rate limits

## 🔒 Security Notes

- Public key is safe to expose (it's meant to be public)
- Never expose your private key
- EmailJS handles all SMTP authentication server-side
- Your Gmail password is never exposed

## Need More Emails?

Free plan: 200 emails/month
Paid plans start at $9/month for 1,000 emails

That's it! Your form now sends emails without any server! 🎉