# 🚀 AWS Amplify Stripe Integration

## Quick Setup Guide

### 1. Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### 2. Initialize Amplify
```bash
amplify init
```

### 3. Add Lambda Function
```bash
amplify add function
```
- Function name: `stripeCheckout`
- Runtime: `NodeJS`
- Template: `Hello World`
- Add environment variable: `STRIPE_SECRET_KEY`

### 4. Add API Gateway
```bash
amplify add api
```
- Type: `REST`
- API name: `stripeapi`
- Path: `/stripe/checkout`
- Function: `stripeCheckout`

### 5. Deploy
```bash
amplify push
```

### 6. Update Environment Variables
In AWS Amplify Console, add:
- `VITE_API_GATEWAY_URL`: Your API Gateway URL
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

## 🎯 Benefits
- ✅ Serverless (no server maintenance)
- ✅ Scalable (auto-scaling)
- ✅ Secure (AWS-managed)
- ✅ Cost-effective (pay per use)

## 💰 Pricing Packages
- Starter: $299
- Professional: $599
- Business: $999
- Enterprise: $1,999

## 📞 Support
Email: support@devtone.agency

---
**Setup time**: 15-20 minutes
**Cost**: ~$0-5/month
