// Client Dashboard Types
// DevTone Agency - Professional Client Dashboard

export interface ClientUser {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'client' | 'admin';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  company_name: string;
  industry?: string;
  website_url?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  business_description?: string;
  logo_url?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  user?: ClientUser;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  project_type: 'website' | 'ecommerce' | 'app' | 'marketing' | 'seo' | 'other';
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget?: number;
  start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  progress_percentage: number;
  project_url?: string;
  repository_url?: string;
  staging_url?: string;
  live_url?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  milestones?: ProjectMilestone[];
  tasks?: ProjectTask[];
  files?: ProjectFile[];
  comments?: ClientComment[];
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  due_date?: string;
  completion_date?: string;
  order_index: number;
  deliverables?: string[];
  is_billable: boolean;
  amount?: number;
  created_at: string;
  updated_at: string;
  project?: Project;
  tasks?: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  completion_date?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  project?: Project;
  milestone?: ProjectMilestone;
}

export interface ClientFeedback {
  id: string;
  project_id: string;
  milestone_id?: string;
  client_id: string;
  feedback_type: 'general' | 'approval' | 'revision' | 'concern';
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'addressed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_response?: string;
  admin_responded_by?: string;
  admin_responded_at?: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  milestone?: ProjectMilestone;
  client?: Client;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  milestone_id?: string;
  uploaded_by_client_id?: string;
  uploaded_by_admin?: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  file_url: string;
  file_category: 'design' | 'content' | 'assets' | 'documents' | 'general';
  description?: string;
  is_public: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  project?: Project;
  milestone?: ProjectMilestone;
  uploaded_by_client?: Client;
}

export interface ClientComment {
  id: string;
  project_id: string;
  client_id?: string;
  parent_comment_id?: string;
  message: string;
  sender_type: 'client' | 'admin';
  sender_name: string;
  is_read: boolean;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  project?: Project;
  client?: Client;
  replies?: ClientComment[];
}

// Dashboard Statistics
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  pending_feedbacks: number;
  unread_messages: number;
  upcoming_milestones: number;
  total_files: number;
  overall_progress: number;
}

// Form Types
export interface CreateFeedbackForm {
  project_id: string;
  milestone_id?: string;
  feedback_type: 'general' | 'approval' | 'revision' | 'concern';
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CreateCommentForm {
  project_id: string;
  parent_comment_id?: string;
  message: string;
  attachments?: string[];
}

export interface FileUploadForm {
  project_id: string;
  milestone_id?: string;
  file_category: 'design' | 'content' | 'assets' | 'documents' | 'general';
  description?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Authentication Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  industry?: string;
  website_url?: string;
  country?: string;
  business_description?: string;
}

export interface AuthSession {
  user: ClientUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Filter and Sort Types
export interface ProjectFilters {
  status?: string[];
  project_type?: string[];
  priority?: string[];
  date_range?: {
    start: string;
    end: string;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'milestone_completed' | 'feedback_response' | 'new_message' | 'file_uploaded' | 'project_update';
  title: string;
  message: string;
  project_id?: string;
  is_read: boolean;
  created_at: string;
}

// Real-time Event Types
export interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record?: any;
}

// Status Badge Colors
export const STATUS_COLORS = {
  // Project Status
  planning: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  review: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  on_hold: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  
  // Task Status
  todo: 'bg-gray-100 text-gray-800',
  
  // Priority
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
  
  // Feedback Status
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  addressed: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  
  // Milestone Status
  delayed: 'bg-red-100 text-red-800',
} as const;
