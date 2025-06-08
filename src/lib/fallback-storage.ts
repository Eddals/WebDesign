// Fallback storage for when Supabase is not available
import { supabase } from './supabase';
import type { Contact } from '../types/contacts';
import type { Quote } from '../types/quotes';

export async function saveContact(contactData: Partial<Contact>) {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('contacts')
      .insert(contactData)
      .select();

    if (error) {
      console.warn('Supabase failed, using localStorage fallback:', error);
      return saveToLocalStorage('contacts', contactData);
    }

    return { data, error: null };
  } catch (err) {
    console.warn('Supabase connection failed, using localStorage fallback:', err);
    return saveToLocalStorage('contacts', contactData);
  }
}

export async function saveQuote(quoteData: Partial<Quote>) {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select();

    if (error) {
      console.warn('Supabase failed, using localStorage fallback:', error);
      return saveToLocalStorage('quotes', quoteData);
    }

    return { data, error: null };
  } catch (err) {
    console.warn('Supabase connection failed, using localStorage fallback:', err);
    return saveToLocalStorage('quotes', quoteData);
  }
}

function saveToLocalStorage(table: string, data: any) {
  try {
    const id = generateId();
    const timestamp = new Date().toISOString();
    
    const record = {
      id,
      created_at: timestamp,
      updated_at: timestamp,
      ...data
    };

    // Get existing records
    const existing = localStorage.getItem(`fallback_${table}`);
    const records = existing ? JSON.parse(existing) : [];
    
    // Add new record
    records.push(record);
    
    // Save back to localStorage
    localStorage.setItem(`fallback_${table}`, JSON.stringify(records));
    
    console.log(`✅ Data saved to localStorage (${table}):`, record);
    
    return { 
      data: [record], 
      error: null,
      fallback: true 
    };
  } catch (err) {
    console.error('localStorage fallback failed:', err);
    return { 
      data: null, 
      error: { message: 'Failed to save data locally' },
      fallback: true 
    };
  }
}

function generateId() {
  return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Function to export localStorage data for later import to Supabase
export function exportFallbackData() {
  const contacts = localStorage.getItem('fallback_contacts');
  const quotes = localStorage.getItem('fallback_quotes');
  
  return {
    contacts: contacts ? JSON.parse(contacts) : [],
    quotes: quotes ? JSON.parse(quotes) : []
  };
}

// Function to clear fallback data after successful Supabase sync
export function clearFallbackData() {
  localStorage.removeItem('fallback_contacts');
  localStorage.removeItem('fallback_quotes');
  console.log('Fallback data cleared');
}