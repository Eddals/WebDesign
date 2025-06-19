# IONOS Email Configuration for DevTone

This guide provides specific instructions for setting up IONOS email with your DevTone estimate forms.

## IONOS SMTP Settings

```
SMTP Server: smtp.ionos.com
Port: 587
Security: STARTTLS (TLS/SSL)
Authentication: Required
```

## Quick Setup

### Option 1: Use the Setup Wizard (Recommended)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the email setup wizard:
   ```bash
   npm run setup:email
   ```

3. Select option `1` for IONOS

4. Enter your IONOS email credentials:
   - Email address: your-email@yourdomain.com
   - Password: Your IONOS email password

### Option 2: Manual Configuration

1. Create or edit your `server/.env` file:

```env
# SMTP Configuration for IONOS
SMTP_HOST=smtp.ionos.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-ionos-password

# Email Recipients
ESTIMATE_RECIPIENT_EMAIL=your-email@yourdomain.com

# Estimate API Configuration
ESTIMATE_API_PORT=3002
```

2. Replace:
   - `your-email@yourdomain.com` with your actual IONOS email address
   - `your-ionos-password` with your IONOS email password

## Testing Your Configuration

1. Test the email setup:
   ```bash
   cd server
   npm run test:email
   ```

2. If successful, you should receive a test email at your configured address.

## Starting the Email Service

To start the email API server:

```bash
cd server
npm run start:estimate
```

Or to start all services (Stripe + Email):

```bash
cd server
npm run start:all
```

## Troubleshooting IONOS

### Common Issues

1. **Authentication Failed**
   - Ensure you're using your full email address as the username
   - Double-check your password
   - Make sure your IONOS email account is active

2. **Connection Timeout**
   - Verify your firewall isn't blocking port 587
   - Check if your ISP blocks SMTP connections
   - Try using a VPN if needed

3. **SSL/TLS Errors**
   - IONOS uses STARTTLS on port 587
   - Make sure `SMTP_SECURE=false` in your .env (this enables STARTTLS)
   - Don't use port 465 with IONOS

### IONOS-Specific Notes

- IONOS requires authentication for all SMTP connections
- The username must be your complete email address
- IONOS has sending limits (typically 500 emails per hour)
- For bulk sending, consider IONOS's dedicated email marketing services

## Security Recommendations

1. **Use environment variables** - Never hardcode credentials
2. **Limit access** - Restrict who can access your .env file
3. **Monitor usage** - Check your IONOS email logs regularly
4. **Use dedicated email** - Create a specific email for form notifications

## Support

- IONOS Support: https://www.ionos.com/help
- IONOS Email Settings: https://www.ionos.com/help/email/
- DevTone Issues: Check the server logs for detailed error messages