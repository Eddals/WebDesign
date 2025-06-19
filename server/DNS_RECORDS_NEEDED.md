# DNS Records Needed for Email Delivery

To ensure emails from team@devtone.agency reach Gmail and other providers, add these DNS records to your domain:

## 1. SPF Record (Required)
Add a TXT record to your domain:
```
Type: TXT
Host: @ (or leave blank)
Value: v=spf1 include:_spf.perfora.net include:_spf.kundenserver.de ~all
```

## 2. DKIM Record (Recommended)
IONOS should provide DKIM settings in your email control panel. Look for:
- DKIM or "Domain Authentication"
- The record will look like: `default._domainkey`

## 3. DMARC Record (Optional but helps)
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:team@devtone.agency
```

## How to Add These Records

### If using IONOS for DNS:
1. Log into your IONOS account
2. Go to Domains & SSL → Your Domain → DNS Settings
3. Add the SPF record as a TXT record
4. Look for email authentication settings for DKIM

### If using another DNS provider:
Add the SPF record as shown above in your DNS management panel.

## Verify Your Records

After adding, verify with:
- https://mxtoolbox.com/spf.aspx
- https://www.mail-tester.com/

## Why This Matters

Without SPF records, Gmail and other providers may:
- Send your emails to spam
- Block them entirely
- Mark them as suspicious

SPF tells receiving servers that IONOS (perfora.net) is authorized to send email for devtone.agency.