const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sendContactEmail, sendContactConfirmationEmail } = require('./email-service');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://devtone.agency',
    'https://www.devtone.agency'
  ],
  credentials: true
}));

// Rate limiting to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many contact requests from this IP, please try again later.'
});

// Contact form endpoint
app.post('/api/contact', limiter, async (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    
    const { full_name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!full_name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Prepare contact data
    const contactData = {
      name: full_name,
      email,
      phone: phone || 'Not provided',
      subject,
      message,
      submittedAt: new Date().toISOString()
    };
    
    // Send admin notification email
    console.log('Sending admin notification email...');
    const adminEmailResult = await sendContactEmail(contactData);
    
    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
    }
    
    // Send confirmation email to the user
    console.log('Sending confirmation email to user...');
    const confirmationResult = await sendContactConfirmationEmail(contactData);
    
    if (!confirmationResult.success) {
      console.error('Failed to send confirmation email:', confirmationResult.error);
    }
    
    // Return success even if email fails (we don't want to block the user)
    res.json({
      success: true,
      message: 'Contact form submitted successfully',
      emailSent: adminEmailResult.success && confirmationResult.success
    });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'contact-api' });
});

const PORT = process.env.CONTACT_API_PORT || 3003;

app.listen(PORT, () => {
  console.log(`Contact API server running on port ${PORT}`);
  console.log(`Contact emails will be sent to: ${process.env.CONTACT_RECIPIENT_EMAIL || process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER}`);
});