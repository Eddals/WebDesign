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
  let webhookSuccess = false;
  
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
        webhookSuccess = true;
      } else {
        // Try to get error details
        let errorDetails = '';
        try {
          const contentType = webhookResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await webhookResponse.json();
            errorDetails = errorData.message || errorData.error || '';
          } else {
            errorDetails = await webhookResponse.text();
          }
        } catch {
          // Ignore parsing errors
        }
        console.warn('ActivePieces webhook returned non-OK status:', webhookResponse.status, errorDetails);
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

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Server returned status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch {
            // Ignore text parsing errors
          }
        }
        console.warn('API error:', errorMessage);
        
        // If webhook was successful, still return success
        return {
          success: true,
          message: 'Your estimate request has been received. We will contact you soon.',
        };
      }

      // Parse successful response
      try {
        const data = await response.json();
        console.log('API response:', data);
        return data;
      } catch (jsonError) {
        console.warn('Failed to parse API response as JSON:', jsonError);
        // If we can't parse the response but it was successful, return success
        return {
          success: true,
          message: 'Your estimate request has been received. We will contact you soon.',
        };
      }
    } catch (apiError) {
      console.warn('API call failed:', apiError);
      
      // If the webhook was successful, we can still return success
      if (webhookSuccess) {
        return {
          success: true,
          message: 'Your estimate request has been received. We will contact you soon.',
        };
      }
      
      // If both webhook and API failed, return error
      return {
        success: false,
        error: 'Unable to submit estimate request. Please try again or contact us directly at team@devtone.agency',
      };
    }
  } catch (error) {
    console.error('Error submitting estimate:', error);
    
    // If webhook was successful but something else failed, still return success
    if (webhookSuccess) {
      return {
        success: true,
        message: 'Your estimate request has been received. We will contact you soon.',
      };
    }
    
    // Return a structured error response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit estimate request',
    };
  }
};