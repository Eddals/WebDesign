// Simple JavaScript version for better compatibility
export default async function handler(req, res) {
  console.log('=== Newsletter API Handler Started ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).json({ message: 'CORS preflight' });
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Newsletter API called with body:', req.body);
  console.log('Environment check - BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);

  const { email, firstName, lastName, phone } = req.body;

  if (!email) {
    console.log('Missing email in request');
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY not found in environment variables');
    return res.status(500).json({ error: 'API configuration error' });
  }

  try {
    const brevoPayload = {
      email,
      attributes: {
        FIRSTNAME: firstName || '',
        LASTNAME: lastName || '',
        SMS: phone && phone !== 'não fornecido' ? phone : undefined,
      },
      listIds: [2], // Newsletter list ID
      updateEnabled: true,
    };

    console.log('Sending to Brevo:', brevoPayload);

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    console.log('Brevo response status:', response.status);

    // Always try to get response body, even for errors
    let responseData;
    const responseText = await response.text();
    console.log('Brevo response text:', responseText);
    
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Failed to parse Brevo response:', parseError);
      responseData = { message: responseText || 'Empty response' };
    }

    if (!response.ok) {
      console.error('Brevo error response:', responseData);
      return res.status(response.status).json({ 
        error: responseData.message || responseData.error || 'Brevo API error',
        details: responseData 
      });
    }

    console.log('Brevo success response:', responseData);
    
    // Send confirmation email using Brevo template #2
    console.log('Sending confirmation email...');
    const confirmationEmailData = {
      sender: {
        name: 'DevTone Agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: email,
          name: firstName || 'Newsletter Subscriber'
        }
      ],
      templateId: 2, // Using template ID 2 for newsletter confirmation
      params: {
        NAME: firstName || 'Newsletter Subscriber',
        EMAIL: email,
        PHONE: phone && phone !== 'não fornecido' ? phone : 'Not provided',
        COMPANY: 'Newsletter Subscription',
        INDUSTRY: 'Newsletter',
        PROJECT_TYPE: 'Newsletter Subscription',
        BUDGET: 'N/A',
        TIMELINE: 'N/A',
        RETAINER: 'N/A',
        FEATURES: 'Newsletter updates, industry insights, exclusive offers',
        DESCRIPTION: 'Thank you for subscribing to our newsletter! You will now receive our latest web development tips, industry insights, and exclusive offers.',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Newsletter Subscription - Welcome Email'
      }
    };

    try {
      const confirmationResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(confirmationEmailData),
      });

      console.log('Confirmation email response status:', confirmationResponse.status);
      
      if (!confirmationResponse.ok) {
        const errorText = await confirmationResponse.text();
        console.error('Confirmation email failed:', errorText);
        // Don't fail the whole request if confirmation email fails
      } else {
        console.log('Confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the whole request if confirmation email fails
    }
    
    console.log('=== Sending success response ===');
    return res.status(200).json({ success: true, data: responseData });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    console.log('=== Sending error response ===');
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message || 'Unknown error'
    });
  }
}