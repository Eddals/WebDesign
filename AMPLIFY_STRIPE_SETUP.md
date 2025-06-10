# 🚀 AWS Amplify + Stripe Integration Setup

## Overview
This setup creates a serverless Stripe payment system using AWS Lambda and API Gateway, fully integrated with your Amplify deployment.

## 🔐 Your Stripe Keys (SECURE)
**Note**: Use your live Stripe keys from your Stripe dashboard. Keep them secure and never commit them to git.

## 📋 Step-by-Step Deployment

### 1. Install Amplify CLI (if not already installed)
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### 2. Initialize Amplify in your project
```bash
amplify init
```
- Choose your AWS profile
- Select environment name: `production`
- Choose your preferred editor

### 3. Add the Lambda function
```bash
amplify add function
```
- Choose: `Lambda function`
- Function name: `stripeCheckout`
- Choose runtime: `NodeJS`
- Choose template: `Hello World`
- Advanced settings: Yes
- Add environment variables: Yes
- Environment variable name: `STRIPE_SECRET_KEY`
- Environment variable value: `your_stripe_secret_key_here`

### 4. Add API Gateway
```bash
amplify add api
```
- Choose: `REST`
- API name: `stripeapi`
- Path: `/stripe/checkout`
- Lambda source: `Use a Lambda function already added in the current Amplify project`
- Function: `stripeCheckout`
- Restrict API access: `No`
- Add another path: `No`

### 5. Deploy to AWS
```bash
amplify push
```
- Review and confirm all resources
- This will create:
  - Lambda function with your Stripe key
  - API Gateway endpoint
  - All necessary IAM roles

### 6. Get your API Gateway URL
After deployment, Amplify will show you the API endpoint URL:
```
REST API endpoint: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
```

### 7. Update Environment Variables
Update `.env.production` with your actual API Gateway URL:
```env
VITE_API_GATEWAY_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### 8. Update Amplify Environment Variables
In AWS Amplify Console:
1. Go to your app → Environment variables
2. Add:
   ```
   VITE_API_GATEWAY_URL = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
   VITE_STRIPE_PUBLISHABLE_KEY = your_stripe_publishable_key_here
   ```

### 9. Redeploy Frontend
```bash
git add .
git commit -m "Add Amplify Stripe integration"
git push origin main
```

## 🔧 Testing

### Test the Lambda function:
```bash
curl -X POST https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "projectType": "professional",
      "features": []
    },
    "customerInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "555-1234",
      "company": "Test Company"
    }
  }'
```

### Expected Response:
```json
{
  "url": "https://checkout.stripe.com/pay/...",
  "sessionId": "cs_...",
  "amount": 599,
  "description": "Professional Package"
}
```

## 🎯 How It Works

1. **Customer selects package** on devtone.agency/pricing
2. **Frontend calls** AWS API Gateway endpoint
3. **Lambda function** processes request and creates Stripe session
4. **Customer redirected** to Stripe Checkout
5. **Payment completed** → redirected back to devtone.agency/success

## 💰 Pricing Packages
- **Starter**: $299
- **Professional**: $599 (Most Popular)
- **Business**: $999
- **Enterprise**: $1,999

## 🔐 Security Features
- ✅ Stripe keys stored securely in AWS Lambda environment
- ✅ CORS configured for devtone.agency
- ✅ Serverless architecture (no server to maintain)
- ✅ AWS IAM security
- ✅ PCI compliant through Stripe

## 📊 Monitoring
- **AWS CloudWatch**: Lambda function logs
- **Stripe Dashboard**: Payment monitoring
- **API Gateway**: Request/response logs

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Check API Gateway CORS settings
2. **Lambda timeout**: Increase timeout in function settings
3. **Environment variables**: Verify Stripe key is set correctly

### Useful Commands:
```bash
# Check Amplify status
amplify status

# View function logs
amplify function logs stripeCheckout

# Update function
amplify update function

# Remove resources (if needed)
amplify remove function
amplify remove api
```

## 🎉 Benefits of This Setup

- ✅ **Serverless**: No server maintenance required
- ✅ **Scalable**: Automatically scales with traffic
- ✅ **Secure**: AWS-managed security
- ✅ **Cost-effective**: Pay only for usage
- ✅ **Integrated**: Works seamlessly with Amplify
- ✅ **Fast**: Low latency with AWS infrastructure

---

**Total setup time**: 15-20 minutes
**Monthly cost**: ~$0-5 (depending on usage)
**Maintenance**: Zero - fully managed by AWS
