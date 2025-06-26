/**
 * Newsletter Service
 * 
 * This service handles newsletter subscriptions.
 * It can be connected to your database or API of choice.
 */

interface SubscribeResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: Error;
}

// Using fetch to submit to the API endpoint
export const subscribeToNewsletter = async (name: string, email: string): Promise<SubscribeResponse> => {
  try {
    console.log('Submitting newsletter subscription:', { name, email });
    
    const response = await fetch('/api/newsletter-subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        source: 'website_footer'
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      throw new Error('Invalid response from server. Please try again later.');
    }
    
    console.log('Newsletter API response:', { status: response.status, data });
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to subscribe');
    }
    
    return {
      success: true,
      message: data.message || 'Successfully subscribed to newsletter',
      data
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
};

// Example using direct database connection (for server-side use)
// This would typically be in a separate server-side file
/*
import { pool } from '../database/connection';

interface Subscriber {
  id: number;
  name: string;
  email: string;
  status: string;
}

interface SubscriberResponse {
  success: boolean;
  subscriber?: Subscriber;
  error?: Error;
}

export const addSubscriber = async (
  name: string, 
  email: string, 
  source: string = 'website_footer'
): Promise<SubscriberResponse> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const queryText = `
      INSERT INTO newsletter_subscribers (name, email, source) 
      VALUES ($1, $2, $3)
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        status = 'active',
        updated_at = NOW()
      RETURNING id, name, email, status
    `;
    
    const values = [name, email, source];
    const result = await client.query(queryText, values);
    
    await client.query('COMMIT');
    
    return {
      success: true,
      subscriber: result.rows[0]
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database error:', error);
    
    throw error;
  } finally {
    client.release();
  }
};
*/

// Utility function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};