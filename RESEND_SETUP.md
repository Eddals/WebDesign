# 📧 Resend Email System Setup Guide

## 🚀 Quick Setup

### 1. Install Resend
```bash
npm install resend
```

### 2. Get Your API Key
1. Go to [Resend.com](https://resend.com)
2. Sign up/Login
3. Go to API Keys
4. Create a new API key
5. Copy the key (starts with `re_`)

### 3. Add Domain to Resend
1. In Resend dashboard, go to "Domains"
2. Add `devtone.com`
3. Add the DNS records shown to your domain provider
4. Wait for verification (usually 5-30 minutes)

### 4. Configure Environment Variables
Create a `.env.local` file in your project root:
```env
RESEND_API_KEY=re_YOUR_API_KEY_HERE
```

### 5. Update Your Estimate Form

Replace the Formspree integration with Resend in `/src/pages/Estimate.tsx`:

```tsx
import { useResendForm } from '@/hooks/useResendForm';

const Estimate = () => {
  const { isSubmitting, isSuccess, error, submitForm } = useResendForm();
  
  // ... your existing form state ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData);
  };

  if (isSuccess) {
    return (
      // Your success message component
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your existing form fields */}
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Get My Estimate'}
      </button>
    </form>
  );
};
```

## 📬 Email Templates

### Admin Email Features:
- Professional gradient header
- Organized contact information table
- Clear project details section
- Formatted description box
- Timestamp footer

### Client Email Features:
- Personalized greeting
- Complete request summary
- Next steps timeline
- Multiple contact options (Phone, Email, WhatsApp)
- Professional footer with branding

## 🎨 Customization

### Change Email Design
Edit the HTML templates in `/src/pages/api/send-estimate.ts`:
- Colors: Update the gradient colors in the header
- Logo: Add your logo image URL
- Contact info: Update phone/WhatsApp numbers

### Add More Fields
1. Add to the form interface
2. Update the API route to handle new fields
3. Add to both email templates

## 🔧 Testing

### Local Testing
1. Run your Next.js app: `npm run dev`
2. Fill out the form
3. Check both inboxes (admin and client)

### Test Email Addresses
For testing, you can use:
- Your personal email as the client
- A test email for admin notifications

## 📱 WhatsApp Integration

The confirmation email includes a WhatsApp button. Update the number:
```html
<a href="https://wa.me/19177413468">Chat on WhatsApp</a>
```

Replace `19177413468` with your WhatsApp business number (include country code, no + or spaces).

## 🚨 Troubleshooting

### Emails not sending?
1. Check API key is correct
2. Verify domain is verified in Resend
3. Check console for errors
4. Ensure you're using correct "from" addresses

### Domain verification issues?
1. DNS changes can take up to 48 hours
2. Check all records are added correctly
3. Use Resend's domain checker

### Rate limits?
- Free tier: 100 emails/day
- Paid plans: Higher limits available

## 🎯 Best Practices

1. **From Address**: Use `noreply@devtone.com` for automated emails
2. **Reply-To**: Set to `team@devtone.com` so replies go to the right place
3. **Subject Lines**: Keep them clear and include the client's name
4. **Mobile Responsive**: The templates are mobile-friendly
5. **Spam Prevention**: Resend handles SPF/DKIM automatically

## 📊 Monitoring

In your Resend dashboard, you can:
- See email delivery status
- View email opens/clicks (if enabled)
- Check for bounces or complaints
- Monitor your usage

## 🔐 Security

- Never commit your API key
- Use environment variables
- Add `.env.local` to `.gitignore`
- Rotate keys periodically

---

Need help? Contact Resend support or check their [documentation](https://resend.com/docs).