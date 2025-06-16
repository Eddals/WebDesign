import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Get environment variables with fallback to hardcoded values for debugging
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://csdejqgfzsxcldqqwfds.supabase.co'
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ'

// Validate URL format
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  console.warn('Invalid Supabase URL detected, using fallback');
  supabaseUrl = 'https://csdejqgfzsxcldqqwfds.supabase.co';
}

// Check for placeholder values
if (supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Placeholder Supabase values detected, using fallback');
  supabaseUrl = 'https://csdejqgfzsxcldqqwfds.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGVqcWdmenN4Y2xkcXF3ZmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzMjMsImV4cCI6MjA2NTQ1NzMyM30.sIpHefIwIjO4iTTNJc07krFHNM8rWih8H06MaftZAyQ';
}

// Debug logging (only once)
if (!window.__supabaseConfigLogged) {
  console.log('🔧 Supabase Configuration:');
  console.log('URL from env:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Key from env:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  console.log('Final URL:', supabaseUrl);
  console.log('Final Key:', supabaseAnonKey ? 'Present' : 'Missing');
  window.__supabaseConfigLogged = true;
}

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))

// Create single Supabase client instance
let supabaseInstance: any = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: window.localStorage,
          storageKey: 'devtone-auth'
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'X-Client-Info': 'devtone-web'
          }
        }
      });
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      // Return a mock client that won't break the app
      supabaseInstance = {
        auth: {
          signIn: () => Promise.reject(new Error('Supabase not configured')),
          signOut: () => Promise.reject(new Error('Supabase not configured')),
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        },
        from: () => ({
          select: () => Promise.reject(new Error('Supabase not configured')),
          insert: () => Promise.reject(new Error('Supabase not configured')),
          update: () => Promise.reject(new Error('Supabase not configured')),
          delete: () => Promise.reject(new Error('Supabase not configured'))
        })
      };
    }
  }
  return supabaseInstance;
})();

// Use the same instance for client dashboard
export const clientSupabase = supabase;