const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sendEstimateEmail, sendClientConfirmationEmail } = require('./email-service');
require('dotenv').config();

const app = express();
const PORT = process.env.ESTIMATE_API_PORT || 3002;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());

// Rate limiting for estimate submissions
const estimateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many estimate requests from this IP, please try again later.'
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'estimate-api' });
});

// Estimate submission endpoint
app.post('/api/estimate', estimateLimiter, async (req, res) => {
  try {
    console.log('Received estimate request:', req.body);

    // Validate required fields
    const requiredFields = ['name', 'email', 'projectType', 'budget', 'timeline'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Prepare form data
    const formData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      company: req.body.company || '',
      country: req.body.country || '',
      industry: req.body.industry || '',
      projectType: req.body.projectType,
      budget: req.body.budget,
      timeline: req.body.timeline,
      description: req.body.description || '',
      features: req.body.features || []
    };

    // Send notification email to admin
    const adminEmailResult = await sendEstimateEmail(formData);
    
    if (!adminEmailResult.success) {
      console.error('Failed to send admin notification:', adminEmailResult.error);
      // Continue even if admin email fails
    }

    // Send confirmation email to client
    const clientEmailResult = await sendClientConfirmationEmail(formData);
    
    if (!clientEmailResult.success) {
      console.error('Failed to send client confirmation:', clientEmailResult.error);
      // Continue even if client email fails
    }

    // Return success response
    res.json({
      success: true,
      message: 'Estimate request submitted successfully',
      emailsSent: {
        admin: adminEmailResult.success,
        client: clientEmailResult.success
      }
    });

  } catch (error) {
    console.error('Error processing estimate request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process estimate request'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Estimate API server running on port ${PORT}`);
  console.log(`SMTP configured: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`Estimate emails will be sent to: ${process.env.ESTIMATE_RECIPIENT_EMAIL || process.env.SMTP_USER}`);
});