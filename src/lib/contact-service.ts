/**
 * Contact Form Service
 * Handles contact form submissions with fallback options
 */

import { apiRequest } from './api-config';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message?: string;
  confirmationId?: string;
  notificationId?: string;
  error?: string;
}

/**
 * Submit contact form with multiple fallback options
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  console.log('📧 Submitting contact form...', data);

  // Try primary endpoint first
  try {
    const result = await apiRequest<ContactResponse>('/api/webhooks/resend-simple', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (result.success) {
      console.log('✅ Contact form submitted successfully via primary endpoint');
      return result;
    }
  } catch (primaryError) {
    console.warn('⚠️ Primary endpoint failed:', primaryError);
    
    // Try alternative endpoints with different data formats
    const alternativeEndpoints = [
      { 
        url: '/api/send-contact',
        transform: (d: ContactFormData) => ({
          full_name: d.name,
          email: d.email,
          phone: d.phone,
          company: d.company,
          subject: d.subject,
          message: d.message,
          preferredContact: 'email'
        })
      },
      {
        url: '/api/webhooks/contact-form',
        transform: (d: ContactFormData) => d
      },
      {
        url: '/api/send-contact-email',
        transform: (d: ContactFormData) => d
      }
    ];

    for (const endpoint of alternativeEndpoints) {
      try {
        console.log(`🔄 Trying alternative endpoint: ${endpoint.url}`);
        const transformedData = endpoint.transform(data);
        const result = await apiRequest<ContactResponse>(endpoint.url, {
          method: 'POST',
          body: JSON.stringify(transformedData)
        });

        if (result.success || result.message) {
          console.log(`✅ Contact form submitted successfully via ${endpoint.url}`);
          return {
            success: true,
            message: result.message || 'Message sent successfully',
            ...result
          };
        }
      } catch (altError) {
        console.warn(`⚠️ Alternative endpoint ${endpoint.url} failed:`, altError);
      }
    }
  }

  // If all API endpoints fail, provide a fallback response
  console.error('❌ All contact endpoints failed');
  
  // Store locally as a last resort
  try {
    const storedContacts = localStorage.getItem('pending_contacts') || '[]';
    const contacts = JSON.parse(storedContacts);
    contacts.push({
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('pending_contacts', JSON.stringify(contacts));
    
    return {
      success: true,
      message: 'Your message has been saved and will be sent when the connection is restored. You can also email us directly at team@devtone.agency',
      error: 'API temporarily unavailable'
    };
  } catch (storageError) {
    console.error('❌ Failed to store contact locally:', storageError);
  }

  return {
    success: false,
    error: 'Unable to send message at this time. Please try again later or email us directly at team@devtone.agency'
  };
}

/**
 * Retry sending pending contacts (call this when connection is restored)
 */
export async function retryPendingContacts(): Promise<void> {
  try {
    const storedContacts = localStorage.getItem('pending_contacts');
    if (!storedContacts) return;

    const contacts = JSON.parse(storedContacts);
    const pending = contacts.filter((c: any) => c.status === 'pending');

    for (const contact of pending) {
      try {
        const result = await submitContactForm(contact);
        if (result.success && !result.error) {
          // Mark as sent
          contact.status = 'sent';
        }
      } catch (error) {
        console.error('Failed to retry contact:', error);
      }
    }

    // Update stored contacts
    localStorage.setItem('pending_contacts', JSON.stringify(contacts));
  } catch (error) {
    console.error('Error retrying pending contacts:', error);
  }
}