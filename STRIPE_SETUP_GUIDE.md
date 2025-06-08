# 🚀 Stripe Checkout Integration Setup Guide

This guide will help you set up Stripe Checkout for your web development services.

## 📋 What's Included

✅ **Backend API** - Node.js/Express server for creating Stripe Checkout sessions  
✅ **React Component** - StripeCheckout component with pricing calculation  
✅ **Success Page** - Beautiful confirmation page after payment  
✅ **Cancel Page** - Helpful page when payment is cancelled  
✅ **Dynamic Pricing** - Based on your estimate form selections  
✅ **Security** - Secure payment processing with Stripe  

---

## 🛠️ Setup Instructions

### 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Go to **Developers > API Keys**
4. Copy your **Publishable Key** and **Secret Key**

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=3001
NODE_ENV=development
```

### 4. Add Frontend Environment Variable

Create/update `.env` in your main project:
```env
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 5. Start the Stripe Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:3001`

### 6. Test the Integration

1. Start your main app: `npm run dev`
2. Go to `/estimate`
3. Fill out the form
4. Try the "Pay & Start Now" option
5. Use Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`

---

## 💰 Pricing Logic

The system calculates prices based on:

### Budget Ranges (One-time Payment)
- **Starter**: $500 - $1,500 (default: $1,000)
- **Professional**: $1,500 - $5,000 (default: $3,000)
- **Premium**: $5,000 - $15,000 (default: $10,000)
- **Enterprise**: $15,000+ (default: $25,000)

### Project Type Multipliers
- **Business Website**: 1.0x
- **E-commerce Store**: 1.5x
- **Portfolio/Personal**: 0.8x
- **Blog/Content**: 0.7x
- **Landing Page**: 0.6x
- **Web Application**: 2.0x

### Timeline Multipliers
- **ASAP (Rush)**: 1.5x (+50% fee)
- **2-3 Weeks**: 1.0x (Standard)
- **1 Month**: 0.9x (10% discount)
- **Flexible**: 0.8x (20% discount)

### Subscription Plans (Setup Fees)
- **Starter**: $99 setup + $29/month
- **Business**: $149 setup + $59/month
- **Pro**: $199 setup + $99/month

---

## 🔧 Customization

### Update Pricing

Edit pricing in both files:
- `server/stripe-checkout.js` (lines 10-35)
- `src/components/StripeCheckout.tsx` (lines 25-50)

### Change Redirect URLs

Update in `server/stripe-checkout.js`:
```javascript
success_url: 'https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
cancel_url: 'https://yourdomain.com/cancel',
```

### Customize Product Description

The description is automatically generated based on:
- Project type
- Payment model
- Selected plan

Example: "Web Design Package - Business Website"

---

## 🔒 Security Features

✅ **Server-side validation** - All pricing calculated on backend  
✅ **Stripe security** - PCI compliant payment processing  
✅ **Webhook verification** - Secure payment confirmation  
✅ **Environment variables** - API keys stored securely  
✅ **CORS protection** - Restricted to your domains  

---

## 📱 User Experience

### Payment Flow
1. **Fill Estimate Form** - User completes 5-step form
2. **Choose Payment Option** - "Get Quote" or "Pay & Start Now"
3. **Price Preview** - Shows calculated price before payment
4. **Stripe Checkout** - Secure payment with Stripe
5. **Success/Cancel** - Appropriate redirect based on outcome

### Features
- **Real-time pricing** - Updates as user selects options
- **Mobile responsive** - Works on all devices
- **Loading states** - Clear feedback during processing
- **Error handling** - Helpful error messages
- **Security badges** - SSL, PCI compliance indicators

---

## 🎯 Testing

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Require 3DS: 4000 0025 0000 3155
```

### Test Scenarios
1. ✅ One-time payment with different budgets
2. ✅ Subscription setup fees
3. ✅ Different project types and timelines
4. ✅ Payment success flow
5. ✅ Payment cancellation flow
6. ✅ Error handling

---

## 🚀 Going Live

### 1. Switch to Live Mode
- Get live Stripe keys from dashboard
- Update environment variables
- Change redirect URLs to production domains

### 2. Set Up Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to `.env`

### 3. Update URLs
- Change `VITE_API_URL` to production server
- Update CORS origins in server
- Update success/cancel URLs

---

## 📊 Analytics & Tracking

The system logs:
- ✅ Payment attempts
- ✅ Successful payments
- ✅ Failed payments
- ✅ Customer information
- ✅ Project details

You can extend this to:
- Send to Google Analytics
- Store in your database
- Send email notifications
- Integrate with CRM

---

## 🆘 Troubleshooting

### Common Issues

**"Failed to create checkout session"**
- Check Stripe secret key
- Verify server is running
- Check CORS settings

**"Amount too low for Stripe"**
- Minimum charge is $0.50
- Check pricing calculation

**"Webhook signature verification failed"**
- Verify webhook secret
- Check endpoint URL

### Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- Check server logs for detailed errors

---

## 🎉 You're Ready!

Your Stripe integration is now complete! Users can:

1. **Get estimates** with dynamic pricing
2. **Pay securely** with Stripe Checkout
3. **Start projects immediately** after payment
4. **Get quotes** for discussion first

The system handles both one-time payments and subscription setup fees, with automatic pricing based on project requirements.

**Happy coding! 🚀**