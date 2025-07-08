import { BREVO_CONFIG } from '../config/brevo';

export async function sendBrevoContact(data: { firstName: string; email: string }) {
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY
      },
      body: JSON.stringify({
        email: data.email,
        attributes: { FIRSTNAME: data.firstName },
        listIds: [2],
        updateEnabled: true
      })
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}