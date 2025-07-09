export default async function handler(req, res) {
  // This is a simple test endpoint to verify Brevo API is working
  try {
    const testEmail = req.query.email || 'team@devtone.agency';
    
    console.log('Testing Brevo API with email:', testEmail);
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify({
        to: [{ email: testEmail, name: 'Test User' }],
        templateId: 2,
        params: {
          FIRSTNAME: 'Test User',
          COMPANY: 'Test Company',
          PROJECT_TYPE: 'Test Project',
          BUDGET: '$1000-$5000',
          TIMELINE: '1-2 weeks',
          FEATURES: 'Feature 1, Feature 2',
          DESCRIPTION: 'This is a test email to verify the Brevo API is working correctly.',
          INDUSTRY: 'Technology',
          RETAINER: 'None',
          PHONE: '555-123-4567'
        },
        sender: {
          name: 'DevTone Agency',
          email: 'team@devtone.agency'
        }
      })
    });

    const responseText = await response.text();
    console.log('Brevo API test response:', response.status, responseText);

    if (!response.ok) {
      return res.status(500).json({ 
        error: `Email service error: ${response.status}`, 
        details: responseText 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Test email sent to ${testEmail}. Check your inbox.`,
      response: responseText
    });
  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
}