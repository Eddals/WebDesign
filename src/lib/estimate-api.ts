// API configuration
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3002' : 'https://api.devtone.online'
);

export interface EstimateFormData {
  // Personal Info
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  industry?: string;

  // Project Details
  projectType: string;
  budget: string;
  timeline: string;
  description?: string;
  features?: string[];
}

export interface EstimateResponse {
  success: boolean;
  message?: string;
  error?: string;
  emailsSent?: {
    admin: boolean;
    client: boolean;
  };
}

export const submitEstimate = async (formData: EstimateFormData): Promise<EstimateResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit estimate');
    }

    return data;
  } catch (error) {
    console.error('Error submitting estimate:', error);
    
    // Return a structured error response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit estimate request',
    };
  }
};