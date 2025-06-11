import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type File = Database['public']['Tables']['files']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type UserRole = 'client' | 'admin'

export interface ProjectWithDetails extends Project {
  profiles: Profile
  milestones: Milestone[]
  messages: Message[]
  files: File[]
  invoices: Invoice[]
}

export interface MessageWithSender extends Message {
  sender: Profile
}

export interface FileWithUploader extends File {
  uploader: Profile
}

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  pendingInvoices: number
  totalRevenue: number
  upcomingDeadlines: number
}

export interface NotificationData {
  id: string
  type: 'message' | 'milestone' | 'invoice' | 'file' | 'project_update'
  title: string
  message: string
  project_id?: string
  read: boolean
  created_at: string
}

export interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}
