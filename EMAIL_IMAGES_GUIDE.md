# How to Add Images to Email Templates

## Current Setup

I've added logo placeholders to your email templates. The emails now include a logo section in the header.

## Option 1: Using Hosted Images (Recommended)

This is the best approach for email compatibility:

1. **Upload your logo** to your website or image hosting service
2. **Update the image URL** in the email templates

### To update the logo URL:

In `/server/email-service.js`, find these lines and replace the URL:

```html
<img src="https://devtone.agency/logo.png" alt="DevTone Logo" style="max-width: 150px; height: auto;">
```

Replace `https://devtone.agency/logo.png` with your actual logo URL.

### Best practices for email images:
- Use PNG or JPG format
- Keep file size under 100KB
- Recommended dimensions: 300px wide (will be displayed at 150px)
- Host on HTTPS (secure) URLs
- Always include alt text

## Option 2: Using Different Images

You can add more images throughout the email:

### Profile/Team Photo
```html
<div style="text-align: center; margin: 20px 0;">
  <img src="https://devtone.agency/team-photo.jpg" 
       alt="DevTone Team" 
       style="max-width: 100%; height: auto; border-radius: 10px;">
</div>
```

### Service Icons
```html
<div style="text-align: center;">
  <img src="https://devtone.agency/icons/web-design.png" 
       alt="Web Design" 
       style="width: 50px; height: 50px;">
</div>
```

### Banner Image
```html
<div style="margin: 20px 0;">
  <img src="https://devtone.agency/email-banner.jpg" 
       alt="DevTone Services" 
       style="width: 100%; max-width: 600px; height: auto;">
</div>
```

## Option 3: Using Base64 Images (Not Recommended)

While possible, this increases email size significantly:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." alt="Logo">
```

## Where to Add Images

### Current image locations in your emails:

1. **Admin Notification Email** (New Estimate Request)
   - Logo in header

2. **Client Confirmation Email** (Thank You for Your Estimate)
   - Logo in header

### You can add more images:
- After the greeting
- Between sections
- In the footer
- As background images (limited support)

## Testing Your Images

1. Send test emails to different providers:
   - Gmail
   - Outlook
   - Yahoo
   - Apple Mail

2. Check that images:
   - Load properly
   - Display at correct size
   - Have proper spacing
   - Show alt text when blocked

## Image Hosting Options

1. **Your website** (recommended)
   - Upload to: `https://devtone.agency/images/email/`
   
2. **CDN Services**
   - Cloudinary
   - ImageKit
   - AWS S3

3. **Free Options**
   - Imgur (not recommended for business)
   - Google Drive (requires special URL format)

## Quick Implementation

To add your logo right now:

1. Upload your logo to your website
2. Get the direct URL (e.g., `https://devtone.agency/assets/logo.png`)
3. Update the email templates in `/server/email-service.js`
4. Test by sending an estimate form

The logo will appear at the top of both admin and client emails!