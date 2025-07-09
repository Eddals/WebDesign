# 🔧 Email Delivery Troubleshooting Guide

## 🚨 Issue: Not Receiving Estimate Emails

### ✅ Fixes Applied

1. **Changed Sender Email**: 
   - ❌ Old: `noreply@devtone.agency` (likely not verified)
   - ✅ New: `team@devtone.agency` (more likely to be verified)

2. **Improved Email Content**: 
   - ✅ Professional HTML template
   - ✅ Better formatting and styling
   - ✅ Clear call-to-action

3. **Enhanced Subject Line**:
   - ❌ Old: `Confirmação de Orçamento - ${projectType}`
   - ✅ New: `Estimate Confirmation - ${projectType}`

## 🧪 Testing Tools Created

### 1. Debug Test Page
**File**: `test-brevo-email-debug.html`
- Tests different sender emails
- Direct Brevo API testing
- Detailed error reporting

### 2. Quick Node.js Test
**File**: `test-estimate-quick.js`
- Simple command-line test
- Run with: `node test-estimate-quick.js`

## 🔍 Diagnostic Steps

### Step 1: Test the API Directly
```bash
# Make sure your Next.js server is running
npm run dev

# Then test with curl:
curl -X POST http://localhost:3000/api/estimate-brevo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your-email@example.com",
    "phone": "(555) 123-4567",
    "company": "Test Company",
    "industry": "Technology",
    "projectType": "business",
    "budget": "$1,500 - $5,000",
    "timeline": "1 Month",
    "description": "Test email",
    "features": ["contact_form"],
    "retainer": "none"
  }'
```

### Step 2: Check Server Logs
Look for these log messages in your Next.js console:
- ✅ `📥 Dados recebidos na API:`
- ✅ `🔑 Usando API Key: Configurada`
- ✅ `📧 Preparando envio de email para:`
- ✅ `📤 Status da resposta Brevo: 201`
- ✅ `Email enviado com sucesso via Brevo:`

### Step 3: Use Debug Test Page
1. Open `test-brevo-email-debug.html` in your browser
2. Enter your email address
3. Test different sender emails
4. Try the "Direct Brevo API" test

## 🎯 Common Issues & Solutions

### Issue 1: Sender Email Not Verified
**Symptoms**: API returns success but no email received
**Solution**: 
- ✅ Changed to `team@devtone.agency`
- Verify sender email in Brevo dashboard

### Issue 2: Email Going to Spam
**Symptoms**: Email sent but not in inbox
**Solution**: 
- ✅ Check spam/junk folder
- ✅ Improved email content and formatting
- ✅ Added proper HTML structure

### Issue 3: API Key Issues
**Symptoms**: 401/403 errors
**Solution**: 
- ✅ Using provided API key as fallback
- Check if key is still valid in Brevo

### Issue 4: Rate Limiting
**Symptoms**: 429 errors
**Solution**: 
- Wait a few minutes between tests
- Check Brevo account limits

## 🔧 Manual Verification

### Test Direct Brevo API
```javascript
// Test this in browser console or Node.js
const testEmail = async () => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': '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'
    },
    body: JSON.stringify({
      sender: { name: 'DevTone Agency', email: 'team@devtone.agency' },
      to: [{ email: 'your-email@example.com', name: 'Test User' }],
      subject: 'Direct API Test',
      htmlContent: '<h1>Test Email</h1><p>If you receive this, the API works!</p>'
    })
  });
  
  const result = await response.json();
  console.log('Status:', response.status);
  console.log('Result:', result);
};

testEmail();
```

## 📧 Expected Email Content

You should receive an email with:
- **From**: DevTone Agency (team@devtone.agency)
- **Subject**: Estimate Confirmation - [Project Type]
- **Content**: Professional HTML email with project details
- **Styling**: Purple gradient header, organized sections

## 🚨 If Still Not Working

1. **Check Brevo Dashboard**:
   - Login to Brevo account
   - Check "Campaigns" > "Email" > "Transactional"
   - Look for sent emails and delivery status

2. **Verify Sender Domain**:
   - Ensure `devtone.agency` domain is verified in Brevo
   - Check DNS records (SPF, DKIM)

3. **Test with Different Email**:
   - Try Gmail, Outlook, Yahoo
   - Some providers have stricter spam filters

4. **Check API Limits**:
   - Verify Brevo account isn't over limits
   - Check if account is suspended

## 📞 Next Steps

1. Run the debug test page
2. Check server console logs
3. Verify email in spam folder
4. Test with different email addresses
5. Check Brevo dashboard for delivery status

---

**Last Updated**: ${new Date().toISOString()}
**Status**: ✅ Fixes applied, ready for testing