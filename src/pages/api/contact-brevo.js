// Contact form endpoint for Brevo
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

    console.log('📧 Creating/updating contact in Brevo:', contactData);

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

    const contactResult = await contactResponse.json();
    console.log('✅ Contact created/updated successfully:', contactResult.id);

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

    // Send email using template #13
    const emailData = {
      to: [{
        email: email,
        name: name
      }],
      templateId: 13,
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

    console.log('📧 Sending email with template #13:', emailData);

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    let emailResult;
    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('❌ Error sending email with template #13:', emailResponse.status, errorData);
      
      // Try fallback to template #2
      console.log('🔄 Trying fallback to template #2...');
      const fallbackEmailData = {
        ...emailData,
        templateId: 2
      };
      
      const fallbackResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify(fallbackEmailData)
      });
      
      if (!fallbackResponse.ok) {
        const fallbackErrorData = await fallbackResponse.text();
        console.error('❌ Error sending email with template #2:', fallbackResponse.status, fallbackErrorData);
        throw new Error(`Failed to send email with both templates: ${emailResponse.status} ${errorData}`);
      }
      
      emailResult = await fallbackResponse.json();
      console.log('✅ Email sent successfully with template #2 (fallback):', emailResult.messageId);
    } else {
      emailResult = await emailResponse.json();
      console.log('✅ Email sent successfully with template #13:', emailResult.messageId);
    }

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      contactId: contactResult.id,
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