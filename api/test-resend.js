import { Resend } from 'resend';

// Initialize Resend
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test Resend API
    const { data, error } = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: 'sweepeasellc@gmail.com',
      subject: 'Resend API Test',
      html: '<p>This is a test email to verify the Resend API is working.</p>',
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send test email',
        details: error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data
    });
  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      message: error.message || 'An unexpected error occurred'
    });
  }
}