import { Resend } from 'resend';

// Move API key to environment variable (remove hardcoded fallback)
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schemas
const validateEmailData = (data) => {
  const { name, email, subject, message } = data;
  const errors = [];

  if (!name?.trim()) errors.push('Name is required');
  if (!email?.trim()) errors.push('Email is required');
  if (!subject?.trim()) errors.push('Subject is required');
  if (!message?.trim()) errors.push('Message is required');
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email.trim())) {
    errors.push('Invalid email format');
  }

  // Length validations
  if (name && name.trim().length > 100) errors.push('Name too long (max 100 characters)');
  if (subject && subject.trim().length > 200) errors.push('Subject too long (max 200 characters)');
  if (message && message.trim().length > 5000) errors.push('Message too long (max 5000 characters)');

  return { isValid: errors.length === 0, errors };
};

// Extract email templates to separate functions for better organization
const getContactConfirmationEmailHTML = (name, subject, message) => {
  // Sanitize inputs to prevent XSS
  const safeName = name.replace(/[<>]/g, '');
  const safeSubject = subject.replace(/[<>]/g, '');
  const safeMessage = message.replace(/[<>]/g, '').replace(/\n/g, '<br>');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 20px; overflow: hidden;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: #ffffff; padding: 30px; text-align: center;">
      <div style="width: 80px; height: 80px; margin: 0 auto 15px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px; color: #4a6cf7;">✉️</span>
      </div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Thank You for Contacting Us!</h1>
      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">We've received your message</p>
    </div>
    <div style="padding: 40px 30px;">
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Hello ${safeName},
      </p>
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Thank you for reaching out to DevTone Agency. We appreciate your interest and have successfully received your message.
      </p>
      <!-- Message Summary -->
      <div style="background-color: #f9f9f9; padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 4px solid #4a6cf7;">
        <h3 style="color: #2541b2; margin: 0 0 15px 0; font-size: 18px;">Your Message Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold; width: 120px;">Subject:</td>
            <td style="padding: 8px 0; color: #333;">${safeSubject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 8px 0; color: #333;">${safeMessage}</td>
          </tr>
        </table>
      </div>
      <!-- What Happens Next -->
      <div style="background-color: #f0f7ff; padding: 25px; border-radius: 15px; margin: 25px 0;">
        <h3 style="color: #2541b2; margin: 0 0 15px 0; font-size: 18px; text-align: center;">What Happens Next?</h3>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; background-color: #4a6cf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
              <span style="font-size: 20px; color: #ffffff;">1</span>
            </div>
            <div>
              <h4 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Message Review</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">Our team will review your message within 2-4 business hours.</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; background-color: #4a6cf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
              <span style="font-size: 20px; color: #ffffff;">2</span>
            </div>
            <div>
              <h4 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Personal Response</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">You'll receive a personalized response within 24 hours.</p>
            </div>
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; background-color: #4a6cf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
              <span style="font-size: 20px; color: #ffffff;">3</span>
            </div>
            <div>
              <h4 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">Follow-up</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">If needed, we'll schedule a call to discuss your requirements in detail.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Contact Information -->
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Need immediate assistance?</p>
        <p style="margin: 0; color: #333; font-size: 14px;">
          Email: team@devtone.agency<br>
          WhatsApp: +1 (917) 741-3468<br>
          Website: <a href="https://devtone.agency" style="color: #4a6cf7; text-decoration: none;">devtone.agency</a>
        </p>
      </div>
    </div>
    <!-- Footer -->
    <div style="background-color: #f5f7fa; padding: 25px; text-align: center; border-radius: 0 0 20px 20px;">
      <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
        Best regards,<br>
        <strong>The DevTone Team</strong>
      </p>
      <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
        © ${new Date().getFullYear()} DevTone Agency. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
};

const getContactConfirmationEmailText = (name, subject, message) => `
Thank you, ${name}!

We've received your message at DevTone Agency.

Subject: ${subject}
Message: ${message}

Our team will review your message and reply within 24 hours.

Best regards,
The DevTone Team
https://devtone.agency
`;

const getTeamNotificationHTML = (formData) => {
  const { name, email, phone, company, subject, message } = formData;
  const timestamp = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2541b2; border-bottom: 2px solid #4a6cf7; padding-bottom: 10px;">📬 New Contact Form Submission</h2>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #333; width: 100px;">Name:</td>
            <td style="padding: 8px 0; color: #555;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td>
            <td style="padding: 8px 0; color: #555;"><a href="mailto:${email}" style="color: #4a6cf7;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td>
            <td style="padding: 8px 0; color: #555;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #333;">Company:</td>
            <td style="padding: 8px 0; color: #555;">${company || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #333;">Subject:</td>
            <td style="padding: 8px 0; color: #555;">${subject}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #fff; border-left: 4px solid #4a6cf7; padding: 20px; margin: 20px 0;">
        <h3 style="color: #2541b2; margin: 0 0 10px 0;">Message:</h3>
        <p style="color: #333; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      
      <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          <strong>Quick Actions:</strong> 
          <a href="mailto:${email}" style="color: #4a6cf7; margin: 0 10px;">Reply</a> | 
          <a href="tel:${phone}" style="color: #4a6cf7; margin: 0 10px;">Call</a>
        </p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        Received: ${timestamp}
      </p>
    </div>
  `;
};

// Add rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3;

const checkRateLimit = (email) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(email) || [];
  
  // Clean old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitStore.set(email, recentRequests);
  return true;
};

// Add logging utility
const logError = (error, context = {}) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context
  });
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      logError(new Error('RESEND_API_KEY not configured'));
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Email service not properly configured'
      });
    }

    // Validate request body
    const { name, email, phone, company, subject, message } = req.body;
    const validation = validateEmailData({ name, email, subject, message });
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Check rate limiting
    if (!checkRateLimit(email.trim().toLowerCase())) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.'
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      subject: subject.trim(),
      message: message.trim()
    };

    // Send emails concurrently for better performance
    const [confirmationEmail, teamNotification] = await Promise.all([
      resend.emails.send({
        from: 'DevTone Agency <team@devtone.agency>',
        to: sanitizedData.email,
        subject: 'We received your message - DevTone Agency',
        html: getContactConfirmationEmailHTML(sanitizedData.name, sanitizedData.subject, sanitizedData.message),
        text: getContactConfirmationEmailText(sanitizedData.name, sanitizedData.subject, sanitizedData.message),
      }),
      resend.emails.send({
        from: 'DevTone Contact Form <team@devtone.agency>',
        to: 'team@devtone.agency',
        subject: `📬 New Contact: ${sanitizedData.name} - ${sanitizedData.subject}`,
        html: getTeamNotificationHTML(sanitizedData),
        text: `New contact form submission\n\nName: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nPhone: ${sanitizedData.phone || 'Not provided'}\nCompany: ${sanitizedData.company || 'Not provided'}\nSubject: ${sanitizedData.subject}\n\nMessage:\n${sanitizedData.message}\n\n--\nReceived: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`,
      })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: {
        confirmationId: confirmationEmail.data?.id,
        notificationId: teamNotification.data?.id,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logError(error, { 
      method: req.method, 
      url: req.url, 
      body: req.body 
    });

    // Don't expose internal errors to client
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process your request. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}