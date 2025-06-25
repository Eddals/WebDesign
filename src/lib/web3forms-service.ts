// Web3Forms Email Service - Alternative to EmailJS
// Get your free access key at: https://web3forms.com

interface Web3FormsConfig {
  accessKey: string;
  endpoint: string;
}

export const WEB3FORMS_CONFIG: Web3FormsConfig = {
  // Get your access key at: https://web3forms.com
  // Just enter your email and you'll get a key instantly
  accessKey: 'YOUR_ACCESS_KEY_HERE', // Replace with your actual key
  endpoint: 'https://api.web3forms.com/submit'
};

interface Web3FormsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const sendEstimateViaWeb3Forms = async (formData: any): Promise<Web3FormsResponse> => {
  try {
    // Format features list
    const featuresList = formData.features?.join(', ') || 'None selected';
    
    // Create a formatted message
    const message = `
New Estimate Request from ${formData.name}

CONTACT INFORMATION:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}
- Company: ${formData.company || 'Not provided'}
- Country: ${formData.country || 'Not provided'}
- Industry: ${formData.industry || 'Not provided'}

PROJECT DETAILS:
- Project Type: ${formData.projectType}
- Budget: ${formData.budget_formatted || formData.budget}
- Timeline: ${formData.timeline_formatted || formData.timeline}
- Features: ${featuresList}

PROJECT DESCRIPTION:
${formData.description || 'No description provided'}

---
Submitted at: ${new Date().toLocaleString()}
    `.trim();

    const response = await fetch(WEB3FORMS_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_CONFIG.accessKey,
        
        // Email settings
        subject: `New Estimate Request - ${formData.name} - ${formData.projectType}`,
        from_name: formData.name,
        email: formData.email, // This will be the reply-to
        to: 'team@devtone.agency', // Where to send
        
        // Main message
        message: message,
        
        // Additional fields (these will be included in the email)
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
        industry: formData.industry,
        project_type: formData.projectType,
        budget: formData.budget_formatted || formData.budget,
        timeline: formData.timeline_formatted || formData.timeline,
        features: featuresList,
        
        // Settings
        botcheck: false, // Disable botcheck for API requests
      })
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: 'Email sent successfully'
      };
    } else {
      return {
        success: false,
        error: result.message || 'Failed to send email'
      };
    }
  } catch (error) {
    console.error('Web3Forms error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};

// Alternative: FormSubmit (even simpler, no API key needed)
export const sendEstimateViaFormSubmit = async (formData: any): Promise<Web3FormsResponse> => {
  try {
    const formBody = new FormData();
    
    // Add all form fields
    formBody.append('_subject', `New Estimate Request - ${formData.name}`);
    formBody.append('name', formData.name);
    formBody.append('email', formData.email);
    formBody.append('phone', formData.phone || 'Not provided');
    formBody.append('company', formData.company || 'Not provided');
    formBody.append('country', formData.country || 'Not provided');
    formBody.append('industry', formData.industry || 'Not provided');
    formBody.append('project_type', formData.projectType);
    formBody.append('budget', formData.budget_formatted || formData.budget);
    formBody.append('timeline', formData.timeline_formatted || formData.timeline);
    formBody.append('features', formData.features?.join(', ') || 'None');
    formBody.append('description', formData.description || 'No description');
    
    // FormSubmit settings
    formBody.append('_captcha', 'false'); // Disable captcha for API
    formBody.append('_template', 'table'); // Use table template
    
    const response = await fetch('https://formsubmit.co/team@devtone.agency', {
      method: 'POST',
      body: formBody
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Email sent successfully'
      };
    } else {
      return {
        success: false,
        error: 'Failed to send email'
      };
    }
  } catch (error) {
    console.error('FormSubmit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};