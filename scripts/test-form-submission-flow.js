#!/usr/bin/env node

// Test the complete form submission flow as it happens in the React app

const testFormSubmission = async () => {
  console.log('Testing form submission flow...\n');

  // Simulate the estimate-api.ts logic
  const submitEstimate = async (formData) => {
    let webhookSuccess = false;
    
    try {
      // First, send to ActivePieces webhook
      console.log('1. Sending to ActivePieces webhook...');
      try {
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

        const webhookResponse = await fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        console.log('Webhook response status:', webhookResponse.status);
        
        if (webhookResponse.ok) {
          console.log('✅ Successfully sent to ActivePieces webhook');
          webhookSuccess = true;
        } else {
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
          console.warn('❌ ActivePieces webhook returned non-OK status:', webhookResponse.status, errorDetails);
        }
      } catch (webhookError) {
        console.error('❌ Error sending to ActivePieces webhook:', webhookError.message);
      }

      // Try to send to our API
      console.log('\n2. Sending to API endpoint...');
      try {
        const apiUrl = 'https://api.devtone.agency/api/estimate';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `Server returned status ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            try {
              const errorText = await response.text();
              if (errorText) {
                errorMessage = errorText;
              }
            } catch {
              // Ignore text parsing errors
            }
          }
          console.warn('❌ API error:', errorMessage);
          
          if (webhookSuccess) {
            return {
              success: true,
              message: 'Your estimate request has been received. We will contact you soon.',
            };
          }
        }

        try {
          const data = await response.json();
          console.log('✅ API response:', JSON.stringify(data, null, 2));
          return data;
        } catch (jsonError) {
          console.warn('Failed to parse API response as JSON:', jsonError.message);
          return {
            success: true,
            message: 'Your estimate request has been received. We will contact you soon.',
          };
        }
      } catch (apiError) {
        console.warn('❌ API call failed:', apiError.message);
        
        if (webhookSuccess) {
          return {
            success: true,
            message: 'Your estimate request has been received. We will contact you soon.',
          };
        }
        
        return {
          success: false,
          error: 'Unable to submit estimate request. Please try again or contact us directly at team@devtone.agency',
        };
      }
    } catch (error) {
      console.error('❌ Error submitting estimate:', error.message);
      
      if (webhookSuccess) {
        return {
          success: true,
          message: 'Your estimate request has been received. We will contact you soon.',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to submit estimate request',
      };
    }
  };

  // Test data
  const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Corp',
    country: 'United States',
    industry: 'Technology',
    projectType: 'business',
    budget: '$1,500 - $5,000',
    timeline: '1 Month',
    description: 'We need a professional business website with modern design',
    features: ['contact_form', 'seo', 'newsletter', 'analytics']
  };

  console.log('Test data:', JSON.stringify(testData, null, 2));
  console.log('\n' + '='.repeat(60) + '\n');

  // Run the submission
  const result = await submitEstimate(testData);

  console.log('\n' + '='.repeat(60) + '\n');
  console.log('Final result:', JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n✅ SUCCESS: The form submission would work correctly!');
    console.log('Message shown to user:', result.message);
  } else {
    console.log('\n❌ ERROR: The form submission would fail');
    console.log('Error shown to user:', result.error);
  }
};

// Run the test
testFormSubmission();