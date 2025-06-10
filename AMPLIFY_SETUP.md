# 🚀 Amplify Stripe Setup

## Quick Steps:

1. **Install Amplify CLI:**
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify:**
```bash
amplify init
```

3. **Add Function:**
```bash
amplify add function
```
- Name: `stripeCheckout`
- Runtime: `NodeJS`
- Template: `Hello World`
- Environment variable: `STRIPE_SECRET_KEY` = your_stripe_secret_key

4. **Add API:**
```bash
amplify add api
```
- Type: `REST`
- Name: `stripeapi`
- Path: `/stripe/checkout`
- Function: `stripeCheckout`

5. **Deploy:**
```bash
amplify push
```

6. **Update .env.production:**
```
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.region.amazonaws.com/dev/stripe/checkout
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

7. **Push to GitHub:**
```bash
git add .
git commit -m "Add Amplify Stripe integration"
git push
```

## 🎯 Result:
- Serverless Stripe payments
- Auto-scaling
- $0-5/month cost
- No server maintenance

## 💰 Packages:
- Starter: $299
- Professional: $599
- Business: $999
- Enterprise: $1,999
