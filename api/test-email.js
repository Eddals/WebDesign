import { Resend } from 'resend';

// Initialize Resend with the API key directly
const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log('Testing email with direct API key');
  
  try {
    // Test admin email
    const adminResult = await resend.emails.send({
      from: 'DevTone Test <team@devtone.agency>',
      to: 'sweepeasellc@gmail.com',
      subject: 'Test Email - Admin Notification',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email Successful!</h2>
          <p>This is a test of the admin notification system.</p>
          <p>If you're receiving this, the email system is working correctly.</p>
          <hr>
          <p><strong>Sent from:</strong> onboarding@resend.dev</p>
          <p><strong>Sent to:</strong> sweepeasellc@gmail.com</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    // Test client email (send to test email for testing)
    const clientResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: 'test@example.com', // Este email será substituído pelo email do cliente real no formulário
      subject: 'Test Email - Client Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Client Email!</h2>
          <p>This is a test of the client confirmation email.</p>
          <p>In production, this would go to the client's email address.</p>
          <hr>
          <p><strong>Sent from:</strong> onboarding@resend.dev</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    const response = {
      success: true,
      message: 'Test emails sent!',
      results: {
        admin: adminResult,
        client: clientResult
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Test email results:', response);
    
    return res.status(200).json(response);
    
  } catch (err) {
    console.error('❌ Test email error:', err);
    return res.status(500).json({ 
      success: false,
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  }
}