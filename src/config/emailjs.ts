// EmailJS Configuration
// Sign up at https://www.emailjs.com to get these values

export const EMAILJS_CONFIG = {
  // Get this from EmailJS Dashboard > Email Services
  SERVICE_ID: 'service_7u161fp',
  
  // Get this from EmailJS Dashboard > Email Templates
  TEMPLATE_ID: 'template_vtmfiqh',
  
  // Get this from EmailJS Dashboard > Account > API Keys
  PUBLIC_KEY: '7iXZ6J8eoDd6BpUgH',
};

// Template variable names that match your EmailJS template
export const TEMPLATE_PARAMS = {
  // These should match the variables in your EmailJS template
  to_email: 'team@devtone.agency', // Where to send the email
  from_name: '', // {{from_name}} in template
  from_email: '', // {{from_email}} in template
  phone: '', // {{phone}} in template
  company: '', // {{company}} in template
  country: '', // {{country}} in template
  industry: '', // {{industry}} in template
  project_type: '', // {{project_type}} in template
  budget: '', // {{budget}} in template
  timeline: '', // {{timeline}} in template
  description: '', // {{description}} in template
  features: '', // {{features}} in template
};