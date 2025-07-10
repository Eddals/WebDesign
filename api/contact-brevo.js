// Contact form endpoint for Brevo - Vercel deployment
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).json({ success: true, message: 'CORS preflight' });
    return;
  }

  // Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      method: req.method 
    });
  }

  try {
    const { name, email, phone, company, subject, message, preferredContact } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, subject, message'
      });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Note: Contact creation requires additional API permissions
    // For now, we'll only send the email using template #2
    console.log('📧 Sending contact email only (contact creation requires additional API permissions)');

    // Send email using template #2
    const emailData = {
      to: [{
        email: email,
        name: name
      }],
      templateId: 2,
      params: {
        FIRSTNAME: name,
        EMAIL: email,
        PHONE: phone || 'Not provided',
        COMPANY: company || 'Not provided',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: preferredContact || 'email'
      }
    };

    console.log('📧 Sending email with template #2:', emailData);

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('❌ Error sending email:', emailResponse.status, errorData);
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Email sent successfully:', emailResult.messageId);

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      emailId: emailResult.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 