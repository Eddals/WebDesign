# Email Automation System Guide

## Overview
The DevTone estimate form now includes a comprehensive email automation system that sends notifications when someone submits an estimate request.

## How It Works

### 1. Form Submission
When a user submits the estimate form at `/estimate`, the system:
- Validates all form data
- Sends data to ActivePieces webhook for additional automation
- Triggers email notifications via SMTP

### 2. Email Notifications

#### Admin Notification (team@devtone.agency)
The admin receives a detailed email with:
- **Priority Indicator**: 
  - 🔥 HIGH PRIORITY: Enterprise budget or ASAP timeline
  - ⭐ PRIORITY: Premium budget
  - 📋 STANDARD: Other requests
- **Lead Summary**: Quick overview with name, company, country, and project type
- **Contact Information**: All provided contact details
- **Project Details**: Formatted budget range, timeline, and features
- **Project Description**: Full description from the form
- **Quick Actions**: 
  - Pre-filled email template button for quick response
  - Direct call button (if phone provided)
- **Response Tips**: Best practices for converting the lead

#### Client Confirmation Email
The client receives:
- Personalized greeting
- Summary of their submission
- Clear timeline of next steps:
  1. Immediate Review (2-4 hours)
  2. Custom Proposal (Within 24 hours)
  3. Strategy Session (Within 48 hours)
  4. Fast-Track Development
- Contact information for immediate assistance
- Helpful resources and links
- Project-specific content (e.g., e-commerce expertise for online stores)

## Email Configuration

### SMTP Settings (server/.env)
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=team@devtone.agency
SMTP_PASS=your-app-password

# Email Recipients
ESTIMATE_RECIPIENT_EMAIL=team@devtone.agency
CONTACT_RECIPIENT_EMAIL=team@devtone.agency
```

### Testing the System

1. **Test Individual Emails**:
   ```bash
   cd server
   node test-enhanced-emails.js
   ```

2. **Start the API Server**:
   ```bash
   cd server
   npm run start:estimate
   ```

3. **Test Full Flow**:
   - Submit a test form at https://devtone.agency/estimate
   - Check team@devtone.agency for admin notification
   - Check the email you provided for client confirmation

## Features

### Smart Subject Lines
- Includes priority indicator
- Shows project type
- Displays budget range
- Example: "🔥 HIGH PRIORITY New ecommerce Project - John Smith ($15,000+)"

### Quick Response Template
The admin email includes a "Reply with Template" button that opens their email client with:
- Pre-filled subject line
- Personalized greeting
- Reference to specific requirements
- Call-to-action for scheduling a call

### Industry-Specific Content
Based on the project type selected:
- **E-commerce**: Highlights conversion optimization and sales growth
- **Web Application**: Emphasizes scalability and technology
- **Business Website**: Focuses on credibility and lead generation

### Visual Design
- Clean, modern HTML emails
- Mobile-responsive design
- DevTone branding with logo
- Clear visual hierarchy
- Action buttons for CTAs

## Troubleshooting

### Emails Not Sending
1. Check SMTP credentials in server/.env
2. Ensure the estimate API is running: `npm run start:estimate`
3. Check server logs for error messages
4. Verify Gmail app password is correct

### Testing Without Sending Real Emails
Use the test script with a test email address:
```bash
node server/test-enhanced-emails.js
```

## Next Steps

The system is now fully automated. When someone submits an estimate:
1. They receive immediate confirmation
2. Team receives detailed notification at team@devtone.agency
3. Team can quickly respond using the template
4. All data is also sent to ActivePieces for additional automation

For any issues or modifications, check the email templates in `server/email-service.js`.