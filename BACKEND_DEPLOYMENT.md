# Quick Backend Deployment Guide

## 🚨 Current Status
The frontend is live at `https://www.devtone.agency` but the payment system is temporarily disabled because the backend API needs to be deployed.

## 🚀 Quick Deploy Options

### Option 1: Heroku (Recommended - 5 minutes)

1. **Install Heroku CLI** (if not installed):
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   cd server
   heroku create devtone-api
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
   heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_stripe_publishable_key
   heroku config:set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   heroku config:set FRONTEND_URL=https://www.devtone.agency
   heroku config:set NODE_ENV=production
   heroku config:set BUSINESS_NAME="DevTone Agency"
   heroku config:set BUSINESS_EMAIL=support@devtone.agency
   heroku config:set BUSINESS_PHONE=+17184193863
   ```

5. **Deploy**:
   ```bash
   git init
   git add .
   git commit -m "Initial backend deployment"
   heroku git:remote -a devtone-api
   git push heroku main
   ```

6. **Update frontend** to use Heroku URL:
   ```bash
   # In your main project directory
   echo "VITE_API_URL=https://devtone-api.herokuapp.com" > .env.production
   ```

### Option 2: Railway (Alternative)

1. **Go to [Railway.app](https://railway.app)**
2. **Connect GitHub** and select your repository
3. **Deploy the server folder**
4. **Add environment variables** in Railway dashboard
5. **Get the deployment URL**

### Option 3: DigitalOcean App Platform

1. **Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)**
2. **Create new app** from GitHub
3. **Select server folder** as source
4. **Add environment variables**
5. **Deploy**

## 🔧 After Backend Deployment

### 1. Update Frontend Environment Variables

Create `.env.production` in your main project:
```env
VITE_API_URL=https://your-backend-url.herokuapp.com
```

### 2. Re-enable Stripe Checkout

In `src/components/StripeCheckout.tsx`, replace the temporary error with:
```typescript
// Call your backend API
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    formData,
    customerInfo
  }),
});
```

### 3. Update Pricing Page

Remove the temporary contact form and re-enable the StripeCheckout component.

### 4. Test Payment Flow

1. **Test with Stripe test cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. **Check Stripe Dashboard** for transactions

## 🔐 Security Checklist

- ✅ Environment variables set correctly
- ✅ HTTPS enabled on backend
- ✅ CORS configured for www.devtone.agency
- ✅ Webhook endpoint accessible
- ✅ Stripe keys are live (not test)

## 📞 Need Help?

If you need assistance with deployment:
1. **Email**: support@devtone.agency
2. **Check logs**: `heroku logs --tail -a devtone-api`
3. **Test health**: `curl https://your-backend-url.herokuapp.com/api/health`

## 🎯 Expected Result

After deployment:
- ✅ Customers can select packages on pricing page
- ✅ Payment modal opens with customer info form
- ✅ Stripe checkout processes payments
- ✅ Customers receive confirmation emails
- ✅ You receive payment notifications

## 📊 Monitoring

- **Heroku Dashboard**: Monitor app performance
- **Stripe Dashboard**: Track payments and customers
- **Health Check**: `https://your-backend-url.herokuapp.com/api/health`

---

**Estimated deployment time**: 5-10 minutes
**Cost**: Heroku free tier or $7/month for production
