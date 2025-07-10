interface BrevoEmailParams {
  name: string;
  email: string;
  message: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  description?: string;
}

/**
 * Send email directly to Brevo from frontend
 * This bypasses all Vercel API issues
 */
export const sendBrevoEmailDirect = async (params: BrevoEmailParams) => {
  try {
    console.log('📤 Sending Brevo email directly from frontend...');
    console.log('📋 Params:', params);
    
    // Your Brevo API key
    const apiKey = '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';
    
    // Prepare the email data for Brevo API
    const emailData = {
      to: [
        {
          email: params.email,
          name: params.name
        }
      ],
      templateId: 7, // Your template ID
      params: {
        FIRSTNAME: params.name.split(' ')[0], // First name extraction
        message: params.message
      },
      sender: {
        name: 'Devtone Agency',
        email: 'team@devtone.agency'
      }
    };

    console.log('📧 Email data prepared:', emailData);

    // Send email using Brevo API directly
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    console.log('📥 Brevo API response status:', response.status);
    console.log('📥 Brevo API response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📥 Brevo API response text:', responseText);

    if (!response.ok) {
      console.error('❌ Brevo API error:', responseText);
      return {
        success: false,
        error: `Brevo API error: ${response.status} ${response.statusText}`,
        details: responseText
      };
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Brevo response:', parseError);
      return {
        success: false,
        error: 'Invalid response from Brevo API',
        rawResponse: responseText
      };
    }

    console.log('✅ Brevo email sent successfully!');
    console.log('📧 Response data:', responseData);
    
    return {
      success: true,
      message: 'Email sent successfully via Brevo',
      data: responseData,
      sentTo: params.email,
      templateId: 7
    };
  } catch (error) {
    console.error('❌ Error sending Brevo email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Send estimate confirmation email using Brevo directly
 */
export const sendEstimateConfirmationEmailDirect = async (formData: any) => {
  try {
    // Format the message with all the estimate details
    const message = `
Your estimate request has been received with the following details:

Project Type: ${formData.projectType || formData.service_type || 'Not specified'}
Budget: ${formData.budget || formData.estimated_budget || 'Not specified'}
Timeline: ${formData.timeline || formData.preferred_timeline || 'Not specified'}
Description: ${formData.description || formData.project_description || 'Not provided'}

We will review your request and get back to you shortly with a detailed proposal.
Thank you for choosing Devtone Agency!
`;

    // Send the email with the formatted message
    return await sendBrevoEmailDirect({
      name: formData.name || formData.full_name,
      email: formData.email,
      message: message,
      phone: formData.phone,
      projectType: formData.projectType || formData.service_type,
      budget: formData.budget || formData.estimated_budget,
      timeline: formData.timeline || formData.preferred_timeline,
      description: formData.description || formData.project_description
    });
  } catch (error) {
    console.error('Error sending estimate confirmation email directly:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};    