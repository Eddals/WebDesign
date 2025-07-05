# HubSpot Integration Guide

This guide explains how to set up and deploy the HubSpot integration for the DevTone website.

## Overview

The HubSpot integration consists of three main API endpoints:

1. `/api/hubspot` - Creates contacts in HubSpot CRM
2. `/api/hubspot-estimate-webhook` - Sends estimate form data to HubSpot webhook
3. `/api/webhook-proxy` - Proxies webhook requests to avoid CORS issues

## Local Development

To test the HubSpot integration locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run start
   ```

   This will start both the Vite development server and the local API server.

3. Test the integration by submitting the estimate form.

## Deployment to Vercel

The API endpoints are deployed to Vercel as serverless functions. To deploy:

1. Make sure you have the Vercel CLI installed:
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. After deployment, the API endpoints will be available at:
   - `https://your-vercel-domain.vercel.app/api/hubspot`
   - `https://your-vercel-domain.vercel.app/api/hubspot-estimate-webhook`
   - `https://your-vercel-domain.vercel.app/api/webhook-proxy`

## Troubleshooting

If you encounter issues with the HubSpot integration:

1. Check the browser console for errors
2. Check the Vercel function logs for errors
3. Verify that the HubSpot webhook URL is correct
4. Test the API endpoints directly using the test HTML page: `test-hubspot-webhook.html`

## HubSpot Webhook Format

The HubSpot webhook expects data in the following format:

```json
{
  "submittedAt": 1625097600000,
  "fields": [
    {
      "name": "firstname",
      "value": "John"
    },
    {
      "name": "lastname",
      "value": "Doe"
    },
    {
      "name": "email",
      "value": "john.doe@example.com"
    }
  ],
  "context": {
    "pageUri": "estimate-form",
    "pageName": "Estimate Request Form"
  }
}
```

## API Endpoints

### 1. `/api/hubspot`

Creates a contact in HubSpot CRM.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "company": "Example Company",
  "country": "United States",
  "industry": "Technology"
}
```

### 2. `/api/hubspot-estimate-webhook`

Sends estimate form data to HubSpot webhook.

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "service_type": "Web Development",
  "property_type": "Commercial",
  "location": "New York, USA",
  "estimated_budget": "$5000",
  "preferred_timeline": "1-2 weeks",
  "property_size": "1000 sq ft",
  "project_description": "This is a test project description."
}
```

### 3. `/api/webhook-proxy`

Proxies webhook requests to avoid CORS issues.

**Request:**
```
POST /api/webhook-proxy?target=hubspot
```

With the same body as the `/api/hubspot-estimate-webhook` endpoint.