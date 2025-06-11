export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'client' | 'admin'
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'client' | 'admin'
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'client' | 'admin'
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string | null
          status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          start_date: string | null
          due_date: string | null
          budget: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date?: string | null
          due_date?: string | null
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date?: string | null
          due_date?: string | null
          budget?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed'
          due_date: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          due_date?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          due_date?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          project_id: string
          sender_id: string
          content: string
          is_internal: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          sender_id: string
          content: string
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          sender_id?: string
          content?: string
          is_internal?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          uploader_id: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          uploader_id: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          uploader_id?: string
          filename?: string
          file_path?: string
          file_size?: number
          file_type?: string
          description?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          project_id: string
          client_id: string
          invoice_number: string
          amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date: string
          paid_at: string | null
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          client_id: string
          invoice_number: string
          amount: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date: string
          paid_at?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          client_id?: string
          invoice_number?: string
          amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string
          paid_at?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
