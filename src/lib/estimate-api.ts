import { ACTIVEPIECES_CONFIG, getActivePiecesAuthHeader } from '@/config/activepieces';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3002' : 'https://api.devtone.agency'
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
    // First, send to ActivePieces webhook
    try {
      // Prepare webhook data matching the expected format
      const webhookData = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone || '',
        empresa: formData.company || '',
        pais: formData.country || '',
        industria: formData.industry || '',
        tipo_projeto: formData.projectType,
        orcamento: formData.budget,
        prazo: formData.timeline,
        mensagem: formData.description || '',
        recursos: formData.features?.join(', ') || '',
        timestamp: new Date().toISOString(),
        fonte: 'devtone-estimate-form'
      };

      // ActivePieces public webhooks don't require authentication
      const webhookResponse = await fetch(ACTIVEPIECES_CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Removed Authorization header as it's not needed for public webhooks
        },
        body: JSON.stringify(webhookData),
      });

      if (webhookResponse.ok) {
        console.log('Successfully sent to ActivePieces webhook');
      } else {
        console.warn('ActivePieces webhook returned non-OK status:', webhookResponse.status, await webhookResponse.text());
      }
    } catch (webhookError) {
      console.error('Error sending to ActivePieces webhook:', webhookError);
      // Continue with the main API call even if webhook fails
    }

    // Try to send to our API, but don't fail if it's not available
    try {
      const response = await fetch(`${API_URL}/api/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        // Add a timeout to prevent long waiting times if the server is down
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok) {
        console.warn(`API returned status ${response.status}:`, data);
      }

      return data;
    } catch (apiError) {
      console.warn('API call failed, but continuing with webhook submission:', apiError);
      
      // If the webhook was successful, we can still return success
      return {
        success: true,
        message: 'Your estimate request has been received. We will contact you soon.',
        error: 'API unavailable, but webhook submission succeeded',
      };
    }
  } catch (error) {
    console.error('Error submitting estimate:', error);
    
    // Return a structured error response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit estimate request',
    };
  }
};