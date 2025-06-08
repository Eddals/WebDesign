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
          full_name: string
          email: string
          phone: string | null
          business_name: string | null
          company: string | null
          project_type: string | null
          website_goal: string | null
          description: string | null
          budget_range: string | null
          timeline: string | null
          selected_package: string | null
          payment_model: string | null
          subscription_plan: string | null
          status: string
          notes: string | null
          estimated_budget: number | null
          pages_needed: string | null
          domain_hosting_status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name: string
          email: string
          phone?: string | null
          business_name?: string | null
          company?: string | null
          project_type?: string | null
          website_goal?: string | null
          description?: string | null
          budget_range?: string | null
          timeline?: string | null
          selected_package?: string | null
          payment_model?: string | null
          subscription_plan?: string | null
          status?: string
          notes?: string | null
          estimated_budget?: number | null
          pages_needed?: string | null
          domain_hosting_status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          email?: string
          phone?: string | null
          business_name?: string | null
          company?: string | null
          project_type?: string | null
          website_goal?: string | null
          description?: string | null
          budget_range?: string | null
          timeline?: string | null
          selected_package?: string | null
          payment_model?: string | null
          subscription_plan?: string | null
          status?: string
          notes?: string | null
          estimated_budget?: number | null
          pages_needed?: string | null
          domain_hosting_status?: string | null
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