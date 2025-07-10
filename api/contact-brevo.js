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

    // Prepare contact data for Brevo
    const contactData = {
      email: email,
      attributes: {
        FIRSTNAME: name,
        PHONE: phone || '',
        COMPANY: company || '',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: preferredContact || 'email'
      },
      listIds: [7], // Add to list #7
      updateEnabled: true
    };

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
      console.error('❌ Error creating contact:', contactResponse.status, errorData);
      throw new Error(`Failed to create contact: ${contactResponse.status} ${errorData}`);
    }

    // Add contact to list #7 separately (in case it wasn't added in the first call)
    try {
      const addToListResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/7/contacts/add`, {
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
        console.log('✅ Contact added to list #7 successfully');
      } else {
        console.warn('⚠️ Could not add contact to list #7:', addToListResponse.status);
      }
    } catch (listError) {
      console.warn('⚠️ Error adding contact to list:', listError);
    }

    // Send email using template #3 (not #2)
    const emailData = {
      to: [{
        email: email,
        name: name
      }],
      templateId: 3,
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