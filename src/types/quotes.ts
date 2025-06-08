export type QuoteStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
export type PackageType = 'Basic' | 'Standard' | 'Premium' | 'starter' | 'business' | 'pro';

export interface Quote {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Contact Information
  full_name: string;
  email: string;
  phone?: string;
  
  // Business Information
  business_name?: string;
  company?: string;
  domain_hosting_status?: string;
  
  // Project Details
  project_type?: string;
  website_goal?: string;
  description?: string;
  budget_range?: string;
  timeline?: string;
  pages_needed?: string;
  
  // Package Selection
  selected_package?: PackageType | string;
  payment_model?: string;
  subscription_plan?: string;
  estimated_budget?: number;
  
  // Status and Tracking
  status: QuoteStatus;
  notes?: string;
}