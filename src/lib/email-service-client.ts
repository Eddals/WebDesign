// Client-side email service using EmailJS or similar
// This runs entirely in the browser - no server needed!

interface EmailServiceConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

// Option 1: EmailJS (https://www.emailjs.com)
export const sendEstimateViaEmailJS = async (formData: any) => {
  // Sign up at https://www.emailjs.com and get your credentials
  const config: EmailServiceConfig = {
    serviceId: 'YOUR_SERVICE_ID', // e.g., 'service_abc123'
    templateId: 'YOUR_TEMPLATE_ID', // e.g., 'template_xyz789'
    publicKey: 'YOUR_PUBLIC_KEY' // e.g., 'user_key123'
  };

  try {
    // Load EmailJS SDK
    const emailjs = (window as any).emailjs;
    
    // Initialize with your public key
    emailjs.init(config.publicKey);
    
    // Send email
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      {
        to_email: 'team@devtone.agency',
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Not provided',
        phone: formData.phone || 'Not provided',
        project_type: formData.projectType,
        budget: formData.budget,
        timeline: formData.timeline,
        description: formData.description || 'No description provided',
        features: formData.features?.join(', ') || 'None selected'
      }
    );
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('EmailJS error:', error);
    return { success: false, error: 'Failed to send email' };
  }
};

// Option 2: Formspree (https://formspree.io)
export const sendEstimateViaFormspree = async (formData: any) => {
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // Get this from Formspree
  
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        project_type: formData.projectType,
        budget: formData.budget,
        timeline: formData.timeline,
        description: formData.description,
        features: formData.features?.join(', ')
      })
    });
    
    if (response.ok) {
      return { success: true, message: 'Form submitted successfully' };
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Formspree error:', error);
    return { success: false, error: 'Failed to submit form' };
  }
};

// Option 3: Web3Forms (https://web3forms.com)
export const sendEstimateViaWeb3Forms = async (formData: any) => {
  const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY'; // Get this from Web3Forms
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New Estimate Request from ${formData.name}`,
        from_name: formData.name,
        email: formData.email,
        message: `
          New Estimate Request
          
          Name: ${formData.name}
          Email: ${formData.email}
          Company: ${formData.company || 'Not provided'}
          Phone: ${formData.phone || 'Not provided'}
          
          Project Type: ${formData.projectType}
          Budget: ${formData.budget}
          Timeline: ${formData.timeline}
          
          Description:
          ${formData.description || 'No description provided'}
          
          Features: ${formData.features?.join(', ') || 'None selected'}
        `
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: 'Email sent successfully' };
    } else {
      throw new Error(result.message || 'Failed to send email');
    }
  } catch (error) {
    console.error('Web3Forms error:', error);
    return { success: false, error: 'Failed to send email' };
  }
};