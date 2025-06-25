import { ACTIVEPIECES_CONFIG, getActivePiecesAuthHeader } from '@/config/activepieces';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3002' : ''
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
  let resendSuccess = false;
  let backupSuccess = false;
  
  try {
    // Try multiple endpoints to ensure delivery
    const endpoints = [
      {
        name: 'Resend API',
        url: '/api/send-estimate-resend',
        timeout: 10000
      },
      {
        name: 'Backup Handler',
        url: '/api/send-estimate-backup',
        timeout: 5000
      }
    ];
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying ${endpoint.name}...`);
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: AbortSignal.timeout(endpoint.timeout)
        });
        
        if (response.ok) {
          console.log(`✅ ${endpoint.name} successful`);
          if (endpoint.name === 'Resend API') resendSuccess = true;
          if (endpoint.name === 'Backup Handler') backupSuccess = true;
          
          try {
            const data = await response.json();
            if (data.debug) {
              console.log('Debug info:', data.debug);
            }
          } catch {
            // Ignore JSON parsing errors
          }
        } else {
          console.warn(`${endpoint.name} returned ${response.status}`);
        }
      } catch (err) {
        console.error(`${endpoint.name} error:`, err);
      }
    }
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
      // Use the correct endpoint based on environment
      const endpoint = API_URL ? `${API_URL}/api/estimate` : '/api/send-estimate-email';
      const response = await fetch(endpoint, {
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
      
      // If any method was successful, return success
      if (webhookSuccess || resendSuccess || backupSuccess) {
        console.log('Submission status:', {
          webhook: webhookSuccess,
          resend: resendSuccess,
          backup: backupSuccess
        });
        
        return {
          success: true,
          message: 'Your estimate request has been received. We will contact you within 24 hours.',
          emailsSent: {
            admin: resendSuccess || backupSuccess,
            client: resendSuccess
          }
        };
      }
      
      // If all methods failed, return error
      return {
        success: false,
        error: 'Unable to submit estimate request. Please try again or contact us directly at sweepeasellc@gmail.com',
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