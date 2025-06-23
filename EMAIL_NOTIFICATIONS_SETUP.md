# Email Notifications Setup

This document explains the complete email notification system for both Contact and Estimate forms.

## Overview

When users submit either the Contact form or Estimate form on your website, they will receive:
1. **Immediate confirmation email** - Acknowledging their submission
2. **Admin notification** - Sent to sweepeasellc@gmail.com with all details

## Email Flow

### Contact Form Submissions
1. User fills out contact form with:
   - Name
   - Email
   - Phone (optional)
   - Subject
   - Message

2. Two emails are sent:
   - **To Admin (sweepeasellc@gmail.com)**: Full contact details and message
   - **To User**: Confirmation with their message summary and next steps

### Estimate Form Submissions
1. User fills out estimate form with:
   - Name, Email, Phone
   - Service Type
   - Project Description
   - Budget & Timeline
   - Additional details

2. Two emails are sent:
   - **To Admin (sweepeasellc@gmail.com)**: Complete estimate request details
   - **To User**: Confirmation with project summary and next steps

## Configuration

All email settings are in `/server/.env`:

```env
# SMTP Configuration (IONOS)
SMTP_HOST=smtp.ionos.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=team@devtone.agency
SMTP_PASS=Alebaba1!

# Email Recipients
ESTIMATE_RECIPIENT_EMAIL=sweepeasellc@gmail.com
CONTACT_RECIPIENT_EMAIL=sweepeasellc@gmail.com
```

## Running the Services

### Start All Services (Recommended)
```bash
cd server
npm run start:all
```

This starts:
- Stripe API (port 3001)
- Estimate API (port 3002)
- Contact API (port 3003)

### Start Individual Services
```bash
# Contact form emails only
npm run start:contact

# Estimate form emails only
npm run start:estimate
```

## Email Templates

### Admin Notifications Include:
- Professional HTML formatting
- All form fields clearly displayed
- Direct reply-to client's email
- Timestamp of submission
- Call-to-action reminders

### User Confirmations Include:
- Thank you message
- Summary of their submission
- Clear next steps
- Expected response time (24 hours)
- Contact information for urgent matters
- Links to helpful resources

## Testing

### Test Contact Form Email
1. Go to your Contact page
2. Fill out the form
3. Submit
4. Check sweepeasellc@gmail.com for admin notification
5. Check the email you provided for confirmation

### Test Estimate Form Email
1. Go to your Estimate page
2. Fill out the form
3. Submit
4. Check sweepeasellc@gmail.com for admin notification
5. Check the email you provided for confirmation

## Troubleshooting

### Emails Not Sending
1. Check server logs for errors
2. Verify SMTP credentials are correct
3. Ensure servers are running (ports 3002 & 3003)
4. Check spam folders

### Authentication Errors
- IONOS may require app-specific passwords
- Check if account has 2FA enabled
- Verify email account is not locked

### CORS Issues
- Frontend URLs are whitelisted in both APIs
- Check browser console for specific errors

## Features

- **Rate Limiting**: 5 submissions per IP per 15 minutes (prevents spam)
- **Input Validation**: Email format and required fields
- **Error Handling**: Graceful failures with user feedback
- **Responsive Design**: Email templates work on all devices
- **Professional Branding**: Consistent DevTone styling

## Next Steps Configuration

Both confirmation emails tell users:
1. Their request was received
2. Team will review within 24 hours
3. They'll receive a detailed response
4. Can call +1 917-741-3468 for urgent matters

This sets clear expectations and reduces follow-up inquiries.