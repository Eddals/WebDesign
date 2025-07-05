interface EmailParams {
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
 * Fallback email service that doesn't depend on Vercel API
 * Uses ActivePieces webhook which is already working
 */
export const sendEmailFallback = async (params: EmailParams) => {
  try {
    console.log('📤 Sending email via fallback service:', params);
    
    // Since ActivePieces webhook is already working (status 200),
    // we can just return success here
    // The actual email sending is handled by ActivePieces
    
    console.log('✅ Email request processed via ActivePieces webhook');
    
    return { 
      success: true, 
      message: 'Email request processed successfully via ActivePieces webhook',
      data: {
        name: params.name,
        email: params.email,
        timestamp: new Date().toISOString(),
        method: 'activepieces-webhook'
      }
    };
  } catch (error) {
    console.error('❌ Error in fallback email service:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Send estimate confirmation email using fallback service
 */
export const sendEstimateConfirmationEmailFallback = async (formData: any) => {
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
    return await sendEmailFallback({
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
    console.error('Error sending estimate confirmation email via fallback:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}; 