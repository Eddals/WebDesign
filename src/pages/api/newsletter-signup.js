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
    const { email, attributes } = req.body;

    // Validate required fields
    if (!email || !attributes || !attributes.FIRSTNAME) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email and firstName'
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

    // Prepare contact data for Brevo
    const contactData = {
      email: email,
      attributes: {
        FIRSTNAME: attributes.FIRSTNAME
      },
      listIds: [3],
      updateEnabled: true
    };

    console.log('📧 Creating/updating newsletter contact in Brevo:', contactData);

    // Create or update contact in Brevo
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.text();
      console.error('❌ Error creating newsletter contact:', contactResponse.status, errorData);
      throw new Error(`Failed to create contact: ${contactResponse.status} ${errorData}`);
    }

    const contactResult = await contactResponse.json();
    console.log('✅ Newsletter contact created/updated successfully:', contactResult.id);

    try {
      const addToListResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/3/contacts/add`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          emails: [email]
        })
      });

      if (addToListResponse.ok) {
        console.log('✅ Newsletter contact added to list #3 successfully');
      } else {
        console.warn('⚠️ Could not add newsletter contact to list #3:', addToListResponse.status);
      }
    } catch (listError) {
      console.warn('⚠️ Error adding newsletter contact to list:', listError);
    }

    const emailData = {
      to: [{
        email: email,
        name: attributes.FIRSTNAME
      }],
      templateId: 7,
      params: {
        FIRSTNAME: attributes.FIRSTNAME,
        EMAIL: email
      }
    };

    console.log('📧 Sending newsletter welcome email with template #7:', emailData);

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
      console.error('❌ Error sending newsletter email:', emailResponse.status, errorData);
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Newsletter email sent successfully:', emailResult.messageId);

    return res.status(200).json({
      success: true,
      message: 'Newsletter signup successful',
      contactId: contactResult.id,
      emailId: emailResult.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Newsletter API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
