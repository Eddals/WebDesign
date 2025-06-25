import { Resend } from 'resend';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  console.log('Testing email with:', {
    apiKeyExists: !!process.env.RESEND_API_KEY,
    adminEmail: process.env.ADMIN_EMAIL || 'team@devtone.agency'
  });
  
  try {
    // Test admin email
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'DevTone Test <noreply@devtone.agency>',
      to: [process.env.ADMIN_EMAIL || 'team@devtone.agency'],
      subject: 'Test Email - Admin Notification',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email Successful!</h2>
          <p>This is a test of the admin notification system.</p>
          <p>If you're receiving this, the email system is working correctly.</p>
          <hr>
          <p><strong>Sent from:</strong> noreply@devtone.agency</p>
          <p><strong>Sent to:</strong> ${process.env.ADMIN_EMAIL || 'team@devtone.agency'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    // Test client email (send to admin as well for testing)
    const { data: clientData, error: clientError } = await resend.emails.send({
      from: 'DevTone <noreply@devtone.agency>',
      to: [process.env.ADMIN_EMAIL || 'team@devtone.agency'],
      subject: 'Test Email - Client Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Client Email!</h2>
          <p>This is a test of the client confirmation email.</p>
          <p>In production, this would go to the client's email address.</p>
          <hr>
          <p><strong>Sent from:</strong> noreply@devtone.agency</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    const response = {
      success: true,
      message: 'Test emails sent!',
      results: {
        admin: adminData ? { id: adminData.id, success: true } : { error: adminError },
        client: clientData ? { id: clientData.id, success: true } : { error: clientError }
      },
      debug: {
        apiKeyExists: !!process.env.RESEND_API_KEY,
        adminEmail: process.env.ADMIN_EMAIL || 'team@devtone.agency',
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('Test email results:', response);
    
    return res.status(200).json(response);
    
  } catch (err) {
    console.error('Test email error:', err);
    return res.status(500).json({ 
      success: false,
      error: err.message,
      debug: {
        apiKeyExists: !!process.env.RESEND_API_KEY,
        adminEmail: process.env.ADMIN_EMAIL || 'team@devtone.agency'
      }
    });
  }
}