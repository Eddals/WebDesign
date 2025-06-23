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
  origin: function(origin, callback) {
    // Allow requests from localhost:5173, the production URL, or no origin (for tools like Postman)
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://devtone.online',
      'https://www.devtone.online',
      process.env.FRONTEND_URL || 'https://devtone.agency'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

    // Send to ActivePieces webhook
    try {
      const activePiecesWebhook = 'https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg';
      
      // ActivePieces credentials - should be in environment variables
      const username = process.env.ACTIVEPIECES_USERNAME || "eae";
      const password = process.env.ACTIVEPIECES_PASSWORD || "SUA_SENHA_AQUI";
      
      // Prepare webhook data in Portuguese format as expected by ActivePieces
      const webhookPayload = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone || '',
        empresa: formData.company || '',
        pais: formData.country || '',
        industria: formData.industry || '',
        tipo_projeto: formData.projectType,
        orcamento: formData.budget,
        prazo: formData.timeline,
        mensagem: formData.description || '',
        recursos: formData.features.join(', ') || '',
        timestamp: new Date().toISOString(),
        fonte: 'devtone-estimate-api',
        ip: req.ip,
        navegador: req.get('user-agent')
      };

      const webhookResponse = await fetch(activePiecesWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        },
        body: JSON.stringify(webhookPayload),
      });

      if (webhookResponse.ok) {
        console.log('Successfully sent to ActivePieces webhook');
      } else {
        const responseText = await webhookResponse.text();
        console.warn('ActivePieces webhook returned non-OK status:', webhookResponse.status, responseText);
      }
    } catch (webhookError) {
      console.error('Error sending to ActivePieces webhook:', webhookError);
      // Continue even if webhook fails
    }

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