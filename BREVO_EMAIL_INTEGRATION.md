# Brevo Email Integration for Estimate Form

## Overview
This integration automatically sends emails when someone submits an estimate request through the DevTone website. It uses Brevo (formerly Sendinblue) as the email service provider.

## Configuration

### Brevo Settings
- **API Key**: `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`
- **SMTP Server**: `smtp-relay.brevo.com`
- **SMTP Port**: `587`
- **SMTP Login**: `91558b001@smtp-brevo.com`
- **Team Email**: `team@devtone.agency`

### Email Templates
- **Template ID #2**: Both team notification and client confirmation emails

## How It Works

### 1. Form Submission
When a user submits the estimate form, the data is sent to `/api/estimate-brevo`

### 2. Email Notifications
The system sends two emails:

#### A. Team Notification Email
- **To**: `team@devtone.agency`
- **Subject**: `New Estimate Request - [Name] from [Company]`
- **Content**: Detailed project information including:
  - Contact details
  - Project specifications
  - Budget and timeline
  - Requested features
  - Project description

#### B. Client Confirmation Email
- **To**: Client's email address
- **Subject**: `Thank you for your estimate request - DevTone Agency`
- **Content**: Professional confirmation with:
  - Thank you message
  - Next steps timeline
  - Project summary
  - Contact information

## Files Created/Modified

### New Files
- `src/pages/api/estimate-brevo.ts` - API endpoint for handling form submissions
- `src/config/brevo.ts` - Configuration file for Brevo settings
- `scripts/test-brevo-integration.js` - Test script to verify integration
- `BREVO_EMAIL_INTEGRATION.md` - This documentation

### Modified Files
- `src/pages/Estimate.tsx` - Updated to use new Brevo API endpoint
  - Removed country field
  - Updated form submission to use `/api/estimate-brevo`
  - Removed old estimate API import

## Testing the Integration

### Run the Test Script
```bash
node scripts/test-brevo-integration.js
```

This will send a test email to `team@devtone.agency` to verify the integration is working.

### Test the Form
1. Fill out the estimate form on your website
2. Submit the form
3. Check that both emails are received:
   - Team notification at `team@devtone.agency`
   - Client confirmation at the email used in the form

## Email Templates

### Template ID #2 (Both Team and Client Emails)
Both the team notification and client confirmation emails use Brevo template ID #2.

#### Parameters passed:
- `NAME`: Client's full name
- `EMAIL`: Client's email address
- `PHONE`: Client's phone number
- `COMPANY`: Client's company name
- `INDUSTRY`: Client's business industry
- `PROJECT_TYPE`: Type of project requested
- `BUDGET`: Budget range selected
- `TIMELINE`: Project timeline
- `RETAINER`: Monthly retainer option
- `FEATURES`: Requested features (comma-separated)
- `DESCRIPTION`: Project description
- `SUBMISSION_DATE`: Date and time of submission
- `SOURCE`: Source of the request (differentiated for team vs client)

#### Email Types:
1. **Team Notification**: Sent to `team@devtone.agency` with `SOURCE: 'Estimate Form'`
2. **Client Confirmation**: Sent to client's email with `SOURCE: 'Estimate Form - Client Confirmation'`

## Security Notes

### API Key Protection
- The API key is stored in the configuration file
- For production, consider using environment variables
- The key has permissions only for sending emails

### Data Validation
- All required fields are validated before sending emails
- Email addresses are validated
- XSS protection through proper HTML escaping

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check API key validity
   - Verify Brevo account status
   - Check server logs for errors

2. **Form submission fails**
   - Ensure all required fields are filled
   - Check browser console for JavaScript errors
   - Verify API endpoint is accessible

3. **Emails going to spam**
   - Ensure proper sender configuration
   - Use consistent branding
   - Include unsubscribe links (if required by law)

### Debug Steps
1. Run the test script to verify Brevo connection
2. Check browser network tab during form submission
3. Review server logs for API errors
4. Verify email addresses are correct

## Future Enhancements

### Potential Improvements
- Add email tracking and analytics
- Implement email templates in Brevo dashboard
- Add automated follow-up sequences
- Include file upload capabilities
- Add email preferences management

### Environment Variables
For production deployment, move sensitive data to environment variables:
```env
BREVO_API_KEY=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
BREVO_TEAM_EMAIL=team@devtone.agency
```

## Support
For issues with the Brevo integration, check:
1. Brevo API documentation
2. Server logs for detailed error messages
3. Network tab in browser developer tools
4. Email delivery status in Brevo dashboard 