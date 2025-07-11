# Contact Form Email Setup with Resend

This document explains how the contact form email system works using Resend for email delivery.

## Overview

The contact form now uses Resend to send email notifications when someone submits a contact request. This ensures reliable email delivery with better tracking and monitoring capabilities.

## Features

- **Dual Email Notifications**: Sends emails to both the customer and admin
- **Beautiful HTML Templates**: Professional email templates with responsive design
- **Error Handling**: Graceful fallback if email service is temporarily unavailable
- **CORS Support**: Works with both local development and production environments
- **Analytics Integration**: Tracks form submissions in Google Analytics

## Configuration

### 1. Resend API Key

The Resend API key is already configured in the code:
```
re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR
```

### 2. Environment Variables

Set the following in your `.env` file:
```env
# Admin email for notifications
ADMIN_EMAIL=team@devtone.agency
```

### 3. Domain Configuration

Make sure the sending domain (`devtone.agency`) is verified in your Resend dashboard.

## How It Works

### 1. Form Submission Flow

1. User fills out the contact form on the website
2. Form data is sent to `/api/contact` endpoint
3. The API validates the data and sends two emails:
   - **Customer Email**: Confirmation that their message was received
   - **Admin Email**: Notification with the contact details

### 2. Email Templates

#### Customer Email Features:
- Personalized greeting with the customer's name
- Summary of their submitted message
- Clear timeline of what happens next
- Contact information for immediate assistance
- Professional design with DevTone branding

#### Admin Email Features:
- Complete contact information
- Message details with formatting preserved
- Quick action buttons (Reply, Call, View in Dashboard)
- Submission metadata (time, IP address)
- Clean, scannable layout

### 3. API Endpoints

**Production**: `https://devtone.agency/api/contact`
**Development**: `http://localhost:3000/api/contact`

The ContactForm component automatically detects the environment and uses the appropriate endpoint.

## Testing

### 1. Test the Contact Form

Open `test-contact-form.html` in a browser to test the form:
```bash
open test-contact-form.html
```

### 2. Test Email Delivery

Run the test script to verify Resend is working:
```bash
node scripts/test-contact-email.js
```

### 3. Local Development

To test locally with the Vercel dev server:
```bash
vercel dev
```

Then access the contact form at `http://localhost:3000`

## Email Examples

### Customer Email Preview
- Subject: "✨ We Received Your Message - DevTone Agency"
- Includes message summary and next steps
- Professional design with clear CTAs

### Admin Email Preview
- Subject: "📬 New Contact Form: [Name] - [Subject]"
- Complete contact details
- Quick action buttons
- Formatted message content

## Troubleshooting

### Common Issues

1. **Emails not being received**
   - **Check spam/junk folder** - Emails from `onboarding@resend.dev` might go to spam
   - **Verify email address** - Make sure the recipient email is correct
   - **Check Resend dashboard** - View email logs at https://resend.com/emails
   - **Wait a few minutes** - Sometimes there's a slight delay in delivery
   - **Test with different email** - Try Gmail, Outlook, etc.

2. **Emails not sending from API**
   - Verify the Resend API key is correct: `re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR`
   - Check rate limits - Resend allows 2 emails per second
   - Ensure you have sufficient credits in your Resend account
   - Run test script: `node scripts/debug-resend-email.js`

3. **CORS errors**
   - Make sure the origin is included in the allowed origins list
   - Check if the API endpoint URL is correct
   - For local testing, use `vercel dev` instead of `npm run dev`

4. **Form submission fails**
   - Verify all required fields are filled
   - Check browser console for errors
   - Ensure the API is deployed and running
   - Test API directly: `node scripts/test-contact-api.js`

### Quick Test Commands

```bash
# Test Resend email delivery
node scripts/debug-resend-email.js

# Send a test email to your address
# First edit the YOUR_EMAIL variable in the script
node scripts/send-test-email-now.js

# Test the contact API endpoint
node scripts/test-contact-api.js

# Test with the HTML form
open test-contact-form.html
```

### Email Not in Inbox?

1. **Check these folders:**
   - Spam/Junk
   - Promotions (Gmail)
   - Other/Updates tabs
   - All Mail

2. **Whitelist the sender:**
   - Add `onboarding@resend.dev` to contacts
   - Mark as "Not Spam" if found in spam

3. **For production:**
   - Verify your own domain in Resend
   - Update from address to use your domain
   - This improves deliverability significantly

### Debug Mode

The API includes console logging for debugging:
- Form submission details
- Email send status
- Error messages with details

## Monitoring

### Resend Dashboard
Monitor email delivery at: https://resend.com/emails

### Analytics
Form submissions are tracked in Google Analytics:
- Event: `contact_form_submission`
- Category: `engagement`
- Label: Subject of the message

## Security

- API key is stored securely in environment variables
- CORS is configured to only allow specific origins
- Input validation prevents malicious submissions
- Rate limiting should be configured in Vercel

## Maintenance

### Updating Email Templates
Email templates are located in:
`/api/lib/email-templates.js`

### Changing Admin Email
Update the `ADMIN_EMAIL` environment variable in Vercel dashboard

### Adding New Fields
1. Update the ContactForm component
2. Update the email templates
3. Update the API to handle new fields

## Support

For issues or questions:
- Email: team@devtone.agency
- Check Resend status: https://status.resend.com/