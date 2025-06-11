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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}