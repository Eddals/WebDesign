import SibApiV3Sdk from 'sib-api-v3-sdk';

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
 * Send an email using Brevo (formerly Sendinblue) API
 * This uses a visual template with ID 2 and passes custom parameters
 */
export const sendBrevoEmail = async (params: BrevoEmailParams) => {
  try {
    // 1. Authentication setup
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';

    // 2. Create API instance for transactional emails
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // 3. Prepare the email with template ID and parameters
    const sendSmtpEmail = {
      to: [
        {
          email: params.email,
          name: params.name
        }
      ],
      templateId: 2, // ID of your template in Brevo
      params: {
        FIRSTNAME: params.name.split(' ')[0], // First name extraction
        message: params.message
      },
      sender: {
        name: 'Devtone Agency',
        email: 'team@devtone.agency'
      }
    };

    // 4. Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo email sent successfully:', response);
    return { success: true, message: 'Email sent successfully', data: response };
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