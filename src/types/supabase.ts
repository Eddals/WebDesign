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
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'admin' | 'client'
          status: 'pending' | 'approved' | 'rejected'
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'admin' | 'client'
          status?: 'pending' | 'approved' | 'rejected'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'admin' | 'client'
          status?: 'pending' | 'approved' | 'rejected'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          // Personal Information
          full_name: string
          email: string
          phone: string | null
          company: string | null
          country: string | null
          industry: string | null
          // Project Details
          project_type: string | null
          budget_range: string | null
          timeline: string | null
          features: Json | null
          description: string | null
          // System Fields
          status: string
          priority: number | null
          assigned_to: string | null
          notes: string | null
          estimated_cost: number | null
          quoted_amount: number | null
          // Metadata
          source: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          // Personal Information
          full_name: string
          email: string
          phone?: string | null
          company?: string | null
          country?: string | null
          industry?: string | null
          // Project Details
          project_type?: string | null
          budget_range?: string | null
          timeline?: string | null
          features?: Json | null
          description?: string | null
          // System Fields
          status?: string
          priority?: number | null
          assigned_to?: string | null
          notes?: string | null
          estimated_cost?: number | null
          quoted_amount?: number | null
          // Metadata
          source?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          // Personal Information
          full_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          country?: string | null
          industry?: string | null
          // Project Details
          project_type?: string | null
          budget_range?: string | null
          timeline?: string | null
          features?: Json | null
          description?: string | null
          // System Fields
          status?: string
          priority?: number | null
          assigned_to?: string | null
          notes?: string | null
          estimated_cost?: number | null
          quoted_amount?: number | null
          // Metadata
          source?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          session_id: string
          user_name: string
          user_email: string
          message: string
          is_user: boolean
          is_read: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          user_name: string
          user_email: string
          message: string
          is_user: boolean
          is_read?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          user_name?: string
          user_email?: string
          message?: string
          is_user?: boolean
          is_read?: boolean
          metadata?: Json | null
        }
      }
      chat_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_name: string
          user_email: string
          user_phone: string | null
          user_company: string | null
          inquiry_type: string | null
          status: string
          is_active: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_name: string
          user_email: string
          user_phone?: string | null
          user_company?: string | null
          inquiry_type?: string | null
          status?: string
          is_active?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_name?: string
          user_email?: string
          user_phone?: string | null
          user_company?: string | null
          inquiry_type?: string | null
          status?: string
          is_active?: boolean
          metadata?: Json | null
        }
      }
      contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          email: string
          phone: string | null
          company: string | null
          contact_reason: string | null
          project_type: string | null
          budget: string | null
          timeline: string | null
          message: string
          preferred_contact: string | null
          status: string
          is_urgent: boolean
          priority: number
          subject: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name: string
          email: string
          phone?: string | null
          company?: string | null
          contact_reason?: string | null
          project_type?: string | null
          budget?: string | null
          timeline?: string | null
          message: string
          preferred_contact?: string | null
          status?: string
          is_urgent?: boolean
          priority?: number
          subject?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          contact_reason?: string | null
          project_type?: string | null
          budget?: string | null
          timeline?: string | null
          message?: string
          preferred_contact?: string | null
          status?: string
          is_urgent?: boolean
          priority?: number
          subject?: string | null
        }
      }
      chat_agents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          role: string
          is_active: boolean
          is_online: boolean
          last_seen: string | null
          max_concurrent_chats: number
          auto_assign: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          role?: string
          is_active?: boolean
          is_online?: boolean
          last_seen?: string | null
          max_concurrent_chats?: number
          auto_assign?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          role?: string
          is_active?: boolean
          is_online?: boolean
          last_seen?: string | null
          max_concurrent_chats?: number
          auto_assign?: boolean
          metadata?: Json | null
        }
      }
      chat_assignments: {
        Row: {
          id: string
          created_at: string
          session_id: string
          agent_id: string | null
          status: string
          assigned_at: string
          completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          agent_id?: string | null
          status?: string
          assigned_at?: string
          completed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          agent_id?: string | null
          status?: string
          assigned_at?: string
          completed_at?: string | null
          notes?: string | null
        }
      }
    }
    Views: {
      chat_stats: {
        Row: {
          total_sessions: number | null
          active_sessions: number | null
          pending_sessions: number | null
          resolved_sessions: number | null
          today_sessions: number | null
          week_sessions: number | null
        }
      }
      chat_sessions_with_counts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_name: string
          user_email: string
          user_phone: string | null
          user_company: string | null
          inquiry_type: string | null
          status: string
          is_active: boolean
          metadata: Json | null
          total_messages: number | null
          unread_messages: number | null
          last_message: string | null
          last_message_time: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}