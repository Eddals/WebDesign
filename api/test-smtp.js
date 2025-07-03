const nodemailer = require('nodemailer');

// Create SMTP transporter with IONOS credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'matheus.silva@devtone.agency',
    pass: 'Alebaba1!'
  },
  debug: true // Enable debug output
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify SMTP connection
    const verifyResult = await transporter.verify();
    console.log('SMTP connection verified:', verifyResult);
    
    // Send a test email
    const testEmail = req.query.email || 'matheus.silva@devtone.agency';
    
    const mailOptions = {
      from: '"Devtone Test" <matheus.silva@devtone.agency>',
      to: testEmail,
      subject: 'SMTP Test Email',
      text: 'This is a test email to verify SMTP configuration is working correctly.',
      html: '<p>This is a test email to verify SMTP configuration is working correctly.</p>'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'SMTP test successful',
      verifyResult,
      emailSent: info.messageId,
      emailInfo: info.response
    });
  } catch (error) {
    console.error('SMTP test error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
};