# Contact Form Debugging Guide

This document provides steps to debug and fix the contact form API issues.

## Current Issues

1. **405 Method Not Allowed Error**: The API endpoint is rejecting POST requests.
2. **JSON Parsing Error**: The response from the server can't be parsed as JSON.

## Debugging Steps

### 1. Test API Endpoints

Use the test page to verify API endpoints are working:

- Visit: `https://devtone.agency/test-api.html`
- Test both the `/api/test` and `/api/contact-brevo` endpoints
- Check if the API routes are being properly handled

### 2. Check Vercel Configuration

The `vercel.json` file has been updated to properly handle API routes:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "pages/api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Check API Endpoint Implementation

The `pages/api/contact-brevo.js` file has been simplified to return a basic response:

```javascript
// Contact form endpoint for Brevo
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method Not Allowed',
      method: req.method 
    });
  }

  // Basic test response
  res.status(200).json({ 
    success: true,
    message: 'Contact form received successfully',
    data: req.body,
    timestamp: new Date().toISOString()
  });
}
```

### 4. Check Frontend Form Implementation

The frontend form component has been updated to match the field names expected by the API:

- Changed `full_name` to `name`
- Added better error handling for API responses

## Deployment Steps

1. Deploy the updated code to Vercel
2. Test the contact form on the live site
3. Check the browser console for any errors

## Fallback Options

If the API endpoint still doesn't work, consider these alternatives:

1. Use the Make.com webhook directly (already implemented as a fallback)
2. Use a different API endpoint like `/api/webhooks/resend-simple`
3. Implement a client-side fallback to store submissions locally when the API is unavailable

## Testing After Deployment

After deploying, visit the test page to verify the API endpoints are working:
`https://devtone.agency/test-api.html`