# Email Deliverability Guide for DevTone

## Why Gmail Marks Your Emails as Suspicious

Gmail uses sophisticated filters to protect users from spam. New domains without proper authentication are often flagged.

## Immediate Actions Required

### 1. Add SPF Record (Do This First!)
Add this TXT record to devtone.agency DNS:
```
v=spf1 include:_spf.perfora.net include:_spf.kundenserver.de ~all
```

This tells Gmail that IONOS is authorized to send emails for devtone.agency.

### 2. Enable DKIM (Do This Second)
1. Log into IONOS
2. Go to Email → Settings → Domain Authentication
3. Enable DKIM
4. Add the provided records to your DNS

### 3. Add DMARC Record (Optional but Recommended)
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:team@devtone.agency
```

## Timeline
- SPF: Works within 1-4 hours
- DKIM: Works within 4-24 hours
- Full reputation: Builds over 2-4 weeks

## Alternative Solutions

### Option 1: Use Gmail SMTP (Immediate Fix)
```javascript
// Use Gmail's servers which have established reputation
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

### Option 2: Use Email Service Provider
- SendGrid (10,000 free emails/month)
- Mailgun (5,000 free emails/month)
- Amazon SES (62,000 free emails/month)

These services have established reputations and better deliverability.

## Testing Your Fix

After adding SPF records:
1. Wait 1-2 hours for DNS propagation
2. Send a test email
3. Check spam score at: https://www.mail-tester.com/

## Building Email Reputation

1. **Warm up slowly**: Start with low volume
2. **Consistent sending**: Regular email patterns
3. **Engagement**: Encourage replies
4. **Clean lists**: Only send to valid addresses
5. **Professional content**: Avoid spam triggers

## Spam Trigger Words to Avoid
- "Free", "Guarantee", "No obligation"
- Excessive capitals or exclamation marks
- Too many links or images
- Poor HTML formatting

## Professional Email Tips
1. Always include unsubscribe option
2. Use consistent "From" name
3. Include physical address
4. Keep image-to-text ratio balanced
5. Test emails before sending

## Monitoring Tools
- Google Postmaster Tools: https://postmaster.google.com/
- MXToolbox: https://mxtoolbox.com/
- Mail-tester: https://www.mail-tester.com/

## Expected Results After DNS Setup
- Week 1: Emails may still go to spam occasionally
- Week 2-3: Improvement in delivery
- Week 4+: Established reputation, consistent inbox delivery

Remember: Email reputation is built over time. Be patient and consistent!