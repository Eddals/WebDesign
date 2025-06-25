# Setting Up Email Notifications with ActivePieces

## Overview

Your estimate form is already sending data to ActivePieces. Now you need to configure ActivePieces to send email notifications.

## Step 1: Access Your ActivePieces Flow

1. Log in to [ActivePieces](https://cloud.activepieces.com)
2. Find your webhook flow (the one receiving estimate data)

## Step 2: Add Email Actions

### Add Gmail/SMTP Action for Admin Notification

1. Click the **+** button after your webhook trigger
2. Search for **Gmail** or **SMTP** 
3. Configure the action:

**For Gmail:**
- Connect your Gmail account
- Set up the email:
  ```
  To: team@devtone.agency
  Subject: New Estimate: {{nome}} - {{tipo_projeto}}
  Body: (use the template below)
  ```

**Admin Email Template:**
```html
<h2>New Estimate Request</h2>

<h3>Client Information</h3>
<ul>
  <li><strong>Name:</strong> {{nome}}</li>
  <li><strong>Email:</strong> {{email}}</li>
  <li><strong>Phone:</strong> {{telefone}}</li>
  <li><strong>Company:</strong> {{empresa}}</li>
  <li><strong>Country:</strong> {{pais}}</li>
  <li><strong>Industry:</strong> {{industria}}</li>
</ul>

<h3>Project Details</h3>
<ul>
  <li><strong>Project Type:</strong> {{tipo_projeto}}</li>
  <li><strong>Budget:</strong> {{orcamento}}</li>
  <li><strong>Timeline:</strong> {{prazo}}</li>
  <li><strong>Features:</strong> {{recursos}}</li>
</ul>

<h3>Description</h3>
<p>{{mensagem}}</p>

<h3>Metadata</h3>
<ul>
  <li><strong>Submitted:</strong> {{timestamp}}</li>
  <li><strong>Source:</strong> {{fonte}}</li>
</ul>

<p><a href="mailto:{{email}}">Reply to Client</a></p>
```

### Add Client Confirmation Email

1. Add another Gmail/SMTP action
2. Configure:
  ```
  To: {{email}}
  Subject: We received your estimate request - DevTone
  Body: (use the template below)
  ```

**Client Email Template:**
```html
<h2>Thank You, {{nome}}!</h2>

<p>We've received your estimate request for your {{tipo_projeto}} project.</p>

<h3>What Happens Next?</h3>

<ol>
  <li><strong>Project Review (2-4 hours)</strong><br>
  Our team will review your requirements.</li>
  
  <li><strong>Custom Proposal (Within 24 hours)</strong><br>
  You'll receive a detailed proposal with pricing.</li>
  
  <li><strong>Consultation Call (Within 48 hours)</strong><br>
  We'll schedule a call to discuss your project.</li>
</ol>

<h3>Your Project Summary:</h3>
<ul>
  <li>Project Type: {{tipo_projeto}}</li>
  <li>Budget: {{orcamento}}</li>
  <li>Timeline: {{prazo}}</li>
</ul>

<p>Need to reach us sooner?</p>
<ul>
  <li>WhatsApp: <a href="https://wa.me/19177413468">+1 917-741-3468</a></li>
  <li>Email: <a href="mailto:team@devtone.agency">team@devtone.agency</a></li>
</ul>

<p>Best regards,<br>
The DevTone Team<br>
<a href="https://devtone.agency">devtone.agency</a></p>
```

## Step 3: Alternative Email Services in ActivePieces

Instead of Gmail, you can use:

1. **SendGrid** - Professional email service
2. **Mailgun** - Reliable transactional emails
3. **SMTP** - Any email provider
4. **Resend** - Modern email API

## Step 4: Test Your Flow

1. Submit a test form on your website
2. Check if emails are sent
3. Check ActivePieces logs for any errors

## Troubleshooting

### Emails not sending?

1. **Check ActivePieces logs** - Look for error messages
2. **Verify email connection** - Re-authenticate if needed
3. **Check spam folder** - Emails might be filtered
4. **Use different sender** - Try a different email service

### Gmail limits

Gmail has sending limits:
- 500 emails/day for regular accounts
- 2000 emails/day for Google Workspace

For high volume, use SendGrid or Mailgun.

## Current Setup

Your form is sending this data to ActivePieces:
- `nome` - Client name
- `email` - Client email
- `telefone` - Phone number
- `empresa` - Company
- `pais` - Country
- `industria` - Industry
- `tipo_projeto` - Project type
- `orcamento` - Budget
- `prazo` - Timeline
- `mensagem` - Description
- `recursos` - Features
- `timestamp` - Submission time
- `fonte` - Source (always "devtone-website")

## Need Help?

1. Check ActivePieces documentation
2. Contact ActivePieces support
3. Or reach out to us:
   - Email: team@devtone.agency
   - WhatsApp: +1 917-741-3468