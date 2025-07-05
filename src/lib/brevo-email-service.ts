interface BrevoEmailParams {
  name: string;
  email: string;
  message: string;
  // Additional optional parameters
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  description?: string;
}

/**
 * Send an email using Brevo (formerly Sendinblue) API via server-side API
 * This uses the server-side endpoint to avoid exposing API keys in client-side code
 */
export const sendBrevoEmail = async (params: BrevoEmailParams) => {
  try {
    // Use the server-side API endpoint instead of direct Brevo API access
    const response = await fetch('/api/send-brevo-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo email API error:', errorData);
      return { 
        success: false, 
        error: errorData.error || `Server returned ${response.status}` 
      };
    }

    const data = await response.json();
    console.log('Brevo email sent successfully:', data);
    return { success: true, message: 'Email sent successfully', data };
  } catch (error) {
    console.error('Error sending Brevo email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Send an estimate confirmation email using Brevo
 * This formats the message with all the estimate details
 */
export const sendEstimateConfirmationEmail = async (formData: any) => {
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
    return await sendBrevoEmail({
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
    console.error('Error sending estimate confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};